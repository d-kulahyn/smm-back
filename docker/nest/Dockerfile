FROM node:22-alpine

WORKDIR /app

# Install necessary dependencies for Prisma and development tools
RUN apk add --no-cache openssl libc6-compat

# Copy package files first for better Docker layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create uploads directory with proper permissions
RUN mkdir -p uploads/avatars uploads/messages && \
    chown -R node:node /app

# Switch to non-root user
USER node

EXPOSE 3001

# Health check for development
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/v1/health || exit 1

# Start in development mode with hot reload
CMD ["npm", "run", "start:dev"]
