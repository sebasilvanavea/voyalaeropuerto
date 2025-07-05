import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  public userSubject = new BehaviorSubject<any>(null); // changed to public
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        this.userSubject.next(session.user);
      } else {
        this.userSubject.next(null);
      }
    });

    this.loadUser();
  }

  private async loadUser() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.userSubject.next(session?.user || null);
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async register(email: string, password: string, metadata: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  isAuthenticated() {
    return this.userSubject.value !== null;
  }

  getCurrentUser() {
    return this.userSubject.value;
  }
}