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
    
    // Set isTransport true for a few students to test
    const updateRes = await client.query(`UPDATE student_master SET "isTransport" = true WHERE registerno IN ('211FA04001', '211FA04002', '211FA04003')`);
    console.log('Updated students:', updateRes.rowCount);

    // Run auto-allocate for bus 1 manually just in case
    // First clear existing allocations
    await client.query(`DELETE FROM transport_allocations WHERE bus_id = 1`);
    
    // Insert some allocations manually if we want to ensure it works, but let's just let the API do it
    const studentsRes = await client.query(`SELECT registerno, gender FROM student_master WHERE "isTransport" = true`);
    console.log('Students needing transport:', studentsRes.rows);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
