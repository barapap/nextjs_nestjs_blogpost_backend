import { IsString, IsNumber } from 'class-validator';

export class CreateBlogpostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
