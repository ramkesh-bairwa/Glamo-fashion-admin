import { useEffect, useState } from 'react';
import { Edit, Filter, Plus, Search, Trash } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchProducts, setSelectedProduct, deleteProduct } from '../../store/products/productSlice';
import { fetchCategories } from '../../store/categories/categorySlice';
import { fetchBrands } from '../../store/brands/brandSlice';
import ProductModal from './components/ProductModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { Product } from '../../types/product';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  
  // useEffect(() => {
  //   dispatch(fetchProducts());
  //   dispatch(fetchCategories());
  //   dispatch(fetchBrands());
  // }, [dispatch]);
  
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
      dispatch(deleteProduct(productToDelete));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };
  
  // Filter products based on search term and category/brand filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? product.categoryId === filterCategory : true;
    const matchesBrand = filterBrand ? product.brandId === filterBrand : true;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });
  
  // Get category and brand names for display
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };
  
  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.title : 'Unknown Brand';
  };

 useEffect(() => {
  if (products.length === 0) dispatch(fetchProducts());
  if (categories.length === 0) dispatch(fetchCategories());
  if (brands.length === 0) dispatch(fetchBrands());
  console.log(brands)
}, [dispatch, products.length, categories.length, brands.length]);
  
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
          <div className="flex items-center gap-2">
            <select
              className="select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
            
            <button className="btn btn-outline p-2">
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-cell">Image</th>
              <th className="table-cell">Name</th>
              <th className="table-cell">Category</th>
              <th className="table-cell">Brand</th>
              <th className="table-cell">Price</th>
              <th className="table-cell">Stock</th>
              <th className="table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="table-cell text-center py-8">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-cell text-center py-8 text-gray-500 dark:text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="table-row table-row-hover">
                  <td className="table-cell">
                    <div className="h-10 w-10 overflow-hidden rounded-md">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-dark-600">
                          No image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell font-medium">{product.name}</td>
                  <td className="table-cell">{getCategoryName(product.categoryId)}</td>
                  <td className="table-cell">{getBrandName(product.brandId)}</td>
                  <td className="table-cell">${product.price.toFixed(2)}</td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.stock > 0
                          ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400'
                          : 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="rounded-md p-1 text-error-500 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
                        onClick={() => handleOpenDeleteModal(product.id)}
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
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
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