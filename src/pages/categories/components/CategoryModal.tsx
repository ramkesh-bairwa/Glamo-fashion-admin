import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { addCategory, updateCategory } from '../../../store/categories/categorySlice';
import { Category } from '../../../types/category';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = {
  name: string;
  description: string;
  slug: string;
};

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { selectedCategory, loading } = useAppSelector((state) => state.categories);
  
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
      slug: '',
    },
  });
  
  useEffect(() => {
    if (selectedCategory) {
      setValue('name', selectedCategory.name);
      setValue('description', selectedCategory.description);
      setValue('slug', selectedCategory.slug);
    } else {
      reset();
    }
  }, [selectedCategory, setValue, reset]);
  
  const watchName = watch('name');
  
  useEffect(() => {
    if (!selectedCategory && watchName) {
      // Only auto-generate slug if creating a new category and slug hasn't been manually edited
      setValue(
        'slug',
        watchName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  }, [watchName, selectedCategory, setValue]);
  
  const onSubmit = (data: FormValues) => {
    if (selectedCategory) {
      dispatch(updateCategory({ ...selectedCategory, ...data }));
    } else {
      dispatch(addCategory(data));
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-dark-700 animate-fade-in animate-slide-in">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedCategory ? 'Edit Category' : 'Add Category'}
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
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name <span className="text-error-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                className="input w-full"
                placeholder="Category name"
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
                placeholder="Category description"
                {...register('description')}
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug <span className="text-error-500">*</span>
              </label>
              <input
                id="slug"
                type="text"
                className="input w-full"
                placeholder="category-slug"
                {...register('slug', { required: 'Slug is required' })}
              />
              {errors.slug && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.slug.message}</p>
              )}
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

export default CategoryModal;