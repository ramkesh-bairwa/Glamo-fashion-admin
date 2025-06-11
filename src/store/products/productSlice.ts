import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Product } from '../../types/product';
import axiosInstance, { axiosWithToken } from '../../api/axiosInstance';

// Sample initial data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    description: 'The latest iPhone with advanced features.',
    price: 999,
    categoryId: '1',
    brandId: '1',
    images: ['https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 50,
    sku: 'IP13P-128-GR',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S22',
    description: 'Flagship Android smartphone with premium features.',
    price: 799,
    categoryId: '1',
    brandId: '2',
    images: ['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 35,
    sku: 'SGS22-128-BK',
  },
  {
    id: '3',
    name: 'MacBook Pro M2',
    description: 'Powerful laptop for professionals with Apple Silicon.',
    price: 1299,
    categoryId: '1',
    brandId: '1',
    images: ['https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 20,
    sku: 'MBP-M2-512-SG',
  },
  {
    id: '4',
    name: 'Sony WH-1000XM4',
    description: 'Premium noise-cancelling headphones with exceptional sound quality.',
    price: 349,
    categoryId: '1',
    brandId: '4',
    images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 45,
    sku: 'SWXM4-BK',
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    description: 'Stylish and comfortable athletic shoes.',
    price: 150,
    categoryId: '2',
    brandId: '3',
    images: ['https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    stock: 60,
    sku: 'NAM270-10-BW',
  },
];

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: sampleProducts,
  selectedProduct: null,
  loading: false,
  error: null,
};

// In a real app, these would be API calls
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  // Simulate API call
  return new Promise<Product[]>((resolve) => {
    setTimeout(() => {
      resolve(sampleProducts);
    }, 500);
  });
});

export const addProduct = createAsyncThunk(
  'products/create',
  async (product: Omit<Product, 'id'>) => {
    const axios = axiosWithToken();
    const url = `${axios.defaults.baseURL}/affiliate-products/create`;

    const response = await axios.post(url, {
      title: product.name,
      price: product.price,
      category: product.categoryId,
      brand: product.brandId,
      image: "TEST", // should be base64 strings
      shortDesc:product.description,
      longDesc:product.description,
      affiliateUrl:"TEST",
      slug:"tetstst"

    });

    return response.data;
  }
);


export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product: Product) => {
    // Simulate API call
    return new Promise<Product>((resolve) => {
      setTimeout(() => {
        resolve(product);
      }, 500);
    });
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    // Simulate API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(id);
      }, 500);
    });
  }
);

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
        state.error = action.error.message || 'Failed to fetch products';
      })
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
        state.error = action.error.message || 'Failed to add product';
        toast.error(state.error);
      })
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
        state.error = action.error.message || 'Failed to update product';
        toast.error(state.error);
      })
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
        state.error = action.error.message || 'Failed to delete product';
        toast.error(state.error);
      });
  },
});

export const { setSelectedProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;