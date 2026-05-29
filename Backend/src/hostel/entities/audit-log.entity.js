import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('hostel_audit_logs')
export class HostelAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id;

  @CreateDateColumn()
  timestamp;

  @Column({ type: 'varchar' })
  adminId;

  @Column({ type: 'varchar' })
  action;

  @Column({ type: 'varchar' })
  target; // Student/Room ID

  @Column({ type: 'text', nullable: true })
  details;
}
