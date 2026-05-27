import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransportationController } from './transportation.controller.js';
import { TransportationService } from './transportation.service.js';
import { TransportationGateway } from './transportation.gateway.js';

import { Bus } from './entities/bus.entity.js';
import { Driver } from './entities/driver.entity.js';
import { Route } from './entities/route.entity.js';
import { RouteStop } from './entities/route-stop.entity.js';
import { TransportAllocation } from './entities/transport-allocation.entity.js';
import { UserTransportDetail } from './entities/user-transport-detail.entity.js';
import { BusLocation } from './entities/bus-location.entity.js';
import { StudentMaster } from '../students/entities/student-master.entity.js';
import { BusDocumentType } from './entities/bus-document-type.entity.js';
import { BusDocument } from './entities/bus-document.entity.js';
import { TransportRider } from './entities/transport-rider.entity.js';
import { FuelAllocation } from './entities/fuel-allocation.entity.js';
import { BusBreakdown } from './entities/bus-breakdown.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bus,
      Driver,
      Route,
      RouteStop,
      TransportAllocation,
      UserTransportDetail,
      BusLocation,
      StudentMaster,
      BusDocumentType,
      BusDocument,
      TransportRider,
      FuelAllocation,
      BusBreakdown,
    ]),
  ],
  controllers: [TransportationController],
  providers: [TransportationService, TransportationGateway],
  exports: [TransportationService],
})
export class TransportationModule {}
