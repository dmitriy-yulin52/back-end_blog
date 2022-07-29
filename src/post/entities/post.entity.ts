import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutputBlockData } from '../dto/create-post.dto';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'jsonb' })
  body: OutputBlockData[];

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true, type: 'jsonb' })
  tags?: string;

  @CreateDateColumn({ type: 'timestamp' })
  create: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update: Date;
}
