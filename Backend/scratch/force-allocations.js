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
    await client.query(`UPDATE student_master SET "isTransport" = true, name = 'Student ' || registerno WHERE registerno IN ('211FA04001', '211FA04002', '211FA04003')`);

    // Force run auto-allocate for bus 4 manually in database
    await client.query(`DELETE FROM transport_allocations WHERE bus_id = 4`);
    await client.query(`
      INSERT INTO transport_allocations (user_id, role, bus_id, route_id, seat_number, status)
      VALUES 
      ('211FA04001', 'student', 4, null, 6, 'active'),
      ('211FA04002', 'student', 4, null, 7, 'active'),
      ('211FA04003', 'student', 4, null, 8, 'active')
    `);
    
    console.log('Successfully set manual allocations');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
