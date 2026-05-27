import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bus_document_types')
export class BusDocumentType {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar', unique: true })
  name;

  @Column({ type: 'text', nullable: true })
  description;

  @CreateDateColumn()
  created_at;
}
