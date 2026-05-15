"use client"

import { FileText, ChevronRight, Package, Warehouse, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DemandPublishProps {
  onNavigate?: (page: string) => void
}

interface PublishItem {
  title: string
  page: string
}

interface PublishGroup {
  key: string
  title: string
  icon: typeof Warehouse
  accent: "primary" | "accent" | "emerald"
  items: PublishItem[]
}

const groups: PublishGroup[] = [
  {
    key: "warehouse",
    title: "仓储出租",
    icon: Warehouse,
    accent: "primary",
    items: [
      { title: "快捷发布", page: "detail-publish-quick" },
      { title: "详细发布", page: "detail-publish-detail" },
    ],
  },
  {
    key: "material-rent",
    title: "物资出租",
    icon: Package,
    accent: "accent",
    items: [{ title: "发布出租", page: "material-publish" }],
  },
  {
    key: "material-sale",
    title: "物资出售",
    icon: Tag,
    accent: "emerald",
    items: [{ title: "发布出售", page: "material-publish" }],
  },
]

const accentMap = {
  primary: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    hoverBorder: "hover:border-primary/60",
    hoverText: "group-hover:text-primary",
  },
  accent: {
    iconBg: "bg-accent/10",
    iconText: "text-accent",
    hoverBorder: "hover:border-accent/60",
    hoverText: "group-hover:text-accent",
  },
  emerald: {
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    hoverBorder: "hover:border-emerald-400/70",
    hoverText: "group-hover:text-emerald-600",
  },
} as const

export function DemandPublish({ onNavigate }: DemandPublishProps) {
  return (
    <section className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">需求发布</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((group) => {
          const Icon = group.icon
          const accent = accentMap[group.accent]
          return (
            <Card key={group.key} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      accent.iconBg,
                    )}
                  >
                    <Icon className={cn("w-5 h-5", accent.iconText)} />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    {group.title}
                  </h3>
                </div>

                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => onNavigate?.(item.page)}
                      className={cn(
                        "group rounded-lg border border-border bg-card",
                        "px-3 py-2.5 flex items-center justify-between gap-2 transition-all",
                        "hover:shadow-sm",
                        accent.hoverBorder,
                      )}
                    >
                      <span
                        className={cn(
                          "font-medium text-sm text-card-foreground transition-colors",
                          accent.hoverText,
                        )}
                      >
                        {item.title}
                      </span>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5",
                          accent.hoverText,
                        )}
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
