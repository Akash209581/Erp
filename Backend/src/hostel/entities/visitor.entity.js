import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('hostel_visitors')
export class HostelVisitor {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  registerno;

  @Column({ type: 'varchar' })
  visitorName;

  @Column({ type: 'varchar' })
  relation;

  @Column({ type: 'timestamp' })
  checkIn;

  @Column({ type: 'timestamp', nullable: true })
  checkOut;

  @Column({ type: 'enum', enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' })
  status;

  @CreateDateColumn()
  createdAt;
}
