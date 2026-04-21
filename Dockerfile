# Dockerfile for Anime Script Pro - Node.js Orchestrator + Vite Frontend
FROM node:20-slim

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend and the server bundle
RUN npm run build

# Port 3000 is the default for the orchestrator
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the production bundle
CMD ["npm", "run", "start"]
