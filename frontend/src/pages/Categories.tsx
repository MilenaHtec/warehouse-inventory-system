import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import { 
  Button, 
  Card, 
  Badge, 
  Modal, 
  ConfirmDialog, 
  PageLoader, 
  EmptyState 
} from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks';
import { formatDate } from '@/lib/utils';
import type { Category, CategoryWithProductCount } from '@shared/types';

export function Categories() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithProductCount | null>(null);

  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = (data: { name: string; description?: string }) => {
    createMutation.mutate(data, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (data: { name: string; description?: string }) => {
    if (!editingCategory) return;
    updateMutation.mutate(
      { id: editingCategory.id, data },
      { onSuccess: () => setEditingCategory(null) }
    );
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    deleteMutation.mutate(deletingCategory.id, {
      onSuccess: () => setDeletingCategory(null),
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage product categories"
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        }
      />

      {categories?.length === 0 ? (
        <EmptyState
          icon={
            <div className="w-16 h-16 rounded-full bg-olive-100 flex items-center justify-center">
              <FolderTree className="w-8 h-8 text-olive-600" />
            </div>
          }
          title="No categories yet"
          description="Create your first category to organize your products."
          action={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <Card key={category.id} className="hover:shadow-medium transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-900">{category.name}</h3>
                  {category.description && (
                    <p className="mt-1 text-sm text-stone-500 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
                <Badge variant="olive">{category.product_count} products</Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  Created {formatDate(category.created_at)}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1.5"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1.5 text-brick-600 hover:text-brick-700 hover:bg-brick-50"
                    onClick={() => setDeletingCategory(category)}
                    disabled={category.product_count > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Category"
      >
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onSubmit={handleUpdate}
            onCancel={() => setEditingCategory(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

