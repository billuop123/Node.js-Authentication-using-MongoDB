# Node.js Authentication using MongoDB

## Description
A user authentication system built with Node.js and MongoDB, providing secure registration, login, and session management. This project uses JWT for authentication and includes an example environment configuration.

## Features
- User registration and login
- Password hashing for security
- JWT-based authentication for session management
- Example environment configuration provided
## API documnetation
  -https://documenter.getpostman.com/view/30352568/2sAXqv4LWs
## Technologies Used
- Node.js
- Express
- MongoDB
- bcrypt
- jsonwebtoken
## Usage
  -npm start
## CONFIGURATION
DATABASE=mongodb+srv://Biplov:<db_password>@cluster0.qbbmn.mongodb.net/Banking_System?retryWrites=true&w=majority&appName=Cluster0
DATABASE_PASSWORD=password
PORT=9000
NODE_ENV='development'
SECRETKEY=BILLU-SECRET-NEEDS-TO-BE-LONG
EXPIRESIN=90d
COOKIE_EXPIRES_IN=90
