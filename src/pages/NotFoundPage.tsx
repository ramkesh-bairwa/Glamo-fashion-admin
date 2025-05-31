import { Link } from 'react-router-dom';
import { ChevronLeft, FileQuestion } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-dark-800">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-700">
          <FileQuestion size={48} className="text-gray-500 dark:text-gray-400" />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Page Not Found</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;