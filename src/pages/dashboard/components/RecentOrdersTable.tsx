import { useState } from 'react';
import { Eye, Package, Truck, CheckCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Sample data for orders
const orders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    date: '2023-05-12',
    amount: 125.99,
    status: 'completed',
  },
  {
    id: 'ORD-002',
    customer: 'Alice Smith',
    date: '2023-05-11',
    amount: 85.5,
    status: 'processing',
  },
  {
    id: 'ORD-003',
    customer: 'Robert Johnson',
    date: '2023-05-10',
    amount: 249.99,
    status: 'shipped',
  },
  {
    id: 'ORD-004',
    customer: 'Emily Davis',
    date: '2023-05-09',
    amount: 75.0,
    status: 'completed',
  },
  {
    id: 'ORD-005',
    customer: 'Michael Wilson',
    date: '2023-05-08',
    amount: 189.99,
    status: 'processing',
  },
];

const RecentOrdersTable: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-success-50 dark:bg-success-900/20',
          text: 'text-success-700 dark:text-success-400',
          icon: CheckCircle,
        };
      case 'processing':
        return {
          bg: 'bg-primary-50 dark:bg-primary-900/20',
          text: 'text-primary-700 dark:text-primary-400',
          icon: Package,
        };
      case 'shipped':
        return {
          bg: 'bg-accent-50 dark:bg-accent-900/20',
          text: 'text-accent-700 dark:text-accent-400',
          icon: Truck,
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          text: 'text-gray-700 dark:text-gray-400',
          icon: Package,
        };
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-cell">Order ID</th>
            <th className="table-cell">Customer</th>
            <th className="table-cell">Date</th>
            <th className="table-cell">Amount</th>
            <th className="table-cell">Status</th>
            <th className="table-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = getStatusStyles(order.status);
            const StatusIcon = status.icon;
            
            return (
              <tr key={order.id} className="table-row table-row-hover">
                <td className="table-cell font-medium">{order.id}</td>
                <td className="table-cell">{order.customer}</td>
                <td className="table-cell">{order.date}</td>
                <td className="table-cell">${order.amount.toFixed(2)}</td>
                <td className="table-cell">
                  <div className="inline-flex items-center">
                    <span
                      className={cn(
                        'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                        status.bg,
                        status.text
                      )}
                    >
                      <StatusIcon size={12} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="table-cell">
                  <button
                    className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-600"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;