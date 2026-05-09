"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Warehouse,
  Building2,
  ClipboardList,
  Package,
  ShoppingCart,
  FileText,
  CheckSquare,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SubMenuItem {
  id: string
  label: string
  icon: React.ElementType
}

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  description: string
  children?: SubMenuItem[]
}

interface AppSidebarProps {
  activeTab: string
  activeSubTab: string
  onTabChange: (tab: string, subTab?: string) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

const menuItems: MenuItem[] = [
  {
    id: "frontend",
    label: "前台",
    icon: Home,
    description: "仓储资源门户",
  },
  {
    id: "personal",
    label: "个人工作台",
    icon: User,
    description: "个人业务管理",
    children: [
      { id: "enterprise", label: "企业中心", icon: Building2 },
      { id: "todo", label: "待办事项", icon: CheckSquare },
      { id: "warehouse-info", label: "仓储信息管理", icon: Package },
      { id: "order", label: "订单管理", icon: ShoppingCart },
      { id: "contract", label: "合同管理", icon: FileText },
    ],
  },
  {
    id: "operation",
    label: "运营工作台",
    icon: Settings,
    description: "运营管理后台",
  },
]

export function AppSidebar({
  activeTab,
  activeSubTab,
  onTabChange,
  collapsed,
  onCollapsedChange,
}: AppSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["personal"])

  const toggleExpand = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    )
  }

  const handleMenuClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      if (!collapsed) {
        toggleExpand(item.id)
      }
      // 点击有子菜单的项时，默认选中第一个子菜单
      onTabChange(item.id, item.children[0].id)
    } else {
      onTabChange(item.id)
    }
  }

  const handleSubMenuClick = (parentId: string, subId: string) => {
    onTabChange(parentId, subId)
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo区域 */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary">
          <Warehouse className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm">仓储基地</span>
            <span className="text-xs text-sidebar-foreground/60">循环物资平台</span>
          </div>
        )}
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isExpanded = expandedMenus.includes(item.id)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive && !hasChildren
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : isActive && hasChildren
                    ? "bg-sidebar-accent/30 text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && (
                  <>
                    <div className="flex flex-col items-start text-left flex-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-xs text-sidebar-foreground/50">{item.description}</span>
                    </div>
                    {hasChildren && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    )}
                  </>
                )}
              </button>

              {/* 子菜单 */}
              {hasChildren && !collapsed && isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                  {item.children!.map((subItem) => {
                    const SubIcon = subItem.icon
                    const isSubActive = activeTab === item.id && activeSubTab === subItem.id
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleSubMenuClick(item.id, subItem.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm",
                          isSubActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                        )}
                      >
                        <SubIcon className="w-4 h-4" />
                        <span>{subItem.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 收起/展开按钮 */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>收起菜单</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
