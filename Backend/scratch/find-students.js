import { Client } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function findStudents() {
  try {
    await client.connect();
    console.log('Connected to DB');

    const students = ['211FA04001', '211FA04002', '211FA04003'];
    const saltRounds = 10;

    for (const reg of students) {
        const check = await client.query('SELECT id FROM users WHERE username = $1', [reg]);
        if (check.rows.length === 0) {
            console.log(`Creating user for ${reg}...`);
            const hashedPassword = await bcrypt.hash(reg, saltRounds);
            await client.query(
                'INSERT INTO users (id, username, password, role, "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())',
                [reg, hashedPassword, 'student', true]
            );
        }
    }
    console.log('User accounts created/verified.');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

findStudents();
