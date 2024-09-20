import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  browser: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  ip: string;

  @Column()
  view: number;

  @Column()
  os: string;

  @ManyToOne(() => Link, (link) => link.visits)
  link: Link;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
