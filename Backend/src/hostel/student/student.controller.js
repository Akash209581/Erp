import { Controller, Get, Post, Body, Param, Dependencies, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { StudentHostelService } from './student.service.js';
import { HostelEligibilityGuard } from '../guards/hostel-eligibility.guard.js';
import * as fs from 'fs';

@Controller('hostel/student')
@UseGuards(HostelEligibilityGuard)
@Dependencies(StudentHostelService)
export class StudentHostelController {
  constructor(studentHostelService) {
    this.studentHostelService = studentHostelService;
  }

  @Get('residence/:registerno')
  getResidence(@Param('registerno') registerno) {
    return this.studentHostelService.getResidence(registerno);
  }

  @Post('complaint')
  createComplaint(@Body() data) {
    return this.studentHostelService.createComplaint(data);
  }

  @Get('complaints/:registerno')
  getMyComplaints(@Param('registerno') registerno) {
    return this.studentHostelService.getMyComplaints(registerno);
  }

  @Post('visitor-request')
  requestVisitor(@Body() data) {
    return this.studentHostelService.requestVisitor(data);
  }

  @Get('visitors/:registerno')
  getMyVisitors(@Param('registerno') registerno) {
    return this.studentHostelService.getMyVisitors(registerno);
  }

  @Post('request-room')
  async requestRoom(@Body() data, @Req() req) {
    try {
      const registerno = req.user?.username || req.user?.registerno || data.registerno;
      if (!registerno) throw new Error('Registration number missing');
      return await this.studentHostelService.requestRoom({ ...data, registerno });
    } catch (e) {
      fs.writeFileSync('request_error_debug.log', JSON.stringify({ message: e.message, stack: e.stack, data, user: req.user }));
      throw new BadRequestException(e.message);
    }
  }

  @Get('infrastructure')
  getInfrastructure() {
    return this.studentHostelService.getAvailableInfrastructure();
  }

  @Post('leave')
  applyForLeave(@Body() data) {
    return this.studentHostelService.applyForLeave(data);
  }

  @Get('leaves/:registerno')
  getMyLeaves(@Param('registerno') registerno) {
    return this.studentHostelService.getMyLeaves(registerno);
  }

  @Get('broadcasts/:registerno')
  getBroadcasts(@Param('registerno') registerno) {
    return this.studentHostelService.getBroadcasts(registerno);
  }

  @Get('attendance/:registerno')
  getAttendance(@Param('registerno') registerno) {
    return this.studentHostelService.getAttendance(registerno);
  }
}
