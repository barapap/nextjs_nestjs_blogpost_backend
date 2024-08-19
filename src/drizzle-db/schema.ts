import { integer, serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),  // Store hashed passwords
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Posts Table
export const blogposts = pgTable('blogposts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_id: integer('author_id').references(() => users.id),  // Foreign key to Users
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Comments Table
export const blogcomments = pgTable('blogcomments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  post_id: integer('post_id').references(() => blogposts.id),  // Foreign key to Posts
  user_id: integer('user_id').references(() => users.id),  // Foreign key to Users
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  posts: many(blogposts),
  comments: many(blogcomments),
}));

export const postsRelations = relations(blogposts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogposts.author_id],
    references: [users.id],
  }),
  comments: many(blogcomments),
}));

export const commentsRelations = relations(blogcomments, ({ one }) => ({
  post: one(blogposts, {
    fields: [blogcomments.post_id],
    references: [blogposts.id],
  }),
  user: one(users, {
    fields: [blogcomments.user_id],
    references: [users.id],
  }),
}));
