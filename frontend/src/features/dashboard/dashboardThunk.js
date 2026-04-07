import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats, getEarningData, getDashboardTable } from '../../services/dashboardService';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const role = auth?.user?.role;

      const [stats, tableData] = await Promise.all([
        getDashboardStats(),
        getDashboardTable()
      ]);

      let chart = null;
      if (role === 'Farmer') {
        try {
          chart = await getEarningData();
        } catch (e) {
          console.warn('Could not fetch earnings chart:', e.message);
        }
      }

      return { stats, chart, tableData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);