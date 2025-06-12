import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Product } from '../../types/product';
import axiosInstance, { axiosWithToken } from '../../api/axiosInstance';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken();
      const url = `${axios.defaults.baseURL}/affiliate-products`;
      console.log('📦 Fetching products from:', url);

      const response = await axios.get(url);

      const items = response?.data?.data?.items;

      if (Array.isArray(items)) {
        return items;
      }

      console.error('❌ Unexpected response format:', response.data);
      return rejectWithValue('Invalid products format');
    } catch (error: any) {
      console.error('❌ API Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);


// Add product
export const addProduct = createAsyncThunk(
  'products/create',
  async (product: Omit<Product, 'id'>, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken();
      const url = `${axios.defaults.baseURL}/affiliate-products/create`;

      const response = await axios.post(url, {
        title: product.title,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image: product.image, // should be base64 or URL
        shortDesc: product.shortDesc,
        longDesc: product.shortDesc || product.shortDesc,
        affiliateUrl: product.affiliateUrl,
        slug: product.slug,
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product: Product, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken();
      const url = `/affiliate-products/edit/${product.id}`; // ✅ Correct API path

      const response = await axios.patch(url, {
        title: product.title,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image: product.image,
        shortDesc: product.shortDesc,
        longDesc: product.shortDesc || product.shortDesc,
        affiliateUrl: product.affiliateUrl,
        slug: product.slug,
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);


export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const axios = axiosWithToken();
      const url = `/affiliate-products/delete/${id}`; // ✅ Updated path
      await axios.delete(url);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })

      // Add
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        toast.success('Product added successfully');
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.selectedProduct = null;
        toast.success('Product updated successfully');
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((product) => product.id !== action.payload);
        toast.success('Product deleted successfully');
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });
  },
});

export const { setSelectedProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;
