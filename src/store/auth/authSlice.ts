import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, { axiosWithToken } from '../../api/axiosInstance';
import { LoginCredentials } from '../../types/auth';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ✅ Safe parsing of localStorage JSON value
const safeParse = (value: string | null) => {
  try {
    if (!value || value === 'undefined') return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const storedUser = safeParse(localStorage.getItem('adminInfo'));

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,
};

// ✅ Login action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin-auth/login', credentials);
      if (response.data.status) {
        const { access_token, admin_info } = response.data.data;
        localStorage.setItem('adminToken', access_token);
        localStorage.setItem('adminInfo', JSON.stringify(admin_info));
        return admin_info;
      }
      return rejectWithValue(response.data.message || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken(); // ✅ CALL the function
      const response = await axios.get('/admin-auth/check-token');
      if(response.data.status==false){
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        window.location.href = '/admin/login'; // Redirect to login
        return rejectWithValue('Unauthorized'); 
      }
      // const user = response.data.user;
      // localStorage.setItem('adminInfo', JSON.stringify(user));
      
      // return user;
    } catch (error: any) {
     
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      return rejectWithValue('Unauthorized');
    }
  }
);

// ✅ Logout action
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
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
