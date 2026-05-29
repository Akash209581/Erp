import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('hostel_complaints')
export class HostelComplaint {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  registerno;

  @Column({ type: 'varchar' })
  category;

  @Column({ type: 'text' })
  description;

  @Column({ type: 'enum', enum: ['Pending', 'In Progress', 'Resolved', 'Escalated'], default: 'Pending' })
  status;

  @Column({ type: 'varchar', nullable: true })
  assignedWardenId;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
