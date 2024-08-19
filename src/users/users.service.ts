import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '../drizzle-db/schema'; 
import * as schema from '../drizzle-db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PG_CONNECTION) private conn: NodePgDatabase<typeof schema>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    const result = await this.conn.insert(users).values({
      username,
      email,
      password,
    });
    return result;
  }

  // Find all users
  async findAll() {
    return await this.conn.query.users.findMany();
  }
  // Find one user by ID
  async findOne(id: number) {
    const user = await this.conn.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update user by ID
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, email, password } = updateUserDto;
    const result = await this.conn.update(users)
      .set({
        ...(username && { username }),
        ...(email && { email }),
        ...(password && { password }),
      })
      .where(eq(users.id, id));
    if (result.rowsAffected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result;
  }

  // Remove user by ID
  async remove(id: number) {
    const result = await this.conn.delete(users)
      .where(eq(users.id, id));
    if (result.rowsAffected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with ID ${id} deleted` };
  }
}
