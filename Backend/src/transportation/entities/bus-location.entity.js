import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('bus_locations')
export class BusLocation {
  @PrimaryColumn({ type: 'int' })
  bus_id;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  latitude;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  longitude;

  @UpdateDateColumn()
  updated_at;
}
