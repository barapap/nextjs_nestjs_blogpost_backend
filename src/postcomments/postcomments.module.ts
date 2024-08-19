import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostcommentsService } from './postcomments.service';
import { PostCommentsController } from './postcomments.controller';
import { DrizzleModule } from '../drizzle-db/drizzle-db.module';
import { JwtAuthGuard } from '../auth/auth.guard';

@Module({
  controllers: [PostCommentsController],
  imports: [
    DrizzleModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [PostcommentsService, JwtAuthGuard],
})
export class PostCommentsModule {}
