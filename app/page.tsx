"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { FrontendPage } from "@/components/frontend/frontend-page"
import { WarehouseMapPage } from "@/components/frontend/warehouse-map-page"
import { WarehouseListPage } from "@/components/frontend/warehouse-list-page"
import { SmartMatchPage } from "@/components/frontend/smart-match-page"
import { DetailPublishPage } from "@/components/frontend/detail-publish-page"
import { MaterialPublishPage } from "@/components/frontend/material-publish-page"
import { PersonalWorkbench } from "@/components/workbench/personal-workbench"
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
  const [activeSubTab, setActiveSubTab] = useState("home")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // 二级页面状态
  const [currentPage, setCurrentPage] = useState("home")
  // 发布页面默认tab
  const [publishDefaultTab, setPublishDefaultTab] = useState<"quick" | "detail">("quick")

  const handleTabChange = (tab: string, subTab?: string) => {
    setActiveTab(tab)
    if (tab === "frontend" && subTab) {
      setActiveSubTab(subTab)
      // 根据子菜单设置当前页面
      if (subTab === "home") {
        setCurrentPage("home")
      } else if (subTab === "warehouse-list") {
        setCurrentPage("warehouse-list")
      } else if (subTab === "warehouse-map") {
        setCurrentPage("warehouse-map")
      } else if (subTab === "detail-publish") {
        setCurrentPage("detail-publish")
        setPublishDefaultTab("quick") // 从侧边栏进入默认显示快捷发布
      } else if (subTab === "material-publish") {
        setCurrentPage("material-publish")
      }
    } else if (subTab) {
      setActiveSubTab(subTab)
    } else {
      setActiveSubTab("")
      setCurrentPage(tab)
    }
  }

  // 页面内导航（用于二级页面）
  const handleNavigate = (page: string) => {
    // 处理发布页面带tab参数
    if (page === "detail-publish-quick") {
      setCurrentPage("detail-publish")
      setPublishDefaultTab("quick")
      setActiveSubTab("detail-publish")
      return
    } else if (page === "detail-publish-detail") {
      setCurrentPage("detail-publish")
      setPublishDefaultTab("detail")
      setActiveSubTab("detail-publish")
      return
    } else if (page === "material-publish") {
      setCurrentPage("material-publish")
      setActiveSubTab("material-publish")
      return
    }

    setCurrentPage(page)
    // 更新侧边栏选中状态
    if (page === "home") {
      setActiveSubTab("home")
    } else if (page === "warehouse-list") {
      setActiveSubTab("warehouse-list")
    } else if (page === "warehouse-map") {
      setActiveSubTab("warehouse-map")
    } else if (page === "detail-publish") {
      setActiveSubTab("detail-publish")
    } else if (page === "material-publish") {
      setActiveSubTab("material-publish")
    }
  }

  const renderContent = () => {
    // 处理前台二级页面
    if (activeTab === "frontend") {
      switch (currentPage) {
        case "warehouse-map":
          return <WarehouseMapPage onNavigate={handleNavigate} />
        case "warehouse-list":
          return <WarehouseListPage onNavigate={handleNavigate} />
        case "smart-match":
          return <SmartMatchPage onNavigate={handleNavigate} />
        case "detail-publish":
          return <DetailPublishPage onNavigate={handleNavigate} defaultTab={publishDefaultTab} />
        case "material-publish":
          return <MaterialPublishPage onNavigate={handleNavigate} />
        case "home":
        default:
          return <FrontendPage onNavigate={handleNavigate} />
      }
    }

    // 个人工作台
    if (activeTab === "personal") {
      return <PersonalWorkbench activeSubTab={activeSubTab} />
    }

    // 运营方工作台
    if (activeTab === "operation") {
      return <OperationWorkbench activeSubTab={activeSubTab} />
    }

    return <FrontendPage onNavigate={handleNavigate} />
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
          sidebarCollapsed ? "ml-16" : "ml-64"
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
