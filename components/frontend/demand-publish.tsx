"use client"

import { FileText, ChevronRight, Package, Warehouse, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
    desc: "对外发布仓储出租信息，触达精准承租方",
    icon: Warehouse,
    accent: "primary",
    items: [
      {
        title: "快捷发布",
        desc: "填写基础信息快速发布，几步上架",
        page: "detail-publish-quick",
      },
      {
        title: "详细发布",
        desc: "完善规格 / 配套 / 资质，提升匹配精度",
        page: "detail-publish-detail",
      },
    ],
  },
  {
    key: "material-rent",
    title: "物资出租",
    desc: "从循环物资库引用资产，发布对外出租",
    icon: Package,
    accent: "accent",
    items: [
      {
        title: "发布物资出租",
        desc: "选择循环物资库中的物资资产，约定计费方式",
        page: "material-publish",
      },
    ],
  },
  {
    key: "material-sale",
    title: "物资出售",
    desc: "面向全平台买家公开出售闲置物资",
    icon: Tag,
    accent: "emerald",
    items: [
      {
        title: "发布物资出售",
        desc: "上传规格、成色、价格，支持议价与整批出售",
        page: "material-publish",
      },
    ],
  },
]

const accentMap = {
  primary: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    hoverBorder: "hover:border-primary/60",
    hoverText: "group-hover:text-primary",
    chip: "bg-primary/5 text-primary border-primary/20",
  },
  accent: {
    iconBg: "bg-accent/10",
    iconText: "text-accent",
    hoverBorder: "hover:border-accent/60",
    hoverText: "group-hover:text-accent",
    chip: "bg-accent/5 text-accent border-accent/20",
  },
  emerald: {
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    hoverBorder: "hover:border-emerald-400/70",
    hoverText: "group-hover:text-emerald-600",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
} as const

export function DemandPublish({ onNavigate }: DemandPublishProps) {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">需求发布</h2>
          <span className="text-xs text-muted-foreground hidden md:inline">
            一站式发布仓储 / 物资资源
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map((group) => {
          const Icon = group.icon
          const accent = accentMap[group.accent]
          return (
            <Card key={group.key} className="overflow-hidden">
              <CardContent className="p-5 flex flex-col h-full">
                {/* 分组标题区 */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                      accent.iconBg,
                    )}
                  >
                    <Icon className={cn("w-5 h-5", accent.iconText)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-card-foreground leading-tight">
                        {group.title}
                      </h3>
                      <span
                        className={cn(
                          "text-[11px] px-1.5 py-0.5 rounded border leading-none",
                          accent.chip,
                        )}
                      >
                        {group.items.length} 个入口
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {group.desc}
                    </p>
                  </div>
                </div>

                {/* 入口列表 */}
                <div className="flex flex-col gap-2 mt-auto">
                  {group.items.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => onNavigate?.(item.page)}
                      className={cn(
                        "group text-left rounded-lg border border-border bg-card",
                        "px-3 py-3 flex items-center gap-3 transition-all",
                        "hover:shadow-sm",
                        accent.hoverBorder,
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "font-medium text-sm text-card-foreground leading-tight transition-colors",
                            accent.hoverText,
                          )}
                        >
                          {item.title}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
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
