import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';
import { blogposts } from '../drizzle-db/schema';
import * as schema from '../drizzle-db/schema';
import { eq } from 'drizzle-orm';
import { PG_CONNECTION } from 'src/constants';

@Injectable()
export class BlogPostsService {
  constructor(
    @Inject(PG_CONNECTION) private conn: NodePgDatabase<typeof schema>,
  ) {}

  // Create a new blog post
  create(createBlogPostDto: CreateBlogpostDto, user: any) {
    const author_id = user.id; 
  
    try {
      const result = this.conn.insert(blogposts).values({
        ...createBlogPostDto,
        
      }).returning();
      return result;
    } catch (error) {
      console.error('Error inserting blog post:', error);
      throw new Error('Failed to create blog post');
    }
  }
  
  // Find all blog posts
  async findAll() {
    return await this.conn.query.blogposts.findMany();
  }

  // Find one blog post by ID
  async findOne(id: number) {
    const post = await this.conn.query.blogposts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  // Update blog post by ID
  async update(id: number, updateBlogPostDto: UpdateBlogpostDto, user: any) {
    // Find the post first
    const post = await this.conn.query.blogposts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    // Check if the logged-in user is the author of the post
    if (post.author_id !== user.id) {
      throw new UnauthorizedException('You are not authorized to update this post');
    }

    const { title, content } = updateBlogPostDto;

    try {
      const result = await this.conn.update(blogposts)
        .set({
          ...(title && { title }),
          ...(content && { content }),
        })
        .where(eq(blogposts.id, id))
        .returning();

      return result;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw new Error('Failed to update blog post');
    }
  }

  // Remove blog post by ID
  async remove(id: number, user: any) {
    // Find the post first
    const post = await this.conn.query.blogposts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    // Check if the logged-in user is the author of the post
    if (post.author_id !== user.id) {
      throw new UnauthorizedException('You are not authorized to delete this post');
    }

    try {
      await this.conn.delete(blogposts).where(eq(blogposts.id, id));
      return { message: `Blog post with ID ${id} deleted` };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw new Error('Failed to delete blog post');
    }
  }
}
