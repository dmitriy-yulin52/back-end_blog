import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorators';
import { UserEntity } from '../user/entities/user.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() userId: number, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/popular')
  getPopularPosts() {
    return this.postService.popular();
  }

  @Get('/search')
  searchPost(@Query() dto: SearchPostDto) {
    return this.postService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() userId: number,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(+id, updatePostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() userId: number, @Param('id') id: string) {
    return this.postService.remove(+id, userId);
  }
}
