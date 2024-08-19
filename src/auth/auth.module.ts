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
      secret: process.env.JWT_SECRET || 'default_jwt_secret',
      signOptions: { 
          algorithm: 'RS256',expiresIn: '1h' 
        },
      verifyOptions: {
          algorithms: ['RS256'],
        },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],  
  exports: [AuthService, JwtAuthGuard],    // Export for use in other modules
})
export class AuthModule {}
