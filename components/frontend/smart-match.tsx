"use client"

import { Sparkles, ArrowRight, Warehouse, Search, ShoppingCart } from "lucide-react"
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
    icon: Warehouse,
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    hoverText: "group-hover:text-primary",
    hoverBorder: "hover:border-primary/60",
  },
  {
    key: "material",
    title: "物资寻找",
    icon: Search,
    iconBg: "bg-accent/10",
    iconText: "text-accent",
    hoverText: "group-hover:text-accent",
    hoverBorder: "hover:border-accent/60",
  },
  {
    key: "purchase",
    title: "物资采购",
    icon: ShoppingCart,
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    hoverText: "group-hover:text-emerald-600",
    hoverBorder: "hover:border-emerald-400/70",
  },
] as const

export function SmartMatch({ onNavigate }: SmartMatchProps) {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">智能匹配</h2>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            AI 匹配
          </Badge>
        </div>
        <Button
          variant="link"
          className="text-primary"
          onClick={() => onNavigate?.("smart-match")}
        >
          进入智能匹配
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickEntries.map((entry) => {
              const Icon = entry.icon
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => onNavigate?.("smart-match")}
                  className={cn(
                    "group rounded-xl border border-border bg-card p-4",
                    "flex items-center gap-3 transition-all hover:shadow-sm text-left",
                    entry.hoverBorder,
                  )}
                >
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                      entry.iconBg,
                    )}
                  >
                    <Icon className={cn("w-5 h-5", entry.iconText)} />
                  </div>
                  <span
                    className={cn(
                      "font-medium text-sm text-card-foreground transition-colors",
                      entry.hoverText,
                    )}
                  >
                    {entry.title}
                  </span>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 ml-auto text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5",
                      entry.hoverText,
                    )}
                  />
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
