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
import fs from 'fs';

dotenv.config();

async function run() {
    try {
        const connection = await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            entities: [Bus, Driver, Route, RouteStop, TransportAllocation, UserTransportDetail, BusLocation, StudentMaster]
        });

        const repo = connection.getRepository(TransportAllocation);
        const all = await repo.find();
        console.log('ALL allocations:', all);

        const allocation = await repo.findOne({
            where: { user_id: '211FA04001', role: 'student', status: 'active' },
        });
        
        console.log('Found allocation:', allocation);
        fs.writeFileSync('scratch/student-query-result.json', JSON.stringify({all, allocation}, null, 2));

        await connection.close();
    } catch (e) {
        console.error('Error:', e);
    }
}

run();
