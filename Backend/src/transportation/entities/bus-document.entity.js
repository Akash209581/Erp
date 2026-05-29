import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Bus } from './bus.entity.js';
import { BusDocumentType } from './bus-document-type.entity.js';

@Entity('bus_documents')
export class BusDocument {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'int' })
  bus_id;

  @Column({ type: 'int' })
  document_type_id;

  @Column({ type: 'varchar', nullable: true })
  document_number;

  @Column({ type: 'date' })
  expiry_date;

  @Column({ type: 'varchar', nullable: true })
  notes;

  @UpdateDateColumn()
  updated_at;

  @ManyToOne(() => Bus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bus_id' })
  bus;

  @ManyToOne(() => BusDocumentType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_type_id' })
  documentType;
}
