import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service.js';
import { StudentsController } from './students.controller.js';
import { StudentMaster } from './entities/student-master.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentMaster]),
    AuthModule,
    UsersModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
