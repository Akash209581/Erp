import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Hostel } from './hostel.entity.js';

@Entity('campuses')
export class Campus {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', unique: true })
  name;

  @Column({ type: 'varchar', nullable: true })
  location;

  @OneToMany(() => Hostel, (hostel) => hostel.campus)
  hostels;
}
