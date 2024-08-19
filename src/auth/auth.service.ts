import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { users } from '../drizzle-db/schema'; 
import * as schema from '../drizzle-db/schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PG_CONNECTION } from 'src/constants';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';

  constructor(
    @Inject(PG_CONNECTION) private conn: NodePgDatabase<typeof schema>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.conn.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await this.conn.insert(users).values({
      username,
      email,
      password: hashedPassword,
    });
    return result;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Find user
    const user = await this.conn.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Something wrong here Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, this.jwtSecret, { expiresIn: '1h' });
    return { access_token: token };
  }

  async validateToken(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
