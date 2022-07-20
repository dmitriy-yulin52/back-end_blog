import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { SearchPostDto } from './dto/search-post.dto';

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
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async popular() {
    const qb = this.repository.createQueryBuilder('p');
    qb.orderBy('views', 'DESC');
    qb.limit(10);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      total,
    };
  }

  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('p');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);
    if (dto.views) {
      qb.orderBy('views', dto.views);
    }
    if (dto.body) {
      qb.andWhere(`p.body ILIKE :body`);
    }
    if (dto.title) {
      qb.andWhere(`p.title ILIKE :title`);
    }
    if (dto.tag) {
      qb.andWhere(`p.tag ILIKE :tag`);
    }

    qb.setParameter('title', `%${dto.title}%`);
    qb.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
      tag: `%${dto.tag}%`,
      views: dto.views || 'DESC',
    });

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      total,
    };
  }

  async findOne(id: number) {
    const qb = await this.repository.createQueryBuilder('posts');

    await qb
      .whereInIds(id)
      .update()
      .set({
        views: () => 'views + 1',
      })
      .execute();

    return this.repository.findOneBy({ id: id });
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
