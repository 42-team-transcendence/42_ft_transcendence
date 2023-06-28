# Base image
FROM node:16-alpine

# Create app directory and go into it
RUN mkdir -p /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Set the backend URL
ENV BACKEND_URL http://server:3333

# Expose the port on which the frontend will run
EXPOSE 3000

# Start the frontend application
CMD ["npm", "start"]