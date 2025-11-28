import { useQuery } from '@tanstack/react-query';
import { Package, FolderTree, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, PageLoader } from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { api } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_stock: number;
  total_value: number;
  low_stock_count: number;
}

export function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: DashboardStats }>('/reports/dashboard');
      return response.data.data;
    },
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const stats = data || {
    total_products: 0,
    total_categories: 0,
    total_stock: 0,
    total_value: 0,
    low_stock_count: 0,
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your warehouse inventory"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={formatNumber(stats.total_products)}
          icon={<Package className="w-5 h-5" />}
          color="olive"
        />
        <StatCard
          title="Categories"
          value={formatNumber(stats.total_categories)}
          icon={<FolderTree className="w-5 h-5" />}
          color="navy"
        />
        <StatCard
          title="Total Stock"
          value={formatNumber(stats.total_stock)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="ochre"
        />
        <StatCard
          title="Low Stock Items"
          value={formatNumber(stats.low_stock_count)}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="brick"
          alert={stats.low_stock_count > 0}
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value</CardTitle>
          </CardHeader>
          <div className="text-3xl font-bold text-stone-900">
            {formatCurrency(stats.total_value)}
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Total value of all products in stock
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction href="/products" label="Add Product" />
            <QuickAction href="/categories" label="Add Category" />
            <QuickAction href="/inventory" label="Update Stock" />
            <QuickAction href="/reports" label="View Reports" />
          </div>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'olive' | 'navy' | 'ochre' | 'brick';
  alert?: boolean;
}

function StatCard({ title, value, icon, color, alert }: StatCardProps) {
  const colors = {
    olive: 'bg-olive-100 text-olive-600',
    navy: 'bg-navy-100 text-navy-600',
    ochre: 'bg-ochre-100 text-ochre-600',
    brick: 'bg-brick-100 text-brick-600',
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      {alert && (
        <Badge variant="warning" className="mt-3">
          Requires attention
        </Badge>
      )}
    </Card>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="p-3 bg-stone-50 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors text-center"
    >
      {label}
    </a>
  );
}

