import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('allocations')
export class Allocation {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  registerno;

  @Column({ type: 'uuid' })
  campusId;

  @Column({ type: 'uuid' })
  hostelId;

  @Column({ type: 'uuid' })
  blockId;

  @Column({ type: 'uuid' })
  roomId;

  @Column({ type: 'enum', enum: ['Pending', 'Active', 'Vacated', 'Rejected'], default: 'Pending' })
  status;

  @Column({ type: 'varchar', nullable: true })
  approvedBy;

  @Column({ type: 'varchar', nullable: true })
  rejectionReason;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
