import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Route } from './route.entity.js';
import { Driver } from './driver.entity.js';
import { TransportAllocation } from './transport-allocation.entity.js';

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn()
  bus_id;

  @Column({ type: 'varchar', unique: true })
  bus_number;

  @Column({ type: 'int' })
  capacity;

  @Column({ type: 'varchar', default: 'active' })
  status;

  @Column({ type: 'int', nullable: true })
  route_id;

  @Column({ type: 'int', nullable: true })
  driver_id;

  @Column({ type: 'int', default: 5 })
  staff_seats;

  @Column({ type: 'int', default: 20 })
  girl_seats;

  @Column({ type: 'int', default: 20 })
  boy_seats;

  @Column({ type: 'varchar', default: '2+2' })
  seating_type;

  @ManyToOne(() => Route, (route) => route.buses, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'route_id' })
  route;

  @ManyToOne(() => Driver, (driver) => driver.buses, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driver_id' })
  driver;

  @OneToMany(() => TransportAllocation, (allocation) => allocation.bus)
  allocations;
}
