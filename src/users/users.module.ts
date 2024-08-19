import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleModule } from '../drizzle-db/drizzle-db.module';

@Module({
  controllers: [UsersController],
  imports: [DrizzleModule],
  providers: [UsersService],
})
export class UsersModule {}
