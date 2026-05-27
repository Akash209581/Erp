const { Client } = require('pg');
const client = new Client({ connectionString: "postgresql://neondb_owner:npg_ksvN8mJq3rTV@ep-lively-breeze-amj53vn6-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require" });

async function checkLocations() {
  try {
    await client.connect();
    const res = await client.query("SELECT * FROM bus_locations");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkLocations();
