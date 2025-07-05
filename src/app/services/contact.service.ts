import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async sendMessage(message: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) {
    const { data, error } = await this.supabase
      .from('contact_messages')
      .insert([{ ...message, status: 'new' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}