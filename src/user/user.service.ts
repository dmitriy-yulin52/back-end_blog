import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user-dto';
import { SearchPostDto } from '../post/dto/search-post.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  public create(dto: CreateUserDto) {
    return this.repository.save(dto).catch(e => {
      if (/(email)[\s\S]+(уже существует)/.test(e.detail)) {
        throw new BadRequestException(
          'Учетная запись с этим адресом электронной почты уже существует..',
        );
      }
      return e;
    });
  }

  findAll() {
    return this.repository.find();
  }

  findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  findByCond(obj: LoginUserDto) {
    const user = this.repository.findOne({
      where: obj,
    });
    return user;
  }

  findByEmailAndId(email: string, id: number) {
    const user = this.repository.findOne({
      where: { email, id },
    });
    return user;
  }

  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.fullName) {
      qb.andWhere(`u.fullName ILIKE :fullName`);
    }
    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }

    qb.setParameters({
      email: `%${dto.email}%`,
      fullName: `%${dto.fullName}%`,
    });

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      total,
    };
  }
}
