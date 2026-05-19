"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Map as MapIcon, List as ListIcon, Tags } from "lucide-react"
import { MaterialMap } from "./material-map"

interface MaterialMapPageProps {
  onNavigate?: (page: string) => void
}

export function MaterialMapPage({ onNavigate }: MaterialMapPageProps) {
  return (
    <div className="space-y-4">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm">
        <button
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          onClick={() => onNavigate?.("home")}
        >
          <Home className="w-4 h-4" />
          首页
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground font-medium">物资地图</span>

        <div className="ml-auto flex items-center gap-2">
          {/* 物资地图 / 物资列表 切换 */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button variant="secondary" size="sm" className="h-7">
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
          <Button size="sm" onClick={() => onNavigate?.("material-publish")}>
            <Tags className="w-4 h-4 mr-1" />
            发布物资
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">物资地图分布</h1>
            <p className="text-sm text-muted-foreground mt-1">
              按物资类型 × 地区交叉查询全国出租与出售需求，定位关联仓储与成交规模
            </p>
          </div>
        </div>

        <MaterialMap onNavigate={onNavigate} />
      </div>
    </div>
  )
}
