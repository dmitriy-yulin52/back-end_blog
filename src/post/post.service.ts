import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
  ) {}

  create(dto: CreatePostDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  popular() {
    return this.repository.find({
      order: {
        views: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const find_post = await this.repository.findOneBy({ id: id });
    if (!find_post) {
      throw new NotFoundException('Статья не найдена');
    }
    return find_post;
  }

  async update(id: number, dto: UpdatePostDto) {
    const find_post = await this.repository.findOneBy({ id: id });
    if (!find_post) {
      throw new NotFoundException('Статья не найдена');
    }
    return await this.repository.update(id, dto);
  }

  async remove(id: number) {
    const find_post = await this.repository.findOneBy({ id: id });
    if (!find_post) {
      throw new NotFoundException('Статья не найдена');
    }
    return await this.repository.delete(id);
  }
}
