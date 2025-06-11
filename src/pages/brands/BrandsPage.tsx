import { useEffect, useState } from 'react';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchBrands, setSelectedBrand, deleteBrand } from '../../store/brands/brandSlice';
import BrandModal from './components/BrandModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { Brand } from '../../types/brand';

const BrandsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brands, loading } = useAppSelector((state) => state.brands);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleAddBrand = () => {
    dispatch(setSelectedBrand(null));
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    dispatch(setSelectedBrand(brand));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setSelectedBrand(null));
  };

  const handleOpenDeleteModal = (id: string) => {
    setBrandToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBrandToDelete(null);
  };

  const handleDeleteBrand = () => {
    if (brandToDelete) {
      dispatch(deleteBrand(brandToDelete));
      setIsDeleteModalOpen(false);
      setBrandToDelete(null);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brands</h1>
        <button className="btn btn-primary" onClick={handleAddBrand}>
          <Plus size={16} className="mr-2" />
          Add Brand
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search brands..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
            No brands found
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <div key={brand.id} className="card card-hover">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-4">
                  {brand.icon ? (
                    <img
                        src={brand.icon}
                        alt={brand.title}
                        className="h-32 w-32 rounded-md object-cover"
                      />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                      {brand.title?.charAt(0).toUpperCase()}
                    </div>
                  )}
                <div className="flex-1 min-w-0">
                    <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                      {brand.title}
                    </h3>
                    {brand.status !== undefined && (
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          brand.status
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                        }`}
                      >
                        {brand.status ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                  {brand.content || 'No description provided'}
                </p>

                <div className="mt-auto pt-4 flex justify-end gap-2">
                  <button
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600"
                    onClick={() => handleEditBrand(brand)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="rounded-md p-2 text-error-500 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
                    onClick={() => handleOpenDeleteModal(brand.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

          <BrandModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onBrandSaved={() => dispatch(fetchBrands())} // 👈 refetch after saving
            />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteBrand}
        title="Delete Brand"
        message="Are you sure you want to delete this brand? This action cannot be undone."
      />
    </div>
  );
};

export default BrandsPage;
