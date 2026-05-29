import { Client } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runQuery() {
  try {
    await client.connect();
    console.log('Connected to database successfully');

    // 0. Ensure user exists and has a known password (Student@2026)
    const hashedPassword = await bcrypt.hash('Student@2026', 10);
    const userRes = await client.query(`SELECT id FROM users WHERE username = '211FA04001'`);
    if (userRes.rows.length === 0) {
      await client.query(`
        INSERT INTO users (id, username, password, role, email, "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), '211FA04001', $1, 'student', 'student@vignan.ac.in', true, now(), now())
      `, [hashedPassword]);
      console.log('Created user 211FA04001 in users table');
    } else {
      await client.query(`
        UPDATE users 
        SET password = $1, role = 'student'
        WHERE username = '211FA04001'
      `, [hashedPassword]);
      console.log('Updated password for user 211FA04001 in users table');
    }

    // 1. Update student_master
    await client.query(`
      UPDATE student_master 
      SET "isTransport" = true, name = 'Akash Student' 
      WHERE registerno = '211FA04001'
    `);
    console.log('Updated student_master for 211FA04001');

    // 2. Ensure a driver exists
    let driverId;
    const driverRes = await client.query(`SELECT driver_id FROM drivers LIMIT 1`);
    if (driverRes.rows.length === 0) {
      const newDriver = await client.query(`
        INSERT INTO drivers (driver_name, phone_number, license_number, status)
        VALUES ('Ramesh Kumar', '9876543210', 'DL-3729183', 'active')
        RETURNING driver_id
      `);
      driverId = newDriver.rows[0].driver_id;
      console.log('Created a default driver with ID:', driverId);
    } else {
      driverId = driverRes.rows[0].driver_id;
      console.log('Using existing driver with ID:', driverId);
    }

    // 3. Ensure a route exists
    let routeId;
    const routeRes = await client.query(`SELECT route_id FROM routes LIMIT 1`);
    if (routeRes.rows.length === 0) {
      const newRoute = await client.query(`
        INSERT INTO routes (route_name, start_point, end_point, routes_distance, estimated_time, status)
        VALUES ('Guntur - Campus Route', 'Guntur', 'VFSTR Campus', 18.5, 45, 'active')
        RETURNING route_id
      `);
      routeId = newRoute.rows[0].route_id;
      console.log('Created a default route with ID:', routeId);
    } else {
      routeId = routeRes.rows[0].route_id;
      console.log('Using existing route with ID:', routeId);
    }

    // 4. Ensure route stops exist for the route
    const stopsRes = await client.query(`SELECT stop_id FROM route_stops WHERE route_id = $1`, [routeId]);
    if (stopsRes.rows.length === 0) {
      await client.query(`
        INSERT INTO route_stops (route_id, stop_name, stop_order)
        VALUES 
        ($1, 'Guntur Bus Stand', 1),
        ($1, 'Narakodur', 2),
        ($1, 'Selapadu', 3),
        ($1, 'VFSTR Campus', 4)
      `, [routeId]);
      console.log('Created route stops for route ID:', routeId);
    }

    // 5. Ensure a bus exists and is linked to the route and driver
    let busId;
    const busRes = await client.query(`SELECT bus_id FROM buses LIMIT 1`);
    if (busRes.rows.length === 0) {
      const newBus = await client.query(`
        INSERT INTO buses (bus_number, capacity, status, route_id, driver_id, staff_seats, girl_seats, boy_seats, seating_type)
        VALUES ('AP07BY9999', 45, 'active', $1, $2, 5, 20, 20, '2+2')
        RETURNING bus_id
      `, [routeId, driverId]);
      busId = newBus.rows[0].bus_id;
      console.log('Created a default bus with ID:', busId);
    } else {
      busId = busRes.rows[0].bus_id;
      // Let's ensure the bus has a route and driver assigned
      await client.query(`
        UPDATE buses 
        SET route_id = $1, driver_id = $2 
        WHERE bus_id = $3
      `, [routeId, driverId, busId]);
      console.log('Assigned existing bus ID:', busId, 'to route:', routeId, 'and driver:', driverId);
    }

    // 6. Delete any existing allocation for 211FA04001
    await client.query(`
      DELETE FROM transport_allocations 
      WHERE user_id = '211FA04001'
    `);
    console.log('Cleared existing allocations for 211FA04001');

    // 7. Insert new active seat allocation
    await client.query(`
      INSERT INTO transport_allocations (user_id, role, bus_id, route_id, seat_number, pickup_stop, status)
      VALUES ('211FA04001', 'student', $1, $2, 12, 'Guntur Bus Stand', 'active')
    `, [busId, routeId]);
    console.log('Inserted new seat allocation for 211FA04001');

    console.log('DB setup completed successfully!');
  } catch (err) {
    console.error('Error during DB setup:', err.message);
  } finally {
    await client.end();
  }
}

runQuery();
