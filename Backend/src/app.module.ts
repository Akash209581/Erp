import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { StudentMaster } from './students/entities/student-master.entity';
import { FinanceStudent } from './students/entities/finance-student.entity';
import { Finance } from './students/entities/finance.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [StudentMaster, FinanceStudent, Finance, User],
      synchronize: true, // Auto-create tables (use migrations for production)
      ssl: {
          rejectUnauthorized: false
      }
    }),
    StudentsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}