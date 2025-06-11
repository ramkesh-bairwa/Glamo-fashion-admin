import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { addProduct, updateProduct } from '../../../store/products/productSlice';
import { Product } from '../../../types/product';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  stock: number;
  sku: string;
  images: string;
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { selectedProduct, loading } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  const [images, setImages] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      brandId: '',
      stock: 0,
      sku: '',
      images: '',
    },
  });
  
  // const imageUrl = watch('images');
  
  useEffect(() => {
    if (selectedProduct) {
      setValue('name', selectedProduct.name);
      setValue('description', selectedProduct.description);
      setValue('price', selectedProduct.price);
      setValue('categoryId', selectedProduct.categoryId);
      setValue('brandId', selectedProduct.brandId);
      setValue('stock', selectedProduct.stock);
      setValue('sku', selectedProduct.sku);
      setImages(selectedProduct.images || []);
    } else {
      reset();
      setImages([]);
    }
  }, [selectedProduct, setValue, reset]);
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const onSubmit = (data: FormValues) => {
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      brandId: data.brandId,
      stock: data.stock,
      sku: data.sku,
      images,
    };
    
    if (selectedProduct) {
      dispatch(updateProduct({ ...selectedProduct, ...productData }));
    } else {
      dispatch(addProduct(productData as Omit<Product, 'id'>));
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-lg bg-white dark:bg-dark-700 animate-fade-in animate-slide-in my-8">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedProduct ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name <span className="text-error-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="input w-full"
                  placeholder="Product name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="input w-full"
                  placeholder="Product description"
                  {...register('description')}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="input w-full"
                    placeholder="0.00"
                    {...register('price', { 
                      required: 'Price is required',
                      min: {
                        value: 0,
                        message: 'Price cannot be negative',
                      },
                    })}
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.price.message}</p>
                  )}
                </div>
                
                {/* <div>
                  <label htmlFor="stock" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Stock <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    className="input w-full"
                    placeholder="0"
                    {...register('stock', { 
                      required: 'Stock is required',
                      min: {
                        value: 0,
                        message: 'Stock cannot be negative',
                      },
                    })}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.stock.message}</p>
                  )}
                </div> */}
              </div>
              
              {/* <div>
                <label htmlFor="sku" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SKU <span className="text-error-500">*</span>
                </label>
                <input
                  id="sku"
                  type="text"
                  className="input w-full"
                  placeholder="Product SKU"
                  {...register('sku', { required: 'SKU is required' })}
                />
                {errors.sku && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.sku.message}</p>
                )}
              </div> */}
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category <span className="text-error-500">*</span>
                </label>
                <select
                  id="categoryId"
                  className="select w-full"
                  {...register('categoryId', { required: 'Category is required' })}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.categoryId.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="brandId" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Brand <span className="text-error-500">*</span>
                </label>
                <select
                  id="brandId"
                  className="select w-full"
                  {...register('brandId', { required: 'Brand is required' })}
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.title}
                    </option>
                  ))}
                </select>
                {errors.brandId && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.brandId.message}</p>
                )}
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Images
                </label>
                <div className="flex items-center gap-2">
                  <input
                      id="images"
                      type="file"
                      accept="image/*"
                      className="input flex-1"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          setImages((prev) => [...prev, base64String]);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  {/* <button
                    type="button"
                    className="btn btn-primary p-2"
                    onClick={handleAddImage}
                  >
                    <Plus size={16} />
                  </button> */}
                </div>
                {errors.images && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.images.message}</p>
                )}
                
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Trash size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {images.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    No images added yet. Add at least one image for your product.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;