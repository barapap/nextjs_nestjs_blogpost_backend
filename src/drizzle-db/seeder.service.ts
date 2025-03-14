// import { Injectable, Inject } from '@nestjs/common';
// import { NodePgDatabase } from 'drizzle-orm/node-postgres';
// import * as schema from './schema';

// @Injectable()
// export class SeederService {
//   constructor(@Inject('PG_CONNECTION') private db: NodePgDatabase<typeof schema>) {}

//   async seed() {
//     console.log("🚀 Running database seeder...");

//     // Insert Users
//     const insertedUsers = await this.db.insert(schema.users).values([
//       { username: "user1", email: "user1@example.com", password: "hashedpassword1" },
//       { username: "user2", email: "user2@example.com", password: "hashedpassword2" },
//     ]).returning({ user_id: schema.users.user_id });

//     console.log("✅ Users seeded:", insertedUsers);

//     // Insert Posts
//     const insertedPosts = await this.db.insert(schema.posts).values([
//       { title: "First Post", content: "Hello, this is my first post!", author_id: insertedUsers[0].user_id },
//       { title: "Second Post", content: "NestJS + Drizzle is awesome!", author_id: insertedUsers[1].user_id },
//     ]).returning({ post_id: schema.posts.post_id });

//     console.log("✅ Posts seeded:", insertedPosts);

//     // Insert Comments
//     const insertedComments = await this.db.insert(schema.blogcomments).values([
//       { content: "Nice post!", post_id: insertedPosts[0].post_id, user_id: insertedUsers[1].user_id },
//       { content: "Great work!", post_id: insertedPosts[1].post_id, user_id: insertedUsers[0].user_id },
//     ]);

//     console.log("✅ Comments seeded:", insertedComments);

//     console.log("🎉 Database seeding completed!");
//   }
// }
