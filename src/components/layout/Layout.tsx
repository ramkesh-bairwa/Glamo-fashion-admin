import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, sidebarOpen } = useAppSelector((state) => state.ui);
  
  useEffect(() => {
    // Apply theme when component mounts
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-800">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;