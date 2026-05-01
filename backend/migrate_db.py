import sqlite3

db_path = 'backend/database/anime_script_pro.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("PRAGMA table_info(project_content)")
    columns = [row[1] for row in cursor.fetchall()]
    print(f"Columns in project_content: {columns}")
    
    missing = []
    if 'growth_strategy' not in columns:
        missing.append('growth_strategy')
    if 'distribution_plan' not in columns:
        missing.append('distribution_plan')
        
    if missing:
        print(f"Adding missing columns: {missing}")
        for col in missing:
            cursor.execute(f"ALTER TABLE project_content ADD COLUMN {col} TEXT")
        conn.commit()
        print("Columns added successfully.")
    else:
        print("All columns present.")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
