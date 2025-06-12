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
  title: string;
  shortDesc: string;
  price: number;
  categoryId: string;
  brandId: string;
  slug: string;
  affiliateUrl: string;
  image: string; // single image
};

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { selectedProduct, loading } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);

  const [image, setImage] = useState<string>(''); // single image base64

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      shortDesc: '',
      price: 0,
      categoryId: '',
      brandId: '',
      slug: '',
      affiliateUrl: '',
      image: '',
    },
  });

  const nameValue = watch('title');

  useEffect(() => {
    if (selectedProduct) {
      reset({
        title: selectedProduct.title,
        shortDesc: selectedProduct.shortDesc,
        price: selectedProduct.price,
        categoryId: selectedProduct.category,
        brandId: selectedProduct.brand,
        slug: selectedProduct.slug,
        affiliateUrl: selectedProduct.affiliateUrl || '',
        image: selectedProduct.image || '',
      });
      setImage(selectedProduct.image || '');
    } else {
      reset();
      setImage('');
    }
  }, [selectedProduct, reset]);

  useEffect(() => {
    const newSlug = slugify(nameValue);
    setValue('slug', newSlug, { shouldValidate: true });
  }, [nameValue, setValue]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImage(base64);
      setValue('image', base64, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormValues) => {
    const productData = {
      title: data.title,
      shortDesc: data.shortDesc,
      price: data.price,
      category: data.categoryId,
      brand: data.brandId,
      slug: data.slug,
      affiliateUrl: data.affiliateUrl,
      image, // single base64 image
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
                <label className="label">Title *</label>
                <input
                  className="input w-full"
                  placeholder="Product title"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-error">{errors.title.message}</p>}
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="input w-full"
                  rows={3}
                  placeholder="Product description"
                  {...register('shortDesc')}
                ></textarea>
              </div>

              <div>
                <label className="label">Affiliate URL *</label>
                <input
                  id="affiliateUrl"
                  className="input w-full"
                  placeholder="https://..."
                  {...register('affiliateUrl', {
                    required: 'Affiliate URL is required',
                    pattern: {
                      value: /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                      message: 'Enter a valid URL',
                    },
                  })}
                />
                {errors.affiliateUrl && <p className="text-error">{errors.affiliateUrl.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price *</label>
                  <input
                    type="number"
                    className="input w-full"
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' },
                    })}
                  />
                  {errors.price && <p className="text-error">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="label">Slug *</label>
                  <input
                    readOnly
                    className="input w-full"
                    {...register('slug', { required: 'Slug is required' })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Category *</label>
                <select
                  className="select w-full"
                  {...register('categoryId', { required: 'Category is required' })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-error">{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="label">Brand *</label>
                <select
                  className="select w-full"
                  {...register('brandId', { required: 'Brand is required' })}
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.title}
                    </option>
                  ))}
                </select>
                {errors.brandId && <p className="text-error">{errors.brandId.message}</p>}
              </div>

              <div>
                <label className="label">Image (Base64)</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="input w-full"
                />
                {errors.image && <p className="text-error">{errors.image.message}</p>}

                {image && (
                  <div className="relative mt-2 group w-28 h-20">
                    <img src={image} className="h-full w-full object-cover rounded-md" />
                    <button
                      type="button"
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      onClick={() => {
                        setImage('');
                        setValue('image', '', { shouldValidate: true });
                      }}
                    >
                      <Trash size={16} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="loader" />
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
