"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Warehouse,
  Building2,
  Package,
  FileText,
  CreditCard,
  List,
  Map,
  FilePlus,
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
}

interface MenuSection {
  id: string
  label: string
  icon: React.ElementType
  description: string
  items?: MenuItem[]
}

// 前台菜单
const frontendMenu: MenuItem[] = [
  { id: "home", label: "首页", icon: Home },
  { id: "warehouse-list", label: "仓储列表", icon: List },
  { id: "warehouse-map", label: "仓储地图", icon: Map },
  { id: "detail-publish", label: "仓储出租发布", icon: FilePlus },
  { id: "material-publish", label: "物资出租发布", icon: Package },
]

// 个人工作台菜单
const personalMenu: MenuItem[] = [
  { id: "my-workbench", label: "我的工作台", icon: LayoutDashboard },
  { id: "enterprise", label: "企业中心", icon: Building2 },
  { id: "warehouse", label: "仓储管理", icon: Warehouse },
  { id: "material", label: "物资管理", icon: Package },
  { id: "demand", label: "需求管理", icon: ClipboardList },
  { id: "order", label: "订单管理", icon: ShoppingCart },
  { id: "settlement", label: "结算管理", icon: CreditCard },
  { id: "contract", label: "合同管理", icon: FileText },
]

// 主导航菜单
const menuSections: MenuSection[] = [
  {
    id: "frontend",
    label: "前台",
    icon: Home,
    description: "仓储资源门户",
    items: frontendMenu,
  },
  {
    id: "personal",
    label: "个人工作台",
    icon: LayoutDashboard,
    description: "业务管理中心",
    items: personalMenu,
  },
]

interface AppSidebarProps {
  activeTab: string
  activeSubTab: string
  onTabChange: (tab: string, subTab?: string) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function AppSidebar({
  activeTab,
  activeSubTab,
  onTabChange,
  collapsed,
  onCollapsedChange,
}: AppSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["frontend", "personal"])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleSectionClick = (section: MenuSection) => {
    if (section.items && section.items.length > 0) {
      if (!collapsed) {
        toggleSection(section.id)
      }
      // 默认选中第一个菜单项
      const firstItem = section.items[0]
      onTabChange(section.id, firstItem.id)
    } else {
      onTabChange(section.id)
    }
  }

  const handleMenuClick = (sectionId: string, itemId: string) => {
    onTabChange(sectionId, itemId)
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo区域 */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary">
          <Warehouse className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm">仓储基地</span>
            <span className="text-xs text-sidebar-foreground/60">中铁建循环物资平台</span>
          </div>
        )}
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuSections.map((section) => {
          const SectionIcon = section.icon
          const isActive = activeTab === section.id
          const isSectionExpanded = expandedSections.includes(section.id)
          const hasItems = section.items && section.items.length > 0

          return (
            <div key={section.id}>
              {/* 一级菜单 */}
              <button
                onClick={() => handleSectionClick(section)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                )}
              >
                <SectionIcon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && (
                  <>
                    <div className="flex flex-col items-start text-left flex-1 min-w-0">
                      <span className="text-sm font-medium truncate w-full">{section.label}</span>
                      <span className="text-xs text-sidebar-foreground/50 truncate w-full">{section.description}</span>
                    </div>
                    {hasItems && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 shrink-0 transition-transform duration-200",
                          isSectionExpanded && "rotate-180"
                        )}
                      />
                    )}
                  </>
                )}
              </button>

              {/* 二级菜单 */}
              {hasItems && !collapsed && isSectionExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                  {section.items!.map((item) => {
                    const ItemIcon = item.icon
                    const isItemActive = activeTab === section.id && activeSubTab === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(section.id, item.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm",
                          isItemActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                        )}
                      >
                        <ItemIcon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 text-left truncate">{item.label}</span>
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
      <div className="p-2 border-t border-sidebar-border shrink-0">
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
              <span>收起���单</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
