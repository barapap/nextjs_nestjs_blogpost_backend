import { IsString } from 'class-validator';

export class CreatePostcommentDto {
  @IsString()
  content: string;
}
