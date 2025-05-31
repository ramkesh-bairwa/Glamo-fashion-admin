import { DivideIcon as LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50 dark:bg-primary-900/20',
          text: 'text-primary-600 dark:text-primary-400',
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-50 dark:bg-secondary-900/20',
          text: 'text-secondary-600 dark:text-secondary-400',
        };
      case 'success':
        return {
          bg: 'bg-success-50 dark:bg-success-900/20',
          text: 'text-success-600 dark:text-success-400',
        };
      case 'warning':
        return {
          bg: 'bg-warning-50 dark:bg-warning-900/20',
          text: 'text-warning-600 dark:text-warning-400',
        };
      case 'error':
        return {
          bg: 'bg-error-50 dark:bg-error-900/20',
          text: 'text-error-600 dark:text-error-400',
        };
      case 'accent':
        return {
          bg: 'bg-accent-50 dark:bg-accent-900/20',
          text: 'text-accent-600 dark:text-accent-400',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          text: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={cn('rounded-full p-3', colorClasses.bg)}>
          <Icon className={colorClasses.text} size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <TrendingUp size={16} className="mr-1 text-success-500" />
        ) : (
          <TrendingDown size={16} className="mr-1 text-error-500" />
        )}
        <span
          className={cn(
            'text-sm font-medium',
            trend === 'up' ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
          )}
        >
          {change}
        </span>
        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;