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

# Step 6: Expose the application ports (if necessary)
# For example, if your server.js listens on port 3000
EXPOSE 3001

# Step 7: Define the command to start Node.js applications
CMD ["sh", "-c", "node server.js & node consumer.js"]
