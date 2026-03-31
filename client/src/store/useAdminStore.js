import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import API_URL from '../config/api';

const useAdminStore = create(
  persist(
    (set, get) => ({
      // State Properties
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

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_URL}/admin/login`, { email, password });
          set({ adminToken: res.data.token, isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      logout: () => {
        // Clears the token and resets the dashboard state locally
        set({ adminToken: null, bookings: [], error: null });
      },

      fetchBookings: async () => {
        const token = get().adminToken;
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
          const res = await axios.get(`${API_URL}/admin/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ bookings: res.data.bookings || [], isLoading: false });
        } catch (error) {
          // If the JWT expired, automatically kick them out
          if (error.response?.status === 401 || error.response?.status === 403) {
            get().logout();
          }
          set({ isLoading: false, error: 'Failed to fetch bookings' });
        }
      },

      fetchAnalytics: async () => {
        const token = get().adminToken;
        if (!token) return;

        try {
          const res = await axios.get(`${API_URL}/admin/analytics`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ analytics: res.data });
        } catch (error) {
          console.error('Failed to fetch analytics', error);
        }
      },

      updateBookingStatus: async (id, newStatus, remarks) => {
        const token = get().adminToken;
        if (!token) return { success: false, message: 'Not authenticated' };

        set({ isLoading: true, error: null });
        try {
          await axios.patch(`${API_URL}/admin/bookings/${id}/status`,
            { status: newStatus, remarks: remarks },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Optimistically update the UI so it feels instantaneous
          set((state) => ({
            bookings: state.bookings.map(b =>
              b.id === id ? { ...b, Status: newStatus, ...(remarks !== undefined && { Remarks: remarks }) } : b
            ),
            isLoading: false
          }));

          // Re-sync analytics counts immediately!
          await get().fetchAnalytics();

          return { success: true };
        } catch (error) {
          // If JWT error, handle log out
          if (error.response?.status === 401 || error.response?.status === 403) {
            get().logout();
          }
          const message = error.response?.data?.message || 'Failed to update status';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'drriftaire-admin-auth', // Key name in localStorage
      partialize: (state) => ({ adminToken: state.adminToken }),
    }
  )
);

export default useAdminStore;
