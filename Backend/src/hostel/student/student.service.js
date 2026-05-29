import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Allocation } from '../entities/allocation.entity.js';
import { HostelComplaint } from '../entities/complaint.entity.js';
import { HostelVisitor } from '../entities/visitor.entity.js';
import { Room } from '../entities/room.entity.js';
import { Hostel } from '../entities/hostel.entity.js';
import { Block } from '../entities/block.entity.js';
import { LeaveRequest } from '../entities/leave-request.entity.js';
import { HostelBroadcast } from '../entities/broadcast.entity.js';
import { HostelAttendance } from '../entities/attendance.entity.js';
import { HostelGateway } from '../hostel.gateway.js';

@Injectable()
@Dependencies(
  getRepositoryToken(Allocation),
  getRepositoryToken(HostelComplaint),
  getRepositoryToken(HostelVisitor),
  getRepositoryToken(Room),
  getRepositoryToken(Hostel),
  getRepositoryToken(Block),
  getRepositoryToken(LeaveRequest),
  getRepositoryToken(HostelBroadcast),
  getRepositoryToken(HostelAttendance),
  HostelGateway
)
export class StudentHostelService {
  constructor(allocationRepo, complaintRepo, visitorRepo, roomRepo, hostelRepo, blockRepo, leaveRepo, broadcastRepo, attendanceRepo, hostelGateway) {
    this.allocationRepo = allocationRepo;
    this.complaintRepo = complaintRepo;
    this.visitorRepo = visitorRepo;
    this.roomRepo = roomRepo;
    this.hostelRepo = hostelRepo;
    this.blockRepo = blockRepo;
    this.leaveRepo = leaveRepo;
    this.broadcastRepo = broadcastRepo;
    this.attendanceRepo = attendanceRepo;
    this.hostelGateway = hostelGateway;
  }

  async getAttendance(registerno) {
    return this.attendanceRepo.find({ where: { registerno }, order: { date: 'DESC' } });
  }

  async getResidence(registerno) {
    const allocation = await this.allocationRepo.findOne({
      where: [
        { registerno, status: 'Active' },
        { registerno, status: 'Pending' }
      ]
    });
    if (!allocation) return { message: 'No active residence found' };
    
    const room = await this.roomRepo.findOne({ 
      where: { id: allocation.roomId },
      relations: ['block', 'block.hostel'] 
    });
    
    return { allocation, room };
  }

  async createComplaint(data) {
    const complaint = this.complaintRepo.create(data);
    const saved = await this.complaintRepo.save(complaint);
    this.hostelGateway.broadcastComplaintUpdate(saved);
    return saved;
  }

  async getMyComplaints(registerno) {
    return this.complaintRepo.find({ where: { registerno }, order: { createdAt: 'DESC' } });
  }

  async requestVisitor(data) {
    const visitor = this.visitorRepo.create(data);
    const saved = await this.visitorRepo.save(visitor);
    this.hostelGateway.broadcastVisitorUpdate(saved);
    return saved;
  }

  async getMyVisitors(registerno) {
    return this.visitorRepo.find({ where: { registerno }, order: { createdAt: 'DESC' } });
  }

  async requestRoom(data) {
    const { registerno, roomId, campusId, hostelId, blockId } = data;

    return this.allocationRepo.manager.transaction(async (manager) => {
      // 1. Concurrency Protection: Check if student already has active/pending request
      const existing = await manager.findOne(Allocation, {
        where: [
          { registerno, status: 'Active' },
          { registerno, status: 'Pending' }
        ]
      });

      if (existing) {
        // Check if pending has expired
        if (existing.status === 'Pending' && existing.expiresAt && new Date() > new Date(existing.expiresAt)) {
          // Release the expired lock
          await manager.update(Allocation, existing.id, { status: 'Rejected', rejectionReason: 'Lock expired' });
        } else {
          throw new Error('You already have an active or pending room allocation request.');
        }
      }

      // 2. Capacity Enforcement (Transaction-Safe)
      const room = await manager.findOne(Room, { where: { id: roomId }, lock: { mode: 'pessimistic_write' } });
      if (!room) throw new Error('Room not found');
      
      // Count non-expired pending requests + active ones
      const currentLoad = await manager.count(Allocation, {
        where: [
          { roomId, status: 'Active' },
          { roomId, status: 'Pending' }
        ]
      });

      if (currentLoad >= room.capacity) {
        throw new Error('Room is full or currently reserved by other students.');
      }

      // 3. Create Pending Allocation with 5-Min Expiry
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      const allocation = manager.create(Allocation, {
        registerno,
        roomId,
        campusId,
        hostelId,
        blockId,
        status: 'Pending',
        expiresAt
      });

      return manager.save(allocation);
    });
  }

  async getAvailableInfrastructure() {
    return this.hostelRepo.find({
      relations: ['blocks', 'blocks.rooms']
    });
  }

  async applyForLeave(data) {
    const leave = this.leaveRepo.create(data);
    return this.leaveRepo.save(leave);
  }

  async getMyLeaves(registerno) {
    return this.leaveRepo.find({ where: { registerno }, order: { createdAt: 'DESC' } });
  }

  async getBroadcasts(registerno) {
    // Fetch global broadcasts and specific ones for student's hostel/block
    const residence = await this.getResidence(registerno);
    const query = this.broadcastRepo.createQueryBuilder('broadcast')
      .where('broadcast.scope = :global', { global: 'Global' });

    if (residence && residence.room) {
      query.orWhere('(broadcast.scope = :hostel AND broadcast.targetId = :hostelId)', { 
        hostel: 'Hostel', 
        hostelId: residence.room.block.hostel.id 
      });
      query.orWhere('(broadcast.scope = :block AND broadcast.targetId = :blockId)', { 
        block: 'Block', 
        blockId: residence.room.block.id 
      });
    }

    return query.orderBy('broadcast.createdAt', 'DESC').getMany();
  }
}
