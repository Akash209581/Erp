import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('student_master')
export class StudentMaster {
    @PrimaryColumn({ type: 'varchar' })
    registerno;

    @Column({ type: 'varchar', nullable: true })
    name;

    @Column({ type: 'varchar', nullable: true })
    coursecode;

    @Column({ type: 'varchar', nullable: true })
    branchcode;

    @Column({ type: 'varchar', nullable: true })
    cyear;

    @Column({ type: 'varchar', nullable: true })
    semester;

    @Column({ type: 'varchar', nullable: true })
    sectioncode;

    @Column({ type: 'varchar', nullable: true })
    gender;

    @Column({ type: 'varchar', nullable: true })
    fathername;

    @Column({ type: 'varchar', nullable: true })
    houseno;

    @Column({ type: 'varchar', nullable: true })
    street;

    @Column({ type: 'varchar', nullable: true })
    town;

    @Column({ type: 'varchar', nullable: true })
    mandal;

    @Column({ type: 'varchar', nullable: true })
    district;

    @Column({ type: 'varchar', nullable: true })
    state;

    @Column({ type: 'varchar', nullable: true })
    pincode;

    @Column({ type: 'varchar', nullable: true })
    landline;

    @Column({ type: 'varchar', nullable: true })
    studentmobile;

    @Column({ type: 'varchar', nullable: true })
    fathermobile;

    @Column({ type: 'varchar', nullable: true })
    doj;

    @Column({ type: 'varchar', nullable: true })
    dob;

    @Column({ type: 'varchar', nullable: true })
    studentemailid;

    @Column({ type: 'varchar', nullable: true })
    parentemailid;

    @Column({ type: 'varchar', nullable: true })
    entrancetest;

    @Column({ type: 'varchar', nullable: true })
    entrancetestrank;

    @Column({ type: 'varchar', nullable: true })
    entrancemarks;

    @Column({ type: 'varchar', nullable: true })
    seatcategory;

    @Column({ type: 'varchar', nullable: true })
    interpercent;

    @Column({ type: 'varchar', nullable: true })
    intertype;

    @Column({ type: 'varchar', nullable: true })
    interpassyear;

    @Column({ type: 'varchar', nullable: true })
    intercollege;

    @Column({ type: 'varchar', nullable: true })
    interlocation;

    @Column({ type: 'varchar', nullable: true })
    interdistrict;

    @Column({ type: 'varchar', nullable: true })
    tenthpercent;

    @Column({ type: 'varchar', nullable: true })
    ssctype;

    @Column({ type: 'varchar', nullable: true })
    sscpassyear;

    @Column({ type: 'varchar', nullable: true })
    sscschool;

    @Column({ type: 'varchar', nullable: true })
    ssclocation;

    @Column({ type: 'varchar', nullable: true })
    sscdistrict;

    @Column({ type: 'varchar', nullable: true })
    ugpercent;

    @Column({ type: 'varchar', nullable: true })
    ugpassyear;

    @Column({ type: 'varchar', nullable: true })
    ugsubstream;

    @Column({ type: 'varchar', nullable: true })
    ugmainstream;

    @Column({ type: 'varchar', nullable: true })
    ugcollege;

    @Column({ type: 'varchar', nullable: true })
    uguniversity;

    @Column({ type: 'varchar', nullable: true })
    uglocation;

    @Column({ type: 'varchar', nullable: true })
    ugdistrict;

    @Column({ type: 'varchar', nullable: true })
    pgpercent;

    @Column({ type: 'varchar', nullable: true })
    pgpassyear;

    @Column({ type: 'varchar', nullable: true })
    pgsubstream;

    @Column({ type: 'varchar', nullable: true })
    pgmainstream;

    @Column({ type: 'varchar', nullable: true })
    pgcollege;

    @Column({ type: 'varchar', nullable: true })
    pguniversity;

    @Column({ type: 'varchar', nullable: true })
    pglocation;

    @Column({ type: 'varchar', nullable: true })
    pgdistrict;

    @Column({ type: 'varchar', nullable: true })
    fatheroccupation;

    @Column({ type: 'varchar', nullable: true })
    fathereducation;

    @Column({ type: 'varchar', nullable: true })
    mothername;

    @Column({ type: 'varchar', nullable: true })
    motheroccupation;

    @Column({ type: 'varchar', nullable: true })
    mothereducation;

    @Column({ type: 'varchar', nullable: true })
    annualincome;

    @Column({ type: 'varchar', nullable: true })
    mothertongue;

    @Column({ type: 'varchar', nullable: true })
    familystatus;

    @Column({ type: 'varchar', nullable: true })
    vignanemployknown;

    @Column({ type: 'varchar', nullable: true })
    employename;

    @Column({ type: 'varchar', nullable: true })
    caste;

    @Column({ type: 'varchar', nullable: true })
    batchno;

    @Column({ type: 'varchar', nullable: true })
    status;

    @Column({ type: 'varchar', nullable: true })
    vuid;

    @Column({ type: 'varchar', nullable: true })
    Religion;

    @Column({ type: 'varchar', nullable: true })
    ReserveCategory;

    @Column({ type: 'varchar', nullable: true })
    pysicallyhandi;

    @Column({ type: 'varchar', nullable: true })
    EBC;

    @Column({ type: 'varchar', nullable: true })
    Hostel;

    @Column({ type: 'varchar', nullable: true })
    status1;

    @Column({ type: 'varchar', nullable: true })
    dojj;

    @Column({ type: 'varchar', nullable: true })
    doj2;

    @Column({ type: 'varchar', nullable: true })
    comment;

    @Column({ type: 'varchar', nullable: true })
    country;

    @Column({ type: 'varchar', nullable: true })
    createdBy;

    @Column({ type: 'boolean', default: false })
    isTransport;
}
