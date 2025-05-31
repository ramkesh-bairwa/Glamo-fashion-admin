const products = [
  {
    id: 1,
    name: 'Apple iPhone 13 Pro',
    category: 'Electronics',
    price: 999,
    sold: 342,
    image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S22',
    category: 'Electronics',
    price: 799,
    sold: 285,
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 3,
    name: 'MacBook Pro M2',
    category: 'Computers',
    price: 1299,
    sold: 189,
    image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 4,
    name: 'Sony WH-1000XM4',
    category: 'Audio',
    price: 349,
    sold: 156,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

const TopSellingProducts: React.FC = () => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex items-center gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {product.category}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              ${product.price}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {product.sold} sold
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopSellingProducts;