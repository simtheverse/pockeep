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
/*
  async function calculateFinancialBalanceByDay(memberName, startDate, endDate) {
    try {
      const member = await getFamilyMemberByName(memberName);
      if (!member) {
        throw new Error(`Family member '${memberName}' not found.`);
      }
  
      const expenses = await getMonthlyExpensesByMemberId(member.id);
      const transactions = await getIncomeTransactionsByMemberId(member.id);
  
      const balanceByDay = [];
      let currentBalance = 0;
  
      // Iterate over each day in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split('T')[0];
  
        // Calculate total expenses for the current day
        const expensesForDay = expenses.filter(expense => expense.recurring_day === currentDate.getDate());
        const totalExpenses = expensesForDay.reduce((sum, expense) => sum + expense.amount, 0);
  
        // Calculate total income for the current day
        const transactionsForDay = transactions.filter(transaction => transaction.transaction_date === formattedDate);
        const totalIncome = transactionsForDay.reduce((sum, transaction) => sum + transaction.amount, 0);
  
        // Update the current balance
        currentBalance += totalIncome - totalExpenses;
  
        // Store the balance for the current day
        balanceByDay.push({
          date: formattedDate,
          financialBalance: currentBalance
        });
  
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return balanceByDay;
    } catch (error) {
      throw new Error('Error calculating financial balance: ' + error.message);
    }
  }*/

  async function logFinancialBalanceByDay(memberName, startDate, endDate) {
    try {
      const member = await pool.query('SELECT id FROM family_members WHERE name = $1', [memberName]);
  
      if (member.rows.length === 0) {
        console.log(`Family member ${memberName} not found.`);
        return;
      }
  
      const memberId = member.rows[0].id;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const balanceByDay = [];
  
      // Iterate over each day in the date range
      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const expenses = await pool.query(
          'SELECT amount FROM monthly_expenses WHERE member_id = $1 AND recurring_day <= $2',
          [memberId, date.getDate()]
        );
        const transactions = await pool.query(
          'SELECT amount FROM income_transactions WHERE member_id = $1 AND transaction_date = $2',
          [memberId, date]
        );
  
        let totalExpenses = 0;
        let totalIncome = 0;
  
        // Calculate the total expenses for the day
        for (const expense of expenses.rows) {
          totalExpenses += parseFloat(expense.amount);
        }
  
        // Calculate the total income for the day
        for (const transaction of transactions.rows) {
          totalIncome += parseFloat(transaction.amount);
        }
  
        const financialBalance = totalIncome - totalExpenses;
  
        balanceByDay.push({
          date: date.toISOString().split('T')[0],
          financialBalance
        });
      }
  
      console.log(`Financial balance for ${memberName}:`);
  
      balanceByDay.forEach(balance => {
        console.log(`${balance.date}: $${balance.financialBalance.toFixed(2)}`);
      });
    } catch (error) {
      console.error('Error calculating financial balance:', error.message);
    } finally {
      pool.end(); // Close the database connection
    }
  }
  
  // Specify the member name and date range
  const memberName = process.argv[2];
  const startDate = process.argv[3];
  const endDate = process.argv[4];
  
  // Call the function to log the financial balance
  logFinancialBalanceByDay(memberName, startDate, endDate);
    
