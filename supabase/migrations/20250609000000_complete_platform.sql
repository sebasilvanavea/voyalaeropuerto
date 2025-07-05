/*
  # Schema Completo para la Mejor Plataforma de Traslados del Mundo
  
  Esta migración incluye todas las tablas necesarias para un sistema completo:
  - Gestión de usuarios y perfiles
  - Sistema de reservas avanzado
  - Gestión de conductores y vehículos
  - Sistema de pagos y facturación
  - Reviews y ratings
  - Tracking en tiempo real
  - Notificaciones
  - Panel administrativo
*/

-- ===============================================
-- EXTENSIONES NECESARIAS
-- ===============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ===============================================
-- ENUMS
-- ===============================================
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE vehicle_status AS ENUM ('available', 'busy', 'maintenance', 'inactive');
CREATE TYPE driver_status AS ENUM ('available', 'busy', 'offline', 'break');
CREATE TYPE notification_type AS ENUM ('booking', 'payment', 'reminder', 'promotion', 'system');

-- ===============================================
-- PERFILES DE USUARIO EXTENDIDOS
-- ===============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  date_of_birth date,
  emergency_contact_name text,
  emergency_contact_phone text,
  preferred_language text DEFAULT 'es',
  notification_preferences jsonb DEFAULT '{"email": true, "sms": true, "push": true}'::jsonb,
  loyalty_points integer DEFAULT 0,
  total_trips integer DEFAULT 0,
  avatar_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  role text DEFAULT 'user' CHECK (role IN ('user', 'driver', 'admin', 'support'))
);

-- ===============================================
-- CONDUCTORES
-- ===============================================
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  license_number text UNIQUE NOT NULL,
  license_expiry date NOT NULL,
  license_photo_url text,
  background_check_status text DEFAULT 'pending',
  background_check_date date,
  rating decimal(3,2) DEFAULT 5.00,
  total_trips integer DEFAULT 0,
  years_experience integer,
  languages text[] DEFAULT ARRAY['es'],
  status driver_status DEFAULT 'offline',
  current_location point,
  last_location_update timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- VEHÍCULOS
-- ===============================================
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text NOT NULL,
  license_plate text UNIQUE NOT NULL,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('taxi', 'suv', 'van', 'luxury')),
  max_passengers integer NOT NULL,
  max_luggage jsonb NOT NULL, -- {trunk: 2, cabin: 2, backpacks: 0}
  features text[] DEFAULT ARRAY[]::text[], -- ['wifi', 'air_conditioning', 'child_seat']
  insurance_policy text NOT NULL,
  insurance_expiry date NOT NULL,
  technical_review_expiry date NOT NULL,
  status vehicle_status DEFAULT 'available',
  odometer integer DEFAULT 0,
  photos text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- RESERVAS AVANZADAS
-- ===============================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  driver_id uuid REFERENCES drivers(id),
  vehicle_id uuid REFERENCES vehicles(id),
  
  -- Información del servicio
  service_type text NOT NULL CHECK (service_type IN ('toAirport', 'fromAirport', 'intercity', 'hourly')),
  pickup_address text NOT NULL,
  pickup_location point,
  destination_address text NOT NULL,
  destination_location point,
  pickup_datetime timestamptz NOT NULL,
  estimated_duration interval,
  estimated_distance decimal(8,2), -- En kilómetros
  
  -- Información de pasajeros
  passengers integer NOT NULL CHECK (passengers >= 1 AND passengers <= 15),
  passenger_details jsonb, -- Nombres, teléfonos de pasajeros adicionales
  special_requests text,
  luggage_details jsonb, -- Detalles específicos del equipaje
  
  -- Información de precios
  base_price decimal(10,2) NOT NULL,
  airport_surcharge decimal(10,2) DEFAULT 0,
  distance_surcharge decimal(10,2) DEFAULT 0,
  time_surcharge decimal(10,2) DEFAULT 0,
  tolls_fee decimal(10,2) DEFAULT 0,
  waiting_fee decimal(10,2) DEFAULT 0,
  tips decimal(10,2) DEFAULT 0,
  total_price decimal(10,2) NOT NULL,
  currency text DEFAULT 'CLP',
  
  -- Estado y tracking
  status booking_status DEFAULT 'pending',
  confirmation_code text UNIQUE,
  estimated_pickup_time timestamptz,
  actual_pickup_time timestamptz,
  estimated_arrival_time timestamptz,
  actual_arrival_time timestamptz,
  
  -- Información adicional
  flight_number text, -- Para servicios de aeropuerto
  flight_arrival_time timestamptz,
  notes text,
  cancellation_reason text,
  cancelled_by uuid REFERENCES auth.users(id),
  cancelled_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_datetime CHECK (pickup_datetime > now())
);

-- ===============================================
-- SISTEMA DE PAGOS
-- ===============================================
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'CLP',
  payment_method text NOT NULL, -- 'credit_card', 'debit_card', 'cash', 'transfer'
  payment_provider text, -- 'stripe', 'transbank', 'mercadopago'
  provider_transaction_id text,
  status payment_status DEFAULT 'pending',
  paid_at timestamptz,
  refunded_at timestamptz,
  refund_amount decimal(10,2) DEFAULT 0,
  fee_amount decimal(10,2) DEFAULT 0, -- Comisión de la plataforma
  driver_amount decimal(10,2), -- Monto para el conductor
  metadata jsonb, -- Información adicional del pago
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- TRACKING EN TIEMPO REAL
-- ===============================================
CREATE TABLE IF NOT EXISTS trip_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  driver_location point NOT NULL,
  speed decimal(5,2), -- km/h
  heading decimal(5,2), -- Dirección en grados (0-360)
  accuracy decimal(8,2), -- Precisión del GPS en metros
  timestamp timestamptz DEFAULT now()
);

-- Índices para trip_tracking
CREATE INDEX idx_trip_tracking_booking_time ON trip_tracking(booking_id, timestamp);
CREATE INDEX idx_trip_tracking_location ON trip_tracking USING GIST (driver_location);

-- ===============================================
-- REVIEWS Y RATINGS
-- ===============================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) UNIQUE NOT NULL,
  reviewer_id uuid REFERENCES auth.users(id) NOT NULL,
  reviewed_id uuid REFERENCES auth.users(id) NOT NULL, -- Driver o passenger
  reviewer_type text NOT NULL CHECK (reviewer_type IN ('passenger', 'driver')),
  
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  categories jsonb, -- {"punctuality": 5, "cleanliness": 4, "driving": 5, "courtesy": 5}
  
  is_public boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- NOTIFICACIONES
-- ===============================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb, -- Datos adicionales para la notificación
  
  is_read boolean DEFAULT false,
  read_at timestamptz,
  
  sent_email boolean DEFAULT false,
  sent_sms boolean DEFAULT false,
  sent_push boolean DEFAULT false,
  
  expires_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

-- ===============================================
-- PROMOCIONES Y DESCUENTOS
-- ===============================================
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value decimal(10,2) NOT NULL,
  max_discount_amount decimal(10,2),
  min_trip_amount decimal(10,2) DEFAULT 0,
  
  usage_limit integer, -- Límite total de usos
  usage_count integer DEFAULT 0,
  user_usage_limit integer DEFAULT 1, -- Límite por usuario
  
  valid_from timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,
  
  applicable_services text[] DEFAULT ARRAY['toAirport', 'fromAirport', 'intercity'],
  applicable_vehicles text[] DEFAULT ARRAY['taxi', 'suv'],
  
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- USO DE PROMOCIONES
-- ===============================================
CREATE TABLE IF NOT EXISTS promotion_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid REFERENCES promotions(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  discount_applied decimal(10,2) NOT NULL,
  used_at timestamptz DEFAULT now(),
  
  UNIQUE(promotion_id, user_id, booking_id)
);

-- ===============================================
-- SOPORTE Y TICKETS
-- ===============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  booking_id uuid REFERENCES bookings(id),
  
  subject text NOT NULL,
  description text NOT NULL,
  category text NOT NULL, -- 'booking', 'payment', 'technical', 'complaint', 'suggestion'
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
  
  assigned_to uuid REFERENCES auth.users(id), -- Staff member
  resolution_notes text,
  resolved_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- CONFIGURACIÓN DEL SISTEMA
-- ===============================================
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general',
  is_public boolean DEFAULT false, -- Si se puede acceder desde el frontend
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===============================================
-- ÍNDICES PARA PERFORMANCE
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_datetime ON bookings(pickup_datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_location ON bookings USING GIST (pickup_location);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_location ON drivers USING GIST (current_location);

CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_id ON reviews(reviewed_id);

-- ===============================================
-- FUNCIONES Y TRIGGERS
-- ===============================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar código de confirmación
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := 'VA' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_booking_confirmation_code 
  BEFORE INSERT ON bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION generate_confirmation_code();

-- Función para actualizar rating del conductor
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE drivers 
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM reviews r
    JOIN bookings b ON r.booking_id = b.id
    WHERE b.driver_id = (
      SELECT driver_id FROM bookings WHERE id = NEW.booking_id
    )
    AND r.reviewer_type = 'passenger'
  )
  WHERE id = (
    SELECT driver_id FROM bookings WHERE id = NEW.booking_id
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_driver_rating_trigger 
  AFTER INSERT OR UPDATE ON reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION update_driver_rating();

-- ===============================================
-- ROW LEVEL SECURITY
-- ===============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Políticas para bookings
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT TO authenticated 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM drivers WHERE id = driver_id));

CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM drivers WHERE id = driver_id));

-- Políticas para drivers (solo conductores aprobados pueden ver/modificar)
CREATE POLICY "Drivers can view their own data" ON drivers FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Drivers can update their own data" ON drivers FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

-- Políticas para notificaciones
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

-- ===============================================
-- DATOS INICIALES
-- ===============================================

-- Configuraciones del sistema
INSERT INTO system_settings (key, value, description, category, is_public) VALUES
('platform_name', '"VoyAlAeropuerto"', 'Nombre de la plataforma', 'general', true),
('currency', '"CLP"', 'Moneda principal', 'general', true),
('default_language', '"es"', 'Idioma por defecto', 'general', true),
('booking_cancellation_window', '2', 'Horas antes del viaje para cancelar gratis', 'booking', true),
('platform_fee_percentage', '10', 'Porcentaje de comisión de la plataforma', 'financial', false),
('max_advance_booking_days', '90', 'Máximo días para reservar con anticipación', 'booking', true),
('support_email', '"support@voyalaeropuerto.com"', 'Email de soporte', 'contact', true),
('support_phone', '"+56912345678"', 'Teléfono de soporte', 'contact', true),
('terms_url', '"/terminos"', 'URL de términos y condiciones', 'legal', true),
('privacy_url', '"/privacidad"', 'URL de política de privacidad', 'legal', true);

-- Promoción de bienvenida
INSERT INTO promotions (code, name, description, discount_type, discount_value, max_discount_amount, usage_limit, valid_from, valid_until) VALUES
('BIENVENIDO2025', 'Descuento de Bienvenida', 'Obtén 20% de descuento en tu primer viaje', 'percentage', 20.00, 5000.00, 1000, now(), now() + interval '1 year');

COMMIT;
