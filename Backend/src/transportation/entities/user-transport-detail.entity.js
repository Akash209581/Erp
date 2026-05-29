import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_transport_details')
export class UserTransportDetail {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar' })
  user_id;

  @Column({ type: 'enum', enum: ['student', 'faculty'] })
  role;

  @Column({ type: 'varchar', nullable: true })
  transportation_location;
}
