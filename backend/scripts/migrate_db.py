import sqlite3

db_path = 'backend/database/anime_script_pro.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Migration for project_content
    cursor.execute("PRAGMA table_info(project_content)")
    columns = [row[1] for row in cursor.fetchall()]
    print(f"Columns in project_content: {columns}")
    
    missing = []
    if 'growth_strategy' not in columns:
        missing.append('growth_strategy')
    if 'distribution_plan' not in columns:
        missing.append('distribution_plan')
    if 'cast_relationships' not in columns:
        missing.append('cast_relationships')
        
    if missing:
        print(f"Adding missing columns to project_content: {missing}")
        for col in missing:
            cursor.execute(f"ALTER TABLE project_content ADD COLUMN {col} TEXT")
        conn.commit()
        print("project_content updated successfully.")
    else:
        print("project_content columns present.")

    # Migration for projects
    cursor.execute("PRAGMA table_info(projects)")
    p_columns = [row[1] for row in cursor.fetchall()]
    print(f"Columns in projects: {p_columns}")

    p_missing = []
    if 'name' not in p_columns:
        p_missing.append('name')
    if 'vibe' not in p_columns:
        p_missing.append('vibe')

    if p_missing:
        print(f"Adding missing columns to projects: {p_missing}")
        for col in p_missing:
            cursor.execute(f"ALTER TABLE projects ADD COLUMN {col} TEXT")
        conn.commit()
        print("projects updated successfully.")
    else:
        print("projects columns present.")

except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
