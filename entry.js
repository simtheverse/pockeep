if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
 


const { Pool } = require('pg');

console.log('No value for FOO yet:', process.env.NODE_ENV);