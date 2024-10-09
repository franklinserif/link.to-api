import { Link } from '@links/entities/link.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false, unique: true })
  username: string;

  @Column({ type: 'text', nullable: false, name: 'first_name' })
  firstName: string;

  @Column({ type: 'text', nullable: false, name: 'last_name' })
  lastName: string;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false, select: false })
  password: string;

  @Column({ nullable: true, select: false })
  otp: number;

  @OneToMany(() => Link, (links) => links.user)
  links: Link[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  checkProperties() {
    this.email = this.email.toLocaleLowerCase().trim();
    this.firstName = this.firstName.toLocaleLowerCase().trim();
    this.lastName = this.lastName.toLocaleLowerCase().trim();
  }
}
