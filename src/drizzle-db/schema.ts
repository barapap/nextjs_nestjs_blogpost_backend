import { integer, serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table
export const users = pgTable('users', {
  user_id: serial('user_id').primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),  // Store hashed passwords
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Posts Table
export const posts = pgTable('posts', {
  post_id: serial('post_id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_id: integer('author_id').references(() => users.user_id),  // Foreign key to Users
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Comments Table
export const blogcomments = pgTable('comments', {
  com_id: serial('com_id').primaryKey(),
  content: text('content').notNull(),
  post_id: integer('post_id').references(() => posts.post_id),  // Foreign key to Posts
  user_id: integer('user_id').references(() => users.user_id),  // Foreign key to Users
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  posts: many(posts),
  comments: many(blogcomments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.author_id],
    references: [users.user_id],
  }),
  comments: many(blogcomments),
}));

export const commentsRelations = relations(blogcomments, ({ one }) => ({
  post: one(posts, {
    fields: [blogcomments.post_id],
    references: [posts.post_id],
  }),
  user: one(users, {
    fields: [blogcomments.user_id],
    references: [users.user_id],
  }),
}));
