import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Room } from './room.entity.js';

@Entity('hostel_assets')
export class HostelAsset {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  name; // e.g., Bed, Fan, AC, Study Table

  @Column({ type: 'varchar', nullable: true })
  category;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  replacementCost;

  @ManyToMany(() => Room, (room) => room.assets)
  rooms;
}
