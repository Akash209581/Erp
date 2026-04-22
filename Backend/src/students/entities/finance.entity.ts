import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FinanceStudent } from './finance-student.entity';

@Entity('finance')
export class Finance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    registerno: string;

    @Column({ nullable: true })
    vuid: string;

    @Column()
    sem: string;

    @Column()
    year: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    feepaid: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    feeleft: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalfee: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    admissionfee: number;

    @Column({ nullable: true })
    studentId: number;

    @ManyToOne(() => FinanceStudent)
    @JoinColumn({ name: 'studentId' })
    student: FinanceStudent;
}
