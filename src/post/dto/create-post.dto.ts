import { IsArray } from 'class-validator';

export class CreatePostDto {
  title: string;
  body: string;
  @IsArray()
  tags?: string;
}
