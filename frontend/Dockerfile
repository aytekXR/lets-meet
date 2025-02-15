# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set NODE_ENV to production
ENV NODE_ENV production

# Build the application
RUN npm run build

# Debug: Show contents of current directory and dist
RUN echo "Current directory contents:" && \
    ls -la && \
    echo "\nDist directory contents:" && \
    ls -la dist/

# Install serve to run the application
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"] 