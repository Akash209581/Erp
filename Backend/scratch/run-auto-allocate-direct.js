import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { TransportationService } from './src/transportation/transportation.service.js';
import { Bus } from './src/transportation/entities/bus.entity.js';
import { Driver } from './src/transportation/entities/driver.entity.js';
import { Route } from './src/transportation/entities/route.entity.js';
import { RouteStop } from './src/transportation/entities/route-stop.entity.js';
import { TransportAllocation } from './src/transportation/entities/transport-allocation.entity.js';
import { UserTransportDetail } from './src/transportation/entities/user-transport-detail.entity.js';
import { BusLocation } from './src/transportation/entities/bus-location.entity.js';
import { StudentMaster } from './src/students/entities/student-master.entity.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
    try {
        const connection = await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            entities: [Bus, Driver, Route, RouteStop, TransportAllocation, UserTransportDetail, BusLocation, StudentMaster]
        });

        const service = new TransportationService(
            connection.getRepository(Bus),
            connection.getRepository(Driver),
            connection.getRepository(Route),
            connection.getRepository(RouteStop),
            connection.getRepository(TransportAllocation),
            connection.getRepository(UserTransportDetail),
            connection.getRepository(BusLocation),
            connection.getRepository(StudentMaster)
        );

        console.log('Fetching bus 1...');
        const buses = await connection.getRepository(Bus).find();
        if (buses.length > 0) {
            console.log('Running auto-allocate for bus', buses[0].bus_id);
            const result = await service.autoAllocateSeats(buses[0].bus_id);
            console.log('Result:', result);
        } else {
            console.log('No buses found in DB');
        }
        
        await connection.close();
    } catch (e) {
        console.error('Error:', e);
    }
}

run();
