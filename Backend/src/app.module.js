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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [StudentMaster, FinanceStudent, Finance, User],
      synchronize: true,
      ssl: {
          rejectUnauthorized: false
      }
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
