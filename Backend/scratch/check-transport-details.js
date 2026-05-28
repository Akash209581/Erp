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
    
    console.log('--- BUSES ---');
    const buses = await client.query(`SELECT * FROM buses`);
    console.log(buses.rows);

    console.log('--- ROUTES ---');
    const routes = await client.query(`SELECT * FROM routes`);
    console.log(routes.rows);

    console.log('--- ROUTE STOPS ---');
    const stops = await client.query(`SELECT * FROM route_stops`);
    console.log(stops.rows);

    console.log('--- ALL ALLOCATIONS ---');
    const allocations = await client.query(`SELECT * FROM transport_allocations`);
    console.log(allocations.rows);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
