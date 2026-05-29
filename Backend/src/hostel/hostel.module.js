import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hostel } from './entities/hostel.entity.js';
import { Block } from './entities/block.entity.js';
import { Room } from './entities/room.entity.js';
import { Allocation } from './entities/allocation.entity.js';
import { HostelComplaint } from './entities/complaint.entity.js';
import { HostelAttendance } from './entities/attendance.entity.js';
import { HostelVisitor } from './entities/visitor.entity.js';
import { Campus } from './entities/campus.entity.js';
import { HostelAuditLog } from './entities/audit-log.entity.js';
import { HostelBroadcast } from './entities/broadcast.entity.js';
import { LeaveRequest } from './entities/leave-request.entity.js';
import { HostelAsset } from './entities/asset.entity.js';

import { AdminHostelController } from './admin/admin.controller.js';
import { AdminHostelService } from './admin/admin.service.js';
import { WardenHostelController } from './warden/warden.controller.js';
import { WardenHostelService } from './warden/warden.service.js';
import { StudentHostelController } from './student/student.controller.js';
import { StudentHostelService } from './student/student.service.js';
import { HostelGateway } from './hostel.gateway.js';
import { StudentsModule } from '../students/students.module.js';
import { FinanceModule } from '../finance/finance.module.js';
import { HostelEligibilityGuard } from './guards/hostel-eligibility.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hostel, 
      Block, 
      Room, 
      Allocation, 
      HostelComplaint, 
      HostelAttendance, 
      HostelVisitor,
      Campus,
      HostelAuditLog,
      HostelBroadcast,
      LeaveRequest,
      HostelAsset
    ]),
    StudentsModule,
    FinanceModule
  ],
  controllers: [
    AdminHostelController,
    WardenHostelController,
    StudentHostelController
  ],
  providers: [
    AdminHostelService,
    WardenHostelService,
    StudentHostelService,
    HostelEligibilityGuard,
    HostelGateway
  ],
  exports: [AdminHostelService, WardenHostelService, StudentHostelService]
})
export class HostelModule {}
