"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Home,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Warehouse,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

const menuItems = [
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
  onTabChange,
  collapsed,
  onCollapsedChange,
}: AppSidebarProps) {
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
      <nav className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && (
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-sidebar-foreground/50">{item.description}</span>
                </div>
              )}
            </button>
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
