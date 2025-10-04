-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbershops ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Barbershops policies
CREATE POLICY "Users can view own barbershops" ON barbershops
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own barbershops" ON barbershops
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own barbershops" ON barbershops
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own barbershops" ON barbershops
    FOR DELETE USING (auth.uid() = owner_id);

-- Public read access for active barbershops (for booking pages)
CREATE POLICY "Anyone can view active barbershops" ON barbershops
    FOR SELECT USING (is_active = true);

-- Staff policies
CREATE POLICY "Barbershop owners can manage staff" ON staff
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbershops 
            WHERE barbershops.id = staff.barbershop_id 
            AND barbershops.owner_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view own barbershop staff" ON staff
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.barbershop_id = staff.barbershop_id
            AND s.user_id = auth.uid()
        )
    );

-- Public read access for active staff (for booking pages)
CREATE POLICY "Anyone can view active staff" ON staff
    FOR SELECT USING (is_active = true);

-- Services policies
CREATE POLICY "Barbershop owners can manage services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbershops 
            WHERE barbershops.id = services.barbershop_id 
            AND barbershops.owner_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view own barbershop services" ON services
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.barbershop_id = services.barbershop_id
            AND s.user_id = auth.uid()
        )
    );

-- Public read access for active services (for booking pages)
CREATE POLICY "Anyone can view active services" ON services
    FOR SELECT USING (is_active = true);

-- Working hours policies
CREATE POLICY "Barbershop owners can manage working hours" ON working_hours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbershops 
            WHERE barbershops.id = working_hours.barbershop_id 
            AND barbershops.owner_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view own barbershop working hours" ON working_hours
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.barbershop_id = working_hours.barbershop_id
            AND s.user_id = auth.uid()
        )
    );

-- Public read access for working hours (for booking pages)
CREATE POLICY "Anyone can view working hours" ON working_hours
    FOR SELECT USING (true);

-- Customers policies
CREATE POLICY "Barbershop owners can manage customers" ON customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbershops 
            WHERE barbershops.id = customers.barbershop_id 
            AND barbershops.owner_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view own barbershop customers" ON customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.barbershop_id = customers.barbershop_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Staff can update own barbershop customers" ON customers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.barbershop_id = customers.barbershop_id
            AND s.user_id = auth.uid()
        )
    );

-- Appointments policies
CREATE POLICY "Barbershop owners can manage appointments" ON appointments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbershops 
            WHERE barbershops.id = appointments.barbershop_id 
            AND barbershops.owner_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view own barbershop appointments" ON appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.barbershop_id = appointments.barbershop_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Staff can update own barbershop appointments" ON appointments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.barbershop_id = appointments.barbershop_id
            AND s.user_id = auth.uid()
        )
    );

-- Allow public to insert appointments (for booking form)
CREATE POLICY "Anyone can create appointments" ON appointments
    FOR INSERT WITH CHECK (true);

-- Staff services policies
CREATE POLICY "Barbershop owners can manage staff services" ON staff_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM staff s
            JOIN barbershops b ON b.id = s.barbershop_id
            WHERE s.id = staff_services.staff_id
            AND b.owner_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view own barbershop staff services" ON staff_services
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.id = staff_services.staff_id
            AND s.user_id = auth.uid()
        )
    );

-- Public read access for staff services (for booking pages)
CREATE POLICY "Anyone can view staff services" ON staff_services
    FOR SELECT USING (true);
