import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('financestudent')
export class FinanceStudent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    registerno: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    coursecode: string;

    @Column({ nullable: true })
    branchcode: string;

    @Column({ nullable: true })
    cyear: string;

    @Column({ nullable: true })
    semester: string;

    @Column({ nullable: true })
    sectioncode: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    fathername: string;

    @Column({ nullable: true })
    houseno: string;

    @Column({ nullable: true })
    street: string;

    @Column({ nullable: true })
    town: string;

    @Column({ nullable: true })
    mandal: string;

    @Column({ nullable: true })
    district: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    pincode: string;

    @Column({ nullable: true })
    landline: string;

    @Column({ nullable: true })
    studentmobile: string;

    @Column({ nullable: true })
    fathermobile: string;

    @Column({ nullable: true })
    doj: string;

    @Column({ nullable: true })
    dob: string;

    @Column({ nullable: true })
    studentemailid: string;

    @Column({ nullable: true })
    parentemailid: string;

    @Column({ nullable: true })
    entrancetest: string;

    @Column({ nullable: true })
    entrancetestrank: string;

    @Column({ nullable: true })
    entrancemarks: string;

    @Column({ nullable: true })
    seatcategory: string;

    @Column({ nullable: true })
    interpercent: string;

    @Column({ nullable: true })
    intertype: string;

    @Column({ nullable: true })
    interpassyear: string;

    @Column({ nullable: true })
    intercollege: string;

    @Column({ nullable: true })
    interlocation: string;

    @Column({ nullable: true })
    interdistrict: string;

    @Column({ nullable: true })
    tenthpercent: string;

    @Column({ nullable: true })
    ssctype: string;

    @Column({ nullable: true })
    sscpassyear: string;

    @Column({ nullable: true })
    sscschool: string;

    @Column({ nullable: true })
    ssclocation: string;

    @Column({ nullable: true })
    sscdistrict: string;

    @Column({ nullable: true })
    ugpercent: string;

    @Column({ nullable: true })
    ugpassyear: string;

    @Column({ nullable: true })
    ugsubstream: string;

    @Column({ nullable: true })
    ugmainstream: string;

    @Column({ nullable: true })
    ugcollege: string;

    @Column({ nullable: true })
    uguniversity: string;

    @Column({ nullable: true })
    uglocation: string;

    @Column({ nullable: true })
    ugdistrict: string;

    @Column({ nullable: true })
    pgpercent: string;

    @Column({ nullable: true })
    pgpassyear: string;

    @Column({ nullable: true })
    pgsubstream: string;

    @Column({ nullable: true })
    pgmainstream: string;

    @Column({ nullable: true })
    pgcollege: string;

    @Column({ nullable: true })
    pguniversity: string;

    @Column({ nullable: true })
    pglocation: string;

    @Column({ nullable: true })
    pgdistrict: string;

    @Column({ nullable: true })
    fatheroccupation: string;

    @Column({ nullable: true })
    fathereducation: string;

    @Column({ nullable: true })
    mothername: string;

    @Column({ nullable: true })
    motheroccupation: string;

    @Column({ nullable: true })
    mothereducation: string;

    @Column({ nullable: true })
    annualincome: string;

    @Column({ nullable: true })
    mothertongue: string;

    @Column({ nullable: true })
    familystatus: string;

    @Column({ nullable: true })
    vignanemployknown: string;

    @Column({ nullable: true })
    employename: string;

    @Column({ nullable: true })
    caste: string;

    @Column({ nullable: true })
    batchno: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    vuid: string;

    @Column({ nullable: true })
    Religion: string;

    @Column({ nullable: true })
    ReserveCategory: string;

    @Column({ nullable: true })
    pysicallyhandi: string;

    @Column({ nullable: true })
    EBC: string;

    @Column({ nullable: true })
    Hostel: string;

    @Column({ nullable: true })
    status1: string;

    @Column({ nullable: true })
    dojj: string;

    @Column({ nullable: true })
    doj2: string;

    @Column({ nullable: true })
    Transportation: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    admission_fee: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total_fee_fixed: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    scholarship_amount: number;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
