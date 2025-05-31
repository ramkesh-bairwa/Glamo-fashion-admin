import { NavLink } from 'react-router-dom';
import { BarChart3, Box, Home, Layers, Package, ShoppingBag, Users } from 'lucide-react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { cn } from '../../utils/cn';

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Brands', path: '/brands', icon: Box },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Users', path: '/users', icon: Users },
  ];

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-black transition-transform dark:border-gray-800 dark:bg-dark-700 md:static',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <ShoppingBag size={20} />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Admin</span>
          )}
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'sidebar-item',
                    isActive && 'sidebar-item-active',
                    !sidebarOpen && 'justify-center px-2'
                  )
                }
              >
                <item.icon size={sidebarOpen ? 18 : 20} />
                {sidebarOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 rounded-md bg-primary-50 px-4 py-3 dark:bg-primary-900/20">
          <BarChart3 size={sidebarOpen ? 18 : 20} className="text-primary-600 dark:text-primary-400" />
          {sidebarOpen && (
            <div className="flex-1">
              <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                Pro Version
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400">
                Upgrade now
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;