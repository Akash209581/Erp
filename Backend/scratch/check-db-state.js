import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runQuery() {
  try {
    await client.connect();
    
    // Get 3 real students from the users table
    const studentsRes = await client.query(`SELECT id, username, role, first_name, last_name FROM users WHERE role = 'student' LIMIT 3`);
    console.log('STUDENTS:', JSON.stringify(studentsRes.rows, null, 2));
    
    // Get the bus
    const busRes = await client.query(`SELECT * FROM buses LIMIT 1`);
    console.log('BUS:', JSON.stringify(busRes.rows, null, 2));
    
    // Get transport_allocations table structure
    const colRes = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'transport_allocations'`);
    console.log('COLUMNS:', JSON.stringify(colRes.rows, null, 2));
    
    // Get existing allocations
    const allocRes = await client.query(`SELECT * FROM transport_allocations`);
    console.log('EXISTING ALLOCATIONS:', JSON.stringify(allocRes.rows, null, 2));

    const result = {
      students: studentsRes.rows,
      bus: busRes.rows[0],
      columns: colRes.rows,
      allocations: allocRes.rows
    };
    fs.writeFileSync('scratch/db-state.json', JSON.stringify(result, null, 2));
    console.log('Saved to scratch/db-state.json');
    
  } catch (err) {
    console.error('Error:', err.message);
    fs.writeFileSync('scratch/db-state-error.txt', err.message + '\n' + err.stack);
  } finally {
    await client.end();
  }
}

runQuery();
