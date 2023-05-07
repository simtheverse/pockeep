require('dotenv').config();
const { Pool } = require('pg');

console.log('process.env.DB_USER', process.env.DB_USER);

// Create a new instance of the Pool class
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT,
});

const newDatabaseName = process.env.DB_DB;

// Check if the database already exists
pool.query(
  `SELECT 1 FROM pg_database WHERE datname = '${newDatabaseName}';`,
  (error, result) => {
    if (error) {
      console.error('Error checking database existence:', error);
      pool.end();
      return;
    }

    const databaseExists = result.rows.length > 0;
    if (databaseExists) {
      console.log('Database already exists:', newDatabaseName);
      pool.end();
      return;
    }

    // Create the database
    pool.query(`CREATE DATABASE ${newDatabaseName};`, (createError, createResult) => {
      if (createError) {
        console.error('Error creating database:', createError);
      } else {
        console.log('Database created successfully:', newDatabaseName);
      }
      pool.end();
    });
  }
);