import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bus } from './bus.entity.js';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  driver_id;

  @Column({ type: 'varchar' })
  name;

  @Column({ type: 'varchar', unique: true })
  phone;

  @Column({ type: 'varchar', unique: true })
  license_number;

  @Column({ type: 'varchar', default: 'active' })
  status;

  @OneToMany(() => Bus, (bus) => bus.driver)
  buses;
}
