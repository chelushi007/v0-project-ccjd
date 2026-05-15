"use client"

import { ChevronDown, Home, UserCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

type WorkbenchKind = "operation" | "personal" | "frontend"

interface AppTopbarProps {
  activeTab: string
  onNavigateFrontend?: () => void
  sidebarCollapsed?: boolean
}

const titleMap: Record<WorkbenchKind, string> = {
  operation: "运营工作台",
  personal: "用户工作台",
  frontend: "",
}

const companyOptions = [
  "中铁物资集团有限公司",
  "中铁建工集团有限公司",
  "中铁十四局集团有限公司",
  "中铁十六局集团有限公司",
  "中国铁建股份有限公司总部",
]

export function AppTopbar({
  activeTab,
  onNavigateFrontend,
  sidebarCollapsed = false,
}: AppTopbarProps) {
  const kind: WorkbenchKind =
    activeTab === "operation"
      ? "operation"
      : activeTab === "personal"
        ? "personal"
        : "frontend"

  const [company, setCompany] = useState(companyOptions[0])

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-40 h-16 flex items-center",
        "transition-[left] duration-300",
        sidebarCollapsed ? "left-16" : "left-64",
        "bg-[#262626] text-white",
        "border-b border-white/10 shadow-sm",
      )}
    >
      {/* 左侧：标题 */}
      <div className="flex items-center h-full pl-6 pr-6 min-w-0 flex-1">
        <h1 className="text-lg font-semibold leading-tight truncate">
          {titleMap[kind]}
        </h1>
      </div>

      {/* 右侧：公司选择 + 用户 + 门户入口 */}
      <div className="flex items-center gap-6 pr-6 shrink-0">
        {kind === "personal" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 h-9 px-4 rounded-full",
                  "bg-white/15 hover:bg-white/25 transition-colors",
                  "text-sm font-medium text-white",
                  "border border-white/20",
                )}
              >
                <span className="max-w-[200px] truncate">{company}</span>
                <ChevronDown className="w-4 h-4 opacity-80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>切换法人单位</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {companyOptions.map((c) => (
                <DropdownMenuItem
                  key={c}
                  onClick={() => setCompany(c)}
                  className={cn(c === company && "bg-accent/50 font-medium")}
                >
                  {c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <button className="flex items-center gap-2 text-sm hover:opacity-90 transition-opacity">
          <UserCircle2 className="w-5 h-5" />
          <span className="font-medium">王庆祥</span>
        </button>

        {kind !== "frontend" && (
          <button
            onClick={onNavigateFrontend}
            className="flex items-center gap-2 text-sm hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">循环资源门户</span>
          </button>
        )}
      </div>
    </header>
  )
}
