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
}

const titleMap: Record<WorkbenchKind, string> = {
  operation: "运营工作台",
  personal: "用户工作台",
  frontend: "循环物资门户",
}

const companyOptions = [
  "中铁物资集团有限公司",
  "中铁建工集团有限公司",
  "中铁十四局集团有限公司",
  "中铁十六局集团有限公司",
  "中国铁建股份有限公司总部",
]

export function AppTopbar({ activeTab, onNavigateFrontend }: AppTopbarProps) {
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
        "fixed top-0 left-0 right-0 z-50 h-16 flex items-center",
        "bg-gradient-to-r from-[#0b4ea2] via-[#1864c2] to-[#2a85e0]",
        "text-white shadow-[0_2px_8px_rgba(11,78,162,0.25)]",
      )}
    >
      {/* 左侧：Logo + 标题 + 副标 */}
      <div className="flex items-stretch h-full pl-5 pr-6 min-w-0 flex-1">
        {/* CRCC Logo 占位 */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white/95 shadow-sm">
            <span className="text-[10px] font-extrabold text-[#0b4ea2] leading-none tracking-tight">
              CRCC
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] tracking-[0.18em] text-white/80 font-medium">
              中国铁建
            </span>
            <span className="text-[10px] tracking-[0.18em] text-white/60">
              CRCC
            </span>
          </div>
        </div>

        {/* 竖向分割线 */}
        <div className="mx-5 my-3 w-px bg-white/25" />

        {/* 标题 + 副标 */}
        <div className="flex flex-col justify-center min-w-0">
          <h1 className="text-lg font-semibold leading-tight truncate">
            {titleMap[kind]}
          </h1>
          <p className="text-[11px] text-white/75 truncate">
            闲置废旧物资的管理以及同法人调拨/租赁管理
          </p>
        </div>
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

        <button
          onClick={onNavigateFrontend}
          className="flex items-center gap-2 text-sm hover:opacity-90 transition-opacity"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">循环物资门户</span>
        </button>
      </div>
    </header>
  )
}
