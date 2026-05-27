import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runQuery() {
  try {
    await client.connect();
    
    console.log('--- USERS IN DB ---');
    const usersRes = await client.query(`SELECT id, username, role, email FROM users`);
    console.log(usersRes.rows);

    console.log('--- STUDENT MASTER FOR 211FA04001 ---');
    const studentRes = await client.query(`SELECT registerno, name, "isTransport" FROM student_master WHERE registerno ILIKE '211FA04001'`);
    console.log(studentRes.rows);

    console.log('--- TRANSPORT ALLOCATIONS FOR 211FA04001 ---');
    const allocRes = await client.query(`SELECT * FROM transport_allocations WHERE user_id ILIKE '211FA04001'`);
    console.log(allocRes.rows);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
