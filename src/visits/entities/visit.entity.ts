import { Link } from '@links/entities/link.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  browser: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  ip: string;

  @Column()
  os: string;

  @ManyToOne(() => Link, (link) => link.visits, { onDelete: 'CASCADE' })
  link: Link;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
