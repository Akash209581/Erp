/**
 * SETUP SCRIPT: Seeds 3 real student allocations from the users table.
 * Run: node scratch/seed-student-allocations.js
 */
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to DB\n');

  try {
    // 1. Get first bus
    const busResult = await client.query(`SELECT * FROM buses LIMIT 1`);
    if (busResult.rows.length === 0) {
      console.error('No buses in DB. Please add a bus first via the admin dashboard.');
      return;
    }
    const bus = busResult.rows[0];
    console.log(`Bus found: ${bus.bus_number} (id=${bus.bus_id})\n`);

    // 2. Check actual columns in users table
    const colsResult = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position`
    );
    const cols = colsResult.rows.map(r => r.column_name);
    console.log('Users table columns:', cols);

    // Build SELECT based on available columns
    const nameCol = cols.includes('name') ? 'name' 
                  : cols.includes('full_name') ? 'full_name' 
                  : cols.includes('first_name') ? `COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')` 
                  : `username`;

    // 2. Get 3 real students from users table
    const studentResult = await client.query(
      `SELECT id, username, (${nameCol}) as display_name, role FROM users WHERE role = 'student' LIMIT 3`
    );

    if (studentResult.rows.length === 0) {
      console.log('No students with role="student" found in users table.');
      console.log('Checking all users...');
      const allUsers = await client.query(`SELECT id, username, role FROM users LIMIT 10`);
      console.log('All users:', allUsers.rows);
      return;
    }

    console.log(`Found ${studentResult.rows.length} students:`);
    studentResult.rows.forEach(s => console.log(` - ${s.username} (id=${s.id})`));

    // 3. Clear existing allocations for this bus
    await client.query(`DELETE FROM transport_allocations WHERE bus_id = $1`, [bus.bus_id]);
    console.log(`\nCleared old allocations for bus ${bus.bus_id}`);

    // 4. Insert allocations using USERNAME as user_id (this is the registration number)
    const seats = [6, 7, 8];
    for (let i = 0; i < studentResult.rows.length; i++) {
      const student = studentResult.rows[i];
      const seat = seats[i];
      const userId = student.username; // Use username as the allocation key

      await client.query(
        `INSERT INTO transport_allocations (user_id, role, bus_id, route_id, seat_number, status)
         VALUES ($1, 'student', $2, NULL, $3, 'active')
         ON CONFLICT DO NOTHING`,
        [userId, bus.bus_id, seat]
      );
      console.log(`✅ Allocated seat ${seat} to ${userId} (${student.display_name || student.username})`);
    }

    // 5. Verify
    const verify = await client.query(`SELECT * FROM transport_allocations WHERE bus_id = $1`, [bus.bus_id]);
    console.log('\n✅ Final allocations in DB:');
    verify.rows.forEach(r => console.log(`  Seat ${r.seat_number} → user_id: "${r.user_id}" (${r.role})`));

    console.log('\n🎯 DONE! Now login with one of these usernames as a student to see the digital bus pass.');
    studentResult.rows.forEach(s => console.log(`  Username: "${s.username}"`));

  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await client.end();
  }
}

run();
