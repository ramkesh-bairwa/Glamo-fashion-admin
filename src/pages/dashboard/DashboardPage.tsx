import { BarChart3, CreditCard, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import StatCard from './components/StatCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import RevenueChart from './components/RevenueChart';
import TopSellingProducts from './components/TopSellingProducts';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button className="btn btn-primary">
          <TrendingUp size={16} className="mr-2" />
          View Reports
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$24,780"
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value="1,482"
          change="+8.2%"
          trend="up"
          icon={ShoppingCart}
          color="secondary"
        />
        <StatCard
          title="Total Products"
          value="384"
          change="+4.6%"
          trend="up"
          icon={Package}
          color="success"
        />
        <StatCard
          title="Total Customers"
          value="5,678"
          change="+18.3%"
          trend="up"
          icon={Users}
          color="accent"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
            <div className="flex items-center gap-2">
              <select className="select text-xs">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
              <button className="btn btn-outline p-2">
                <BarChart3 size={16} />
              </button>
            </div>
          </div>
          <RevenueChart />
        </div>
        
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Selling</h2>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </button>
          </div>
          <TopSellingProducts />
        </div>
      </div>
      
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            View All Orders
          </button>
        </div>
        <RecentOrdersTable />
      </div>
    </div>
  );
};

export default DashboardPage;