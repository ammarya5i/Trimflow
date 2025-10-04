-- TrimFlow Database Schema for Neon PostgreSQL
-- This schema matches the Prisma schema and includes all necessary tables and relationships

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create User table (for NextAuth.js)
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionStatus" TEXT,
    "subscriptionPlan" TEXT DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionCurrentPeriodEnd" TIMESTAMP(3)
);

-- Create Account table (for NextAuth.js)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Session table (for NextAuth.js)
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create VerificationToken table (for NextAuth.js)
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("identifier", "token")
);

-- Create Barbershop table
CREATE TABLE IF NOT EXISTS "Barbershop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "language" TEXT NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Barbershop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Staff table
CREATE TABLE IF NOT EXISTS "Staff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barbershopId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'barber',
    "avatarUrl" TEXT,
    "bio" TEXT,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Staff_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create Service table
CREATE TABLE IF NOT EXISTS "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barbershopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Service_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create WorkingHours table
CREATE TABLE IF NOT EXISTS "WorkingHours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barbershopId" TEXT NOT NULL,
    "staffId" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isWorking" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WorkingHours_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkingHours_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Customer table
CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barbershopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Appointment table
CREATE TABLE IF NOT EXISTS "Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barbershopId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "totalPrice" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Appointment_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create StaffService junction table
CREATE TABLE IF NOT EXISTS "StaffService" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "staffId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StaffService_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StaffService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_barbershop_owner_id" ON "Barbershop"("ownerId");
CREATE INDEX IF NOT EXISTS "idx_barbershop_slug" ON "Barbershop"("slug");
CREATE INDEX IF NOT EXISTS "idx_staff_barbershop_id" ON "Staff"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_service_barbershop_id" ON "Service"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_working_hours_barbershop_id" ON "WorkingHours"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_customer_barbershop_id" ON "Customer"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_appointment_barbershop_id" ON "Appointment"("barbershopId");
CREATE INDEX IF NOT EXISTS "idx_appointment_start_time" ON "Appointment"("startTime");
CREATE INDEX IF NOT EXISTS "idx_appointment_status" ON "Appointment"("status");

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Barbershop_slug_key" ON "Barbershop"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "WorkingHours_barbershopId_dayOfWeek_key" ON "WorkingHours"("barbershopId", "dayOfWeek");
CREATE UNIQUE INDEX IF NOT EXISTS "StaffService_staffId_serviceId_key" ON "StaffService"("staffId", "serviceId");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barbershop_updated_at BEFORE UPDATE ON "Barbershop" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON "Staff" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_updated_at BEFORE UPDATE ON "Service" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON "WorkingHours" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_updated_at BEFORE UPDATE ON "Customer" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointment_updated_at BEFORE UPDATE ON "Appointment" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data
INSERT INTO "User" ("id", "email", "name", "onboardingCompleted", "subscriptionPlan", "subscriptionStatus") 
VALUES ('demo-user-id', 'demo@trimflow.com', 'Demo Owner', true, 'PRO', 'active')
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Barbershop" ("id", "ownerId", "name", "slug", "description", "address", "city", "state", "zipCode", "country", "phone", "email", "website", "timezone", "currency", "language", "isActive")
VALUES ('demo-barbershop-id', 'demo-user-id', 'Berber Ali', 'berber-ali', 'Professional barbershop offering modern cuts and traditional services', '123 Main Street', 'Istanbul', 'Istanbul', '34000', 'TR', '+90 212 555 0123', 'info@berberali.com', 'https://berberali.com', 'Europe/Istanbul', 'TRY', 'tr', true)
ON CONFLICT ("slug") DO NOTHING;

-- Insert demo services
INSERT INTO "Service" ("id", "barbershopId", "name", "description", "duration", "price", "category", "isActive")
VALUES 
    ('service-1', 'demo-barbershop-id', 'Saç Kesimi', 'Profesyonel saç kesimi', 30, 5000, 'Hair', true),
    ('service-2', 'demo-barbershop-id', 'Sakal Tıraşı', 'Sakal düzeltme ve şekillendirme', 20, 3000, 'Beard', true),
    ('service-3', 'demo-barbershop-id', 'Saç + Sakal', 'Komple bakım hizmeti', 45, 7000, 'Complete', true),
    ('service-4', 'demo-barbershop-id', 'Saç Yıkama', 'Profesyonel saç yıkama ve bakım', 15, 2000, 'Hair Care', true),
    ('service-5', 'demo-barbershop-id', 'Fade Kesim', 'Modern fade kesim', 40, 6000, 'Modern', true)
ON CONFLICT DO NOTHING;

-- Insert demo staff
INSERT INTO "Staff" ("id", "barbershopId", "userId", "name", "email", "phone", "role", "bio", "specialties", "isActive")
VALUES 
    ('staff-1', 'demo-barbershop-id', 'demo-user-id', 'Ali Demir', 'ali@berberali.com', '+90 212 555 0123', 'admin', 'Master barber with 15 years of experience', ARRAY['Classic Cuts', 'Beard Styling', 'Hair Coloring'], true),
    ('staff-2', 'demo-barbershop-id', NULL, 'Mehmet Yılmaz', 'mehmet@berberali.com', '+90 212 555 0124', 'barber', 'Specialist in modern cuts and fades', ARRAY['Fade Cuts', 'Modern Styles', 'Hair Washing'], true),
    ('staff-3', 'demo-barbershop-id', NULL, 'Ayşe Kaya', 'ayse@berberali.com', '+90 212 555 0125', 'reception', 'Friendly receptionist and customer service specialist', ARRAY['Customer Service', 'Appointment Management'], true)
ON CONFLICT DO NOTHING;

-- Insert working hours (Monday to Saturday)
INSERT INTO "WorkingHours" ("id", "barbershopId", "dayOfWeek", "startTime", "endTime", "isWorking")
VALUES 
    ('wh-1', 'demo-barbershop-id', 1, '09:00', '18:00', true), -- Monday
    ('wh-2', 'demo-barbershop-id', 2, '09:00', '18:00', true), -- Tuesday
    ('wh-3', 'demo-barbershop-id', 3, '09:00', '18:00', true), -- Wednesday
    ('wh-4', 'demo-barbershop-id', 4, '09:00', '18:00', true), -- Thursday
    ('wh-5', 'demo-barbershop-id', 5, '09:00', '18:00', true), -- Friday
    ('wh-6', 'demo-barbershop-id', 6, '09:00', '16:00', true), -- Saturday
    ('wh-7', 'demo-barbershop-id', 0, '09:00', '18:00', false) -- Sunday (closed)
ON CONFLICT ("barbershopId", "dayOfWeek") DO NOTHING;

-- Insert demo customers
INSERT INTO "Customer" ("id", "barbershopId", "name", "email", "phone", "dateOfBirth", "notes")
VALUES 
    ('customer-1', 'demo-barbershop-id', 'Ahmet Yılmaz', 'ahmet@example.com', '+90 212 555 0101', '1985-03-15', 'Prefers short cuts, allergic to certain products'),
    ('customer-2', 'demo-barbershop-id', 'Mehmet Özkan', 'mehmet@example.com', '+90 212 555 0102', '1990-07-22', 'Regular customer, likes beard styling'),
    ('customer-3', 'demo-barbershop-id', 'Can Demir', 'can@example.com', '+90 212 555 0103', '1995-11-08', 'New customer, interested in modern styles')
ON CONFLICT DO NOTHING;

-- Insert demo appointments
INSERT INTO "Appointment" ("id", "barbershopId", "customerId", "staffId", "serviceId", "startTime", "endTime", "duration", "status", "notes", "totalPrice", "paymentStatus", "paymentMethod")
VALUES 
    ('appointment-1', 'demo-barbershop-id', 'customer-1', 'staff-1', 'service-1', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '30 minutes', 30, 'scheduled', 'Regular haircut', 5000, 'pending', NULL),
    ('appointment-2', 'demo-barbershop-id', 'customer-2', 'staff-2', 'service-3', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '45 minutes', 45, 'scheduled', 'Complete grooming service', 7000, 'pending', NULL),
    ('appointment-3', 'demo-barbershop-id', 'customer-3', 'staff-1', 'service-5', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '40 minutes', 40, 'completed', 'Fade cut completed successfully', 6000, 'paid', 'cash')
ON CONFLICT DO NOTHING;

-- Link staff to services
INSERT INTO "StaffService" ("id", "staffId", "serviceId")
VALUES 
    -- Ali (admin) can do all services
    ('ss-1', 'staff-1', 'service-1'),
    ('ss-2', 'staff-1', 'service-2'),
    ('ss-3', 'staff-1', 'service-3'),
    ('ss-4', 'staff-1', 'service-4'),
    ('ss-5', 'staff-1', 'service-5'),
    -- Mehmet (barber) can do most services
    ('ss-6', 'staff-2', 'service-1'),
    ('ss-7', 'staff-2', 'service-2'),
    ('ss-8', 'staff-2', 'service-3'),
    ('ss-9', 'staff-2', 'service-4')
ON CONFLICT ("staffId", "serviceId") DO NOTHING;

-- Grant necessary permissions (adjust as needed for your Neon setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_neon_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_neon_user;

COMMENT ON TABLE "User" IS 'NextAuth.js user table';
COMMENT ON TABLE "Account" IS 'NextAuth.js account table';
COMMENT ON TABLE "Session" IS 'NextAuth.js session table';
COMMENT ON TABLE "VerificationToken" IS 'NextAuth.js verification token table';
COMMENT ON TABLE "Barbershop" IS 'Barbershop information and settings';
COMMENT ON TABLE "Staff" IS 'Staff members working at barbershops';
COMMENT ON TABLE "Service" IS 'Services offered by barbershops';
COMMENT ON TABLE "WorkingHours" IS 'Working hours for barbershops and staff';
COMMENT ON TABLE "Customer" IS 'Customer information';
COMMENT ON TABLE "Appointment" IS 'Appointment bookings';
COMMENT ON TABLE "StaffService" IS 'Junction table linking staff to services they can provide';
