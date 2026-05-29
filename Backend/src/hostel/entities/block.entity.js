import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Hostel } from './hostel.entity.js';
import { Room } from './room.entity.js';

@Entity('blocks')
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  name;

  @Column({ type: 'uuid' })
  hostelId;

  @ManyToOne(() => Hostel, (hostel) => hostel.blocks)
  @JoinColumn({ name: 'hostelId' })
  hostel;

  @OneToMany(() => Room, (room) => room.block)
  rooms;
}
