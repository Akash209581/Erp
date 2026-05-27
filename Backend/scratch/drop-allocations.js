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
    console.log('Dropping transport_allocations...');
    await client.query(`DROP TABLE IF EXISTS transport_allocations CASCADE`);
    console.log('Table dropped. Restart the backend to let TypeORM recreate it.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
