import { Client } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedTransportManager() {
  try {
    await client.connect();
    console.log('Connected to Neon DB');

    const username = 'transport_admin';
    const password = 'Transport@2026';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if user exists
    const checkRes = await client.query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (checkRes.rows.length === 0) {
      console.log('Creating transport_manager user...');
      await client.query(
        'INSERT INTO users (id, username, password, role, "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())',
        [username, hashedPassword, 'transport_manager', true]
      );
      console.log(`User ${username} created successfully.`);
    } else {
      console.log(`User ${username} already exists. Updating role...`);
      await client.query('UPDATE users SET role = $1 WHERE username = $2', ['transport_manager', username]);
    }

    // Set isTransport=true for all students in student_master for testing
    console.log('Updating student_master set isTransport=true...');
    await client.query('UPDATE student_master SET "isTransport" = true');
    console.log('Updated student_master successfully.');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

seedTransportManager();
