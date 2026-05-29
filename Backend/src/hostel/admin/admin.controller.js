import { Controller, Get, Post, Body, Param, Patch, Delete, Dependencies, BadRequestException } from '@nestjs/common';
import { AdminHostelService } from './admin.service.js';

@Controller('hostel/admin')
@Dependencies(AdminHostelService)
export class AdminHostelController {
  constructor(adminHostelService) {
    this.adminHostelService = adminHostelService;
  }

  @Get('stats')
  getGlobalStats() {
    return this.adminHostelService.getGlobalStats();
  }

  @Post('hostels')
  createHostel(@Body() data) {
    return this.adminHostelService.createHostel(data);
  }

  @Get('hostels')
  getAllHostels() {
    return this.adminHostelService.getAllHostels();
  }

  @Post('blocks')
  createBlock(@Body() data) {
    return this.adminHostelService.createBlock(data);
  }

  @Post('rooms')
  createRoom(@Body() data) {
    return this.adminHostelService.createRoom(data);
  }

  @Post('allocate')
  allocateRoom(@Body() data) {
    return this.adminHostelService.allocateRoom(data);
  }

  @Get('allocations')
  getAllAllocations() {
    return this.adminHostelService.getAllAllocations();
  }

  @Patch('approve/:id')
  async approveAllocation(@Param('id') id, @Body('adminId') adminId) {
    try {
      return await this.adminHostelService.approveAllocation(id, adminId);
    } catch (e) {
      require('fs').writeFileSync('admin_error.log', JSON.stringify({ message: e.message, stack: e.stack }));
      throw new BadRequestException(e.message);
    }
  }

  @Patch('reject/:id')
  rejectAllocation(@Param('id') id, @Body('adminId') adminId, @Body('reason') reason) {
    return this.adminHostelService.rejectAllocation(id, adminId, reason);
  }

  @Get('audit-logs')
  getAuditLogs() {
    return this.adminHostelService.getAuditLogs();
  }

  @Get('assets')
  getAssets() {
    return this.adminHostelService.getAssets();
  }

  @Post('assets')
  createAsset(@Body() data) {
    return this.adminHostelService.createAsset(data);
  }

  @Post('broadcast')
  createBroadcast(@Body() data) {
    return this.adminHostelService.createBroadcast(data);
  }
}
