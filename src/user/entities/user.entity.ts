import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { CommentEntity } from '../../comment/entities/comment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @OneToMany(() => CommentEntity, comment => comment.user, {
    eager: false,
    nullable: true,
  })
  comments: CommentEntity[];

  @Column({ nullable: true })
  password?: string;

  @CreateDateColumn({ type: 'timestamp' })
  create: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update: Date;
}
