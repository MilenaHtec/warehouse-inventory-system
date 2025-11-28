import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  Loader2,
  Eye,
  ArrowUp,
  ArrowDown,
  History,
} from "lucide-react";
import {
  Button,
  Card,
  Badge,
  Dropdown,
  Modal,
  ConfirmDialog,
  PageLoader,
  EmptyState,
} from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { ProductForm } from "@/components/forms/ProductForm";
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useProductInventoryHistory,
} from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import type {
  ProductWithCategory,
  ProductFilters,
  InventoryHistoryWithProduct,
} from "@shared/types";

export function Products() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithCategory | null>(null);
  const [deletingProduct, setDeletingProduct] =
    useState<ProductWithCategory | null>(null);
  const [viewingHistoryProduct, setViewingHistoryProduct] =
    useState<ProductWithCategory | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Parse sort option into sort_by and sort_order
  type SortByField = "name" | "price" | "quantity" | "created_at";
  const getSortParams = (
    option: string
  ): { sort_by: SortByField; sort_order: "asc" | "desc" } => {
    switch (option) {
      case "price_asc":
        return { sort_by: "price", sort_order: "asc" };
      case "price_desc":
        return { sort_by: "price", sort_order: "desc" };
      case "stock_asc":
        return { sort_by: "quantity", sort_order: "asc" };
      case "stock_desc":
        return { sort_by: "quantity", sort_order: "desc" };
      case "newest":
      default:
        return { sort_by: "created_at", sort_order: "desc" };
    }
  };

  const sortParams = getSortParams(sortOption);

  const filters = useMemo<ProductFilters>(
    () => ({
      page,
      limit: 12,
      search: debouncedSearch || undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
      sort_by: sortParams.sort_by,
      sort_order: sortParams.sort_order,
    }),
    [
      page,
      debouncedSearch,
      categoryId,
      sortParams.sort_by,
      sortParams.sort_order,
    ]
  );

  const { data, isLoading, isFetching } = useProducts(filters);

  // Track if we've ever loaded data (for initial load only)
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Mark as loaded once we get data
  if (data && !hasInitiallyLoaded) {
    setHasInitiallyLoaded(true);
  }
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
    { value: "", label: "All Categories" },
    ...(categories?.map((cat) => ({
      value: cat.id.toString(),
      label: cat.name,
    })) || []),
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "stock_asc", label: "Stock: Low to High" },
    { value: "stock_desc", label: "Stock: High to Low" },
  ];

  const products = data?.data || [];
  const pagination = data?.pagination;

  // Only show full page loader on initial load, never during search/filtering
  if (isLoading && !hasInitiallyLoaded) {
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
            <div className="relative group">
              {isFetching ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-olive-500 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-olive-600 transition-colors" />
              )}
              <input
                type="text"
                placeholder="Search by name or code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 placeholder:font-normal hover:bg-stone-100 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600 focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500 focus:bg-white dark:focus:bg-stone-800 transition-all duration-200"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              variant="filled"
              options={categoryOptions}
              value={categoryId}
              placeholder="All Categories"
              onChange={(value) => {
                setCategoryId(value as string);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              variant="filled"
              options={sortOptions}
              value={sortOption}
              placeholder="Sort by"
              onChange={(value) => {
                setSortOption(value as string);
                setPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {products.length === 0 ? (
        <EmptyState
          icon={
            <div className="w-16 h-16 rounded-full bg-olive-100 dark:bg-olive-900/30 flex items-center justify-center">
              <Package className="w-8 h-8 text-olive-600 dark:text-olive-400" />
            </div>
          }
          title={search || categoryId ? "No products found" : "No products yet"}
          description={
            search || categoryId
              ? "Try adjusting your filters to find what you're looking for."
              : "Create your first product to get started."
          }
          action={
            !search &&
            !categoryId && (
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
                        <div className="font-medium text-stone-900 dark:text-stone-100">
                          {product.name}
                        </div>
                        <div className="text-xs text-stone-400 dark:text-stone-500">
                          Added {formatDate(product.created_at)}
                        </div>
                      </td>
                      <td>
                        <code className="text-sm font-mono bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded">
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
                          variant={
                            product.quantity <= 10 ? "warning" : "success"
                          }
                        >
                          {product.quantity}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 text-navy-600 hover:text-navy-700 hover:bg-navy-50"
                            onClick={() => setViewingHistoryProduct(product)}
                            title="View inventory history"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5"
                            onClick={() => setEditingProduct(product)}
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 text-brick-600 hover:text-brick-700 hover:bg-brick-50"
                            onClick={() => setDeletingProduct(product)}
                            title="Delete product"
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
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} products
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
                <span className="text-sm text-stone-600 dark:text-stone-400 px-2">
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

      {/* Inventory History Modal */}
      <Modal
        isOpen={!!viewingHistoryProduct}
        onClose={() => setViewingHistoryProduct(null)}
        title={`Inventory History: ${viewingHistoryProduct?.name || ""}`}
        size="lg"
      >
        {viewingHistoryProduct && (
          <ProductHistoryContent
            productId={viewingHistoryProduct.id}
            currentStock={viewingHistoryProduct.quantity}
          />
        )}
      </Modal>
    </div>
  );
}

// Separate component for history content to handle its own data fetching
function ProductHistoryContent({
  productId,
  currentStock,
}: {
  productId: number;
  currentStock: number;
}) {
  const { data, isLoading } = useProductInventoryHistory(productId, {
    limit: 50,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-olive-600 animate-spin" />
      </div>
    );
  }

  const history = data?.data || [];

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="w-12 h-12 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500 dark:text-stone-400">
          No inventory changes recorded yet.
        </p>
        <p className="text-sm text-stone-400 mt-1">
          Current stock: {currentStock}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Current Stock Summary */}
      <div className="mb-4 p-3 bg-olive-50 dark:bg-olive-900/20 rounded-lg flex items-center justify-between">
        <span className="text-sm font-medium text-stone-600">
          Current Stock
        </span>
        <span className="text-xl font-bold text-olive-700">{currentStock}</span>
      </div>

      {/* History List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {history.map((entry) => (
          <HistoryEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function HistoryEntry({ entry }: { entry: InventoryHistoryWithProduct }) {
  const isIncrease = entry.change_type === "increase";
  const isDecrease = entry.change_type === "decrease";

  return (
    <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
      <div
        className={cn(
          "p-1.5 rounded",
          isIncrease
            ? "bg-success-100"
            : isDecrease
            ? "bg-brick-100"
            : "bg-ochre-100"
        )}
      >
        {isIncrease ? (
          <ArrowUp className="w-4 h-4 text-success-600" />
        ) : isDecrease ? (
          <ArrowDown className="w-4 h-4 text-brick-600" />
        ) : (
          <History className="w-4 h-4 text-ochre-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-900 dark:text-stone-100 capitalize">
            {entry.change_type}
          </span>
          <Badge
            variant={isIncrease ? "success" : isDecrease ? "error" : "ochre"}
          >
            {entry.quantity_change > 0 ? "+" : ""}
            {entry.quantity_change}
          </Badge>
        </div>
        <div className="text-sm text-stone-500 dark:text-stone-400">
          {entry.quantity_before} → {entry.quantity_after}
          {entry.reason && (
            <span className="ml-2 text-stone-400 dark:text-stone-500">
              • {entry.reason}
            </span>
          )}
        </div>
        <div className="text-xs text-stone-400 dark:text-stone-500 mt-1">
          {formatDateTime(entry.created_at)}
        </div>
      </div>
    </div>
  );
}
