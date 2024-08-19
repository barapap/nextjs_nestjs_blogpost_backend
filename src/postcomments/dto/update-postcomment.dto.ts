import { PartialType } from '@nestjs/mapped-types';
import { CreatePostcommentDto } from './create-postcomment.dto';

export class UpdatePostcommentDto extends PartialType(CreatePostcommentDto) {}
