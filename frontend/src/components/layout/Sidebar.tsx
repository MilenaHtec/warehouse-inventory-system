import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ArrowLeftRight,
  BarChart3,
  ChevronLeft,
  Warehouse,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/categories', icon: FolderTree, label: 'Categories' },
  { to: '/inventory', icon: ArrowLeftRight, label: 'Inventory' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-stone-900 text-stone-100 transition-all duration-300 z-40',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-olive-600 flex items-center justify-center flex-shrink-0">
            <Warehouse className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-lg whitespace-nowrap">Warehouse</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                'hover:bg-stone-800',
                isActive
                  ? 'bg-olive-600/20 text-olive-400'
                  : 'text-stone-400 hover:text-stone-100'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebarCollapse}
        className={cn(
          'absolute bottom-4 right-0 translate-x-1/2',
          'w-6 h-6 rounded-full bg-stone-800 border border-stone-700',
          'flex items-center justify-center',
          'hover:bg-stone-700 transition-colors'
        )}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          className={cn(
            'w-4 h-4 text-stone-400 transition-transform',
            sidebarCollapsed && 'rotate-180'
          )}
        />
      </button>
    </aside>
  );
}

