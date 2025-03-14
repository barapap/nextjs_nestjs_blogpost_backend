// import { NestFactory } from '@nestjs/core';
// import { DrizzleModule } from './drizzle-db.module';
// import { SeederService } from './seeder.service';

// async function runSeeder() {
//   const app = await NestFactory.createApplicationContext(DrizzleModule);
//   const seeder = app.get(SeederService);

//   await seeder.seed();
//   await app.close();
// }

// runSeeder().catch((error) => {
//   console.error("❌ Seeding failed:", error);
//   process.exit(1);
// });
