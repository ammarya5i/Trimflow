-- Disable timeouts for this session to avoid editor interruptions
SET statement_timeout TO '0';
SET lock_timeout TO '0';

-- Extensions (comment out if your Neon role lacks permissions)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core tables (from prisma schema)
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

CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

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

CREATE TABLE IF NOT EXISTS "StaffService" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "staffId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StaffService_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "StaffService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "StaffService_staffId_serviceId_key" UNIQUE ("staffId", "serviceId")
);


