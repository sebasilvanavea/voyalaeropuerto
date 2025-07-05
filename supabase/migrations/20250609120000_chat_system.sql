-- Chat System Migration
-- Creates tables for real-time chat functionality between users and drivers

-- Chat Rooms Table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    unread_count_user INTEGER DEFAULT 0,
    unread_count_driver INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(booking_id)
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'driver', 'support')),
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location', 'system')),
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Storage Bucket for attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Chat Indexes for performance
CREATE INDEX idx_chat_rooms_booking_id ON chat_rooms(booking_id);
CREATE INDEX idx_chat_rooms_user_id ON chat_rooms(user_id);
CREATE INDEX idx_chat_rooms_driver_id ON chat_rooms(driver_id);
CREATE INDEX idx_chat_rooms_status ON chat_rooms(status);
CREATE INDEX idx_chat_rooms_updated_at ON chat_rooms(updated_at DESC);

CREATE INDEX idx_chat_messages_booking_id ON chat_messages(booking_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_is_read ON chat_messages(is_read);
CREATE INDEX idx_chat_messages_sender_type ON chat_messages(sender_type);

-- RLS Policies for chat_rooms
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

-- Users can see chat rooms where they are either the user or driver
CREATE POLICY "Users can view their chat rooms" ON chat_rooms
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() = driver_id OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users can update chat rooms where they are either the user or driver
CREATE POLICY "Users can update their chat rooms" ON chat_rooms
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.uid() = driver_id OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only system can insert chat rooms (created automatically with bookings)
CREATE POLICY "System can insert chat rooms" ON chat_rooms
    FOR INSERT WITH CHECK (true);

-- RLS Policies for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can see messages in chat rooms where they are participants
CREATE POLICY "Users can view chat messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_rooms cr 
            WHERE cr.booking_id = chat_messages.booking_id 
            AND (cr.user_id = auth.uid() OR cr.driver_id = auth.uid())
        ) OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users can insert messages in chat rooms where they are participants
CREATE POLICY "Users can send chat messages" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM chat_rooms cr 
            WHERE cr.booking_id = chat_messages.booking_id 
            AND (cr.user_id = auth.uid() OR cr.driver_id = auth.uid())
        )
    );

-- Users can update their own messages (for read status)
CREATE POLICY "Users can update message read status" ON chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM chat_rooms cr 
            WHERE cr.booking_id = chat_messages.booking_id 
            AND (cr.user_id = auth.uid() OR cr.driver_id = auth.uid())
        )
    );

-- Storage policies for chat attachments
CREATE POLICY "Users can upload chat attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'chat-attachments' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can view chat attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'chat-attachments' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their chat attachments" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'chat-attachments' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their chat attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'chat-attachments' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Function to update chat room's last message
CREATE OR REPLACE FUNCTION update_chat_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_rooms 
    SET 
        last_message = NEW.message,
        last_message_at = NEW.created_at,
        updated_at = NOW(),
        unread_count_user = CASE 
            WHEN NEW.sender_type = 'driver' THEN unread_count_user + 1 
            ELSE unread_count_user 
        END,
        unread_count_driver = CASE 
            WHEN NEW.sender_type = 'user' THEN unread_count_driver + 1 
            ELSE unread_count_driver 
        END
    WHERE booking_id = NEW.booking_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update chat room when new message is sent
DROP TRIGGER IF EXISTS update_chat_room_trigger ON chat_messages;
CREATE TRIGGER update_chat_room_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_room_last_message();

-- Function to reset unread count when messages are marked as read
CREATE OR REPLACE FUNCTION reset_unread_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
        UPDATE chat_rooms 
        SET 
            unread_count_user = CASE 
                WHEN NEW.sender_type = 'driver' THEN GREATEST(0, unread_count_user - 1)
                ELSE unread_count_user 
            END,
            unread_count_driver = CASE 
                WHEN NEW.sender_type = 'user' THEN GREATEST(0, unread_count_driver - 1)
                ELSE unread_count_driver 
            END,
            updated_at = NOW()
        WHERE booking_id = NEW.booking_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update unread count when message is marked as read
DROP TRIGGER IF EXISTS reset_unread_count_trigger ON chat_messages;
CREATE TRIGGER reset_unread_count_trigger
    AFTER UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION reset_unread_count();

-- Function to automatically create chat room when booking is created
CREATE OR REPLACE FUNCTION create_chat_room_for_booking()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create chat room if booking has a driver assigned
    IF NEW.driver_id IS NOT NULL THEN
        INSERT INTO chat_rooms (booking_id, user_id, driver_id)
        VALUES (NEW.id, NEW.user_id, NEW.driver_id)
        ON CONFLICT (booking_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create chat room when driver is assigned to booking
DROP TRIGGER IF EXISTS create_chat_room_trigger ON bookings;
CREATE TRIGGER create_chat_room_trigger
    AFTER INSERT OR UPDATE OF driver_id ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION create_chat_room_for_booking();

-- Admin views for chat analytics
CREATE OR REPLACE VIEW chat_analytics AS
SELECT 
    DATE_TRUNC('day', cr.created_at) as date,
    COUNT(DISTINCT cr.id) as total_chat_rooms,
    COUNT(DISTINCT CASE WHEN cr.status = 'active' THEN cr.id END) as active_rooms,
    COUNT(cm.id) as total_messages,
    AVG(
        CASE WHEN cr.last_message_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (cr.last_message_at - cr.created_at))/3600.0 
        END
    ) as avg_conversation_duration_hours,
    COUNT(DISTINCT cm.sender_id) as active_users
FROM chat_rooms cr
LEFT JOIN chat_messages cm ON cm.booking_id = cr.booking_id
GROUP BY DATE_TRUNC('day', cr.created_at)
ORDER BY date DESC;

-- Sample initial data for testing
INSERT INTO user_profiles (id, full_name, email, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'Support Agent', 'support@voyalaeropuerto.com', 'admin')
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE chat_rooms IS 'Chat rooms for each booking - links users and drivers';
COMMENT ON TABLE chat_messages IS 'Individual messages within chat rooms';
COMMENT ON VIEW chat_analytics IS 'Analytics view for chat system metrics';
