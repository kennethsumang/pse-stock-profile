import { create } from "zustand";
import { AuthUser } from "../_types/auth";
import { Company, GetCompanyResponse } from "../_types/companies";
import { getCurrentDomain } from "../_utils/http.library";

interface AuthState {
  user: AuthUser | null;
  loginUser: (user: AuthUser) => void;
  logoutUser: () => void;
}

interface CompanyState {
  companies: Company[];
  count: number;
  isFetching: boolean;
  fetchAllCompanies: () => void;
}

interface TransactionStore {
  key: number;
  increment: () => void;
}

interface DividendStore {
  key: number;
  increment: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loginUser: (user: AuthUser) => set(() => ({ user })),
  logoutUser: () => set(() => ({ user: null })),
}));

const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  count: 0,
  isFetching: false,
  fetchAllCompanies: async () => {
    try {
      set({ isFetching: true });
      const url = new URL(`${getCurrentDomain()}/api/companies`);
      url.searchParams.append("limit", "1000"); // fetch all companies
      const response = await fetch(url.toString(), { method: "GET" });
      const data = (await response.json()) as GetCompanyResponse;
      set({ companies: data.data });
      set({ count: data.total });
      set({ isFetching: false });
    } catch (e) {
      console.error(e);
      set({ isFetching: false });
    }
  },
}));

const useTransactionStore = create<TransactionStore>((set) => ({
  key: 0,
  increment: () => set((state) => ({ key: state.key + 1 })),
}));

const useDividendStore = create<DividendStore>((set) => ({
  key: 0,
  increment: () => set((state) => ({ key: state.key + 1 })),
}));

export { useAuthStore, useCompanyStore, useTransactionStore, useDividendStore };
