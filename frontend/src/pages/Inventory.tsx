import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowUp, ArrowDown, History, Package, Search } from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  Badge, 
  Input,
  PageLoader, 
  EmptyState 
} from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { useProductSearch, useIncreaseStock, useDecreaseStock, useInventoryHistory } from '@/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateTime, cn } from '@/lib/utils';
import type { ProductWithCategory, InventoryHistoryWithProduct } from '@shared/types';

const stockChangeSchema = z.object({
  quantity: z.coerce.number().int().positive('Quantity must be positive'),
  reason: z.string().max(500).optional(),
});

type StockChangeData = z.infer<typeof stockChangeSchema>;

export function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
  const [operation, setOperation] = useState<'increase' | 'decrease' | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: searchResults, isLoading: isSearching } = useProductSearch(debouncedSearch);
  const { data: historyData, isLoading: isLoadingHistory } = useInventoryHistory({ limit: 10 });

  const increaseMutation = useIncreaseStock();
  const decreaseMutation = useDecreaseStock();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockChangeData>({
    resolver: zodResolver(stockChangeSchema),
  });

  const handleSelectProduct = (product: ProductWithCategory) => {
    setSelectedProduct(product);
    setSearchQuery('');
  };

  const handleStockChange = (data: StockChangeData) => {
    if (!selectedProduct || !operation) return;

    const mutationFn = operation === 'increase' ? increaseMutation : decreaseMutation;
    mutationFn.mutate(
      {
        productId: selectedProduct.id,
        data: { quantity: data.quantity, reason: data.reason || undefined },
      },
      {
        onSuccess: () => {
          reset();
          setSelectedProduct(null);
          setOperation(null);
        },
      }
    );
  };

  const history = historyData?.data || [];
  const isSubmitting = increaseMutation.isPending || decreaseMutation.isPending;

  return (
    <div>
      <PageHeader
        title="Inventory Management"
        description="Update stock levels and view inventory history"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Update Section */}
        <Card>
          <CardHeader>
            <CardTitle>Update Stock</CardTitle>
          </CardHeader>

          {!selectedProduct ? (
            <div>
              {/* Product Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
                <input
                  type="text"
                  placeholder="Search for a product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>

              {/* Search Results */}
              {debouncedSearch && (
                <div className="mt-4">
                  {isSearching ? (
                    <p className="text-sm text-stone-500 dark:text-stone-400">Searching...</p>
                  ) : searchResults?.length === 0 ? (
                    <p className="text-sm text-stone-500 dark:text-stone-400">No products found</p>
                  ) : (
                    <div className="space-y-2">
                      {searchResults?.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="w-full p-3 text-left bg-stone-50 dark:bg-stone-800 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-stone-900 dark:text-stone-100">{product.name}</div>
                              <div className="text-sm text-stone-500 dark:text-stone-400">
                                {product.product_code} • {product.category_name}
                              </div>
                            </div>
                            <Badge variant={product.quantity <= 10 ? 'warning' : 'success'}>
                              Stock: {product.quantity}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!searchQuery && (
                <div className="mt-4 text-center text-sm text-stone-500 dark:text-stone-400">
                  <Package className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
                  Search for a product to update its stock
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Selected Product */}
              <div className="p-4 bg-olive-50 dark:bg-olive-900/20 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-stone-900 dark:text-stone-100">{selectedProduct.name}</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">
                      {selectedProduct.product_code} • {selectedProduct.category_name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-olive-700 dark:text-olive-400">
                      {selectedProduct.quantity}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">Current Stock</div>
                  </div>
                </div>
              </div>

              {/* Operation Selection */}
              {!operation ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    className="h-20 flex-col gap-2"
                    onClick={() => setOperation('increase')}
                  >
                    <ArrowUp className="w-6 h-6 text-success-600" />
                    <span>Increase Stock</span>
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-20 flex-col gap-2"
                    onClick={() => setOperation('decrease')}
                    disabled={selectedProduct.quantity === 0}
                  >
                    <ArrowDown className="w-6 h-6 text-brick-600" />
                    <span>Decrease Stock</span>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(handleStockChange)} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn(
                      'p-2 rounded-lg',
                      operation === 'increase' ? 'bg-success-50 dark:bg-success-700/20' : 'bg-brick-50 dark:bg-brick-700/20'
                    )}>
                      {operation === 'increase' ? (
                        <ArrowUp className="w-5 h-5 text-success-600 dark:text-success-500" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-brick-600 dark:text-brick-500" />
                      )}
                    </div>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {operation === 'increase' ? 'Increase' : 'Decrease'} Stock
                    </span>
                  </div>

                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    max={operation === 'decrease' ? selectedProduct.quantity : undefined}
                    placeholder="Enter quantity"
                    error={errors.quantity?.message}
                    {...register('quantity')}
                  />

                  <div>
                    <label className="label">Reason (optional)</label>
                    <textarea
                      className="input min-h-[80px] resize-none"
                      placeholder="Enter reason for stock change"
                      {...register('reason')}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        setOperation(null);
                        reset();
                      }}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant={operation === 'decrease' ? 'danger' : 'primary'}
                      className="flex-1"
                      isLoading={isSubmitting}
                    >
                      Confirm
                    </Button>
                  </div>
                </form>
              )}

              {!operation && (
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => setSelectedProduct(null)}
                >
                  Select Different Product
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Recent History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>

          {isLoadingHistory ? (
            <div className="text-center py-8 text-stone-500 dark:text-stone-400">Loading...</div>
          ) : history.length === 0 ? (
            <EmptyState
              title="No activity yet"
              description="Stock changes will appear here."
              className="py-8"
            />
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <HistoryEntry key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function HistoryEntry({ entry }: { entry: InventoryHistoryWithProduct }) {
  const isIncrease = entry.change_type === 'increase';
  const isDecrease = entry.change_type === 'decrease';

  return (
    <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
      <div className={cn(
        'p-1.5 rounded',
        isIncrease ? 'bg-success-100 dark:bg-success-700/20' : isDecrease ? 'bg-brick-100 dark:bg-brick-700/20' : 'bg-ochre-100 dark:bg-ochre-700/20'
      )}>
        {isIncrease ? (
          <ArrowUp className="w-4 h-4 text-success-600 dark:text-success-500" />
        ) : isDecrease ? (
          <ArrowDown className="w-4 h-4 text-brick-600 dark:text-brick-500" />
        ) : (
          <History className="w-4 h-4 text-ochre-600 dark:text-ochre-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-900 dark:text-stone-100 truncate">{entry.product_name}</span>
          <Badge variant={isIncrease ? 'success' : isDecrease ? 'error' : 'ochre'}>
            {entry.quantity_change > 0 ? '+' : ''}{entry.quantity_change}
          </Badge>
        </div>
        <div className="text-sm text-stone-500 dark:text-stone-400">
          {entry.quantity_before} → {entry.quantity_after}
          {entry.reason && <span className="ml-2">• {entry.reason}</span>}
        </div>
        <div className="text-xs text-stone-400 dark:text-stone-500 mt-1">
          {formatDateTime(entry.created_at)}
        </div>
      </div>
    </div>
  );
}
