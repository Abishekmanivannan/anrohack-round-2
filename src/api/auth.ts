import { User, UserRole } from '../types';
import { apiFetch, isMockMode } from './client';
import { MockAuth } from '../mock/storage';

export interface LoginParams {
  email: string;
  role?: UserRole;
}

export interface RegisterParams {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export const authApi = {
  login: async (credentials: LoginParams): Promise<{ user: User; token: string }> => {
    if (isMockMode()) {
      // Simulate API latency
      await new Promise(res => setTimeout(res, 400));
      const users = MockAuth.getUsers();
      let matchedUser = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      
      // If logging in by role or user not found, fallback to role default
      if (!matchedUser && credentials.role) {
        matchedUser = users.find(u => u.role === credentials.role);
      }
      if (!matchedUser) {
        matchedUser = users[0]; // fallback patient
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
};
