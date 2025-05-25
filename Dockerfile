FROM node:20-slim

# Install git and clean up in a single layer to keep image size down
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/mcp/package*.json ./packages/mcp/
COPY packages/openapi-mcp-server/package*.json ./packages/openapi-mcp-server/

# Copy source files
COPY . .

# Install dependencies and prepare the twilio-oai specs
RUN npm ci && \
    cd packages/mcp && npm run prepare && cd ../.. && \
    npm run build --workspaces

# Set environment variables
ENV NODE_ENV=production

# Expose the default MCP port
EXPOSE 3000

# Start the MCP server
CMD ["node", "packages/mcp/build/index.js"]