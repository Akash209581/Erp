import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Bus } from './bus.entity.js';
import { Route } from './route.entity.js';

@Entity('transport_allocations')
export class TransportAllocation {
  @PrimaryGeneratedColumn()
  allocation_id;

  @Column({ type: 'varchar', length: 255 })
  user_id;

  @Column({ type: 'enum', enum: ['student', 'faculty'] })
  role;

  @Column({ type: 'int' })
  bus_id;

  @Column({ type: 'int', nullable: true })
  route_id;

  @Column({ type: 'int' })
  seat_number;

  @Column({ type: 'varchar', nullable: true })
  pickup_stop;

  @Column({ type: 'varchar', default: 'active' })
  status;

  @CreateDateColumn()
  allocated_at;

  @ManyToOne(() => Bus, (bus) => bus.allocations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bus_id' })
  bus;

  @ManyToOne(() => Route, (route) => route.allocations, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'route_id' })
  route;
}
