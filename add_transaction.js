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


  async function insertIncomeTransaction(memberId, transactionDate, description, amount) {
    try {
      const query = `
        INSERT INTO income_transactions (member_id, transaction_date, description, amount)
        VALUES ($1, $2, $3, $4)`;
  
      const values = [memberId, transactionDate, description, amount];
  
      await pool.query(query, values);
  
      console.log('Income transaction inserted successfully');
    } catch (error) {
      console.error('Error inserting income transaction:', error);
    }
  }

  
  // Example usage of insertIncomeTransaction
insertIncomeTransaction(1, '2023-05-10', 'Freelance Work', 500.0);
