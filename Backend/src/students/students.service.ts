import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentMaster } from './entities/student-master.entity';
import { FinanceStudent } from './entities/finance-student.entity';
import { Finance } from './entities/finance.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentMaster)
    private studentsRepository: Repository<StudentMaster>,
    @InjectRepository(FinanceStudent)
    private financeRepository: Repository<FinanceStudent>,
    @InjectRepository(Finance)
    private financeRecordRepository: Repository<Finance>,
    private usersService: UsersService,
  ) {}

  findAll(): Promise<StudentMaster[]> {
    return this.studentsRepository.find();
  }

  findAllFinance(username?: string): Promise<FinanceStudent[]> {
    if (username) {
      return this.financeRepository.find({
        where: { createdBy: username },
        order: { createdAt: 'DESC' }
      });
    }
    return this.financeRepository.find({
        order: { createdAt: 'DESC' }
    });
  }

  findOne(registerno: string): Promise<StudentMaster | null> {
    return this.studentsRepository.findOneBy({ registerno });
  }

  findOneFinance(registerno: string): Promise<FinanceStudent | null> {
    return this.financeRepository.findOneBy({ registerno });
  }

  create(student: Partial<StudentMaster>): Promise<StudentMaster> {
    return this.studentsRepository.save(student);
  }

  async createFinance(studentData: Partial<FinanceStudent>): Promise<FinanceStudent> {
    // Sanitize numeric fields to avoid Postgres 22P02 error (invalid numeric input for "")
    if (typeof studentData.total_fee_fixed === 'string' && (studentData.total_fee_fixed as string).trim() === '') {
        studentData.total_fee_fixed = 0;
    }
    if (typeof studentData.scholarship_amount === 'string' && (studentData.scholarship_amount as string).trim() === '') {
        studentData.scholarship_amount = 0;
    }

    // Save the core student record (registerno is now nullable)
    const savedStudent = await this.financeRepository.save(studentData);

    // Create the linked financial record
    const financeRecord = this.financeRecordRepository.create({
        studentId: savedStudent.id,
        vuid: savedStudent.vuid,
        sem: savedStudent.semester || '1',
        year: savedStudent.cyear || '1',
        admissionfee: 0,
        totalfee: savedStudent.total_fee_fixed || 0,
        feepaid: 0,
        feeleft: savedStudent.total_fee_fixed || 0,
    });

    await this.financeRecordRepository.save(financeRecord);
    
    return savedStudent;
  }

  async remove(registerno: string): Promise<void> {
    await this.studentsRepository.delete(registerno);
  }

  async clearAll(): Promise<{ message: string }> {
    await this.financeRecordRepository.clear();
    await this.financeRepository.clear();
    await this.studentsRepository.clear();
    return { message: 'All student records have been cleared' };
  }

  async findByVuid(vuid: string): Promise<FinanceStudent | null> {
    return this.financeRepository.findOneBy({ vuid: vuid.trim() });
  }

  async updateAdmissionPayment(vuid: string): Promise<FinanceStudent> {
    const student = await this.financeRepository.findOneBy({ vuid });
    if (!student) throw new Error('Student not found');
    
    if (student.admission_fee === 'Yes') {
        return student; // Already processed
    }

    student.admission_fee = 'Yes';
    
    // Generate Register Number: 261FA00001
    const currentYearShort = new Date().getFullYear().toString().slice(-2);
    // Count only students who have been assigned a register number to ensure sequence
    const count = await this.financeRepository.createQueryBuilder('student')
        .where('student.registerno IS NOT NULL')
        .getCount();
    
    const sequence = (count + 1).toString().padStart(5, '0');
    student.registerno = `${currentYearShort}1FA${sequence}`;
    
    const updatedStudent = await this.financeRepository.save(student);
    
    // Also update the linked finance record with the new register number
    await this.financeRecordRepository.update(
        { studentId: updatedStudent.id },
        { registerno: updatedStudent.registerno }
    );
    
    // Create Student User Account (Background-like within the same transaction/request)
    try {
        await this.usersService.create({
            username: updatedStudent.registerno,
            password: updatedStudent.registerno, // Password is same as registerno as requested
            role: UserRole.STUDENT,
            email: updatedStudent.studentemailid
        });
    } catch (userError) {
        console.error('Failed to create student user account:', userError);
        // We continue because the student record is already updated
    }
    
    return updatedStudent;
  }
}