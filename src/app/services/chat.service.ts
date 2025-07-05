import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  sender_type: 'user' | 'driver' | 'support';
  message: string;
  message_type: 'text' | 'image' | 'location' | 'system';
  metadata?: any;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export interface ChatRoom {
  id: string;
  booking_id: string;
  user_id: string;
  driver_id: string;
  status: 'active' | 'closed' | 'archived';
  last_message?: string;
  last_message_at?: string;
  unread_count_user: number;
  unread_count_driver: number;
  created_at: string;
  updated_at: string;
}

export interface TypingIndicator {
  room_id: string;
  user_id: string;
  user_name: string;
  is_typing: boolean;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase: SupabaseClient;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private typingSubject = new BehaviorSubject<TypingIndicator[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  
  public messages$ = this.messagesSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private currentRoomId: string | null = null;
  private currentUserId: string | null = null;
  private typingTimeout: any = null;
  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.setupRealtimeSubscriptions();
  }

  private setupRealtimeSubscriptions() {
    // Subscribe to message changes
    this.supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        this.handleMessageChange(payload);
      })
      .subscribe();

    // Subscribe to typing indicators
    this.supabase
      .channel('typing_indicators')
      .on('presence', { event: 'sync' }, () => {
        this.updateTypingIndicators();
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.updateTypingIndicators();
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.updateTypingIndicators();
      })
      .subscribe();
  }

  private handleMessageChange(payload: any) {
    if (payload.eventType === 'INSERT' && payload.new.booking_id === this.currentRoomId) {
      const newMessage = payload.new as ChatMessage;
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, newMessage]);
      
      // Mark as read if it's not from the current user
      if (newMessage.sender_id !== this.currentUserId && !newMessage.is_read) {
        this.markMessageAsRead(newMessage.id);
      }
    }
  }

  private updateTypingIndicators() {
    const channel = this.supabase.channel('typing_indicators');
    const presenceState = channel.presenceState();
    const typingUsers: TypingIndicator[] = [];

    Object.values(presenceState).forEach((presences: any) => {
      presences.forEach((presence: any) => {
        if (presence.room_id === this.currentRoomId && 
            presence.user_id !== this.currentUserId && 
            presence.is_typing) {
          typingUsers.push(presence);
        }
      });
    });

    this.typingSubject.next(typingUsers);
  }

  async initializeChat(bookingId: string, userId: string): Promise<ChatRoom> {
    this.currentRoomId = bookingId;
    this.currentUserId = userId;

    // Get or create chat room
    const { data: existingRoom } = await this.supabase
      .from('chat_rooms')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (existingRoom) {
      await this.loadMessages(bookingId);
      await this.updateUnreadCount(userId, bookingId);
      return existingRoom;
    }

    // Create new room if it doesn't exist
    const { data: booking } = await this.supabase
      .from('bookings')
      .select('user_id, driver_id')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      throw new Error('Booking not found');
    }

    const { data: newRoom, error } = await this.supabase
      .from('chat_rooms')
      .insert({
        booking_id: bookingId,
        user_id: booking.user_id,
        driver_id: booking.driver_id,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    await this.loadMessages(bookingId);
    return newRoom;
  }

  async loadMessages(roomId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await this.supabase
      .from('chat_messages')
      .select(`
        *,
        sender:user_profiles!chat_messages_sender_id_fkey(
          full_name,
          avatar_url
        )
      `)
      .eq('booking_id', roomId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const formattedMessages = messages.map(msg => ({
      ...msg,
      sender_name: msg.sender?.full_name || 'Usuario',
      sender_avatar: msg.sender?.avatar_url
    }));

    this.messagesSubject.next(formattedMessages);
    return formattedMessages;
  }

  async sendMessage(
    bookingId: string, 
    senderId: string, 
    senderType: 'user' | 'driver' | 'support',
    message: string, 
    messageType: 'text' | 'image' | 'location' = 'text',
    metadata?: any
  ): Promise<ChatMessage> {
    const { data: newMessage, error } = await this.supabase
      .from('chat_messages')
      .insert({
        booking_id: bookingId,
        sender_id: senderId,
        sender_type: senderType,
        message,
        message_type: messageType,
        metadata,
        is_read: false
      })
      .select(`
        *,
        sender:user_profiles!chat_messages_sender_id_fkey(
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    // Update chat room's last message
    await this.supabase
      .from('chat_rooms')
      .update({
        last_message: message,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId);

    const formattedMessage = {
      ...newMessage,
      sender_name: newMessage.sender?.full_name || 'Usuario',
      sender_avatar: newMessage.sender?.avatar_url
    };

    return formattedMessage;
  }

  async sendLocationMessage(
    bookingId: string, 
    senderId: string, 
    senderType: 'user' | 'driver',
    latitude: number, 
    longitude: number,
    address?: string
  ): Promise<ChatMessage> {
    const metadata = {
      latitude,
      longitude,
      address: address || `${latitude}, ${longitude}`
    };

    return this.sendMessage(
      bookingId, 
      senderId, 
      senderType, 
      `📍 Ubicación compartida: ${metadata.address}`, 
      'location', 
      metadata
    );
  }

  async uploadAndSendImage(
    bookingId: string, 
    senderId: string, 
    senderType: 'user' | 'driver',
    file: File
  ): Promise<ChatMessage> {
    // Upload image to Supabase Storage
    const fileName = `chat-images/${bookingId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('chat-attachments')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('chat-attachments')
      .getPublicUrl(fileName);

    const metadata = {
      filename: file.name,
      filesize: file.size,
      url: urlData.publicUrl
    };

    return this.sendMessage(
      bookingId, 
      senderId, 
      senderType, 
      '📷 Imagen compartida', 
      'image', 
      metadata
    );
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const { error } = await this.supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  }

  async markAllMessagesAsRead(bookingId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('booking_id', bookingId)
      .neq('sender_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    await this.updateUnreadCount(userId, bookingId);
  }

  private async updateUnreadCount(userId: string, bookingId?: string): Promise<void> {
    let query = this.supabase
      .from('chat_messages')
      .select('id', { count: 'exact' })
      .neq('sender_id', userId)
      .eq('is_read', false);

    if (bookingId) {
      query = query.eq('booking_id', bookingId);
    }

    const { count } = await query;
    this.unreadCountSubject.next(count || 0);
  }

  async getChatRooms(userId: string, userType: 'user' | 'driver'): Promise<ChatRoom[]> {
    const column = userType === 'user' ? 'user_id' : 'driver_id';
    
    const { data: rooms, error } = await this.supabase
      .from('chat_rooms')
      .select(`
        *,
        booking:bookings(
          pickup_location,
          dropoff_location,
          scheduled_date,
          status
        ),
        user:user_profiles!chat_rooms_user_id_fkey(
          full_name,
          avatar_url
        ),
        driver:drivers!chat_rooms_driver_id_fkey(
          user_id,
          user_profiles(full_name, avatar_url)
        )
      `)
      .eq(column, userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return rooms;
  }

  async startTyping(roomId: string, userId: string, userName: string): Promise<void> {
    const channel = this.supabase.channel('typing_indicators');
    
    await channel.track({
      room_id: roomId,
      user_id: userId,
      user_name: userName,
      is_typing: true,
      timestamp: new Date().toISOString()
    });

    // Clear previous timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Auto-stop typing after 3 seconds
    this.typingTimeout = setTimeout(() => {
      this.stopTyping(roomId, userId, userName);
    }, 3000);
  }

  async stopTyping(roomId: string, userId: string, userName: string): Promise<void> {
    const channel = this.supabase.channel('typing_indicators');
    
    await channel.track({
      room_id: roomId,
      user_id: userId,
      user_name: userName,
      is_typing: false,
      timestamp: new Date().toISOString()
    });

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  async closeChatRoom(roomId: string): Promise<void> {
    const { error } = await this.supabase
      .from('chat_rooms')
      .update({ 
        status: 'closed',
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId);

    if (error) throw error;
  }

  async getChatHistory(bookingId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await this.supabase
      .from('chat_messages')
      .select(`
        *,
        sender:user_profiles!chat_messages_sender_id_fkey(
          full_name,
          avatar_url
        )
      `)
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return messages.map(msg => ({
      ...msg,
      sender_name: msg.sender?.full_name || 'Usuario',
      sender_avatar: msg.sender?.avatar_url
    }));
  }

  // Admin functions
  async getAdminChatRooms(filters?: {
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ChatRoom[]> {
    let query = this.supabase
      .from('chat_rooms')
      .select(`
        *,
        booking:bookings(
          pickup_location,
          dropoff_location,
          scheduled_date,
          status
        ),
        user:user_profiles!chat_rooms_user_id_fkey(
          full_name,
          email,
          avatar_url
        ),
        driver:drivers!chat_rooms_driver_id_fkey(
          user_id,
          user_profiles(full_name, email, avatar_url)
        )
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data: rooms, error } = await query.order('updated_at', { ascending: false });

    if (error) throw error;
    return rooms;
  }

  async sendSupportMessage(
    bookingId: string, 
    supportUserId: string, 
    message: string
  ): Promise<ChatMessage> {
    return this.sendMessage(bookingId, supportUserId, 'support', message);
  }

  disconnect(): void {
    this.currentRoomId = null;
    this.currentUserId = null;
    this.messagesSubject.next([]);
    this.typingSubject.next([]);
    this.unreadCountSubject.next(0);
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }
}
