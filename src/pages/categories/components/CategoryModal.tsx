import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { addCategory, updateCategory } from '../../../store/categories/categorySlice';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySaved: () => void;
}

type FormValues = {
  title: string;
  content: string;
  slug: string;
  icon: FileList | string;
};

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onCategorySaved }) => {
  const dispatch = useAppDispatch();
  const { selectedCategory, loading } = useAppSelector((state) => state.categories);
  const [iconBase64, setIconBase64] = useState<string>('');

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

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
      content: '',
      slug: '',
      icon: '',
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      setValue('title', selectedCategory.title);
      setValue('content', selectedCategory.content || '');
      setValue('slug', selectedCategory.slug || '');
      setIconBase64(selectedCategory.icon || '');
      setValue('icon', selectedCategory.icon || '');
    } else {
      reset();
      setIconBase64('');
    }
  }, [selectedCategory, setValue, reset]);

  const watchTitle = watch('title');

  useEffect(() => {
    if (!selectedCategory && watchTitle) {
      const generatedSlug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug);
    }
  }, [watchTitle, selectedCategory, setValue]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      icon: typeof data.icon === 'string' ? data.icon : iconBase64,
    };

    if (selectedCategory) {
      await dispatch(updateCategory({ ...selectedCategory, ...payload }));
    } else {
      await dispatch(addCategory(payload));
    }

    onCategorySaved();
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
            {/* Title */}
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name <span className="text-error-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="input w-full"
                placeholder="Category name"
                {...register('title', { required: 'Name is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="content"
                rows={3}
                className="input w-full"
                placeholder="Category description"
                {...register('content')}
              ></textarea>
            </div>

            {/* Slug */}
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

            {/* Icon Image */}
            <div>
              <label htmlFor="icon" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Icon Image
              </label>
              <input
                id="icon"
                type="file"
                accept="image/*"
                className="input w-full"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const base64 = await convertToBase64(file);
                    setIconBase64(base64);
                    setValue('icon', base64 as any);
                  }
                }}
              />
              {errors.icon && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.icon.message}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
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
