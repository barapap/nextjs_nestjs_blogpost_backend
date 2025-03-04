import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { BlogPostsService } from './blogposts.service';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';

@Controller('api/posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  // Get all blog posts
  @Get()
  async findAll() {
    return this.blogPostsService.findAll();
  }

  @Get()
  async findAllByPage(@Query('page') page: number = 1) {
    const limit = 5; // Set the number of posts per page
    const offset = (page - 1) * limit;
    return this.blogPostsService.findPaginated(offset, limit);
  }

  // Get one posts with associated comments
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findPostWithComments(@Param('id') id: number) {
    return this.blogPostsService.findPostWithComments(id);
  }

  // Get a single blog post by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.blogPostsService.findOne(id);
  }

  // Create a new blog post (Protected Route using JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createBlogPostDto: CreateBlogpostDto,
    @Request() req: any 
  ) {
    return this.blogPostsService.create(createBlogPostDto, req.user);
  }

  // Update a blog post by ID (Protected Route using JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBlogPostDto: UpdateBlogpostDto,
    @Request() req: any // to verify if they own the post)
  ) {
    return this.blogPostsService.update(id, updateBlogPostDto, req.user);
  }

  // Delete a blog post by ID (Protected Route)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req: any) {
    return this.blogPostsService.remove(id, req.user);
  }
}
