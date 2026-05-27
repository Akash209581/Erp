import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bus } from './bus.entity.js';
import { RouteStop } from './route-stop.entity.js';
import { TransportAllocation } from './transport-allocation.entity.js';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  route_id;

  @Column({ type: 'varchar' })
  route_name;

  @Column({ type: 'varchar' })
  start_point;

  @Column({ type: 'varchar' })
  end_point;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  routes_distance;

  @Column({ type: 'int', nullable: true })
  estimated_time;

  @Column({ type: 'varchar', default: 'active' })
  status;

  @OneToMany(() => Bus, (bus) => bus.route)
  buses;

  @OneToMany(() => RouteStop, (stop) => stop.route)
  stops;

  @OneToMany(() => TransportAllocation, (allocation) => allocation.route)
  allocations;
}
