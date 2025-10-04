SET statement_timeout TO '0';
SET lock_timeout TO '0';

-- Seed demo owner and barbershop
INSERT INTO "User" ("id", "email", "name", "onboardingCompleted", "subscriptionPlan", "subscriptionStatus")
VALUES ('demo-user-id', 'demo@trimflow.com', 'Demo Owner', true, 'PRO', 'active')
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Barbershop" ("id", "ownerId", "name", "slug", "description", "address", "city", "state", "zipCode", "country", "phone", "email", "website", "timezone", "currency", "language", "isActive")
VALUES ('demo-barbershop-id', 'demo-user-id', 'Berber Ali', 'berber-ali', 'Professional barbershop offering modern cuts and traditional services', '123 Main Street', 'Istanbul', 'Istanbul', '34000', 'TR', '+90 212 555 0123', 'info@berberali.com', 'https://berberali.com', 'Europe/Istanbul', 'TRY', 'tr', true)
ON CONFLICT ("slug") DO NOTHING;

-- Services
INSERT INTO "Service" ("id", "barbershopId", "name", "description", "duration", "price", "category", "isActive")
VALUES 
  ('service-1', 'demo-barbershop-id', 'Saç Kesimi', 'Profesyonel saç kesimi', 30, 5000, 'Hair', true),
  ('service-2', 'demo-barbershop-id', 'Sakal Tıraşı', 'Sakal düzeltme ve şekillendirme', 20, 3000, 'Beard', true),
  ('service-3', 'demo-barbershop-id', 'Saç + Sakal', 'Komple bakım hizmeti', 45, 7000, 'Complete', true),
  ('service-4', 'demo-barbershop-id', 'Saç Yıkama', 'Profesyonel saç yıkama ve bakım', 15, 2000, 'Hair Care', true),
  ('service-5', 'demo-barbershop-id', 'Fade Kesim', 'Modern fade kesim', 40, 6000, 'Modern', true)
ON CONFLICT DO NOTHING;

-- Staff
INSERT INTO "Staff" ("id", "barbershopId", "userId", "name", "email", "phone", "role", "bio", "specialties", "isActive")
VALUES 
  ('staff-1', 'demo-barbershop-id', 'demo-user-id', 'Ali Demir', 'ali@berberali.com', '+90 212 555 0123', 'admin', 'Master barber with 15 years of experience', ARRAY['Classic Cuts', 'Beard Styling', 'Hair Coloring'], true),
  ('staff-2', 'demo-barbershop-id', NULL, 'Mehmet Yılmaz', 'mehmet@berberali.com', '+90 212 555 0124', 'barber', 'Specialist in modern cuts and fades', ARRAY['Fade Cuts', 'Modern Styles', 'Hair Washing'], true),
  ('staff-3', 'demo-barbershop-id', NULL, 'Ayşe Kaya', 'ayse@berberali.com', '+90 212 555 0125', 'reception', 'Friendly receptionist and customer service specialist', ARRAY['Customer Service', 'Appointment Management'], true)
ON CONFLICT DO NOTHING;

-- Working hours (Mon-Sun)
INSERT INTO "WorkingHours" ("id", "barbershopId", "dayOfWeek", "startTime", "endTime", "isWorking")
VALUES 
  ('wh-1', 'demo-barbershop-id', 1, '09:00', '18:00', true),
  ('wh-2', 'demo-barbershop-id', 2, '09:00', '18:00', true),
  ('wh-3', 'demo-barbershop-id', 3, '09:00', '18:00', true),
  ('wh-4', 'demo-barbershop-id', 4, '09:00', '18:00', true),
  ('wh-5', 'demo-barbershop-id', 5, '09:00', '18:00', true),
  ('wh-6', 'demo-barbershop-id', 6, '09:00', '16:00', true),
  ('wh-7', 'demo-barbershop-id', 0, '09:00', '18:00', false)
ON CONFLICT ("barbershopId", "dayOfWeek") DO NOTHING;

-- Customers
INSERT INTO "Customer" ("id", "barbershopId", "name", "email", "phone", "dateOfBirth", "notes")
VALUES 
  ('customer-1', 'demo-barbershop-id', 'Ahmet Yılmaz', 'ahmet@example.com', '+90 212 555 0101', '1985-03-15', 'Prefers short cuts, allergic to certain products'),
  ('customer-2', 'demo-barbershop-id', 'Mehmet Özkan', 'mehmet@example.com', '+90 212 555 0102', '1990-07-22', 'Regular customer, likes beard styling'),
  ('customer-3', 'demo-barbershop-id', 'Can Demir', 'can@example.com', '+90 212 555 0103', '1995-11-08', 'New customer, interested in modern styles')
ON CONFLICT DO NOTHING;

-- Appointments
INSERT INTO "Appointment" ("id", "barbershopId", "customerId", "staffId", "serviceId", "startTime", "endTime", "duration", "status", "notes", "totalPrice", "paymentStatus", "paymentMethod")
VALUES 
  ('appointment-1', 'demo-barbershop-id', 'customer-1', 'staff-1', 'service-1', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '30 minutes', 30, 'scheduled', 'Regular haircut', 5000, 'pending', NULL),
  ('appointment-2', 'demo-barbershop-id', 'customer-2', 'staff-2', 'service-3', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '45 minutes', 45, 'scheduled', 'Complete grooming service', 7000, 'pending', NULL),
  ('appointment-3', 'demo-barbershop-id', 'customer-3', 'staff-1', 'service-5', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '40 minutes', 40, 'completed', 'Fade cut completed successfully', 6000, 'paid', 'cash')
ON CONFLICT DO NOTHING;


