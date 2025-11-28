import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Dropdown } from '@/components/ui';
import { useCategories } from '@/hooks';
import type { ProductWithCategory } from '@shared/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be at most 200 characters'),
  product_code: z.string().min(1, 'Product code is required').max(50, 'Code must be at most 50 characters'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be non-negative').optional(),
  category_id: z.coerce.number().positive('Category is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: ProductWithCategory;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      product_code: product?.product_code || '',
      price: product?.price || 0,
      quantity: product?.quantity || 0,
      category_id: product?.category_id || undefined,
    },
  });

  const categoryOptions = categories?.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
  })) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Enter product name"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Product Code"
          placeholder="e.g., PROD-001"
          error={errors.product_code?.message}
          {...register('product_code')}
        />

        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Category"
              options={categoryOptions}
              value={field.value?.toString() || ''}
              onChange={(value) => field.onChange(Number(value))}
              placeholder="Select category"
              error={errors.category_id?.message}
            />
          )}
        />

        {!product && (
          <Input
            label="Initial Quantity"
            type="number"
            min="0"
            placeholder="0"
            error={errors.quantity?.message}
            {...register('quantity')}
          />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
