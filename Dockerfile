FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Expose port
EXPOSE 8081 19000 19001 19002

# Start Expo with tunnel
CMD ["npx", "expo", "start", "--tunnel", "--non-interactive"]
