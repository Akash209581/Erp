import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function dropTransportationTables() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Drop tables in order of dependency
    const tables = [
      'trips',
      'fuel_logs',
      'bus_passes',
      'pass_change_requests',
      'transport_allocations',
      'route_stops',
      'buses',
      'drivers',
      'routes',
      'users' // Dropping users to fix the "password contains null values" sync error
    ];

    for (const table of tables) {
      console.log(`Dropping table: ${table}`);
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }

    console.log('Transportation tables dropped successfully');
  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await client.end();
  }
}

dropTransportationTables();
