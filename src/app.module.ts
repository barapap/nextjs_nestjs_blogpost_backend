import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogpostsModule } from './blogposts/blogposts.module';
import { PostCommentsModule } from './postcomments/postcomments.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DrizzleModule } from './drizzle-db/drizzle-db.module';
// To inject environment variables
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BlogpostsModule, 
    PostCommentsModule, 
    UsersModule, 
    AuthModule, 
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
