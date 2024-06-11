# Step 1: Use a Node.js base image
FROM node:20.14.0

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install npm dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Install RabbitMQ
# Using a multi-stage build to run RabbitMQ in a separate container
FROM rabbitmq:3.13-management AS rabbitmq

# Expose the necessary RabbitMQ ports
EXPOSE 5672 15672

# Step 7: Define the command to start RabbitMQ and Node.js applications
# This step will run both RabbitMQ and the Node.js applications when the container starts

# Use a script to start RabbitMQ and Node.js applications
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
