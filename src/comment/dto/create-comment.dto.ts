import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  public text: string;

  @IsNotEmpty()
  public postId: number;
}
