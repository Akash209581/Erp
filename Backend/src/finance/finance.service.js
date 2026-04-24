import { Injectable, Logger, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FinanceStudent } from './entities/finance-student.entity.js';
import { Finance } from './entities/finance.entity.js';
import { StudentMaster } from '../students/entities/student-master.entity.js';
import { UsersService } from '../users/users.service.js';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
@Dependencies(
  getRepositoryToken(FinanceStudent),
  getRepositoryToken(Finance),
  getRepositoryToken(StudentMaster),
  UsersService
)
export class FinanceService {
  constructor(financeRepository, financeRecordRepository, studentMasterRepository, usersService) {
    this.financeRepository = financeRepository;
    this.financeRecordRepository = financeRecordRepository;
    this.studentMasterRepository = studentMasterRepository;
    this.usersService = usersService;
    this.logger = new Logger(FinanceService.name);
  }

  async findAllFinance(username) {
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

  async findByVuid(vuid) {
    return this.financeRepository.findOneBy({ vuid: vuid.trim() });
  }

  async createFinance(studentData) {
    // Sanitize numeric fields
    if (typeof studentData.total_fee_fixed === 'string' && studentData.total_fee_fixed.trim() === '') {
        studentData.total_fee_fixed = 0;
    }
    if (typeof studentData.scholarship_amount === 'string' && studentData.scholarship_amount.trim() === '') {
        studentData.scholarship_amount = 0;
    }

    // Save the core student record
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

  async updateAdmissionPayment(vuid) {
    const student = await this.financeRepository.findOneBy({ vuid: vuid.trim() });
    if (!student) throw new Error('Student not found');
    
    if (student.admission_fee === 'Yes') {
        return student; // Already processed
    }

    // Generate Register Number: 261FA00001
    const currentYearShort = new Date().getFullYear().toString().slice(-2);
    const count = await this.financeRepository.createQueryBuilder('student')
        .where('student.registerno IS NOT NULL')
        .getCount();
    
    const sequence = (count + 1).toString().padStart(5, '0');
    const registerno = `${currentYearShort}1FA${sequence}`;

    // Use update to ensure we are updating the existing record by ID
    await this.financeRepository.update(student.id, {
        admission_fee: 'Yes',
        registerno: registerno
    });

    // Refresh student data
    const updatedStudent = await this.financeRepository.findOneBy({ id: student.id });
    if (!updatedStudent) throw new Error('Failed to retrieve updated student');

    // Also update the linked finance record with the new register number
    await this.financeRecordRepository.update(
        { studentId: updatedStudent.id },
        { registerno: updatedStudent.registerno }
    );

    // Create/update the record in StudentMaster
    try {
        const studentMasterData = this.studentMasterRepository.create({
            ...updatedStudent,
            registerno: updatedStudent.registerno
        });
        await this.studentMasterRepository.save(studentMasterData);
    } catch (masterError) {
        this.logger.error('Failed to create student master record:', masterError);
    }
    
    // Create Student User Account
    try {
        await this.usersService.create({
            username: updatedStudent.registerno,
            password: updatedStudent.registerno,
            role: UserRole.STUDENT,
            email: updatedStudent.studentemailid
        });
    } catch (userError) {
        this.logger.error('Failed to create student user account:', userError);
    }
    
    return updatedStudent;
  }
}
