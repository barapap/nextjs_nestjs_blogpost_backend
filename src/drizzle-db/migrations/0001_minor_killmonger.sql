ALTER TABLE "comments" RENAME COLUMN "id" TO "com_id";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "id" TO "post_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "id" TO "user_id";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
