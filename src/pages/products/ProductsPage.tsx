import { useEffect, useState } from 'react';
import { Edit, Plus, Search, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  fetchProducts,
  setSelectedProduct,
  deleteProduct,
} from '../../store/products/productSlice';
import { fetchCategories } from '../../store/categories/categorySlice';
import { fetchBrands } from '../../store/brands/brandSlice';
import ProductModal from './components/ProductModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { Product } from '../../types/product';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    products, 
    loading, 
    pagination,
    error
  } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');

  // Fetch data with current filters
  const fetchData = (page = 1) => {
    dispatch(fetchProducts({
      page,
      limit: 10,
      search: searchTerm,
      category: filterCategory,
      brand: filterBrand
    }));
  };

  // Initial load
  useEffect(() => {
    fetchData();
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  // Handle filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1); // Reset to page 1 when filters change
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCategory, filterBrand]);

  const handleAddProduct = () => {
    dispatch(setSelectedProduct(null));
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    dispatch(setSelectedProduct(product));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setSelectedProduct(null));
  };

  const handleOpenDeleteModal = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete)).then(() => {
        // Only refetch if we're not on the first page and the last item was deleted
        if (products.length === 1 && pagination.currentPage > 1) {
          fetchData(pagination.currentPage - 1);
        } else {
          fetchData(pagination.currentPage);
        }
      });
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.title || 'Unknown Category';
  };

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.title || 'Unknown Brand';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          <Plus size={16} className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-grow sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-error-50 p-4 text-error-600 dark:bg-error-900/20 dark:text-error-400">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 text-left text-sm font-medium text-gray-700 dark:bg-dark-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Brand</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                  </div>
                </td>
              </tr>
            ) : !Array.isArray(products) || products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-10 w-10 overflow-hidden rounded-md">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-dark-600">
                          No image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {product.title.length > 30 
                      ? `${product.title.substring(0, 30)}...` 
                      : product.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getCategoryName(product.category)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getBrandName(product.brand)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600"
                        onClick={() => handleEditProduct(product)}
                        aria-label="Edit product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="rounded-md p-1 text-error-500 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
                        onClick={() => handleOpenDeleteModal(product.id)}
                        aria-label="Delete product"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {products.length} of {pagination.totalItems} products
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-outline"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`btn ${pagination.currentPage === pageNum ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              className="btn btn-outline"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              aria-label="Next page"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default ProductsPage;