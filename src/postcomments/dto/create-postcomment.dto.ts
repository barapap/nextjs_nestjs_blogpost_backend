import { IsNumber, IsString } from 'class-validator';

export class CreatePostcommentDto {
  @IsString()
  content: string;

  @IsNumber()
  post_id: number;

  @IsString()
  user_id: string;
}
