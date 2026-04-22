const { Client } = require('pg');
require('dotenv').config();

async function cleanup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected to database. Dropping tables for schema sync...');
    // Drop in correct order due to relationships
    await client.query('DROP TABLE IF EXISTS "finance" CASCADE');
    await client.query('DROP TABLE IF EXISTS "financestudent" CASCADE');
    console.log('Tables dropped successfully.');
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await client.end();
  }
}

cleanup();
