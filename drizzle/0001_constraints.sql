-- Overlap rules that Drizzle can't express. Works on local Postgres 16 and Supabase.
CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
-- One driver can't hold two active blocks (unavailable / payment hold / assignment) that overlap.
-- Holds are created when a driver accepts, so a driver can't accept two overlapping jobs while
-- both wait for payment (PACK_REVIEW B1).
ALTER TABLE "driver_blocks" ADD CONSTRAINT "driver_blocks_no_overlap"
  EXCLUDE USING gist ("driver_id" WITH =, tstzrange("starts_at", "ends_at", '[)') WITH &&)
  WHERE ("released_at" IS NULL);
--> statement-breakpoint
ALTER TABLE "fleet_blocks" ADD CONSTRAINT "fleet_blocks_no_overlap"
  EXCLUDE USING gist ("vehicle_id" WITH =, tstzrange("starts_at", "ends_at", '[)') WITH &&)
  WHERE ("released_at" IS NULL);
--> statement-breakpoint
-- Blocks tied to a booking must point at a real booking.
ALTER TABLE "driver_blocks" ADD CONSTRAINT "driver_blocks_booking_fk"
  FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE "fleet_blocks" ADD CONSTRAINT "fleet_blocks_booking_fk"
  FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE;
--> statement-breakpoint
-- Audit log is append-only.
CREATE OR REPLACE FUNCTION flydrive_audit_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
END $$;
--> statement-breakpoint
CREATE TRIGGER audit_log_no_update BEFORE UPDATE OR DELETE ON "audit_log"
  FOR EACH ROW EXECUTE FUNCTION flydrive_audit_immutable();
--> statement-breakpoint
CREATE TRIGGER booking_events_no_update BEFORE UPDATE OR DELETE ON "booking_events"
  FOR EACH ROW EXECUTE FUNCTION flydrive_audit_immutable();
