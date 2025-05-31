import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { addBrand, updateBrand } from '../../../store/brands/brandSlice';
import { Brand } from '../../../types/brand';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = {
  name: string;
  description: string;
  website: string;
  logo: string;
};

const BrandModal: React.FC<BrandModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { selectedBrand, loading } = useAppSelector((state) => state.brands);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      website: '',
      logo: '',
    },
  });
  
  useEffect(() => {
    if (selectedBrand) {
      setValue('name', selectedBrand.name);
      setValue('description', selectedBrand.description || '');
      setValue('website', selectedBrand.website || '');
      setValue('logo', selectedBrand.logo || '');
    } else {
      reset();
    }
  }, [selectedBrand, setValue, reset]);
  
  const onSubmit = (data: FormValues) => {
    if (selectedBrand) {
      dispatch(updateBrand({ ...selectedBrand, ...data }));
    } else {
      dispatch(addBrand(data));
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-dark-700 animate-fade-in animate-slide-in">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedBrand ? 'Edit Brand' : 'Add Brand'}
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
                placeholder="Brand name"
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
                placeholder="Brand description"
                {...register('description')}
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="website" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website URL
              </label>
              <input
                id="website"
                type="text"
                className="input w-full"
                placeholder="https://example.com"
                {...register('website', {
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Enter a valid URL',
                  },
                })}
              />
              {errors.website && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.website.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="logo" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Logo URL
              </label>
              <input
                id="logo"
                type="text"
                className="input w-full"
                placeholder="https://example.com/logo.png"
                {...register('logo', {
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Enter a valid URL',
                  },
                })}
              />
              {errors.logo && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.logo.message}</p>
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

export default BrandModal;