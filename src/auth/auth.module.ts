import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule
import { DrizzleModule } from '../drizzle-db/drizzle-db.module';
import { JwtAuthGuard } from './auth.guard';  // Import JwtAuthGuard

@Module({
  imports: [
    DrizzleModule,
    JwtModule.register({
      secret: "test123",
      signOptions: {expiresIn: '1h'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],  
})
export class AuthModule {}
