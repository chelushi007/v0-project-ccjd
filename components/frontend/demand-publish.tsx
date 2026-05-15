"use client"

import { FileText, ChevronRight, Boxes, Warehouse, Lightbulb } from "lucide-react"
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
  subtitle: string
  icon: typeof Warehouse
  accent: "primary" | "accent"
  items: PublishItem[]
}

const groups: PublishGroup[] = [
  {
    key: "warehouse",
    title: "仓储出租",
    subtitle: "发布闲置仓储资源",
    icon: Warehouse,
    accent: "primary",
    items: [
      { title: "快捷发布", desc: "极简流程", page: "detail-publish-quick" },
      { title: "详细发布", desc: "完整信息", page: "detail-publish-detail" },
    ],
  },
  {
    key: "material",
    title: "物资运营",
    subtitle: "盘活闲置物资资产",
    icon: Boxes,
    accent: "accent",
    items: [
      { title: "物资出租", desc: "周期租赁", page: "material-publish" },
      { title: "物资出售", desc: "一次性处置", page: "material-publish" },
    ],
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
} as const

export function DemandPublish({ onNavigate }: DemandPublishProps) {
  return (
    <section className="w-full h-full flex flex-col">
      {/* 标题区 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">需求发布</h2>
        </div>
      </div>

      {/* 卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {groups.map((group) => {
          const Icon = group.icon
          const accent = accentMap[group.accent]
          return (
            <Card key={group.key} className="overflow-hidden h-full">
              <CardContent className="p-5 flex flex-col h-full">
                {/* 分组标题 */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                      accent.iconBg,
                    )}
                  >
                    <Icon className={cn("w-5 h-5", accent.iconText)} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-card-foreground leading-tight">
                      {group.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {group.subtitle}
                    </p>
                  </div>
                </div>

                {/* 入口按钮 */}
                <div className="grid grid-cols-2 gap-2 mt-3 flex-1">
                  {group.items.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => onNavigate?.(item.page)}
                      className={cn(
                        "group rounded-lg border border-border bg-card",
                        "px-3 py-3 flex flex-col items-start gap-1 transition-all text-left",
                        "hover:shadow-sm",
                        accent.hoverBorder,
                      )}
                    >
                      <span
                        className={cn(
                          "font-medium text-sm text-card-foreground transition-colors flex items-center w-full justify-between",
                          accent.hoverText,
                        )}
                      >
                        {item.title}
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5",
                            accent.hoverText,
                          )}
                        />
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>

                {/* 底部小贴士 */}
                <div className="mt-4 pt-3 border-t border-border flex items-start gap-1.5 text-[11px] text-muted-foreground">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-px text-muted-foreground/70" />
                  <span>
                    {group.key === "warehouse"
                      ? "填写越完整，撮合越精准"
                      : "支持多张图片与规格参数上传"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
