import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Bus } from './bus.entity.js';

@Entity('bus_breakdowns')
export class BusBreakdown {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'int' })
  bus_id;

  @Column({ type: 'varchar' })
  part;

  @Column({ type: 'varchar', nullable: true })
  note;

  @Column({ type: 'varchar', default: 'medium' })
  priority;

  @Column({ type: 'varchar', default: 'reported' })
  status;

  @Column({ type: 'varchar', nullable: true })
  reported_by;

  @Column({ type: 'varchar', nullable: true })
  approved_by;

  @Column({ type: 'timestamp', nullable: true })
  approved_at;

  @CreateDateColumn()
  reported_at;

  @ManyToOne(() => Bus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bus_id' })
  bus;
}
