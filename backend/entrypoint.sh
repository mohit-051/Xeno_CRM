#!/bin/bash

# Start RabbitMQ in the background
docker run -d --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management

# Wait for RabbitMQ to start
sleep 10

# Start the Node.js server
node server.js &

# Start the Node.js consumer
node consumer.js
