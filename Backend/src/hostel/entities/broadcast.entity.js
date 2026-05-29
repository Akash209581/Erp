import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('hostel_broadcasts')
export class HostelBroadcast {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'text' })
  message;

  @Column({ type: 'varchar' })
  senderId;

  @Column({ type: 'enum', enum: ['Global', 'Hostel', 'Block'], default: 'Global' })
  scope;

  @Column({ type: 'uuid', nullable: true })
  targetId; // hostelId or blockId if scope is not Global

  @CreateDateColumn()
  createdAt;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt;
}
