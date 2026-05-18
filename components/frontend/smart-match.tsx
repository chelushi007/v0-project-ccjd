"use client"

import { useState } from "react"
import {
  Sparkles,
  ArrowRight,
  Warehouse,
  Search,
  ShoppingCart,
  Lightbulb,
  List,
  LayoutGrid,
  MapPin,
  Maximize2,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SmartMatchProps {
  onNavigate?: (page: string) => void
}

const quickEntries = [
  {
    key: "rent",
    title: "仓储承租",
    desc: "找仓库",
    icon: Warehouse,
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    hoverText: "group-hover:text-primary",
    hoverBorder: "hover:border-primary/60",
  },
  {
    key: "material",
    title: "物资寻租",
    desc: "找租赁物资",
    icon: Search,
    iconBg: "bg-accent/10",
    iconText: "text-accent",
    hoverText: "group-hover:text-accent",
    hoverBorder: "hover:border-accent/60",
  },
  {
    key: "purchase",
    title: "物资采购",
    desc: "找出售物资",
    icon: ShoppingCart,
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    hoverText: "group-hover:text-emerald-600",
    hoverBorder: "hover:border-emerald-400/70",
  },
] as const

type MatchKind = "warehouse" | "material" | "purchase"

type MatchResult = {
  id: number
  kind: MatchKind
  title: string
  location: string
  meta: string
  price: string
  unit: string
  match: number
  tag: string
}

const matchResults: MatchResult[] = [
  {
    id: 1,
    kind: "warehouse",
    title: "广州南沙保税综合仓 B3 区 8000㎡",
    location: "广东省广州市南沙区",
    meta: "可分租 · 9% 增票 · 行吊 16-32T",
    price: "0.56",
    unit: "元/m²/天",
    match: 97,
    tag: "高匹配",
  },
  {
    id: 2,
    kind: "material",
    title: "二手钢管扣件 约 500 吨",
    location: "广东省广州市黄埔区",
    meta: "八成新 · 可检测 · 量大优惠",
    price: "12",
    unit: "元/吨/天",
    match: 92,
    tag: "推荐",
  },
  {
    id: 3,
    kind: "warehouse",
    title: "深圳前海智慧仓储 A 区 3500㎡",
    location: "广东省深圳市南山区",
    meta: "WMS 系统 · 恒温区 · 自动化",
    price: "0.92",
    unit: "元/m²/天",
    match: 89,
    tag: "推荐",
  },
  {
    id: 4,
    kind: "purchase",
    title: "建筑模板 约 1000 张 (转售)",
    location: "广东省佛山市顺德区",
    meta: "六成新 · 批量优惠 · 可自提",
    price: "45",
    unit: "元/张",
    match: 85,
    tag: "近期热门",
  },
  {
    id: 5,
    kind: "material",
    title: "塔吊标准节 10 节",
    location: "广东省东莞市虎门镇",
    meta: "九成新 · 原厂配件 · 检测报告",
    price: "1800",
    unit: "元/节/月",
    match: 81,
    tag: "推荐",
  },
  {
    id: 6,
    kind: "warehouse",
    title: "东莞虎门港大型堆场 12000㎡",
    location: "广东省东莞市虎门镇",
    meta: "近港口 · 24h 看管 · 重载地面",
    price: "0.46",
    unit: "元/m²/天",
    match: 78,
    tag: "推荐",
  },
]

const kindMeta: Record<
  MatchKind,
  { label: string; color: string; icon: typeof Warehouse }
> = {
  warehouse: { label: "仓储", color: "bg-primary/10 text-primary", icon: Warehouse },
  material: { label: "物资租赁", color: "bg-accent/10 text-accent", icon: Package },
  purchase: {
    label: "物资采购",
    color: "bg-emerald-100 text-emerald-600",
    icon: ShoppingCart,
  },
}

export function SmartMatch({ onNavigate }: SmartMatchProps) {
  const [view, setView] = useState<"list" | "card">("list")

  return (
    <section className="w-full h-full flex flex-col">
      {/* 标题区 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">智能匹配</h2>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5">
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors",
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
            aria-pressed={view === "list"}
            title="列表式"
          >
            <List className="w-3.5 h-3.5" />
            列表
          </button>
          <button
            type="button"
            onClick={() => setView("card")}
            className={cn(
              "px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors",
              view === "card"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
            aria-pressed={view === "card"}
            title="卡片式"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            卡片
          </button>
        </div>
      </div>

      {/* 单卡片包裹三入口 + 匹配结果，撑满与左侧同高 */}
      <Card className="flex-1">
        <CardContent className="p-4 flex flex-col h-full">
          {/* 三入口（始终显示，作为快捷入口） */}
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {quickEntries.map((entry) => {
              const Icon = entry.icon
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => onNavigate?.(`smart-match-${entry.key}`)}
                  className={cn(
                    "group rounded-lg border border-border bg-card p-2.5",
                    "flex items-center gap-2 transition-all hover:shadow-sm text-left",
                    entry.hoverBorder,
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      entry.iconBg,
                    )}
                  >
                    <Icon className={cn("w-4 h-4", entry.iconText)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "font-semibold text-sm text-card-foreground transition-colors truncate",
                        entry.hoverText,
                      )}
                    >
                      {entry.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {entry.desc}
                    </div>
                  </div>
                  <ArrowRight
                    className={cn(
                      "w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5",
                      entry.hoverText,
                    )}
                  />
                </button>
              )
            })}
          </div>

          {/* 匹配结果区 */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-foreground">为您匹配</div>
            <span className="text-[11px] text-muted-foreground">
              共 {matchResults.length} 条
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            {view === "list" ? (
              <ul className="divide-y divide-border rounded-md border border-border bg-card">
                {matchResults.map((item) => {
                  const meta = kindMeta[item.kind]
                  const Icon = meta.icon
                  return (
                    <li
                      key={item.id}
                      onClick={() => onNavigate?.("smart-match-result")}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                          meta.color,
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-card-foreground line-clamp-1">
                            {item.title}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0 shrink-0"
                          >
                            {item.tag}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[140px]">
                              {item.location}
                            </span>
                          </span>
                          <span className="truncate">{item.meta}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline gap-0.5 justify-end">
                          <span className="text-primary font-bold text-sm">
                            {item.price}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {item.unit}
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium tabular-nums">
                          匹配度 {item.match}%
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchResults.map((item) => {
                  const meta = kindMeta[item.kind]
                  const Icon = meta.icon
                  return (
                    <div
                      key={item.id}
                      onClick={() => onNavigate?.("smart-match-result")}
                      className="rounded-md border border-border bg-card p-2.5 hover:shadow-sm hover:border-primary/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] px-1 py-0 gap-0.5", meta.color)}
                        >
                          <Icon className="w-2.5 h-2.5" />
                          {meta.label}
                        </Badge>
                        <span className="text-[10px] text-emerald-600 font-medium tabular-nums">
                          匹配 {item.match}%
                        </span>
                      </div>
                      <div className="text-sm font-medium text-card-foreground line-clamp-1 mb-1">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground line-clamp-1 mb-1.5">
                        <Maximize2 className="w-3 h-3" />
                        <span className="truncate">{item.meta}</span>
                      </div>
                      <div className="flex items-baseline gap-0.5 pt-1.5 border-t border-border">
                        <span className="text-primary font-bold text-sm">
                          {item.price}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.unit}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 底部小贴士 */}
          <div className="mt-3 pt-2 border-t border-border flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-px text-muted-foreground/70" />
            <span>填写匹配条件越具体，命中结果越精准</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
