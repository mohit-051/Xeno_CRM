# Xeno CRM

Welcome to Xeno CRM, a powerful customer relationship management system designed to streamline your business operations.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
   - [Frontend](#frontend)
   - [Backend](#backend)
3. [Usage](#usage)
4. [Connectivity](#connectivity)

## Introduction

Xeno CRM consists of two main repositories: the frontend and the backend. This README will guide you through the installation and setup process for both components.

## Installation

### Frontend

To run the frontend, follow these steps:

1. Install node modules:
   ```bash
   npm i --legacy-peer-deps
   ```
2. Fix audit issues:
   ```bash
   npm audit fix --force
   ```
3. Start the frontend:
   ```bash
   npm start
   ```

### Backend

To run the backend, follow these steps:

1. Install node modules:
   ```bash
   npm i
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Run RabbitMQ server (for pub-sub):
   ```bash
   docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
   ```
4. Run the consumer server:
   ```bash
   node consumer.js
   ```

## Usage

Once both the frontend and backend are running, you can access the Xeno CRM system through your browser. Explore the various features and functionalities to manage your customer relationships efficiently.

## Connectivity

With the setup complete, Xeno CRM is now ready to handle your business needs. Should you encounter any issues or have questions, feel free to reach out to our support team for assistance.

Happy CRM-ing!
