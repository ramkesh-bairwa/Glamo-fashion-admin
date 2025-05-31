import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Brand } from '../../types/brand';

// Sample initial data
const sampleBrands: Brand[] = [
  { 
    id: '1', 
    name: 'Apple', 
    description: 'Technology company that designs, develops, and sells consumer electronics, computer software, and online services', 
    website: 'https://www.apple.com',
    logo: 'https://images.pexels.com/photos/1482061/pexels-photo-1482061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    id: '2', 
    name: 'Samsung', 
    description: 'South Korean multinational manufacturing conglomerate', 
    website: 'https://www.samsung.com',
    logo: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    id: '3', 
    name: 'Nike', 
    description: 'American multinational corporation engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services', 
    website: 'https://www.nike.com',
    logo: 'https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    id: '4', 
    name: 'Sony', 
    description: 'Japanese multinational conglomerate corporation', 
    website: 'https://www.sony.com',
    logo: 'https://images.pexels.com/photos/1482061/pexels-photo-1482061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    id: '5', 
    name: 'Microsoft', 
    description: 'American multinational technology corporation', 
    website: 'https://www.microsoft.com',
    logo: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
];

interface BrandState {
  brands: Brand[];
  selectedBrand: Brand | null;
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: sampleBrands,
  selectedBrand: null,
  loading: false,
  error: null,
};

// In a real app, these would be API calls
export const fetchBrands = createAsyncThunk('brands/fetchBrands', async () => {
  // Simulate API call
  return new Promise<Brand[]>((resolve) => {
    setTimeout(() => {
      resolve(sampleBrands);
    }, 500);
  });
});

export const addBrand = createAsyncThunk(
  'brands/addBrand',
  async (brand: Omit<Brand, 'id'>) => {
    // Simulate API call
    return new Promise<Brand>((resolve) => {
      setTimeout(() => {
        const newBrand = {
          ...brand,
          id: Math.random().toString(36).substring(2, 9),
        };
        resolve(newBrand);
      }, 500);
    });
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async (brand: Brand) => {
    // Simulate API call
    return new Promise<Brand>((resolve) => {
      setTimeout(() => {
        resolve(brand);
      }, 500);
    });
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id: string) => {
    // Simulate API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(id);
      }, 500);
    });
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setSelectedBrand: (state, action: PayloadAction<Brand | null>) => {
      state.selectedBrand = action.payload;
    },
    clearBrandError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brands';
      })
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
        toast.success('Brand added successfully');
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add brand';
        toast.error(state.error);
      })
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex((brand) => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        state.selectedBrand = null;
        toast.success('Brand updated successfully');
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update brand';
        toast.error(state.error);
      })
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter((brand) => brand.id !== action.payload);
        toast.success('Brand deleted successfully');
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete brand';
        toast.error(state.error);
      });
  },
});

export const { setSelectedBrand, clearBrandError } = brandSlice.actions;
export default brandSlice.reducer;