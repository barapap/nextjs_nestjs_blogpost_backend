import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PostcommentsService } from './postcomments.service';
import { CreatePostcommentDto } from './dto/create-postcomment.dto';
import { UpdatePostcommentDto } from './dto/update-postcomment.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('api/posts/:postId/comments')
@UseGuards(JwtAuthGuard)
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostcommentsService) {}

  // // Get all comments
  // @Get()
  // async findAll() {
  //   return this.postCommentsService.findAll();
  // }

  // Get all comment by a post ID
  @Get()
  async findCommentsForPost(@Param('postId') id: number) {
    return this.postCommentsService.findCommentsForPost(id);
  }

  // Get a comment by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postCommentsService.findOne(id);
  }

  // Create a new comment
  @Post()
  async create(
    @Param('postId') postId: number, 
    @Body() createCommentDto: CreatePostcommentDto, 
    @Request() req: any
  ) {
    return this.postCommentsService.create(createCommentDto, req.user, postId);
  }

  // Update a comment by ID
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCommentDto: UpdatePostcommentDto) {
    return this.postCommentsService.update(id, updateCommentDto);
  }

  // Delete a comment by ID
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.postCommentsService.remove(id);
  }
}