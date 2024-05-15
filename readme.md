Blog API using Node.js, MySQL, Firebase Cloud Storage, and Jest for Testing

This is a RESTful API for managing a blog built using Node.js, MySQL for database storage, Firebase Cloud Storage for uploading images, and Jest for testing the main API functionality.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js
MySQL
Firebase Account
Installation
Clone the repository.
Install dependencies using `npm install`.

Configuration
Create a `.env` file in the root directory and add the following environment variables:

PORT=Your_Port_Value

MYSQL_HOST=Your_MySQL_Host

MYSQL_USER=Your_MySQL_Username

MYSQL_PASSWORD=Your_MySQL_Password

MYSQL_NAME=Your_MySQL_Database_Name

allowedOrigins=Your_Allowed_Origins

TOKEN_SECRET=Your_Token_Secret

firebase_apiKey=Your_Firebase_API_Key

firebase_authDomain=Your_Firebase_Auth_Domain

firebase_projectId=Your_Firebase_Project_ID

firebase_storageBucket=Your_Firebase_Storage_Bucket

firebase_messagingSenderId=Your_Firebase_Messaging_Sender_ID

firebase_appId=Your_Firebase_App_ID

Usage
Start the server using npm start.
The API will be accessible at http://localhost:<PORT>.

Testing
Run tests using npm test. This will execute Jest tests to ensure the functionality of the API.

Acknowledgments

Node.js
MySQL
Firebase
Jest
