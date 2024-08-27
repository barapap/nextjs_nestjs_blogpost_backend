import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreatePostcommentDto } from './dto/create-postcomment.dto';
import { UpdatePostcommentDto } from './dto/update-postcomment.dto';
import { blogcomments } from '../drizzle-db/schema'; 
import * as schema from '../drizzle-db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PostcommentsService {
  constructor(
    @Inject('PG_CONNECTION') private conn: NodePgDatabase<typeof schema>,
  ) {}

  // Create a new blog post's comment
  async create(createCommentDto: CreatePostcommentDto, user: any, postId: number) {
    const user_id = user.id; 
    createCommentDto.post_id = postId;
    createCommentDto.user_id = user_id;
    try {
      const result = await this.conn.insert(blogcomments).values({
        ...createCommentDto
      }).returning();
      return result;
    } catch (error) {
      console.error('Error inserting comment:', error);
      throw new Error('Failed to create comment');
    }
  }

  // Find all comments
  async findAll() {
    return await this.conn.query.blogcomments.findMany();
  }

  // Find one comment by ID
  async findOne(id: number) {
    const comment = await this.conn.query.blogcomments.findFirst({
      where: (comments, { eq }) => eq(comments.id, id),
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  // Update comment by ID
  async update(id: number, updateCommentDto: UpdatePostcommentDto) {
    const { content } = updateCommentDto;
    const result = await this.conn.update(blogcomments)
      .set({
        ...(content && { content }),
      })
      .where(eq(blogcomments.id, id));
    if (result.rowsAffected === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return result;
  }

  // Remove comment by ID
  async remove(id: number) {
    const result = await this.conn.delete(blogcomments)
      .where(eq(blogcomments.id, id));
    if (result.rowsAffected === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return { message: `Comment with ID ${id} deleted` };
  }
}
