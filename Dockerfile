# Build stage
FROM node:22.16.0 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Production stage
FROM node:22.16.0

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Run the production server
CMD ["npm", "run", "serve"]
