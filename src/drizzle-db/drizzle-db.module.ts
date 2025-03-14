import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
// import { SeederService } from './seeder.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),],
  providers: [
    {
      provide: 'PG_CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        if (!connectionString) {
          throw new Error('❌ DATABASE_URL is not defined!');
        }
        const sslOption = configService.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false;
        
        const pool = new Pool({
          connectionString,
          ssl: sslOption,
        });

        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
    // SeederService,
  ],
  exports: ['PG_CONNECTION'],
})
export class DrizzleModule {}
