// const { Sequelize } = require('sequelize');
// const path = require('path');

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: path.join(__dirname, '..', 'database.sqlite'),
//   logging: false
// });

// module.exports = sequelize;

// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'localhost',   // your MySQL host, usually localhost
//   user: 'root',        // your MySQL username
//   password: 'Bus2605@',// your MySQL password
//   database: 'secondsoul' // the database you just created
// });

// connection.connect(err => {
//   if (err) {
//     console.error('Database connection failed:', err.stack);
//     return;
//   }
//   console.log('Database connected!');
// });

// module.exports = connection;
const mysql = require('mysql2');
require('dotenv').config(); // Add this line

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'secondsoul'
});
connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Database connected!');
});

module.exports = connection;