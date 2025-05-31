import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { toggleTheme, toggleSidebar } from '../../store/ui/uiSlice';
import { logout } from '../../store/auth/authSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <header className="z-30 border-b border-gray-200 bg-black px-4 py-2 dark:border-gray-800 dark:bg-dark-700">
      <div className="flex h-12 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600 md:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          
          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-10 pr-4 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-600 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600">
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-error-500"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-md p-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-600"
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                <User size={16} />
              </div>
              <span className="hidden text-sm font-medium md:block">{user?.name || 'Admin'}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-dark-700">
                <div className="py-1" onClick={() => setUserMenuOpen(false)}>
                  <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-600">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Profile</span>
                    </div>
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-600">
                    <div className="flex items-center gap-2">
                      <Settings size={16} />
                      <span>Settings</span>
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-gray-100 dark:text-error-400 dark:hover:bg-dark-600"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;