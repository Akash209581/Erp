import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export const UserRole = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
  FINANCE: 'finance',
  FINANCER: 'financer',
  STAFF: 'staff',
  ADMISSION: 'admission'
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', unique: true })
  username;

  @Column({ type: 'varchar' })
  password;

  @Column({
    type: 'enum',
    enum: Object.values(UserRole),
    default: UserRole.STUDENT,
  })
  role;

  @Column({ type: 'varchar', nullable: true })
  email;

  @Column({ type: 'boolean', default: true })
  isActive;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
