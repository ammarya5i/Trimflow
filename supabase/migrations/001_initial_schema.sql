-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'unpaid')),
    subscription_plan TEXT CHECK (subscription_plan IN ('FREE', 'PRO', 'PREMIUM')) DEFAULT 'FREE',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_current_period_end TIMESTAMP WITH TIME ZONE
);

-- Create barbershops table
CREATE TABLE IF NOT EXISTS barbershops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    currency TEXT DEFAULT 'USD',
    language TEXT DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT CHECK (role IN ('admin', 'barber', 'reception')) DEFAULT 'barber',
    avatar_url TEXT,
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    price INTEGER NOT NULL, -- in cents
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create working_hours table
CREATE TABLE IF NOT EXISTS working_hours (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_working BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(barbershop_id, day_of_week, staff_id)
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    status TEXT CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    notes TEXT,
    total_price INTEGER NOT NULL, -- in cents
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff_services junction table
CREATE TABLE IF NOT EXISTS staff_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(staff_id, service_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_barbershops_owner_id ON barbershops(owner_id);
CREATE INDEX IF NOT EXISTS idx_barbershops_slug ON barbershops(slug);
CREATE INDEX IF NOT EXISTS idx_staff_barbershop_id ON staff(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_services_barbershop_id ON services(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_working_hours_barbershop_id ON working_hours(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_customers_barbershop_id ON customers(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_barbershop_id ON appointments(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barbershops_updated_at BEFORE UPDATE ON barbershops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON working_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
