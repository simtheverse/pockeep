if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  const { Pool } = require('pg');
  
  // Create a new instance of the Pool class
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  async function clearTables() {
    try {
      const query = `
        TRUNCATE TABLE monthly_expenses, family_members, income_transactions CASCADE`;
  
      await pool.query(query);
  
      console.log('Tables cleared successfully');
    } catch (error) {
      console.error('Error clearing tables:', error);
    } finally {
      pool.end(); // Close the database connection
    }
  }
  
  // Call the function to clear the tables
  clearTables();
