# Use the official Node.js image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5100 (assuming your application listens on this port)
EXPOSE 5100

# Set the user to run the application
USER node

# Command to start the application
CMD ["node", "server.js"]
