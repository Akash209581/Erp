import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentMaster } from './entities/student-master.entity';
import { FinanceStudent } from './entities/finance-student.entity';
import { Finance } from './entities/finance.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentMaster, FinanceStudent, Finance]),
    AuthModule,
    UsersModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}