import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('hostel_attendance')
export class HostelAttendance {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'date' })
  date;

  @Column({ type: 'varchar' })
  registerno;

  @Column({ type: 'enum', enum: ['Present', 'Absent', 'Leave'], default: 'Present' })
  status;

  @Column({ type: 'varchar' })
  markedBy;

  @CreateDateColumn()
  createdAt;
}
