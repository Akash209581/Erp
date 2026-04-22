import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentMaster } from './entities/student-master.entity';
import { FinanceStudent } from './entities/finance-student.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(): Promise<StudentMaster[]> {
    return this.studentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('finance')
  findAllFinance(@Request() req: any): Promise<FinanceStudent[]> {
    return this.studentsService.findAllFinance(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('vuid/:vuid')
  async getByVuid(@Param('vuid') vuid: string): Promise<FinanceStudent> {
    const student = await this.studentsService.findByVuid(vuid);
    if (!student) {
        throw new NotFoundException(`Student with VUID ${vuid} not found`);
    }
    return student;
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-payment')
  updatePayment(@Body('vuid') vuid: string): Promise<FinanceStudent> {
    return this.studentsService.updateAdmissionPayment(vuid);
  }

  @Get(':registerno')
  findOne(@Param('registerno') registerno: string): Promise<StudentMaster | null> {
    return this.studentsService.findOne(registerno);
  }

  @Post()
  create(@Body() student: Partial<StudentMaster>): Promise<StudentMaster> {
    return this.studentsService.create(student);
  }

  @UseGuards(JwtAuthGuard)
  @Post('finance')
  createFinance(@Body() student: Partial<FinanceStudent>, @Request() req: any): Promise<FinanceStudent> {
    student.createdBy = req.user.username;
    return this.studentsService.createFinance(student);
  }

  @Post('clear-all')
  clearAll(): Promise<{ message: string }> {
    return this.studentsService.clearAll();
  }

}