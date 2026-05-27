import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transport_riders')
export class TransportRider {
  @PrimaryColumn({ type: 'varchar' })
  person_id;

  @PrimaryColumn({
    type: 'enum',
    enum: ['student', 'faculty'],
  })
  role;

  @Column({ type: 'varchar', nullable: true })
  name;

  @Column({ type: 'varchar', nullable: true })
  gender;

  @Column({ type: 'varchar', nullable: true })
  year;

  @Column({ type: 'varchar', nullable: true })
  section;

  @Column({ type: 'varchar', nullable: true })
  graduation;

  @Column({ type: 'varchar', nullable: true })
  branch;

  @Column({ type: 'varchar', nullable: true })
  program;

  @Column({ type: 'varchar', nullable: true })
  stop_name;

  @Column({ type: 'varchar', nullable: true })
  route_name;

  @Column({ type: 'int', nullable: true })
  route_id;

  @Column({ type: 'boolean', nullable: true })
  bus_fees_paid;

  @Column({ type: 'varchar', nullable: true })
  academic_year;

  @Column({ type: 'varchar', nullable: true })
  designation;

  @Column({ type: 'varchar', nullable: true })
  qualification;

  @Column({ type: 'varchar', nullable: true })
  dept;

  @Column({ type: 'jsonb', nullable: true })
  extra_fields;

  @CreateDateColumn()
  created_at;

  @UpdateDateColumn()
  updated_at;
}
