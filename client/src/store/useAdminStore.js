import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import API_URL, { HEALTHCHECK_URL } from '../config/api';

const api = axios.create({
  baseURL: API_URL,
});

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || fallbackMessage;

const useAdminStore = create(
  persist(
    (set, get) => ({
      adminToken: null,
      bookings: [],
      analytics: {
        total: 0,
        pending: 0,
        accept: 0,
        reject: 0,
        completed: 0,
      },
      isLoading: false,
      error: null,
      health: {
        status: 'idle',
        uptime: null,
        checkedAt: null,
        message: null,
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/admin/login', { email, password });
          set({ adminToken: res.data.token, isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          const message = getErrorMessage(error, 'Login failed');
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      logout: () => {
        set({
          adminToken: null,
          bookings: [],
          analytics: {
            total: 0,
            pending: 0,
            accept: 0,
            reject: 0,
            completed: 0,
          },
          isLoading: false,
          error: null,
        });
      },

      checkHealth: async () => {
        set((state) => ({
          health: {
            ...state.health,
            status: 'checking',
            message: null,
          },
        }));

        try {
          const res = await axios.get(HEALTHCHECK_URL);
          const checkedAt = new Date().toISOString();
          const isHealthy = res.data?.status === 'ok';

          set({
            health: {
              status: isHealthy ? 'ok' : 'error',
              uptime: typeof res.data?.uptime === 'number' ? res.data.uptime : null,
              checkedAt,
              message: isHealthy ? 'Backend reachable' : 'Backend health check returned an unexpected response',
            },
          });

          return { success: isHealthy, data: res.data };
        } catch (error) {
          const message = getErrorMessage(error, 'Backend health check failed');
          set({
            health: {
              status: 'error',
              uptime: null,
              checkedAt: new Date().toISOString(),
              message,
            },
          });
          return { success: false, message };
        }
      },

      getAuthConfig: () => {
        const token = get().adminToken;
        return token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : null;
      },

      handleAuthFailure: (error, fallbackMessage) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          get().logout();
          return 'Session expired. Please log in again.';
        }

        return getErrorMessage(error, fallbackMessage);
      },

      fetchBookings: async () => {
        const authConfig = get().getAuthConfig();
        if (!authConfig) return { success: false, message: 'Not authenticated' };

        set({ isLoading: true, error: null });
        try {
          const res = await api.get('/admin/bookings', authConfig);
          set({ bookings: res.data.bookings || [], isLoading: false });
          return { success: true, bookings: res.data.bookings || [] };
        } catch (error) {
          const message = get().handleAuthFailure(error, 'Failed to fetch bookings');
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      fetchAnalytics: async () => {
        const authConfig = get().getAuthConfig();
        if (!authConfig) return { success: false, message: 'Not authenticated' };

        try {
          const res = await api.get('/admin/analytics', authConfig);
          set({ analytics: res.data });
          return { success: true, analytics: res.data };
        } catch (error) {
          const message = get().handleAuthFailure(error, 'Failed to fetch analytics');
          set({ error: message });
          return { success: false, message };
        }
      },

      updateBookingStatus: async (id, newStatus, remarks, sales, profit) => {
        const authConfig = get().getAuthConfig();
        if (!authConfig) return { success: false, message: 'Not authenticated' };

        set({ isLoading: true, error: null });
        try {
          await api.patch(
            `/admin/bookings/${id}/status`,
            { status: newStatus, remarks, ...(sales !== undefined && { sales }), ...(profit !== undefined && { profit }) },
            authConfig
          );

          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === id
                ? { 
                    ...booking, 
                    Status: newStatus, 
                    ...(remarks !== undefined && { Remarks: remarks }),
                    ...(sales !== undefined && { Sales: sales }),
                    ...(profit !== undefined && { Profit: profit })
                  }
                : booking
            ),
            isLoading: false,
          }));

          await get().fetchAnalytics();

          return { success: true };
        } catch (error) {
          const message = get().handleAuthFailure(error, 'Failed to update status');
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },
    }),
    {
      name: 'drriftaire-admin-auth',
      partialize: (state) => ({ adminToken: state.adminToken }),
    }
  )
);

export default useAdminStore;
