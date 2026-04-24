import { Controller, Get, Post, Body, Param, UseGuards, Request, NotFoundException, Dependencies } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('finance')
@Dependencies(FinanceService)
export class FinanceController {
  constructor(financeService) {
    this.financeService = financeService;
  }

  @UseGuards(JwtAuthGuard)
  @Get('students')
  findAllFinance(@Request() req) {
    return this.financeService.findAllFinance(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('vuid/:vuid')
  async getByVuid(@Param('vuid') vuid) {
    const student = await this.financeService.findByVuid(vuid);
    if (!student) {
        throw new NotFoundException(`Student with VUID ${vuid} not found`);
    }
    return student;
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-payment')
  updatePayment(@Body('vuid') vuid) {
    return this.financeService.updateAdmissionPayment(vuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('students')
  createFinance(@Body() student, @Request() req) {
    student.createdBy = req.user.username;
    return this.financeService.createFinance(student);
  }
}
