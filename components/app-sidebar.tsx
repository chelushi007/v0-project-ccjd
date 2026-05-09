"use client"

import { cn } from "@/lib/utils"
import {
  Home,
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
  CreditCard,
  Receipt,
  Wallet,
  MapPin,
  Truck,
  Users,
  MapPinned,
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
  children?: SubMenuItem[]
}

interface MenuSection {
  id: string
  label: string
  icon: React.ElementType
  description: string
  items?: MenuItem[]
}

// 物权单位菜单
const propertyOwnerMenu: MenuItem[] = [
  { id: "enterprise", label: "企业中心", icon: Building2 },
  {
    id: "todo",
    label: "待办事项",
    icon: ClipboardList,
    children: [
      { id: "delegate", label: "委托受理", icon: CheckSquare },
      { id: "approval", label: "审批事项", icon: FileCheck },
    ],
  },
  { id: "material", label: "物资管理", icon: Package },
  {
    id: "order",
    label: "订单管理",
    icon: ShoppingCart,
    children: [
      { id: "warehouse-lease", label: "仓储承租状态列表", icon: Warehouse },
      { id: "material-storage", label: "物资存储订单列表", icon: Package },
    ],
  },
  {
    id: "settlement",
    label: "结算管理",
    icon: CreditCard,
    children: [
      { id: "reconciliation", label: "对账管理", icon: Receipt },
      { id: "payment", label: "支付结算", icon: Wallet },
    ],
  },
  { id: "contract", label: "合同管理", icon: FileText },
]

// 仓储单位菜单
const warehouseUnitMenu: MenuItem[] = [
  { id: "enterprise", label: "企业中心", icon: Building2 },
  {
    id: "todo",
    label: "待办事项",
    icon: ClipboardList,
    children: [
      { id: "delegate", label: "委托受理", icon: CheckSquare },
      { id: "approval", label: "审批事项", icon: FileCheck },
    ],
  },
  { id: "warehouse-info", label: "仓储信息管理", icon: Warehouse },
  { id: "material", label: "物资管理", icon: Package },
  {
    id: "order",
    label: "订单管理",
    icon: ShoppingCart,
    children: [
      { id: "warehouse-rent", label: "仓储出租状态列表", icon: Warehouse },
      { id: "material-storage", label: "物资存储订单列表", icon: Package },
    ],
  },
  {
    id: "settlement",
    label: "结算管理",
    icon: CreditCard,
    children: [
      { id: "reconciliation", label: "对账管理", icon: Receipt },
      { id: "payment", label: "支付结算", icon: Wallet },
    ],
  },
  { id: "contract", label: "合同管理", icon: FileText },
]

// 仓储站点菜单
const warehouseSiteMenu: MenuItem[] = [
  { id: "enterprise", label: "企业中心", icon: Building2 },
  {
    id: "todo",
    label: "待办事项",
    icon: ClipboardList,
    children: [
      { id: "delegate", label: "委托受理", icon: CheckSquare },
      { id: "approval", label: "审批事项", icon: FileCheck },
    ],
  },
  { id: "warehouse-info", label: "仓储信息管理", icon: Warehouse },
  { id: "material", label: "物资管理", icon: Package },
  {
    id: "order",
    label: "订单管理",
    icon: ShoppingCart,
    children: [
      { id: "warehouse-rent", label: "仓储出租状态列表", icon: Warehouse },
      { id: "material-storage", label: "物资存储订单列表", icon: Package },
    ],
  },
  {
    id: "settlement",
    label: "结算管理",
    icon: CreditCard,
    children: [
      { id: "reconciliation", label: "对账管理", icon: Receipt },
      { id: "payment", label: "支付结算", icon: Wallet },
    ],
  },
  { id: "contract", label: "合同管理", icon: FileText },
]

// 专运单位菜单
const transportUnitMenu: MenuItem[] = [
  { id: "enterprise", label: "企业中心", icon: Building2 },
  {
    id: "todo",
    label: "待办事项",
    icon: ClipboardList,
    children: [
      { id: "delegate", label: "委托受理", icon: CheckSquare },
      { id: "approval", label: "审批事项", icon: FileCheck },
    ],
  },
  { id: "site", label: "站点管理", icon: MapPinned },
  { id: "material", label: "物资管理", icon: Package },
  {
    id: "warehouse-order",
    label: "仓储订单管理",
    icon: Warehouse,
    children: [
      { id: "warehouse-rent", label: "仓储出租状态列表", icon: Warehouse },
    ],
  },
  {
    id: "material-order",
    label: "物资订单管理",
    icon: Package,
    children: [
      { id: "material-rent", label: "物资出租订单列表", icon: Package },
    ],
  },
  {
    id: "settlement",
    label: "结算管理",
    icon: CreditCard,
    children: [
      { id: "reconciliation", label: "对账管理", icon: Receipt },
      { id: "payment", label: "支付结算", icon: Wallet },
    ],
  },
  { id: "contract", label: "合同管理", icon: FileText },
]

// 使用单位菜单
const userUnitMenu: MenuItem[] = [
  { id: "enterprise", label: "企业中心", icon: Building2 },
  {
    id: "todo",
    label: "待办事项",
    icon: ClipboardList,
    children: [
      { id: "delegate", label: "委托受理", icon: CheckSquare },
      { id: "approval", label: "审批事项", icon: FileCheck },
    ],
  },
  {
    id: "order",
    label: "订单管理",
    icon: ShoppingCart,
    children: [
      { id: "material-lease", label: "物资承租订单列表", icon: Package },
    ],
  },
  {
    id: "settlement",
    label: "结算管理",
    icon: CreditCard,
    children: [
      { id: "reconciliation", label: "对账管理", icon: Receipt },
      { id: "payment", label: "支付结算", icon: Wallet },
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
  },
  {
    id: "personal-property",
    label: "个人工作台-物权单位",
    icon: Building2,
    description: "物权单位业务管理",
    items: propertyOwnerMenu,
  },
  {
    id: "personal-warehouse-unit",
    label: "个人工作台-仓储单位",
    icon: Warehouse,
    description: "仓储单位业务管理",
    items: warehouseUnitMenu,
  },
  {
    id: "personal-warehouse-site",
    label: "个人工作台-仓储站点",
    icon: MapPin,
    description: "仓储站点业务管理",
    items: warehouseSiteMenu,
  },
  {
    id: "personal-transport",
    label: "个人工作台-专运单位",
    icon: Truck,
    description: "专运单位业务管理",
    items: transportUnitMenu,
  },
  {
    id: "personal-user",
    label: "个人工作台-使用单位",
    icon: Users,
    description: "使用单位业务管理",
    items: userUnitMenu,
  },
  {
    id: "operation",
    label: "运营工作台",
    icon: Settings,
    description: "运营管理后台",
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
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    )
  }

  const handleSectionClick = (section: MenuSection) => {
    if (section.items && section.items.length > 0) {
      if (!collapsed) {
        toggleSection(section.id)
      }
      // 默认选中第一个菜单项
      const firstItem = section.items[0]
      if (firstItem.children && firstItem.children.length > 0) {
        onTabChange(section.id, `${firstItem.id}-${firstItem.children[0].id}`)
      } else {
        onTabChange(section.id, firstItem.id)
      }
    } else {
      onTabChange(section.id)
    }
  }

  const handleMenuClick = (sectionId: string, item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      toggleMenu(`${sectionId}-${item.id}`)
      // 默认选中第一个子菜单
      onTabChange(sectionId, `${item.id}-${item.children[0].id}`)
    } else {
      onTabChange(sectionId, item.id)
    }
  }

  const handleSubMenuClick = (sectionId: string, menuId: string, subId: string) => {
    onTabChange(sectionId, `${menuId}-${subId}`)
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-72"
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
            <span className="text-xs text-sidebar-foreground/60">循环物资平台</span>
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
                    const menuKey = `${section.id}-${item.id}`
                    const isMenuExpanded = expandedMenus.includes(menuKey)
                    const hasChildren = item.children && item.children.length > 0
                    const isItemActive = activeSubTab === item.id || activeSubTab.startsWith(`${item.id}-`)

                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => handleMenuClick(section.id, item)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm",
                            isItemActive
                              ? "bg-sidebar-primary/20 text-sidebar-foreground"
                              : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                          )}
                        >
                          <ItemIcon className="w-4 h-4 shrink-0" />
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {hasChildren && (
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 shrink-0 transition-transform duration-200",
                                isMenuExpanded && "rotate-180"
                              )}
                            />
                          )}
                        </button>

                        {/* 三级菜单 */}
                        {hasChildren && isMenuExpanded && (
                          <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border/50 pl-3">
                            {item.children!.map((subItem) => {
                              const SubIcon = subItem.icon
                              const isSubActive = activeSubTab === `${item.id}-${subItem.id}`
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() => handleSubMenuClick(section.id, item.id, subItem.id)}
                                  className={cn(
                                    "w-full flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-xs",
                                    isSubActive
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/60 hover:text-sidebar-foreground"
                                  )}
                                >
                                  <SubIcon className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{subItem.label}</span>
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
