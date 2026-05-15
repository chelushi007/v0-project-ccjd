"use client"

import { FileText, ChevronRight, Package, Warehouse, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DemandPublishProps {
  onNavigate?: (page: string) => void
}

interface PublishItem {
  title: string
  desc: string
  page: string
}

interface PublishGroup {
  key: string
  title: string
  desc: string
  icon: typeof Warehouse
  accent: "primary" | "accent" | "emerald"
  items: PublishItem[]
}

const groups: PublishGroup[] = [
  {
    key: "warehouse",
    title: "仓储出租",
    desc: "发布仓储出租信息",
    icon: Warehouse,
    accent: "primary",
    items: [
      { title: "快捷发布", desc: "填写基础信息快速发布", page: "detail-publish-quick" },
      { title: "详细发布", desc: "填写完整信息精准匹配", page: "detail-publish-detail" },
    ],
  },
  {
    key: "material-rent",
    title: "物资出租",
    desc: "从循环物资库发布出租",
    icon: Package,
    accent: "accent",
    items: [{ title: "发布物资出租", desc: "引用循环物资库中的物资", page: "material-publish" }],
  },
  {
    key: "material-sale",
    title: "物资出售",
    desc: "发布闲置物资出售信息",
    icon: Tag,
    accent: "emerald",
    items: [{ title: "发布物资出售", desc: "面向全平台买家公开出售", page: "material-publish" }],
  },
]

const accentMap = {
  primary: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    hoverBorder: "hover:border-primary/50",
    hoverText: "group-hover:text-primary",
  },
  accent: {
    iconBg: "bg-accent/10",
    iconText: "text-accent",
    hoverBorder: "hover:border-accent/50",
    hoverText: "group-hover:text-accent",
  },
  emerald: {
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    hoverBorder: "hover:border-emerald-400/60",
    hoverText: "group-hover:text-emerald-600",
  },
} as const

export function DemandPublish({ onNavigate }: DemandPublishProps) {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">需求发布</h2>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
            {groups.map((group) => {
              const Icon = group.icon
              const accent = accentMap[group.accent]
              return (
                <div key={group.key} className="md:px-4 first:md:pl-0 last:md:pr-0 pt-6 md:pt-0 first:pt-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${accent.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${accent.iconText}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate">{group.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">{group.desc}</p>
                    </div>
                  </div>
                  <div className={`grid ${group.items.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                    {group.items.map((item) => (
                      <Card
                        key={item.title}
                        className={`cursor-pointer hover:shadow-md transition-all ${accent.hoverBorder} group`}
                        onClick={() => onNavigate?.(item.page)}
                      >
                        <CardContent className="p-4 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className={`font-medium text-sm text-card-foreground ${accent.hoverText} transition-colors truncate`}>
                              {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.desc}</p>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-muted-foreground ${accent.hoverText} transition-colors shrink-0`} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
