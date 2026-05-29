import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hostel } from '../entities/hostel.entity.js';
import { Block } from '../entities/block.entity.js';
import { Room } from '../entities/room.entity.js';
import { Allocation } from '../entities/allocation.entity.js';
import { HostelComplaint } from '../entities/complaint.entity.js';
import { HostelAuditLog } from '../entities/audit-log.entity.js';
import { HostelAsset } from '../entities/asset.entity.js';
import { HostelBroadcast } from '../entities/broadcast.entity.js';
import { HostelGateway } from '../hostel.gateway.js';

@Injectable()
@Dependencies(
  getRepositoryToken(Hostel),
  getRepositoryToken(Block),
  getRepositoryToken(Room),
  getRepositoryToken(Allocation),
  getRepositoryToken(HostelComplaint),
  getRepositoryToken(HostelAuditLog),
  getRepositoryToken(HostelAsset),
  getRepositoryToken(HostelBroadcast),
  HostelGateway
)
export class AdminHostelService {
  constructor(hostelRepo, blockRepo, roomRepo, allocationRepo, complaintRepo, auditLogRepo, assetRepo, broadcastRepo, hostelGateway) {
    this.hostelRepo = hostelRepo;
    this.blockRepo = blockRepo;
    this.roomRepo = roomRepo;
    this.allocationRepo = allocationRepo;
    this.complaintRepo = complaintRepo;
    this.auditLogRepo = auditLogRepo;
    this.assetRepo = assetRepo;
    this.broadcastRepo = broadcastRepo;
    this.hostelGateway = hostelGateway;
  }

  async getGlobalStats() {
    const totalHostels = await this.hostelRepo.count();
    const totalRooms = await this.roomRepo.count();
    const activeAllocations = await this.allocationRepo.count({ where: { status: 'Active' } });
    const pendingComplaints = await this.complaintRepo.count({ where: { status: 'Pending' } });
    
    return {
      totalHostels,
      totalRooms,
      occupiedRooms: activeAllocations,
      pendingComplaints
    };
  }

  async createHostel(data) {
    const hostel = this.hostelRepo.create(data);
    return this.hostelRepo.save(hostel);
  }

  async getAllHostels() {
    return this.hostelRepo.find({ relations: ['blocks', 'blocks.rooms'] });
  }

  async createBlock(data) {
    const block = this.blockRepo.create(data);
    return this.blockRepo.save(block);
  }

  async createRoom(data) {
    const room = this.roomRepo.create(data);
    return this.roomRepo.save(room);
  }

  async allocateRoom(data) {
    const room = await this.roomRepo.findOneBy({ id: data.roomId });
    if (!room) throw new Error('Room not found');
    if (room.currentOccupancy >= room.capacity) throw new Error('Room is full');

    const allocation = this.allocationRepo.create({ ...data, status: 'Active' });
    const savedAllocation = await this.allocationRepo.save(allocation);

    room.currentOccupancy += 1;
    await this.roomRepo.save(room);

    // Audit Log
    await this.recordAudit('SYSTEM', 'DIRECT_ALLOCATION', data.registerno, `Directly allocated to room ${room.roomNumber}`);

    return savedAllocation;
  }

  async approveAllocation(id, adminId) {
    return this.allocationRepo.manager.transaction(async (manager) => {
      const allocation = await manager.findOne(Allocation, { where: { id } });
      if (!allocation) throw new Error('Allocation not found');
      if (allocation.status !== 'Pending') throw new Error('Allocation is not in pending status');

      // Lock expiry check temporarily bypassed for testing
      // if (allocation.expiresAt && new Date() > new Date(allocation.expiresAt)) { ... }

      const room = await manager.findOne(Room, { where: { id: allocation.roomId }, lock: { mode: 'pessimistic_write' } });
      if (!room) throw new Error('Room not found');
      if (room.currentOccupancy >= room.capacity) throw new Error('Room is full');

      allocation.status = 'Active';
      allocation.approvedBy = adminId;
      allocation.approvedAt = new Date();
      allocation.expiresAt = null; // Clear expiry
      await manager.save(allocation);

      room.currentOccupancy += 1;
      await manager.save(room);

       // Audit Log
      await this.recordAudit(adminId, 'APPROVE_ALLOCATION', allocation.registerno, `Approved room ${room.roomNumber}`);

      this.hostelGateway.broadcastAllocationUpdate(allocation);
      return allocation;
    });
  }

  async rejectAllocation(id, adminId, reason) {
    const allocation = await this.allocationRepo.findOneBy({ id });
    if (!allocation) throw new Error('Allocation not found');
    
    allocation.status = 'Rejected';
    await this.allocationRepo.save(allocation);

    // Audit Log
    await this.recordAudit(adminId, 'REJECT_ALLOCATION', allocation.registerno, reason || 'Rejected by Admin');

    this.hostelGateway.broadcastAllocationUpdate(allocation);
    return allocation;
  }

  async recordAudit(adminId, action, target, details) {
    const log = this.auditLogRepo.create({
      adminId,
      action,
      target,
      details
    });
    return this.auditLogRepo.save(log);
  }

  async getAllAllocations() {
    return this.allocationRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getAuditLogs() {
    return this.auditLogRepo.find({ order: { timestamp: 'DESC' } });
  }

  async getAssets() {
    return this.assetRepo.find();
  }

  async createAsset(data) {
    const asset = this.assetRepo.create(data);
    return this.assetRepo.save(asset);
  }

  async createBroadcast(data) {
    const broadcast = this.broadcastRepo.create({ ...data, scope: 'Global' });
    return this.broadcastRepo.save(broadcast);
  }
}
