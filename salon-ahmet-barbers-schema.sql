-- Salon Ahmet Barbers Database Schema for Neon PostgreSQL
-- This schema includes all the real business data for Salon Ahmet Barbers in Mecidiyeköy, Istanbul

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

-- Insert Ahmet (Salon Owner) - Only admin account
INSERT INTO "User" ("id", "email", "name", "onboardingCompleted", "subscriptionPlan", "subscriptionStatus") 
VALUES ('ahmet-owner-id', 'ahmet@salonahmetbarbers.com', 'Ahmet Usta', true, 'PRO', 'active')
ON CONFLICT ("email") DO NOTHING;

-- Insert Salon Ahmet Barbers (Real Business Data)
INSERT INTO "Barbershop" ("id", "ownerId", "name", "slug", "description", "address", "city", "state", "zipCode", "country", "phone", "email", "website", "timezone", "currency", "language", "isActive")
VALUES ('salon-ahmet-id', 'ahmet-owner-id', 'Salon Ahmet Barbers', 'salon-ahmet-barbers', 'Professional barbershop in Mecidiyeköy, Istanbul. Offering traditional Turkish barbering and modern grooming services with 4.9-star rating from 608+ reviews.', 'Mecidiyeköy, Şht. Er Cihan Namlı Cd No:9 D:2B', 'Istanbul', 'Şişli', '34387', 'TR', '+90 541 883 31 20', 'info@salonahmetbarbers.com', 'https://www.instagram.com/salonahmetbarbers/', 'Europe/Istanbul', 'TRY', 'tr', true)
ON CONFLICT ("slug") DO NOTHING;

-- Insert Real Services (Based on Google Business Listing)
INSERT INTO "Service" ("id", "barbershopId", "name", "description", "duration", "price", "category", "isActive")
VALUES 
    ('service-1', 'salon-ahmet-id', 'Model Saç Kesimi', 'Professional model haircut with modern styling techniques', 45, 20000, 'Hair', true),
    ('service-2', 'salon-ahmet-id', 'Sakal Kesimi & Şekillendirme', 'Beard cutting and professional styling with hot towel treatment', 30, 15000, 'Beard', true),
    ('service-3', 'salon-ahmet-id', 'Komple Bakım', 'Complete grooming package - hair + beard + facial care', 60, 35000, 'Complete', true),
    ('service-4', 'salon-ahmet-id', 'Tıraş & Yüz Bakımı', 'Traditional shave with facial care and hot towel treatment', 40, 18000, 'Shave', true),
    ('service-5', 'salon-ahmet-id', 'Saç Boyama', 'Professional hair coloring service with premium products', 90, 25000, 'Coloring', true),
    ('service-6', 'salon-ahmet-id', 'Doğal Kalıcı Saç Düzleştirici (KRİSTAL&BOTOX)', 'Natural permanent hair straightening with Krystal & Botox treatment', 120, 40000, 'Treatment', true),
    ('service-7', 'salon-ahmet-id', 'Profesyonel Yüz Bakımları', 'Professional facial care and skincare treatments', 60, 30000, 'Facial', true),
    ('service-8', 'salon-ahmet-id', 'Kaş Boyama', 'Eyebrow tinting and shaping service', 30, 8000, 'Eyebrow', true)
ON CONFLICT DO NOTHING;

-- Insert Real Staff (Ahmet and his team)
INSERT INTO "Staff" ("id", "barbershopId", "userId", "name", "email", "phone", "role", "bio", "specialties", "isActive")
VALUES 
    ('staff-1', 'salon-ahmet-id', 'ahmet-owner-id', 'Ahmet Usta', 'ahmet@salonahmetbarbers.com', '+90 541 883 31 20', 'admin', 'Master barber and salon owner with 15+ years of experience in traditional Turkish barbering and modern techniques', ARRAY['Model Cuts', 'Beard Styling', 'Traditional Shaves', 'Hair Coloring', 'Facial Care'], true),
    ('staff-2', 'salon-ahmet-id', NULL, 'Mehmet Usta', 'mehmet@salonahmetbarbers.com', '+90 541 883 31 21', 'barber', 'Specialist in modern cuts, fades, and contemporary styling', ARRAY['Fade Cuts', 'Modern Styles', 'Hair Washing', 'Styling'], true),
    ('staff-3', 'salon-ahmet-id', NULL, 'Can Usta', 'can@salonahmetbarbers.com', '+90 541 883 31 22', 'barber', 'Expert in beard grooming, luxury treatments, and hair coloring', ARRAY['Beard Grooming', 'Luxury Treatments', 'Hair Coloring', 'Facial Care'], true)
ON CONFLICT DO NOTHING;

-- Insert Working Hours (Every day 9:00-23:45 as per Google listing)
INSERT INTO "WorkingHours" ("id", "barbershopId", "dayOfWeek", "startTime", "endTime", "isWorking")
VALUES 
    ('wh-1', 'salon-ahmet-id', 1, '09:00', '23:45', true), -- Monday
    ('wh-2', 'salon-ahmet-id', 2, '09:00', '23:45', true), -- Tuesday
    ('wh-3', 'salon-ahmet-id', 3, '09:00', '23:45', true), -- Wednesday
    ('wh-4', 'salon-ahmet-id', 4, '09:00', '23:45', true), -- Thursday
    ('wh-5', 'salon-ahmet-id', 5, '09:00', '23:45', true), -- Friday
    ('wh-6', 'salon-ahmet-id', 6, '09:00', '23:45', true), -- Saturday
    ('wh-7', 'salon-ahmet-id', 0, '09:00', '23:45', true) -- Sunday
ON CONFLICT ("barbershopId", "dayOfWeek") DO NOTHING;

-- Insert Sample Customers (for testing)
INSERT INTO "Customer" ("id", "barbershopId", "name", "email", "phone", "dateOfBirth", "notes")
VALUES 
    ('customer-1', 'salon-ahmet-id', 'Mehmet Yılmaz', 'mehmet@example.com', '+90 212 555 0101', '1985-03-15', 'Regular customer, loves traditional Turkish barbering'),
    ('customer-2', 'salon-ahmet-id', 'Ali Demir', 'ali@example.com', '+90 212 555 0102', '1990-07-22', 'Business owner, prefers premium services'),
    ('customer-3', 'salon-ahmet-id', 'Can Özkan', 'can@example.com', '+90 212 555 0103', '1995-11-08', 'Local resident, interested in modern styles')
ON CONFLICT DO NOTHING;

-- Insert Sample Appointments (for testing)
INSERT INTO "Appointment" ("id", "barbershopId", "customerId", "staffId", "serviceId", "startTime", "endTime", "duration", "status", "notes", "totalPrice", "paymentStatus", "paymentMethod")
VALUES 
    ('appointment-1', 'salon-ahmet-id', 'customer-1', 'staff-1', 'service-1', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '45 minutes', 45, 'scheduled', 'Model haircut request', 20000, 'pending', NULL),
    ('appointment-2', 'salon-ahmet-id', 'customer-2', 'staff-2', 'service-3', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '60 minutes', 60, 'scheduled', 'Complete grooming service', 35000, 'pending', NULL),
    ('appointment-3', 'salon-ahmet-id', 'customer-3', 'staff-1', 'service-4', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '40 minutes', 40, 'completed', 'Traditional shave completed successfully', 18000, 'paid', 'cash')
ON CONFLICT DO NOTHING;

-- Link Staff to Services (All staff can do most services)
INSERT INTO "StaffService" ("id", "staffId", "serviceId")
VALUES 
    -- Ahmet Usta (admin) can do all services
    ('ss-1', 'staff-1', 'service-1'),
    ('ss-2', 'staff-1', 'service-2'),
    ('ss-3', 'staff-1', 'service-3'),
    ('ss-4', 'staff-1', 'service-4'),
    ('ss-5', 'staff-1', 'service-5'),
    ('ss-6', 'staff-1', 'service-6'),
    ('ss-7', 'staff-1', 'service-7'),
    ('ss-8', 'staff-1', 'service-8'),
    -- Mehmet Usta (barber) can do most services
    ('ss-9', 'staff-2', 'service-1'),
    ('ss-10', 'staff-2', 'service-2'),
    ('ss-11', 'staff-2', 'service-3'),
    ('ss-12', 'staff-2', 'service-4'),
    ('ss-13', 'staff-2', 'service-5'),
    -- Can Usta (barber) specializes in luxury services
    ('ss-14', 'staff-3', 'service-2'),
    ('ss-15', 'staff-3', 'service-3'),
    ('ss-16', 'staff-3', 'service-5'),
    ('ss-17', 'staff-3', 'service-6'),
    ('ss-18', 'staff-3', 'service-7'),
    ('ss-19', 'staff-3', 'service-8')
ON CONFLICT ("staffId", "serviceId") DO NOTHING;

-- Grant necessary permissions (adjust as needed for your Neon setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_neon_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_neon_user;

COMMENT ON TABLE "User" IS 'NextAuth.js user table - Only Ahmet has admin access';
COMMENT ON TABLE "Account" IS 'NextAuth.js account table';
COMMENT ON TABLE "Session" IS 'NextAuth.js session table';
COMMENT ON TABLE "VerificationToken" IS 'NextAuth.js verification token table';
COMMENT ON TABLE "Barbershop" IS 'Salon Ahmet Barbers business information';
COMMENT ON TABLE "Staff" IS 'Ahmet and his barber team';
COMMENT ON TABLE "Service" IS 'Real services offered by Salon Ahmet Barbers';
COMMENT ON TABLE "WorkingHours" IS 'Working hours: Every day 9:00-23:45';
COMMENT ON TABLE "Customer" IS 'Customer information for appointment requests';
COMMENT ON TABLE "Appointment" IS 'Appointment bookings and requests';
COMMENT ON TABLE "StaffService" IS 'Which staff members can provide which services';
