import { User } from '@users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Links')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'url_original' })
  urlOriginal: string;

  @Column({ type: 'text', name: 'short_URL', unique: true })
  shortURL: string;

  @ManyToOne(() => User, (users) => users.links, { nullable: true })
  user: User;

  @Column({ default: true })
  status: boolean;

  @Column()
  expirationDate: Date;

  @ManyToOne(() => User, (users) => users.links, { nullable: true })
  user: User;


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  setExpirationDate() {
    const currentDate = new Date();
    if (this.user) {
      this.expirationDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 3),
      );
    } else {
      this.expirationDate = new Date(
        currentDate.setDate(currentDate.getDate() + 30),
      );
    }
  }
}
