import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginCredentials } from '../../types/auth';
import axiosInstance from '../../api/axiosInstance';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem('adminInfo');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin-auth/login', credentials);
      if (response.data.status) {
        localStorage.setItem('adminToken', response.data.data.access_token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.data.admin_info));
        return response.data.data.admin_info;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const token = localStorage.getItem('adminToken');
  const userStr = localStorage.getItem('adminInfo');
  if (token && userStr) {
    return JSON.parse(userStr);
  }
  return null;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutSuccess: (state) => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
  },
});

export const { logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
