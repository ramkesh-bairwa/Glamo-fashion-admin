import { useEffect, useState } from 'react';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchCategories, setSelectedCategory, deleteCategory } from '../../store/categories/categorySlice';
import CategoryModal from './components/CategoryModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { Category } from '../../types/category';

const CategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  const handleAddCategory = () => {
    dispatch(setSelectedCategory(null));
    setIsModalOpen(true);
  };
  
  const handleEditCategory = (category: Category) => {
    dispatch(setSelectedCategory(category));
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setSelectedCategory(null));
  };
  
  const handleOpenDeleteModal = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };
  
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete));
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };
  
  const filteredCategories = categories.filter((category) => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <button className="btn btn-primary" onClick={handleAddCategory}>
          <Plus size={16} className="mr-2" />
          Add Category
        </button>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search categories..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-cell">Name</th>
              <th className="table-cell">Description</th>
              <th className="table-cell">Slug</th>
              <th className="table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="table-cell text-center py-8">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
                  </div>
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-cell text-center py-8 text-gray-500 dark:text-gray-400">
                  No categories found
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id} className="table-row table-row-hover">
                  <td className="table-cell font-medium">{category.name}</td>
                  <td className="table-cell">{category.description}</td>
                  <td className="table-cell">{category.slug}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="rounded-md p-1 text-error-500 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
                        onClick={() => handleOpenDeleteModal(category.id)}
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
      
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
};

export default CategoriesPage;