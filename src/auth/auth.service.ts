import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { users } from '../drizzle-db/schema'; 
import * as schema from '../drizzle-db/schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly jwtSecret = "test123";

  constructor(
    private jwtService: JwtService,
    @Inject('PG_CONNECTION') private conn: NodePgDatabase<typeof schema>,
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
    const token = this.jwtService.sign({ 
      id: user.user_id, 
      username: user.username 
  });
    return { access_token: token };
  }

  async validateToken(token: string) {
    try {
      // verify function takes two params
      return this.jwtService.verify(
        // one is the token
        token, 
        // one is a object
        {secret: this.jwtSecret}
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
