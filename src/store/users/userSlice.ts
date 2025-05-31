import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types/user';

// Sample initial data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    status: 'active',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer',
    status: 'active',
    createdAt: '2023-02-20T14:45:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'customer',
    status: 'inactive',
    createdAt: '2023-01-05T09:15:00Z',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'customer',
    status: 'active',
    createdAt: '2023-03-10T16:20:00Z',
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2022-12-01T08:00:00Z',
  },
];

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: sampleUsers,
  loading: false,
  error: null,
};

// In a real app, this would be an API call
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  // Simulate API call
  return new Promise<User[]>((resolve) => {
    setTimeout(() => {
      resolve(sampleUsers);
    }, 500);
  });
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default userSlice.reducer;