import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('hostel_leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  registerno;

  @Column({ type: 'enum', enum: ['Leave', 'Outpass'] })
  type;

  @Column({ type: 'timestamp' })
  startDate;

  @Column({ type: 'timestamp' })
  endDate;

  @Column({ type: 'text' })
  reason;

  @Column({ type: 'enum', enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' })
  status;

  @Column({ type: 'text', nullable: true })
  rejectionReason;

  @Column({ type: 'varchar', nullable: true })
  approvedBy;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
