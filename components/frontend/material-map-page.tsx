"use client"

import { ChevronRight, Boxes, List as ListIcon, Map as MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MaterialMap } from "./material-map"
import { cn } from "@/lib/utils"

interface MaterialMapPageProps {
  onNavigate?: (page: string) => void
}

export function MaterialMapPage({ onNavigate }: MaterialMapPageProps) {
  return (
    <div className="space-y-4">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="link"
          className="p-0 h-auto text-muted-foreground hover:text-primary"
          onClick={() => onNavigate?.("home")}
        >
          首页
        </Button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">物资地图</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant="secondary"
              size="sm"
              className={cn("h-7")}
              onClick={() => onNavigate?.("material-map")}
            >
              <MapIcon className="w-4 h-4 mr-1" />
              物资地图
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={() => onNavigate?.("material-list")}
            >
              <ListIcon className="w-4 h-4 mr-1" />
              物资列表
            </Button>
          </div>
        </div>
      </div>

      {/* 顶部信息条 */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/8 via-accent/3 to-transparent">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground">物资地图</h1>
            <p className="text-sm text-muted-foreground line-clamp-1">
              按物资分类与地区双维度查看全国物资租售需求分布，地图与右侧推荐自动联动。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 物资地图主体 */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <MaterialMap onNavigate={onNavigate} />
        </CardContent>
      </Card>
    </div>
  )
}
