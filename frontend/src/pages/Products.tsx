import { useState } from 'react';
import { Plus, Pencil, Trash2, Package, Search } from 'lucide-react';
import { 
  Button, 
  Card, 
  Badge, 
  Input,
  Select,
  Modal, 
  ConfirmDialog, 
  PageLoader, 
  EmptyState 
} from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { ProductForm } from '@/components/forms/ProductForm';
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { ProductWithCategory, ProductFilters } from '@shared/types';

export function Products() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductWithCategory | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [page, setPage] = useState(1);
  
  const debouncedSearch = useDebounce(search, 300);

  const filters: ProductFilters = {
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    category_id: categoryId ? Number(categoryId) : undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  };

  const { data, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (formData: any) => {
    if (!editingProduct) return;
    const { quantity, ...data } = formData;
    updateMutation.mutate(
      { id: editingProduct.id, data },
      { onSuccess: () => setEditingProduct(null) }
    );
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    deleteMutation.mutate(deletingProduct.id, {
      onSuccess: () => setDeletingProduct(null),
    });
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...(categories?.map((cat) => ({
      value: cat.id.toString(),
      label: cat.name,
    })) || []),
  ];

  const products = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading && !products.length) {
    return <PageLoader />;
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        }
      />

      {/* Filters */}
      <Card padding="sm" className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={categoryOptions}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {products.length === 0 ? (
        <EmptyState
          icon={
            <div className="w-16 h-16 rounded-full bg-olive-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-olive-600" />
            </div>
          }
          title={search || categoryId ? 'No products found' : 'No products yet'}
          description={
            search || categoryId 
              ? 'Try adjusting your filters to find what you\'re looking for.'
              : 'Create your first product to get started.'
          }
          action={
            !search && !categoryId && (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            )
          }
        />
      ) : (
        <>
          {/* Products Table */}
          <Card padding="none">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Stock</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="font-medium text-stone-900">{product.name}</div>
                        <div className="text-xs text-stone-400">
                          Added {formatDate(product.created_at)}
                        </div>
                      </td>
                      <td>
                        <code className="text-sm font-mono bg-stone-100 px-2 py-0.5 rounded">
                          {product.product_code}
                        </code>
                      </td>
                      <td>
                        <Badge variant="olive">{product.category_name}</Badge>
                      </td>
                      <td className="text-right font-medium">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="text-right">
                        <Badge 
                          variant={product.quantity <= 10 ? 'warning' : 'success'}
                        >
                          {product.quantity}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 text-brick-600 hover:text-brick-700 hover:bg-brick-50"
                            onClick={() => setDeletingProduct(product)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-stone-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-stone-600 px-2">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === pagination.total_pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Product"
        size="lg"
      >
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Product"
        size="lg"
      >
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProduct(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

