const fs = require('fs');
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

async function loadFamilyMembersFromCSV() {
    try {
      const filePath = 'family_members.csv';
      const csvData = fs.readFileSync(filePath, 'utf-8');
      const rows = csvData.split('\n').slice(1); // Exclude header row
  
      for (let row of rows) {
        const [name, age, gender] = row.split(',');
  
        const query = `
          INSERT INTO family_members (name, age, gender)
          VALUES ($1, $2, $3)
          RETURNING id`; // Return the generated id
  
        const values = [name, age, gender];
  
        const result = await pool.query(query, values);
        const memberId = result.rows[0].id; // Retrieve the generated id
  
        console.log(`Family member '${name}' loaded with ID ${memberId}`);
      }
  
      console.log('Family members loaded from CSV');
    } catch (error) {
      console.error('Error loading family members:', error);
    }
  }
  /*
  async function loadMonthlyExpensesFromCSV() {
    try {
      const filePath = 'monthly_expenses.csv';
      const csvData = fs.readFileSync(filePath, 'utf-8');
      const rows = csvData.split('\n').slice(1); // Exclude header row
  
      for (let row of rows) {
        const [name, expenseName, amount, category, recurringDay] = row.split(',');
  
        // Get the member_id from the family_members table based on the member's name
        const getMemberIdQuery = `
          SELECT id
          FROM family_members
          WHERE name = $1`;
  
        const getMemberIdValues = [name];
  
        const memberResult = await pool.query(getMemberIdQuery, getMemberIdValues);
        const memberId = memberResult.rows[0].member_id; // Retrieve the member_id
  
        const query = `
          INSERT INTO monthly_expenses (member_id, expense_name, amount, category, recurring_day)
          VALUES ($1, $2, $3, $4, $5)`;
  
        const values = [memberId, expenseName, amount, category, recurringDay];
  
        await pool.query(query, values);
      }
  
      console.log('Monthly expenses loaded from CSV');
    } catch (error) {
      console.error('Error loading monthly expenses:', error);
    } finally {
      pool.end(); // Close the database connection
    } */

    async function loadMonthlyExpensesFromCSV() {
        try {
          const filePath = 'monthly_expenses.csv';
          const csvData = fs.readFileSync(filePath, 'utf-8');
          const rows = csvData.split('\n').slice(1); // Exclude header row
      
          for (let row of rows) {
            const [name, expenseName, amount, category, recurringDay] = row.split(',');
      
            const query = `
              INSERT INTO monthly_expenses (member_id, expense_name, amount, category, recurring_day)
              SELECT id, $1, $2, $3, $4
              FROM family_members
              WHERE name = $5`;
      
            const values = [expenseName, amount, category, recurringDay, name];
      
            await pool.query(query, values);
          }
      
          console.log('Monthly expenses loaded from CSV');
        } catch (error) {
          console.error('Error loading monthly expenses:', error);
        }
      }
  
  async function runLoadingScripts() {
    try {
      await loadFamilyMembersFromCSV();
      await loadMonthlyExpensesFromCSV();
    } catch (error) {
      console.error('Error running loading scripts:', error);
    }
  }
  
  runLoadingScripts();