import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Brand } from '../../types/brand';
import axiosInstance, { axiosWithToken } from '../../api/axiosInstance';


interface BrandState {
  brands: Brand[];
  selectedBrand: Brand | null;
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  selectedBrand: null,
  loading: false,
  error: null,
};

// In a real app, these would be API calls
export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken();
      const url = `${axios.defaults.baseURL}/brands`;
      console.log(url);
      const response = await axios.get(url); // 
      
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data.data)) {
        return response.data.data.data;
      } else {
        return rejectWithValue('Invalid brands format');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBrand = createAsyncThunk(
  'brands/create',
  async (brand: any) => {
    const axios = axiosWithToken();
    const url = `${axios.defaults.baseURL}/brands/create`;
    const response = await axios.post(url, {title:brand.title,content:brand.content,icon:brand.icon}); // Send JSON directly
    return response.data;
  }
);


export const updateBrand = createAsyncThunk(
  'brands/edit',
  async (brand: Brand) => {
    const axios = axiosWithToken();
    const url = `${axios.defaults.baseURL}/brands/edit/${brand.id}`;

    const payload = {
      title: brand.title,
      content: brand.content,
      icon: brand.icon,
      slug: brand.slug,
    };

    const response = await axios.patch(url, payload); // Or `post` if that's what your backend uses
    return response.data;
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
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload; // ✅ Must be an array
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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