import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Category } from '../../types/category';

// Sample initial data
const sampleCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets', slug: 'electronics' },
  { id: '2', name: 'Clothing', description: 'Fashion items and apparel', slug: 'clothing' },
  { id: '3', name: 'Home & Kitchen', description: 'Home appliances and kitchenware', slug: 'home-kitchen' },
  { id: '4', name: 'Books', description: 'Books, e-books, and audiobooks', slug: 'books' },
  { id: '5', name: 'Toys & Games', description: 'Toys, games, and entertainment items', slug: 'toys-games' },
];

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: sampleCategories,
  selectedCategory: null,
  loading: false,
  error: null,
};

// In a real app, these would be API calls
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  // Simulate API call
  return new Promise<Category[]>((resolve) => {
    setTimeout(() => {
      resolve(sampleCategories);
    }, 500);
  });
});

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category: Omit<Category, 'id'>) => {
    // Simulate API call
    return new Promise<Category>((resolve) => {
      setTimeout(() => {
        const newCategory = {
          ...category,
          id: Math.random().toString(36).substring(2, 9),
        };
        resolve(newCategory);
      }, 500);
    });
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category: Category) => {
    // Simulate API call
    return new Promise<Category>((resolve) => {
      setTimeout(() => {
        resolve(category);
      }, 500);
    });
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string) => {
    // Simulate API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(id);
      }, 500);
    });
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