import { BarChart3, AlertTriangle, Package } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  Badge, 
  PageLoader, 
  EmptyState 
} from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { useStockByCategory, useLowStock } from '@/hooks';
import { formatCurrency, formatNumber } from '@/lib/utils';

export function Reports() {
  const { data: stockByCategory, isLoading: isLoadingStock } = useStockByCategory();
  const { data: lowStock, isLoading: isLoadingLow } = useLowStock(10);

  const isLoading = isLoadingStock || isLoadingLow;

  if (isLoading) {
    return <PageLoader />;
  }

  const totalValue = stockByCategory?.reduce((sum, cat) => sum + cat.total_value, 0) || 0;
  const totalStock = stockByCategory?.reduce((sum, cat) => sum + cat.total_stock, 0) || 0;

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Inventory analytics and insights"
      />

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-olive-100 dark:bg-olive-900/30">
              <Package className="w-6 h-6 text-olive-600 dark:text-olive-400" />
            </div>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Total Stock</p>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{formatNumber(totalStock)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-ochre-100 dark:bg-ochre-900/30">
              <BarChart3 className="w-6 h-6 text-ochre-600 dark:text-ochre-400" />
            </div>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Total Value</p>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-brick-100 dark:bg-brick-900/30">
              <AlertTriangle className="w-6 h-6 text-brick-600 dark:text-brick-400" />
            </div>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Low Stock Items</p>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{lowStock?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-olive-600 dark:text-olive-400" />
              Stock by Category
            </CardTitle>
          </CardHeader>

          {stockByCategory?.length === 0 ? (
            <EmptyState
              title="No data"
              description="Add some products to see category statistics."
              className="py-8"
            />
          ) : (
            <div className="space-y-4">
              {stockByCategory?.map((category) => {
                const percentage = totalStock > 0 
                  ? Math.round((category.total_stock / totalStock) * 100) 
                  : 0;

                return (
                  <div key={category.category_id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-stone-900 dark:text-stone-100">{category.category_name}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                          {formatNumber(category.total_stock)} units
                        </span>
                        <span className="text-xs text-stone-400 dark:text-stone-500 ml-2">
                          ({category.total_products} products)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-3">
                      <div
                        className="bg-olive-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-stone-500 dark:text-stone-400">
                      <span>{percentage}% of total</span>
                      <span>{formatCurrency(category.total_value)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-brick-600 dark:text-brick-400" />
              Low Stock Alert
              {lowStock && lowStock.length > 0 && (
                <Badge variant="error">{lowStock.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>

          {lowStock?.length === 0 ? (
            <EmptyState
              icon={
                <div className="w-12 h-12 rounded-full bg-success-50 dark:bg-success-700/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-success-600 dark:text-success-500" />
                </div>
              }
              title="All stocked up!"
              description="No products with low stock levels."
              className="py-8"
            />
          ) : (
            <div className="space-y-3">
              {lowStock?.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-brick-50 dark:bg-brick-900/20 rounded-lg border border-brick-100 dark:border-brick-800"
                >
                  <div>
                    <div className="font-medium text-stone-900 dark:text-stone-100">{product.name}</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">
                      {product.product_code} • {product.category_name}
                    </div>
                  </div>
                  <Badge variant={product.quantity === 0 ? 'error' : 'warning'}>
                    {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} left`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
