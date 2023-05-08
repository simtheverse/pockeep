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

  async function calculateFinancialBalance(memberId, date) {
    try {
      // Query the family_members table to get the member's name
      const memberQuery = 'SELECT name FROM family_members WHERE id = $1;';
      const memberResult = await pool.query(memberQuery, [memberId]);
      const memberName = memberResult.rows[0].name;
  
      // Query the monthly_expenses table to calculate total monthly expenses
      const expensesQuery = 'SELECT SUM(amount) AS total_expenses FROM monthly_expenses WHERE member_id = $1;';
      const expensesResult = await pool.query(expensesQuery, [memberId]);
      const totalExpenses = parseFloat(expensesResult.rows[0].total_expenses) || 0;
  
      // Query the income_transactions table to calculate total non-reoccurring income up until the given date
      const incomeQuery = 'SELECT SUM(amount) AS total_income FROM income_transactions WHERE member_id = $1 AND transaction_date <= $2;';
      const incomeResult = await pool.query(incomeQuery, [memberId, date]);
      const totalIncome = parseFloat(incomeResult.rows[0].total_income) || 0;
  
      // Query the monthly_expenses table to calculate total non-reoccurring expenses up until the given date
      const expensesTransactionsQuery = 'SELECT SUM(amount) AS total_expenses FROM monthly_expenses WHERE member_id = $1 AND recurring_day IS NULL AND created_at <= $2;';
      const expensesTransactionsResult = await pool.query(expensesTransactionsQuery, [memberId, date]);
      const totalExpensesTransactions = parseFloat(expensesTransactionsResult.rows[0].total_expenses) || 0;
  
      // Calculate the financial balance
      const financialBalance = totalIncome - totalExpenses - totalExpensesTransactions;
  
      console.log(`Financial balance for ${memberName} on ${date}: $${financialBalance.toFixed(2)}`);
    } catch (error) {
      console.error('Error calculating financial balance:', error);
    }
  }
  
  async function main() {
  // Example usage: calculateFinancialBalance(1, '2023-05-31');
  // Check if a member ID is provided as a command-line argument
  const memberId = process.argv[2];
  const date = process.argv[3];
  
  // Validate the member ID
  if (!memberId || !date) {
    console.error('Please provide a member ID then date as a command-line argument');
  } else {
    try {
     await calculateFinancialBalance(memberId, date);
    } catch (error) {
        console.error('Error calculating financial balance:', error);
        }   finally {
            pool.end();
        }
  }
    }

main();
