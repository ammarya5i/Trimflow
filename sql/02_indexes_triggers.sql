SET statement_timeout TO '0';
SET lock_timeout TO '0';

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_barbershop_owner_id" ON "Barbershop"("ownerId");
CREATE INDEX IF NOT EXISTS "idx_barbershop_slug" ON "Barbershop"("slug");
CREATE INDEX IF NOT EXISTS "idx_staff_barbershop_id" ON "Staff"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_service_barbershop_id" ON "Service"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_working_hours_barbershop_id" ON "WorkingHours"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_customer_barbershop_id" ON "Customer"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_appointment_barbershop_id" ON "Appointment"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_appointment_start_time" ON "Appointment"("startTime");
CREATE INDEX IF NOT EXISTS "idx_appointment_status" ON "Appointment"("status");

-- Unique constraints mirrors
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Barbershop_slug_key" ON "Barbershop"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "WorkingHours_barbershopId_dayOfWeek_key" ON "WorkingHours"("barbershopId", "dayOfWeek");

-- updatedAt trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
DO $$ BEGIN
  CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_barbershop_updated_at BEFORE UPDATE ON "Barbershop" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON "Staff" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_service_updated_at BEFORE UPDATE ON "Service" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON "WorkingHours" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_customer_updated_at BEFORE UPDATE ON "Customer" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_appointment_updated_at BEFORE UPDATE ON "Appointment" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


