import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BlogPostsService } from './blogposts.service';
import { BlogPostsController } from './blogposts.controller';
import { DrizzleModule } from '../drizzle-db/drizzle-db.module';
import { JwtAuthGuard } from '../auth/auth.guard';

@Module({
  controllers: [BlogPostsController],
  imports: [
    DrizzleModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [BlogPostsService, JwtAuthGuard],
})
export class BlogpostsModule {}
