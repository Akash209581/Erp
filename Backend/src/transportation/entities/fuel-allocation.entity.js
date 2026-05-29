import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Bus } from './bus.entity.js';

@Entity('fuel_allocations')
export class FuelAllocation {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'int' })
  bus_id;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  liters;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  odometer_km;

  @Column({ type: 'varchar', nullable: true })
  notes;

  @CreateDateColumn()
  created_at;

  @ManyToOne(() => Bus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bus_id' })
  bus;
}
