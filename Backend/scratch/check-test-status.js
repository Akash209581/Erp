const { Client } = require('pg');
const client = new Client({ connectionString: "postgresql://neondb_owner:npg_ksvN8mJq3rTV@ep-lively-breeze-amj53vn6-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require" });

async function checkStatus() {
  try {
    await client.connect();
    
    console.log('--- BUS INFO ---');
    const busRes = await client.query("SELECT * FROM buses WHERE bus_number = 'AP07BY1234'");
    console.log(busRes.rows);

    console.log('\n--- STUDENT ALLOCATION ---');
    const allocRes = await client.query("SELECT * FROM transport_allocations WHERE user_id = '211FA04001'");
    console.log(allocRes.rows);

    if (allocRes.rows.length > 0) {
      const busId = allocRes.rows[0].bus_id;
      const busAlloc = await client.query("SELECT * FROM buses WHERE bus_id = $1", [busId]);
      console.log('\n--- ALLOCATED BUS DETAILS ---');
      console.log(busAlloc.rows);
    }

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

checkStatus();
