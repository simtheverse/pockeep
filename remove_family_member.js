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

  async function deleteMonthlyExpenses(memberId) {
    try {
      const query = `
        DELETE FROM monthly_expenses
        WHERE member_id = $1`;
  
      const values = [memberId];
  
      await pool.query(query, values);
  
      console.log('Associated monthly expenses deleted successfully');
    } catch (error) {
      console.error('Error deleting associated monthly expenses:', error);
      throw error;
    }
  }
  
  async function removeFamilyMember(memberId) {
    try {
      await deleteMonthlyExpenses(memberId);
  
      const query = `
        DELETE FROM family_members
        WHERE id = $1`;
  
      const values = [memberId];
  
      const result = await pool.query(query, values);
  
      if (result.rowCount > 0) {
        console.log('Family member removed successfully');
      } else {
        console.log('Family member not found');
      }
    } catch (error) {
      console.error('Error removing family member:', error);
    } finally {
      pool.end(); // Close the database connection
    }
  }
  
  // Check if a member ID is provided as a command-line argument
  const memberIdToRemove = process.argv[2];
  
  // Validate the member ID
  if (!memberIdToRemove) {
    console.error('Please provide a member ID as a command-line argument');
  } else {
    removeFamilyMember(memberIdToRemove);
  }