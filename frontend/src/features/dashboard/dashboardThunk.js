import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats, getEarningData, getDashboardTable } from '../../services/dashboardService';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const [stats, chart, tableData] = await Promise.all([
        getDashboardStats(),
        getEarningData(),
        getDashboardTable()
      ]);
      return { stats, chart, tableData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);