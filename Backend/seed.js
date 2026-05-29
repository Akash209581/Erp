const { Client } = require('pg');

// Database connection string from .env
const connectionString = "postgresql://neondb_owner:npg_ksvN8mJq3rTV@ep-lively-breeze-amj53vn6-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function seed() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('Connected to Neon Cloud Database. Repairing and Seeding SHAMS Data...');

    // 1. Wipe existing hostel-related data to clear duplicate constraint errors
    // Order matters because of Foreign Keys
    console.log('Clearing old records...');
    await client.query('DELETE FROM allocations');
    await client.query('DELETE FROM rooms');
    await client.query('DELETE FROM blocks');
    await client.query('DELETE FROM hostels');
    await client.query('DELETE FROM campuses');

    // 2. Seed Campus
    const campusRes = await client.query(`
      INSERT INTO campuses (name, location)
      VALUES ('Main Campus', 'Vadlamudi')
      RETURNING id
    `);
    const campusId = campusRes.rows[0].id;
    console.log('Campus Seeded.');

    // 3. Seed Hostels
    const hostelRes = await client.query(`
      INSERT INTO hostels (name, type, "campusId") 
      VALUES 
        ('V-Residence (Boys)', 'Boys', '${campusId}'), 
        ('N-Residence (Girls)', 'Girls', '${campusId}') 
      RETURNING id, name
    `);
    const boysHostelId = hostelRes.rows[0].id;
    const girlsHostelId = hostelRes.rows[1].id;
    console.log('Hostels Seeded.');

    // 4. Seed Blocks
    const blockRes = await client.query(`
      INSERT INTO blocks (name, "hostelId") 
      VALUES ('Block A', '${boysHostelId}'), ('Block B', '${boysHostelId}'), ('Wing N1', '${girlsHostelId}')
      RETURNING id, name
    `);
    const blockAId = blockRes.rows[0].id;
    const blockBId = blockRes.rows[1].id;
    const wingN1Id = blockRes.rows[2].id;
    console.log('Blocks Seeded.');

    // 5. Seed Rooms
    await client.query(`
      INSERT INTO rooms ("roomNumber", capacity, "currentOccupancy", "blockId")
      VALUES 
        ('A101', 4, 0, '${blockAId}'),
        ('A102', 4, 1, '${blockAId}'),
        ('B101', 2, 1, '${blockBId}'),
        ('B102', 2, 2, '${blockBId}'),
        ('N101', 3, 0, '${wingN1Id}')
    `);
    console.log('Rooms Seeded.');

    // 6. Seed Eligible Students
    await client.query(`
      INSERT INTO student_master (registerno, name, "Hostel")
      VALUES 
        ('261FA00001', 'John Doe', 'yes'),
        ('211FA04002', 'Jane Smith', 'yes'),
        ('211FA04003', 'Local Resident', 'no')
      ON CONFLICT (registerno) DO UPDATE SET "Hostel" = EXCLUDED."Hostel"
    `);
    console.log('Student Records Seeded.');

    console.log('✅ DATABASE REPAIRED & SEEDED! You can now start the backend.');

  } catch (err) {
    console.error('Seeding Error:', err);
  } finally {
    await client.end();
  }
}

seed();
