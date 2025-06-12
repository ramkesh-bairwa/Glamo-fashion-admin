import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Category } from '../../types/category';
import { axiosWithToken } from '../../api/axiosInstance';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

// In a real app, these would be API calls
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken();
      const url = `${axios.defaults.baseURL}/categories`;
      console.log('📦 Fetching categories from:', url);
      const response = await axios.get(url);

      if (Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data.data?.data)) {
        return response.data.data.data;
      } else {
        return rejectWithValue('Invalid categories format');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category: Omit<Category, 'id'>, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken(); // your axios instance
      const url = `${axios.defaults.baseURL}/categories/create`; // assuming baseURL is already set to /api/admin
      const response = await axios.post(url, category);

      if (response.data.status) {
        return response.data.data; // adjust based on actual response structure
      } else {
        return rejectWithValue(response.data.message || 'Failed to add category');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'API error');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category: Category, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken();
      const { id, title, content, slug } = category; // Only send editable fields
      const url = `${axios.defaults.baseURL}/categories/edit/${id}`;
      const response = await axios.patch(url, { title, content, slug });

      if (response.data.status) {
        return response.data.data; // return updated category
      } else {
        return rejectWithValue(response.data.message || 'Failed to update category');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'API error');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken();
      const url = `${axios.defaults.baseURL}/categories/delete/${id}`;
      const response = await axios.delete(url);

      if (response.data.status) {
        return id;
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete category');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'API error');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        toast.success('Category added successfully');
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add category';
        toast.error(state.error);
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.selectedCategory = null;
        toast.success('Category updated successfully');
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update category';
        toast.error(state.error);
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((cat) => cat.id !== action.payload);
        toast.success('Category deleted successfully');
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete category';
        toast.error(state.error);
      });
  },
});

export const { setSelectedCategory, clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;