import { Bell, Moon, Sun } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

export function Header() {
  const { sidebarCollapsed, darkMode, toggleDarkMode } = useUIStore();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 z-30 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="h-full flex items-center justify-end px-6">
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brick-500 rounded-full" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 ml-2">
            <div className="w-8 h-8 rounded-full bg-olive-100 dark:bg-olive-900 flex items-center justify-center">
              <span className="text-sm font-medium text-olive-700 dark:text-olive-300">WH</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
