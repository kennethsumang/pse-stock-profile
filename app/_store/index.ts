import { create } from 'zustand';
import { AuthUser } from '../_types/auth';

interface AuthState {
  user: AuthUser|null;
  loginUser: (user: AuthUser) => void;
  logoutUser: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loginUser: (user: AuthUser) => set(() => ({ user })),
  logoutUser: () => set(() => ({ user: null }))
}));

export {
  useAuthStore,
}