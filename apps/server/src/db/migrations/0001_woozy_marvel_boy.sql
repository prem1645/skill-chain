CREATE TABLE "certificate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cert_id" integer NOT NULL,
	"learner_name" text NOT NULL,
	"course_name" text NOT NULL,
	"nsqf_level" integer NOT NULL,
	"completion_date" timestamp NOT NULL,
	"marks" integer,
	"issuer_id" uuid NOT NULL,
	"learner_address" varchar(42),
	"cert_hash" varchar(64),
	"ipfs_cid" text,
	"transaction_hash" varchar(66),
	"metadata" jsonb,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "certificate_cert_id_unique" UNIQUE("cert_id")
);
--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "fk_certificate_issuer_id" FOREIGN KEY ("issuer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;