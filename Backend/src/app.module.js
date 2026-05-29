import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module.js';
import { FinanceModule } from './finance/finance.module.js';
import { LibraryModule } from './library/library.module.js';
import { HostelModule } from './hostel/hostel.module.js';
import { TransportationModule } from './transportation/transportation.module.js';
import { StudentMaster } from './students/entities/student-master.entity.js';
import { FinanceStudent } from './finance/entities/finance-student.entity.js';
import { Finance } from './finance/entities/finance.entity.js';
import { UsersModule } from './users/users.module.js';
import { User } from './users/entities/user.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { Bus } from './transportation/entities/bus.entity.js';
import { Driver } from './transportation/entities/driver.entity.js';
import { Route } from './transportation/entities/route.entity.js';
import { RouteStop } from './transportation/entities/route-stop.entity.js';
import { TransportAllocation } from './transportation/entities/transport-allocation.entity.js';
import { UserTransportDetail } from './transportation/entities/user-transport-detail.entity.js';
import { BusLocation } from './transportation/entities/bus-location.entity.js';
import { BusDocumentType } from './transportation/entities/bus-document-type.entity.js';
import { BusDocument } from './transportation/entities/bus-document.entity.js';
import { TransportRider } from './transportation/entities/transport-rider.entity.js';
import { FuelAllocation } from './transportation/entities/fuel-allocation.entity.js';
import { BusBreakdown } from './transportation/entities/bus-breakdown.entity.js';
import { Hostel } from './hostel/entities/hostel.entity.js';
import { Block } from './hostel/entities/block.entity.js';
import { Room } from './hostel/entities/room.entity.js';
import { Allocation } from './hostel/entities/allocation.entity.js';
import { HostelComplaint } from './hostel/entities/complaint.entity.js';
import { HostelAttendance } from './hostel/entities/attendance.entity.js';
import { HostelVisitor } from './hostel/entities/visitor.entity.js';
import { Campus } from './hostel/entities/campus.entity.js';
import { HostelAuditLog } from './hostel/entities/audit-log.entity.js';
import { HostelBroadcast } from './hostel/entities/broadcast.entity.js';
import { LeaveRequest } from './hostel/entities/leave-request.entity.js';
import { HostelAsset } from './hostel/entities/asset.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        StudentMaster, 
        FinanceStudent, 
        Finance, 
        User,
        Bus,
        Driver,
        Route,
        RouteStop,
        TransportAllocation,
        UserTransportDetail,
        BusLocation,
        BusDocumentType,
        BusDocument,
        TransportRider,
        FuelAllocation,
        BusBreakdown,
        Hostel, Block, Room, Allocation, HostelComplaint, HostelAttendance, HostelVisitor, Campus, HostelAuditLog,
        HostelBroadcast, LeaveRequest, HostelAsset
      ],
      synchronize: true,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    StudentsModule,
    FinanceModule,
    LibraryModule,
    HostelModule,
    TransportationModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
