FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Build the project
RUN npm run build

# Expose port for HTTP server (if needed)
EXPOSE 3000

# Start the MCP server
CMD ["node", "dist/demo/filesystem.js"]
