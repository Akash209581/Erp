import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service.js';
import { FinanceController } from './finance.controller.js';
import { FinanceStudent } from './entities/finance-student.entity.js';
import { Finance } from './entities/finance.entity.js';
import { StudentMaster } from '../students/entities/student-master.entity.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinanceStudent, Finance, StudentMaster]),
    UsersModule,
    AuthModule,
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
