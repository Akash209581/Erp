import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FinanceStudent } from './finance-student.entity.js';

@Entity('finance')
export class Finance {
    @PrimaryGeneratedColumn()
    id;

    @Column({ type: 'varchar', nullable: true })
    registerno;

    @Column({ type: 'varchar', nullable: true })
    vuid;

    @Column({ type: 'varchar' })
    sem;

    @Column({ type: 'varchar' })
    year;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    feepaid;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    feeleft;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalfee;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    admissionfee;

    @Column({ type: 'int', nullable: true })
    studentId;

    @ManyToOne(() => FinanceStudent)
    @JoinColumn({ name: 'studentId' })
    student;
}
