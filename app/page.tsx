"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { FrontendPage } from "@/components/frontend/frontend-page"
import { WarehouseMapPage } from "@/components/frontend/warehouse-map-page"
import { WarehouseListPage } from "@/components/frontend/warehouse-list-page"
import { MaterialListPage } from "@/components/frontend/material-list-page"
import { SmartMatchPage } from "@/components/frontend/smart-match-page"
import { DetailPublishPage } from "@/components/frontend/detail-publish-page"
import { WarehouseDetailPage } from "@/components/frontend/warehouse-detail-page"
import { TransportDetailPage } from "@/components/frontend/transport-detail-page"
import { MaterialDetailPage } from "@/components/frontend/material-detail-page"
import { MaterialPublishPage } from "@/components/frontend/material-publish-page"
import { PersonalWorkbench } from "@/components/workbench/personal-workbench"
import { OperationWorkbench } from "@/components/workbench/operation-workbench"
import { cn } from "@/lib/utils"
import { AppTopbar } from "@/components/app-topbar"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("frontend")
  const [activeSubTab, setActiveSubTab] = useState("home")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // 二级页面状态
  const [currentPage, setCurrentPage] = useState("home")
  // 发布页面默认tab
  const [publishDefaultTab, setPublishDefaultTab] = useState<"quick" | "detail">("quick")
  // 智能匹配默认需求类型
  const [smartMatchInitialType, setSmartMatchInitialType] = useState<
    "rent" | "material" | "purchase"
  >("rent")

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
      } else if (subTab === "material-list") {
        setCurrentPage("material-list")
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
    } else if (
      page === "smart-match-rent" ||
      page === "smart-match-material" ||
      page === "smart-match-purchase"
    ) {
      const type = page.replace("smart-match-", "") as
        | "rent"
        | "material"
        | "purchase"
      setSmartMatchInitialType(type)
      setCurrentPage("smart-match")
      setActiveSubTab("smart-match")
      return
    } else if (page === "smart-match") {
      setSmartMatchInitialType("rent")
      setCurrentPage("smart-match")
      setActiveSubTab("smart-match")
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
    } else if (page === "material-list") {
      setActiveSubTab("material-list")
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
        case "material-list":
          return <MaterialListPage onNavigate={handleNavigate} />
        case "smart-match":
          return (
            <SmartMatchPage
              onNavigate={handleNavigate}
              initialType={smartMatchInitialType}
            />
          )
        case "detail-publish":
          return <DetailPublishPage onNavigate={handleNavigate} defaultTab={publishDefaultTab} />
        case "warehouse-detail":
          return <WarehouseDetailPage onNavigate={handleNavigate} />
        case "transport-detail":
          return <TransportDetailPage onNavigate={handleNavigate} />
        case "material-detail":
          return <MaterialDetailPage onNavigate={handleNavigate} />
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
      {/* 全局顶栏 */}
      <AppTopbar
        activeTab={activeTab}
        onNavigateFrontend={() => handleTabChange("frontend", "home")}
        sidebarCollapsed={sidebarCollapsed}
      />

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
          "transition-all duration-300 pt-16",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* 页面内容 */}
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
