# Use Debian-based Node.js LTS image
FROM node:22-bookworm-slim

# Install GCC compiler, build tools, Chromium for headless PDF rendering, and core fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    chromium \
    fonts-liberation \
    fonts-freefont-ttf \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Configure environment for Puppeteer and Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PORT=8082

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install npm dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Create workspace directory for compilation tasks
RUN mkdir -p temp_build && chmod 777 temp_build

# Expose the web server port
EXPOSE 8082

# Start the LabRecord Studio web application
CMD ["node", "server.js"]
