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
    console.log('Altering column type...');
    await client.query(`ALTER TABLE transport_allocations ALTER COLUMN user_id TYPE varchar(255)`);
    console.log('Column type altered successfully');
    
    // Now trigger the auto allocation
    console.log('Triggering auto allocation manually for testing');
    
    // Delete existing
    await client.query(`DELETE FROM transport_allocations WHERE bus_id = 1`);
    
    // Seed
    await client.query(`
      INSERT INTO transport_allocations (user_id, role, bus_id, route_id, seat_number, status)
      VALUES 
      ('211FA04001', 'student', 1, 1, 6, 'active'),
      ('211FA04002', 'student', 1, 1, 7, 'active'),
      ('211FA04003', 'student', 1, 1, 8, 'active')
    `);
    console.log('Manual allocations inserted');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
