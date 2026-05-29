import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Block } from './block.entity.js';
import { HostelAsset } from './asset.entity.js';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  roomNumber;

  @Column({ type: 'int' })
  capacity;

  @Column({ type: 'int', default: 0 })
  currentOccupancy;

  @Column({ type: 'uuid' })
  blockId;

  @ManyToOne(() => Block, (block) => block.rooms)
  @JoinColumn({ name: 'blockId' })
  block;

  @ManyToMany(() => HostelAsset, (asset) => asset.rooms)
  @JoinTable({ name: 'room_assets' })
  assets;
}
