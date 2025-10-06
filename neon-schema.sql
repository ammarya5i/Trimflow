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

-- Insert Ahmet Salon data
INSERT INTO "User" ("id", "email", "name", "onboardingCompleted", "subscriptionPlan", "subscriptionStatus") 
VALUES ('ahmet-salon-user-id', 'ahmet@ahmetsalon.com', 'Ahmet Salon', true, 'PRO', 'active')
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Barbershop" ("id", "ownerId", "name", "slug", "description", "address", "city", "state", "zipCode", "country", "phone", "email", "website", "timezone", "currency", "language", "isActive")
VALUES ('ahmet-salon-id', 'ahmet-salon-user-id', 'Ahmet Salon', 'ahmet-salon', 'Istanbul''s premier barbershop for traditional and modern grooming services. Experience the perfect blend of Turkish barbering heritage and contemporary style.', 'Nişantaşı Mahallesi, Teşvikiye Caddesi No: 45', 'Istanbul', 'Istanbul', '34365', 'TR', '+90 212 123 45 67', 'info@ahmetsalon.com', 'https://ahmetsalon.com', 'Europe/Istanbul', 'TRY', 'tr', true)
ON CONFLICT ("slug") DO NOTHING;

-- Insert Ahmet Salon services
INSERT INTO "Service" ("id", "barbershopId", "name", "description", "duration", "price", "category", "isActive")
VALUES 
    ('service-1', 'ahmet-salon-id', 'Classic Cut', 'Traditional Turkish barbering with professional haircut, beard trim, hot towel treatment, hair wash, and styling', 30, 15000, 'Classic', true),
    ('service-2', 'ahmet-salon-id', 'Premium Cut', 'Our most popular service with premium haircut, beard styling, hot towel shave, hair wash & conditioning, professional styling, face massage, and aftercare consultation', 45, 25000, 'Premium', true),
    ('service-3', 'ahmet-salon-id', 'Luxury Experience', 'Complete grooming package with everything in Premium plus full beard treatment, eyebrow trimming, nose hair trimming, premium products, extended massage, and complimentary refreshments', 60, 40000, 'Luxury', true),
    ('service-4', 'ahmet-salon-id', 'Beard Trim & Style', 'Professional beard trimming, shaping, and styling with hot towel treatment', 25, 8000, 'Beard', true),
    ('service-5', 'ahmet-salon-id', 'Hot Towel Shave', 'Traditional Turkish hot towel shave with premium products and face massage', 35, 12000, 'Traditional', true)
ON CONFLICT DO NOTHING;

-- Insert Ahmet Salon staff
INSERT INTO "Staff" ("id", "barbershopId", "userId", "name", "email", "phone", "role", "bio", "specialties", "isActive")
VALUES 
    ('staff-1', 'ahmet-salon-id', 'ahmet-salon-user-id', 'Ahmet Usta', 'ahmet@ahmetsalon.com', '+90 212 123 45 67', 'admin', 'Master barber with 20 years of experience in traditional Turkish barbering and modern techniques', ARRAY['Classic Turkish Cuts', 'Beard Styling', 'Hot Towel Shaves', 'Traditional Services'], true),
    ('staff-2', 'ahmet-salon-id', NULL, 'Mehmet Usta', 'mehmet@ahmetsalon.com', '+90 212 123 45 68', 'barber', 'Specialist in modern cuts, fades, and contemporary styling', ARRAY['Fade Cuts', 'Modern Styles', 'Hair Washing', 'Styling'], true),
    ('staff-3', 'ahmet-salon-id', NULL, 'Can Usta', 'can@ahmetsalon.com', '+90 212 123 45 69', 'barber', 'Expert in beard grooming and luxury treatments', ARRAY['Beard Grooming', 'Luxury Treatments', 'Face Massage', 'Premium Services'], true)
ON CONFLICT DO NOTHING;

-- Insert Ahmet Salon working hours (Monday to Saturday: 9:00-20:00, Sunday: 10:00-18:00)
INSERT INTO "WorkingHours" ("id", "barbershopId", "dayOfWeek", "startTime", "endTime", "isWorking")
VALUES 
    ('wh-1', 'ahmet-salon-id', 1, '09:00', '20:00', true), -- Monday
    ('wh-2', 'ahmet-salon-id', 2, '09:00', '20:00', true), -- Tuesday
    ('wh-3', 'ahmet-salon-id', 3, '09:00', '20:00', true), -- Wednesday
    ('wh-4', 'ahmet-salon-id', 4, '09:00', '20:00', true), -- Thursday
    ('wh-5', 'ahmet-salon-id', 5, '09:00', '20:00', true), -- Friday
    ('wh-6', 'ahmet-salon-id', 6, '09:00', '20:00', true), -- Saturday
    ('wh-7', 'ahmet-salon-id', 0, '10:00', '18:00', true) -- Sunday
ON CONFLICT ("barbershopId", "dayOfWeek") DO NOTHING;

-- Insert Ahmet Salon customers
INSERT INTO "Customer" ("id", "barbershopId", "name", "email", "phone", "dateOfBirth", "notes")
VALUES 
    ('customer-1', 'ahmet-salon-id', 'Mehmet Yılmaz', 'mehmet@example.com', '+90 212 555 0101', '1985-03-15', 'Regular customer, loves traditional Turkish barbering'),
    ('customer-2', 'ahmet-salon-id', 'Ali Demir', 'ali@example.com', '+90 212 555 0102', '1990-07-22', 'Business owner, prefers premium services'),
    ('customer-3', 'ahmet-salon-id', 'Can Özkan', 'can@example.com', '+90 212 555 0103', '1995-11-08', 'Local resident, interested in modern styles')
ON CONFLICT DO NOTHING;

-- Insert Ahmet Salon appointments
INSERT INTO "Appointment" ("id", "barbershopId", "customerId", "staffId", "serviceId", "startTime", "endTime", "duration", "status", "notes", "totalPrice", "paymentStatus", "paymentMethod")
VALUES 
    ('appointment-1', 'ahmet-salon-id', 'customer-1', 'staff-1', 'service-1', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '30 minutes', 30, 'scheduled', 'Classic Turkish cut', 15000, 'pending', NULL),
    ('appointment-2', 'ahmet-salon-id', 'customer-2', 'staff-2', 'service-2', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '45 minutes', 45, 'scheduled', 'Premium grooming service', 25000, 'pending', NULL),
    ('appointment-3', 'ahmet-salon-id', 'customer-3', 'staff-1', 'service-5', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '35 minutes', 35, 'completed', 'Hot towel shave completed successfully', 12000, 'paid', 'cash')
ON CONFLICT DO NOTHING;

-- Link Ahmet Salon staff to services
INSERT INTO "StaffService" ("id", "staffId", "serviceId")
VALUES 
    -- Ahmet Usta (admin) can do all services
    ('ss-1', 'staff-1', 'service-1'),
    ('ss-2', 'staff-1', 'service-2'),
    ('ss-3', 'staff-1', 'service-3'),
    ('ss-4', 'staff-1', 'service-4'),
    ('ss-5', 'staff-1', 'service-5'),
    -- Mehmet Usta (barber) can do most services
    ('ss-6', 'staff-2', 'service-1'),
    ('ss-7', 'staff-2', 'service-2'),
    ('ss-8', 'staff-2', 'service-3'),
    ('ss-9', 'staff-2', 'service-4'),
    -- Can Usta (barber) specializes in luxury services
    ('ss-10', 'staff-3', 'service-2'),
    ('ss-11', 'staff-3', 'service-3'),
    ('ss-12', 'staff-3', 'service-4'),
    ('ss-13', 'staff-3', 'service-5')
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
