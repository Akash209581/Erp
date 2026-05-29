import { Controller, Get, Post, Body, Param, Patch, Dependencies } from '@nestjs/common';
import { WardenHostelService } from './warden.service.js';

@Controller('hostel/warden')
@Dependencies(WardenHostelService)
export class WardenHostelController {
  constructor(wardenHostelService) {
    this.wardenHostelService = wardenHostelService;
  }

  @Get('inhabitants')
  getInhabitants() {
    return this.wardenHostelService.getInhabitants();
  }

  @Post('attendance')
  markAttendance(@Body() data) {
    return this.wardenHostelService.markAttendance(data);
  }

  @Get('complaints')
  getComplaints() {
    return this.wardenHostelService.getComplaints();
  }

  @Patch('complaints/:id')
  updateComplaint(@Param('id') id, @Body() data) {
    return this.wardenHostelService.updateComplaint(id, data);
  }

  @Get('visitors')
  getVisitors() {
    return this.wardenHostelService.getVisitors();
  }

  @Patch('visitors/:id')
  verifyVisitor(@Param('id') id, @Body() data) {
    return this.wardenHostelService.verifyVisitor(id, data);
  }

  @Get('leaves')
  getPendingLeaves() {
    return this.wardenHostelService.getPendingLeaves();
  }

  @Patch('leaves/:id')
  updateLeaveStatus(@Param('id') id, @Body() data) {
    return this.wardenHostelService.updateLeaveStatus(id, data);
  }

  @Post('broadcast')
  createBroadcast(@Body() data) {
    return this.wardenHostelService.createBroadcast(data);
  }
}
