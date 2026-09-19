import { User, UserRole } from '../types';
import { apiFetch, isMockMode } from './client';
import { MockAuth, setItem } from '../mock/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface LoginParams {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterParams {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
}

const mapSupabaseUser = (user: any): User | null => {
  if (!user) return null;

  const role = (user.user_metadata?.role as UserRole) || 'PATIENT';

  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email,
    role,
    phone: user.user_metadata?.phone,
    avatarUrl: user.user_metadata?.avatar_url,
    created_at: user.created_at,
  };
};

export const authApi = {
  login: async (credentials: LoginParams): Promise<{ user: User; token: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password || 'password123',
      });

      if (error) throw new Error(error.message);
      if (!data.user || !data.session) throw new Error('Unable to sign in');

      const mappedUser = mapSupabaseUser(data.user);
      if (!mappedUser) throw new Error('No user returned from Supabase');

      return { user: mappedUser, token: data.session.access_token };
    }

    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      const users = MockAuth.getUsers();
      let matchedUser = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

      if (!matchedUser && credentials.role) {
        matchedUser = users.find(u => u.role === credentials.role);
      }
      if (!matchedUser) {
        matchedUser = users[0];
      }

      MockAuth.setCurrentUser(matchedUser);
      const token = `mock_jwt_token_${matchedUser.id}_${Date.now()}`;
      localStorage.setItem('careflow_auth_token', token);
      return { user: matchedUser, token };
    }

    return apiFetch<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: RegisterParams): Promise<{ user: User; token: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || 'Password123!',
        options: {
          data: {
            full_name: data.name,
            role: data.role,
            phone: data.phone || '',
          },
        },
      });

      if (error) throw new Error(error.message);
      if (!signUpData.user || !signUpData.session) {
        throw new Error('Account created but no session was returned');
      }

      const mappedUser = mapSupabaseUser(signUpData.user);
      if (!mappedUser) throw new Error('No user returned from Supabase');

      return { user: mappedUser, token: signUpData.session.access_token };
    }

    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 500));
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        created_at: new Date().toISOString(),
      };
      MockAuth.addUser(newUser);
      MockAuth.setCurrentUser(newUser);
      const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;
      localStorage.setItem('careflow_auth_token', token);
      return { user: newUser, token };
    }

    return apiFetch<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      localStorage.removeItem('careflow_auth_token');
      return;
    }

    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 200));
      MockAuth.setCurrentUser(null);
      localStorage.removeItem('careflow_auth_token');
      return;
    }

    await apiFetch('/auth/logout', { method: 'POST' });
    localStorage.removeItem('careflow_auth_token');
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return mapSupabaseUser(user);
    }

    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 200));
      return MockAuth.getCurrentUser();
    }

    try {
      return await apiFetch<User>('/auth/me');
    } catch {
      return null;
    }
  },

  updateProfile: async (updates: { name?: string; phone?: string }): Promise<User> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      const current = MockAuth.getCurrentUser();
      if (!current) throw new Error('Not authenticated');
      const updated: User = { ...current, ...updates };
      const users = MockAuth.getUsers();
      const idx = users.findIndex(u => u.id === current.id);
      if (idx !== -1) {
        users[idx] = updated;
        setItem('careflow_users', users);
      }
      MockAuth.setCurrentUser(updated);
      return updated;
    }
    return apiFetch<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};
