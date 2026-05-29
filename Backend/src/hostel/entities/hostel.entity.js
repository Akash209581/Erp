import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Block } from './block.entity.js';
import { Campus } from './campus.entity.js';

@Entity('hostels')
export class Hostel {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', unique: true })
  name;

  @Column({ type: 'enum', enum: ['Boys', 'Girls'] })
  type;

  @Column({ type: 'uuid', nullable: true })
  campusId;

  @ManyToOne(() => Campus, (campus) => campus.hostels)
  @JoinColumn({ name: 'campusId' })
  campus;

  @OneToMany(() => Block, (block) => block.hostel)
  blocks;
}
