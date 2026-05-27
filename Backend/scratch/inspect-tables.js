import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function inspectTables() {
  try {
    await client.connect();
    
    const tables = ['transport_allocations', 'users', 'student_master', 'buses', 'drivers', 'routes', 'route_stops'];
    
    for (const table of tables) {
      console.log(`\n--- Table: ${table} ---`);
      const colsRes = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table}';
      `);
      colsRes.rows.forEach(row => console.log(`Column: ${row.column_name} (${row.data_type})`));
      
      const countRes = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`Row count: ${countRes.rows[0].count}`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

inspectTables();
