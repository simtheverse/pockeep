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


// Function to create the family_members table
async function createFamilyMembersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS family_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        gender VARCHAR(10),
        created_at TIMESTAMP DEFAULT NOW()
      )`;

    await pool.query(query);
    console.log('family_members table created');
  } catch (error) {
    console.error('Error creating family_members table:', error);
  }
}

// Function to create the monthly_expenses table
async function createMonthlyExpensesTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS monthly_expenses (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES family_members(id),
        expense_name VARCHAR(255) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        category VARCHAR(255),
        recurring_day INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;

    await pool.query(query);
    console.log('monthly_expenses table created');
  } catch (error) {
    console.error('Error creating monthly_expenses table:', error);
  }
}

async function createIncomeTransactionsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS income_transactions (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES family_members(id),
        transaction_date DATE,
        description VARCHAR(255),
        amount NUMERIC
      );`;

    await pool.query(query);

    console.log('Income transactions table created successfully');
  } catch (error) {
    console.error('Error creating income transactions table:', error);
  }
}

// Call the functions to create the tables
async function createTables() {
  try {
    await createFamilyMembersTable();
    await createMonthlyExpensesTable();
    await createIncomeTransactionsTable();
  } finally {
    pool.end(); // Close the database connection
  }
}

// Execute the createTables function
createTables();
