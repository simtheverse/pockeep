const { Pool } = require('pg');

// Create a new instance of the Pool class
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432, // Default PostgreSQL port
});

// Function to insert a monthly expense
async function insertMonthlyExpense(memberId, expenseName, amount, category, recurringDay) {
  try {
    const query = `
      INSERT INTO monthly_expenses (member_id, expense_name, amount, category, recurring_day)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;

    const values = [memberId, expenseName, amount, category, recurringDay];

    const result = await pool.query(query, values);
    console.log('Monthly expense inserted:', result.rows[0]);
  } catch (error) {
    console.error('Error inserting monthly expense:', error);
  }
}

// Usage example
insertMonthlyExpense(1, 'Rent', 1000.00, 'Housing', 1);
