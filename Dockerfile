# Use the official Node.js image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose port 3000 (assuming your application listens on this port)
EXPOSE 5000

# Set the user to run the application
USER node

# Set the entry point to use nodemon
ENTRYPOINT ["nodemon", "server.js"]