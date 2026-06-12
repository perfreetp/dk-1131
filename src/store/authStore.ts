import { create } from 'zustand';
import { User, AuthStatus } from '@/types';
import { mockUsers } from '@/data/mockData';

interface AuthStore {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, username: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: 'loading',
  login: async (email) => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      set({ user, status: 'authenticated' });
    } else {
      throw new Error('邮箱或密码错误');
    }
  },
  logout: () => {
    set({ user: null, status: 'unauthenticated' });
  },
  register: async (email, _password, username) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      is_creator: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set({ user: newUser, status: 'authenticated' });
  },
}));
