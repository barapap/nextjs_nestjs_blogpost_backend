import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';
import { posts, blogcomments } from '../drizzle-db/schema';
import * as schema from '../drizzle-db/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class BlogPostsService {
  constructor(
    @Inject('PG_CONNECTION') private conn: NodePgDatabase<typeof schema>,
  ) {}

  // Create a new blog post
  create(createBlogPostDto: CreateBlogpostDto, user: any) {
    const author_id = user.id; 
    createBlogPostDto.author_id = author_id;
    try {
      const result = this.conn.insert(posts).values({
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
    return await this.conn.query.posts.findMany();
  }

  async getPostWithAuthor(postId: number) {
    const post = await this.conn.query.posts.findFirst({ where: eq(posts.post_id, postId) });
    if (!post) throw new NotFoundException('Post not found');

    // use "schema" because use the "acuan" from schema to search in "conn"
    const author = await this.conn.query.users.findFirst({ where: eq(schema.users.user_id, post.author_id) });

    return {
      ...post,
      authorUsername: author ? author.username : "Unknown",
    };
  }

  async findPostWithComments(postId: number) { 
    const post = await this.conn.query.posts.findFirst({
      where: eq(posts.post_id, postId),
      with: {
        // Include comments relation (from schema foreign key)
        comments: {
          with:{
            // Include the user (author) data for each comment (from foreign key)
            user: true,
          }
        }
      },
    });

    if (!post) return null; // Handle the case where the post doesn't exist

    // Transformations
    return {
      post_id: post.post_id,
      title: post.title,
      content: post.content,
      author_id: post.author_id, // Should match the frontend
      created_at: post.created_at,
      comments: post.comments.map(comment => ({
        com_id: comment.com_id,
        content: comment.content,
        user_id: comment.user_id, // Should match the frontend
        author_username: comment.user.username || "Unknown", // Should match the frontend
      })),
    };
  }

  // Find one blog post by ID
  async findOne(id: number) {
    const post = await this.conn.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.post_id, id),
    });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  // Update blog post by ID
  async update(id: number, updateBlogPostDto: UpdateBlogpostDto, user: any) {
    // Find the post first
    const post = await this.conn.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.post_id, id),
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
      const result = await this.conn.update(posts)
        .set({
          ...(title && { title }),
          ...(content && { content }),
        })
        .where(eq(posts.post_id, id))
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
    const post = await this.conn.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.post_id, id),
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    // Check if the logged-in user is the author of the post
    if (post.author_id !== user.id) {
      throw new UnauthorizedException('You are not authorized to delete this post');
    }

    try {
      await this.conn.delete(posts).where(eq(posts.post_id, id));
      return { message: `Blog post with ID ${id} deleted` };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw new Error('Failed to delete blog post');
    }
  }
}
