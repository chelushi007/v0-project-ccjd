"use client"

import { Sparkles, ArrowRight, Warehouse, Search, ShoppingCart, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export function SmartMatch({ onNavigate }: SmartMatchProps) {
  return (
    <section className="w-full h-full flex flex-col">
      {/* 标题区 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">智能匹配</h2>
        </div>
      </div>

      {/* 单卡片包裹三入口，撑满与左侧同高 */}
      <Card className="flex-1">
        <CardContent className="p-5 flex flex-col h-full">
          <p className="text-xs text-muted-foreground mb-3">
            选择匹配类型，平台基于行业大数据为您快速精准撮合
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {quickEntries.map((entry) => {
              const Icon = entry.icon
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => onNavigate?.(`smart-match-${entry.key}`)}
                  className={cn(
                    "group rounded-xl border border-border bg-card p-4",
                    "flex flex-col items-start gap-2 transition-all hover:shadow-sm text-left h-full",
                    entry.hoverBorder,
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        entry.iconBg,
                      )}
                    >
                      <Icon className={cn("w-5 h-5", entry.iconText)} />
                    </div>
                    <ArrowRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5",
                        entry.hoverText,
                      )}
                    />
                  </div>
                  <div className="mt-auto">
                    <div
                      className={cn(
                        "font-semibold text-sm text-card-foreground transition-colors",
                        entry.hoverText,
                      )}
                    >
                      {entry.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {entry.desc}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 底部小贴士 */}
          <div className="mt-4 pt-3 border-t border-border flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-px text-muted-foreground/70" />
            <span>填写匹配条件越具体，命中结果越精准</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
