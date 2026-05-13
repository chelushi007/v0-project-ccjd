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
  Receipt,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  children?: MenuItem[]
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

// 个人工作台菜单（结算管理含两个子级）
const personalMenu: MenuItem[] = [
  { id: "my-workbench", label: "我的工作台", icon: LayoutDashboard },
  { id: "enterprise", label: "企业中心", icon: Building2 },
  { id: "warehouse", label: "仓储管理", icon: Warehouse },
  { id: "material", label: "物资管理", icon: Package },
  {
    id: "demand",
    label: "需求管理",
    icon: ClipboardList,
    children: [
      { id: "demand-self", label: "仓储自主出租", icon: Warehouse },
      { id: "demand-entrust", label: "仓储委托出租", icon: FileText },
      { id: "demand-material", label: "物资出租", icon: Package },
    ],
  },
  {
    id: "order",
    label: "订单管理",
    icon: ShoppingCart,
    children: [
      { id: "order-warehouse", label: "仓储交易订单", icon: Warehouse },
      { id: "order-storage", label: "物资存放订单", icon: Package },
      { id: "order-trade", label: "物资交易订单", icon: ShoppingCart },
    ],
  },
  {
    id: "settlement",
    label: "费用管理",
    icon: CreditCard,
    children: [
      { id: "settlement-reconciliation", label: "对账管理", icon: Receipt },
      { id: "settlement-settle", label: "结算管理", icon: Wallet },
    ],
  },
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
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "frontend",
    "personal",
  ])
  // 三级展开（如：结算管理）。当前激活子项所在的父级会自动保持展开
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "settlement",
    "demand",
    "order",
  ])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    )
  }

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    )
  }

  const handleSectionClick = (section: MenuSection) => {
    if (section.items && section.items.length > 0) {
      if (!collapsed) {
        toggleSection(section.id)
      }
      const firstItem = section.items[0]
      // 若首项也有子级，进入其首个孙项
      const targetSubTab =
        firstItem.children && firstItem.children.length > 0
          ? firstItem.children[0].id
          : firstItem.id
      onTabChange(section.id, targetSubTab)
    } else {
      onTabChange(section.id)
    }
  }

  const handleItemClick = (sectionId: string, item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // 展开/收起 子菜单
      if (!expandedItems.includes(item.id)) {
        setExpandedItems((prev) => [...prev, item.id])
      } else {
        toggleItem(item.id)
      }
      // 默认进入第一个孙项
      onTabChange(sectionId, item.children[0].id)
    } else {
      onTabChange(sectionId, item.id)
    }
  }

  // 判断三级父项是否激活：当前 subTab 命中其任意 child
  const isItemActive = (sectionId: string, item: MenuItem) => {
    if (activeTab !== sectionId) return false
    if (item.children && item.children.length > 0) {
      return item.children.some((c) => c.id === activeSubTab)
    }
    return activeSubTab === item.id
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
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
            <span className="text-xs text-sidebar-foreground/60">
              中铁建循环物资平台
            </span>
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
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground",
                )}
              >
                <SectionIcon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isActive && "text-sidebar-primary",
                  )}
                />
                {!collapsed && (
                  <>
                    <div className="flex flex-col items-start text-left flex-1 min-w-0">
                      <span className="text-sm font-medium truncate w-full">
                        {section.label}
                      </span>
                      <span className="text-xs text-sidebar-foreground/50 truncate w-full">
                        {section.description}
                      </span>
                    </div>
                    {hasItems && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 shrink-0 transition-transform duration-200",
                          isSectionExpanded && "rotate-180",
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
                    const itemActive = isItemActive(section.id, item)
                    const hasChildren =
                      item.children && item.children.length > 0
                    const itemExpanded = expandedItems.includes(item.id)

                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => handleItemClick(section.id, item)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm",
                            itemActive && !hasChildren
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : itemActive && hasChildren
                                ? "bg-sidebar-accent/60 text-sidebar-foreground font-medium"
                                : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                          )}
                        >
                          <ItemIcon className="w-4 h-4 shrink-0" />
                          <span className="flex-1 text-left truncate">
                            {item.label}
                          </span>
                          {hasChildren && (
                            <ChevronDown
                              className={cn(
                                "w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-sidebar-foreground/60",
                                itemExpanded && "rotate-180",
                              )}
                            />
                          )}
                        </button>

                        {/* 三级菜单 */}
                        {hasChildren && itemExpanded && (
                          <div className="ml-3 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                            {item.children!.map((child) => {
                              const ChildIcon = child.icon
                              const childActive =
                                activeTab === section.id &&
                                activeSubTab === child.id

                              return (
                                <button
                                  key={child.id}
                                  onClick={() =>
                                    onTabChange(section.id, child.id)
                                  }
                                  className={cn(
                                    "w-full flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-xs",
                                    childActive
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/60 hover:text-sidebar-foreground",
                                  )}
                                >
                                  <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                                  <span className="flex-1 text-left truncate">
                                    {child.label}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
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
              <span>收起菜单</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
