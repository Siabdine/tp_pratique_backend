/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('achats')
export class Achat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nom: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number; // Le prix reste un nombre

  @Column('date')
  date_achat: Date;

  @CreateDateColumn()
  created_at: Date;
}
