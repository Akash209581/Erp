import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedTransportDetails() {
  try {
    await client.connect();
    console.log('Connected to DB');

    const userId = '211FA04001';
    const role = 'student';
    const location = 'Guntur bus Stand';

    // Insert or update
    const check = await client.query('SELECT id FROM user_transport_details WHERE user_id = $1 AND role = $2', [userId, role]);
    
    if (check.rows.length === 0) {
      await client.query(
        'INSERT INTO user_transport_details (user_id, role, transportation_location) VALUES ($1, $2, $3)',
        [userId, role, location]
      );
      console.log(`Location set for ${userId}`);
    } else {
      await client.query(
        'UPDATE user_transport_details SET transportation_location = $3 WHERE user_id = $1 AND role = $2',
        [userId, role, location]
      );
      console.log(`Location updated for ${userId}`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

seedTransportDetails();
