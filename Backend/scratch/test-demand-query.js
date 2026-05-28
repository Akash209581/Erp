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
    console.log('Connected to DB');

    const query = `
      SELECT r.route_name, COUNT(s.id) as count
      FROM student_master s
      LEFT JOIN transport_allocations a ON a.user_id = s.registerno::varchar AND a.status = 'active'
      LEFT JOIN routes r ON 1=1
      WHERE s."isTransport" = true AND a.allocation_id IS NULL
      GROUP BY r.route_name
    `;
    const res = await client.query(query);
    console.log('Query result:', res.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
