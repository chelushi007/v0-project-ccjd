"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { FrontendPage } from "@/components/frontend/frontend-page"
import { WarehouseMapPage } from "@/components/frontend/warehouse-map-page"
import { WarehouseListPage } from "@/components/frontend/warehouse-list-page"
import { SmartMatchPage } from "@/components/frontend/smart-match-page"
import { PropertyOwnerWorkbench } from "@/components/workbench/roles/property-owner-workbench"
import { WarehouseUnitWorkbench } from "@/components/workbench/roles/warehouse-unit-workbench"
import { WarehouseSiteWorkbench } from "@/components/workbench/roles/warehouse-site-workbench"
import { TransportUnitWorkbench } from "@/components/workbench/roles/transport-unit-workbench"
import { UserUnitWorkbench } from "@/components/workbench/roles/user-unit-workbench"
import { OperationWorkbench } from "@/components/workbench/operation-workbench"
import { cn } from "@/lib/utils"
import { Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("frontend")
  const [activeSubTab, setActiveSubTab] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // 二级页面状态
  const [currentPage, setCurrentPage] = useState("frontend")

  const handleTabChange = (tab: string, subTab?: string) => {
    setActiveTab(tab)
    setCurrentPage(tab) // 重置二级页面
    if (subTab) {
      setActiveSubTab(subTab)
    } else {
      setActiveSubTab("")
    }
  }

  // 页面内导航（用于二级页面）
  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const renderContent = () => {
    // 处理前台二级页面
    if (activeTab === "frontend") {
      switch (currentPage) {
        case "warehouse-map-page":
          return <WarehouseMapPage onNavigate={handleNavigate} />
        case "warehouse-list":
          return <WarehouseListPage onNavigate={handleNavigate} />
        case "smart-match":
          return <SmartMatchPage onNavigate={handleNavigate} />
        default:
          return <FrontendPage onNavigate={handleNavigate} />
      }
    }

    // 其他工作台页面
    switch (activeTab) {
      case "personal-property":
        return <PropertyOwnerWorkbench subTab={activeSubTab} />
      case "personal-warehouse-unit":
        return <WarehouseUnitWorkbench subTab={activeSubTab} />
      case "personal-warehouse-site":
        return <WarehouseSiteWorkbench subTab={activeSubTab} />
      case "personal-transport":
        return <TransportUnitWorkbench subTab={activeSubTab} />
      case "personal-user":
        return <UserUnitWorkbench subTab={activeSubTab} />
      case "operation":
        return <OperationWorkbench />
      default:
        return <FrontendPage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 侧边栏 */}
      <AppSidebar
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        onTabChange={handleTabChange}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* 主内容区域 */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-72"
        )}
      >
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-end px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-auto"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            {/* 通知按钮 */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            {/* 用户菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden md:inline text-sm">管理员</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>个人信息</DropdownMenuItem>
                <DropdownMenuItem>账户设置</DropdownMenuItem>
                <DropdownMenuItem>帮助中心</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
