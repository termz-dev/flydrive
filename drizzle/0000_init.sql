CREATE TYPE "public"."block_kind" AS ENUM('unavailable', 'hold', 'assignment');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('submitted', 'candidates_ready', 'offer_pending', 'payment_pending', 'payment_review', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_candidate');--> statement-breakpoint
CREATE TYPE "public"."case_kind" AS ENUM('support', 'safety');--> statement-breakpoint
CREATE TYPE "public"."case_status" AS ENUM('open', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."check_kind" AS ENUM('identity', 'licence', 'guarantor', 'background');--> statement-breakpoint
CREATE TYPE "public"."check_status" AS ENUM('pending', 'passed', 'failed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."city" AS ENUM('lagos', 'ibadan');--> statement-breakpoint
CREATE TYPE "public"."driver_status" AS ENUM('applicant', 'under_review', 'eligible', 'suspended', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('female', 'male', 'undisclosed');--> statement-breakpoint
CREATE TYPE "public"."handover_stage" AS ENUM('pickup', 'return');--> statement-breakpoint
CREATE TYPE "public"."offer_status" AS ENUM('pending', 'accepted', 'declined', 'expired', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."package" AS ENUM('half-day', 'full-day', 'weekly', 'monthly', 'weekend', 'custom');--> statement-breakpoint
CREATE TYPE "public"."party" AS ENUM('customer', 'driver');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('initialized', 'succeeded', 'failed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('customer', 'driver', 'staff');--> statement-breakpoint
CREATE TYPE "public"."staff_permission" AS ENUM('bookings.manage', 'drivers.review', 'payments.verify', 'bookings.confirm', 'incidents.manage', 'audit.read', 'staff.admin');--> statement-breakpoint
CREATE TYPE "public"."transmission" AS ENUM('manual', 'automatic');--> statement-breakpoint
CREATE TYPE "public"."vehicle_class" AS ENUM('saloon', 'suv', 'minivan');--> statement-breakpoint
CREATE TYPE "public"."vehicle_source" AS ENUM('customer', 'flydrive');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text,
	"data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"actor_id" uuid,
	"actor_role" text NOT NULL,
	"type" text NOT NULL,
	"from_status" "booking_status",
	"to_status" "booking_status",
	"data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ref" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"package" "package" NOT NULL,
	"vehicle_source" "vehicle_source" NOT NULL,
	"customer_vehicle_id" uuid,
	"vehicle_class" "vehicle_class",
	"fleet_vehicle_id" uuid,
	"city" "city" NOT NULL,
	"pickup_area" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"duties" text NOT NULL,
	"passengers" smallint DEFAULT 1 NOT NULL,
	"overnight_out_of_state" boolean DEFAULT false NOT NULL,
	"accommodation_note" text,
	"prefers_female_driver" boolean DEFAULT false NOT NULL,
	"notes" text,
	"short_notice" boolean NOT NULL,
	"status" "booking_status" DEFAULT 'submitted' NOT NULL,
	"quote_kobo" bigint,
	"payment_due_at" timestamp with time zone,
	"selected_driver_id" uuid,
	"handler_id" uuid,
	"meeting_point" text,
	"contact_phone" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_range" CHECK ("bookings"."ends_at" > "bookings"."starts_at"),
	CONSTRAINT "bookings_vehicle_source" CHECK (("bookings"."vehicle_source" = 'customer' and "bookings"."customer_vehicle_id" is not null) or ("bookings"."vehicle_source" = 'flydrive' and "bookings"."vehicle_class" is not null)),
	CONSTRAINT "bookings_quote_positive" CHECK ("bookings"."quote_kobo" is null or "bookings"."quote_kobo" > 0),
	CONSTRAINT "bookings_passengers" CHECK ("bookings"."passengers" between 1 and 20)
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"booking_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"added_by" uuid,
	"excluded_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_booking_id_driver_id_pk" PRIMARY KEY("booking_id","driver_id")
);
--> statement-breakpoint
CREATE TABLE "customer_vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"colour" text,
	"transmission" "transmission" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "driver_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" uuid NOT NULL,
	"kind" "block_kind" NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"booking_id" uuid,
	"hold_expires_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "driver_blocks_range" CHECK ("driver_blocks"."ends_at" > "driver_blocks"."starts_at"),
	CONSTRAINT "driver_blocks_hold_expiry" CHECK (("driver_blocks"."kind" <> 'hold') or ("driver_blocks"."hold_expires_at" is not null))
);
--> statement-breakpoint
CREATE TABLE "driver_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" uuid NOT NULL,
	"kind" "check_kind" NOT NULL,
	"status" "check_status" DEFAULT 'pending' NOT NULL,
	"review_note" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "driver_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"years_experience" smallint NOT NULL,
	"transmissions" "transmission"[] NOT NULL,
	"cities" "city"[] NOT NULL,
	"gender" "gender" DEFAULT 'undisclosed' NOT NULL,
	"status" "driver_status" DEFAULT 'applicant' NOT NULL,
	"training_status" text DEFAULT 'pending' NOT NULL,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fleet_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"kind" "block_kind" NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"booking_id" uuid,
	"hold_expires_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fleet_blocks_range" CHECK ("fleet_blocks"."ends_at" > "fleet_blocks"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "fleet_vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"vehicle_class" "vehicle_class" NOT NULL,
	"transmission" "transmission" NOT NULL,
	"seats" smallint,
	"city" "city" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "handovers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"stage" "handover_stage" NOT NULL,
	"party" "party" NOT NULL,
	"user_id" uuid NOT NULL,
	"condition_note" text NOT NULL,
	"fuel_level" text,
	"disputed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"href" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"status" "offer_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"responded_at" timestamp with time zone,
	"decline_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel" text NOT NULL,
	"recipient" text NOT NULL,
	"template" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_error" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"provider" text DEFAULT 'paystack' NOT NULL,
	"reference" text NOT NULL,
	"amount_kobo" bigint NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"status" "payment_status" DEFAULT 'initialized' NOT NULL,
	"provider_summary" jsonb,
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_amount_positive" CHECK ("payments"."amount_kobo" > 0)
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"mfa_verified_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_mfa" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"secret_enc" text NOT NULL,
	"enabled_at" timestamp with time zone,
	"last_used_step" bigint
);
--> statement-breakpoint
CREATE TABLE "staff_permissions" (
	"user_id" uuid NOT NULL,
	"permission" "staff_permission" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staff_permissions_user_id_permission_pk" PRIMARY KEY("user_id","permission")
);
--> statement-breakpoint
CREATE TABLE "support_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid,
	"opened_by" uuid NOT NULL,
	"kind" "case_kind" NOT NULL,
	"status" "case_status" DEFAULT 'open' NOT NULL,
	"message" text NOT NULL,
	"resolution" text,
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "role" NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"disabled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_lower" CHECK ("users"."email" = lower("users"."email"))
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"event_key" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"error" text
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_events" ADD CONSTRAINT "booking_events_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_events" ADD CONSTRAINT "booking_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_vehicle_id_customer_vehicles_id_fk" FOREIGN KEY ("customer_vehicle_id") REFERENCES "public"."customer_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_fleet_vehicle_id_fleet_vehicles_id_fk" FOREIGN KEY ("fleet_vehicle_id") REFERENCES "public"."fleet_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_selected_driver_id_driver_profiles_user_id_fk" FOREIGN KEY ("selected_driver_id") REFERENCES "public"."driver_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_handler_id_users_id_fk" FOREIGN KEY ("handler_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_driver_id_driver_profiles_user_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_vehicles" ADD CONSTRAINT "customer_vehicles_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_blocks" ADD CONSTRAINT "driver_blocks_driver_id_driver_profiles_user_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_checks" ADD CONSTRAINT "driver_checks_driver_id_driver_profiles_user_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_checks" ADD CONSTRAINT "driver_checks_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_profiles" ADD CONSTRAINT "driver_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fleet_blocks" ADD CONSTRAINT "fleet_blocks_vehicle_id_fleet_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."fleet_vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handovers" ADD CONSTRAINT "handovers_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handovers" ADD CONSTRAINT "handovers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_driver_id_driver_profiles_user_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_mfa" ADD CONSTRAINT "staff_mfa_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_permissions" ADD CONSTRAINT "staff_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_opened_by_users_id_fk" FOREIGN KEY ("opened_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_cases" ADD CONSTRAINT "support_cases_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_created_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "booking_events_booking_idx" ON "booking_events" USING btree ("booking_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_ref_key" ON "bookings" USING btree ("ref");--> statement-breakpoint
CREATE INDEX "bookings_customer_idx" ON "bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "driver_blocks_driver_idx" ON "driver_blocks" USING btree ("driver_id");--> statement-breakpoint
CREATE UNIQUE INDEX "driver_checks_driver_kind_key" ON "driver_checks" USING btree ("driver_id","kind");--> statement-breakpoint
CREATE UNIQUE INDEX "handovers_once" ON "handovers" USING btree ("booking_id","stage","party");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "offers_one_pending_per_booking" ON "offers" USING btree ("booking_id") WHERE "offers"."status" = 'pending';--> statement-breakpoint
CREATE INDEX "offers_driver_idx" ON "offers" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "outbox_due_idx" ON "outbox" USING btree ("status","next_attempt_at");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_reference_key" ON "payments" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "payments_booking_idx" ON "payments" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "rate_limits_key_at_idx" ON "rate_limits" USING btree ("key","created_at");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_key" ON "users" USING btree ("phone") WHERE "users"."phone" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_events_key" ON "webhook_events" USING btree ("provider","event_key");