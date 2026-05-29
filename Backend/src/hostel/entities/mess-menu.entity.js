import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('hostel_mess_menus')
export class MessMenu {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  hostelId;

  @Column({ type: 'json' })
  menu; // { Monday: { Breakfast: "...", Lunch: "...", Dinner: "..." }, ... }

  @Column({ type: 'enum', enum: ['Draft', 'Pending', 'Approved'], default: 'Draft' })
  status;

  @Column({ type: 'varchar', nullable: true })
  approvedBy;

  @CreateDateColumn()
  createdAt;
}
