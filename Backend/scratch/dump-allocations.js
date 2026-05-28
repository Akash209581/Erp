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
    const res = await client.query(`SELECT * FROM transport_allocations`);
    fs.writeFileSync('scratch/allocations.json', JSON.stringify(res.rows, null, 2));
    console.log('Saved to scratch/allocations.json');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
