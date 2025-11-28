import { Bell } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

export function Header() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-white border-b border-stone-200 z-30 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="h-full flex items-center justify-end px-6">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brick-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-olive-100 flex items-center justify-center">
              <span className="text-sm font-medium text-olive-700">WH</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
