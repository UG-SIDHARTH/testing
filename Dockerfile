# Use Debian-based Node.js LTS image
FROM node:22-bookworm-slim

# Install GCC compiler and essential build tools for compiling C programs
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install npm dependencies
RUN npm install --omit=dev

# Copy application source code and lab programs
COPY . .

# Ensure temp directory for compilation exists with full permissions
RUN mkdir -p temp_build && chmod 777 temp_build

# Expose web server port
EXPOSE 8082

# Set environment variables
ENV PORT=8082 \
    NODE_ENV=production

# Start the LabRecord Studio server
CMD ["node", "server.js"]
