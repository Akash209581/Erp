const { Client } = require('pg');
const bcrypt = require('bcrypt');

const DATABASE_URL = "postgresql://neondb_owner:npg_ksvN8mJq3rTV@ep-lively-breeze-amj53vn6-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function seed() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to DB');

    const users = [
      { username: 'chief_warden', password: 'Admin@2026', role: 'admin', email: 'admin@vignan.ac.in' },
      { username: 'hostel_warden', password: 'Warden@2026', role: 'warden', email: 'warden@vignan.ac.in' }
    ];

    for (const u of users) {
      const existing = await client.query('SELECT * FROM users WHERE username = $1', [u.username]);
      if (existing.rows.length === 0) {
        const hashed = await bcrypt.hash(u.password, 10);
        await client.query(
          'INSERT INTO users (id, username, password, role, email, "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, true, now(), now())',
          [u.username, hashed, u.role, u.email]
        );
        console.log(`Created user: ${u.username}`);
      } else {
        console.log(`User already exists: ${u.username}`);
      }
    }
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.end();
  }
}

seed();
