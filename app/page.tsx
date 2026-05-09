"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { FrontendPage } from "@/components/frontend/frontend-page"
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

const subTabNames: Record<string, string> = {
  enterprise: "企业中心",
  todo: "待办事项",
  "warehouse-info": "仓储信息管理",
  order: "订单管理",
  contract: "合同管理",
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("frontend")
  const [activeSubTab, setActiveSubTab] = useState("enterprise")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleTabChange = (tab: string, subTab?: string) => {
    setActiveTab(tab)
    if (subTab) {
      setActiveSubTab(subTab)
    } else if (tab === "personal") {
      setActiveSubTab("enterprise")
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "frontend":
        return <FrontendPage />
      case "personal":
        return <PersonalWorkbench activeSubTab={activeSubTab} />
      case "operation":
        return <OperationWorkbench />
      default:
        return <FrontendPage />
    }
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "frontend":
        return "仓储基地门户"
      case "personal":
        return `个人工作台 - ${subTabNames[activeSubTab] || "企业中心"}`
      case "operation":
        return "运营工作台"
      default:
        return "仓储基地"
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
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-card-foreground">{getPageTitle()}</h1>
          </div>

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
