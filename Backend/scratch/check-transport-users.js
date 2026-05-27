import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAndCreateUsers() {
  try {
    await client.connect();
    
    // Check for transport-related usernames
    const searchRes = await client.query(`
      SELECT username, role FROM users 
      WHERE username ILIKE '%transport%' OR username ILIKE '%manager%';
    `);
    
    if (searchRes.rows.length > 0) {
      console.log('Found potential transport manager users:');
      searchRes.rows.forEach(row => console.log(`- ${row.username} (Role: ${row.role})`));
    } else {
      console.log('No transport manager users found. Creating one...');
      // Note: In a real app we'd hash the password, but for dev seed we'll use a known one.
      // Assuming 'bcrypt' is used in the app, we'll just insert a test user.
      // But wait! If I insert directly, the app might not be able to log in if it expects hashed.
      // I'll check the seed logic in the backend.
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkAndCreateUsers();
