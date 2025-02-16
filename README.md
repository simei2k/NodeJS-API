NodeJS API  Assessment with 3 functions

Tech Stack: NodeJS, MySQL, Sequelize, Express

# NodeJS API Setup

This is a simple Node.js API for managing students and teachers. It includes functionality for registering teachers, suspending students, and associating students with teachers.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) or any compatible database

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/simei2k/NodeJS-API.git
   cd NodeJS-API
2. **Install Dependencies**
   npm install

3. **Configure Database:**
   Make sure MySQL (or another compatible database) is installed and running.
   Create a database for this project (e.g., workpal).
   Example MySQL command: CREATE DATABASE workpal;
   Edit the config/config.js or your database configuration file (depending on the structure) with your MySQL credentials.
   ```bash
   module.exports = {
   development: {
   username: "root",
   password: "",
   database: "workpal",
   host: "127.0.0.1",
   dialect: "mysql"
   }
   };

5. **Run Migrations to create tables**
```bash
npx sequelize-cli db:migrate

6. **Start the server**
```bash
npm start


