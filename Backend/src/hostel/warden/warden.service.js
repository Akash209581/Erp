import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HostelAttendance } from '../entities/attendance.entity.js';
import { HostelComplaint } from '../entities/complaint.entity.js';
import { HostelVisitor } from '../entities/visitor.entity.js';
import { Allocation } from '../entities/allocation.entity.js';
import { LeaveRequest } from '../entities/leave-request.entity.js';
import { HostelBroadcast } from '../entities/broadcast.entity.js';
import { HostelGateway } from '../hostel.gateway.js';

@Injectable()
@Dependencies(
  getRepositoryToken(HostelAttendance),
  getRepositoryToken(HostelComplaint),
  getRepositoryToken(HostelVisitor),
  getRepositoryToken(Allocation),
  getRepositoryToken(LeaveRequest),
  getRepositoryToken(HostelBroadcast),
  HostelGateway
)
export class WardenHostelService {
  constructor(attendanceRepo, complaintRepo, visitorRepo, allocationRepo, leaveRepo, broadcastRepo, hostelGateway) {
    this.attendanceRepo = attendanceRepo;
    this.complaintRepo = complaintRepo;
    this.visitorRepo = visitorRepo;
    this.allocationRepo = allocationRepo;
    this.leaveRepo = leaveRepo;
    this.broadcastRepo = broadcastRepo;
    this.hostelGateway = hostelGateway;
  }

  async getInhabitants() {
    // In a real system, you'd join with StudentMaster
    return this.allocationRepo.find({ where: { status: 'Active' } });
  }

  async markAttendance(data) {
    const attendance = this.attendanceRepo.create(data);
    const saved = await this.attendanceRepo.save(attendance);

    if (data.status === 'Absent') {
      console.log(`[SHAMS ALERT] SMS sent to parent of ${data.registerno}: Student was not present in the hostel during roll-call on ${data.date}.`);
    }

    this.hostelGateway.broadcastAttendanceUpdate(saved);
    return saved;
  }

  async getComplaints() {
    return this.complaintRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateComplaint(id, data) {
    await this.complaintRepo.update(id, data);
    const updated = await this.complaintRepo.findOneBy({ id });
    this.hostelGateway.broadcastComplaintUpdate(updated);
    return updated;
  }

  async getVisitors() {
    return this.visitorRepo.find({ order: { createdAt: 'DESC' } });
  }

  async verifyVisitor(id, data) {
    await this.visitorRepo.update(id, data);
    const updated = await this.visitorRepo.findOneBy({ id });
    this.hostelGateway.broadcastVisitorUpdate(updated);
    return updated;
  }

  async getPendingLeaves() {
    return this.leaveRepo.find({ where: { status: 'Pending' }, order: { createdAt: 'DESC' } });
  }

  async updateLeaveStatus(id, data) {
    await this.leaveRepo.update(id, data);
    return this.leaveRepo.findOneBy({ id });
  }

  async createBroadcast(data) {
    const broadcast = this.broadcastRepo.create(data);
    const saved = await this.broadcastRepo.save(broadcast);
    this.hostelGateway.broadcastNewBroadcast(saved);
    return saved;
  }
}
