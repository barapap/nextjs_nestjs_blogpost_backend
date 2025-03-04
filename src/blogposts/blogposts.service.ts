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

  // Find all posts with pagination
  async findPaginated(offset: number, limit: number) {
    try {
      // Fetch the paginated posts
      const posts = await this.conn.query.posts.findMany({
        // Use limit and offset directly for pagination
        limit: limit, // Limit the number of posts per page
        offset: offset, // Skip a number of records to apply offset
      });

      // Fetch the total number of posts for pagination
      const totalPosts = await this.conn.query.posts.findMany(); // Fetch all posts to count them
      const totalPages = Math.ceil(totalPosts.length / limit); // Calculate total pages

      return {
        posts,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching posts with pagination:', error);
      throw new Error('Failed to fetch paginated posts');
    }
  }

  async findPostWithComments(postId: number) {
    // Can reference here of how to use "findMany()" 
    const result = await this.conn.query.posts.findMany(
      {
        where: eq(posts.post_id, postId), //eq refers equals
        with: {
          comments: true, // Include comments relation
        },
      }
    );

    // Transformations
    const postsWithComments = result.map(
      (post) => (
        {
          id: post.post_id,
          title: post.title,
          content: post.content,
          comments: post.comments.map(
            (comment) => (
              {
                id: comment.com_id,
                content: comment.content,
              }
            )
          ),
        }
      )
    );
    return postsWithComments;
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
