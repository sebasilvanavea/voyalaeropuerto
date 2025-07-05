/*
  # Crear tablas iniciales para la aplicación

  1. Nuevas Tablas
    - `bookings`: Almacena las reservas de traslados
      - `id` (uuid, clave primaria)
      - `user_id` (uuid, referencia a auth.users)
      - `service_type` (text, tipo de servicio)
      - `date_time` (timestamptz, fecha y hora del servicio)
      - `address` (text, dirección)
      - `passengers` (int, número de pasajeros)
      - `status` (text, estado de la reserva)
      - `created_at` (timestamptz, fecha de creación)

    - `contact_messages`: Almacena los mensajes de contacto
      - `id` (uuid, clave primaria)
      - `name` (text, nombre del remitente)
      - `email` (text, correo del remitente)
      - `phone` (text, teléfono del remitente)
      - `message` (text, contenido del mensaje)
      - `status` (text, estado del mensaje)
      - `created_at` (timestamptz, fecha de creación)

  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Políticas para gestionar acceso a las reservas
    - Políticas para gestionar acceso a los mensajes de contacto
*/

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  service_type text NOT NULL,
  date_time timestamptz NOT NULL,
  address text NOT NULL,
  passengers int NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT passengers_check CHECK (passengers >= 1 AND passengers <= 10)
);

-- Crear tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para contact_messages
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Índices para mejorar el rendimiento
CREATE INDEX bookings_user_id_idx ON bookings(user_id);
CREATE INDEX bookings_date_time_idx ON bookings(date_time);
CREATE INDEX contact_messages_created_at_idx ON contact_messages(created_at);