import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function listTables() {
  try {
    await client.connect();
    console.log('Connected to Neon DB');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('Tables in DB:');
    res.rows.forEach(row => console.log(`- ${row.table_name}`));

    // Check users table for transport manager
    console.log('\nChecking users table for roles:');
    const usersRes = await client.query(`
      SELECT DISTINCT role FROM users;
    `);
    usersRes.rows.forEach(row => console.log(`Role found: ${row.role}`));

    // Check student_master columns
    console.log('\nChecking student_master columns for boolean values:');
    const colsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'student_master';
    `);
    colsRes.rows.forEach(row => console.log(`Column: ${row.column_name} (${row.data_type})`));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

listTables();
