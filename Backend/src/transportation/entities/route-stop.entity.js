import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Route } from './route.entity.js';

@Entity('route_stops')
export class RouteStop {
  @PrimaryGeneratedColumn()
  stop_id;

  @Column({ type: 'int' })
  route_id;

  @Column({ type: 'varchar' })
  stop_name;

  @Column({ type: 'int' })
  stop_order;

  @Column({ type: 'time', nullable: true })
  pickup_time;

  @ManyToOne(() => Route, (route) => route.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route;
}
