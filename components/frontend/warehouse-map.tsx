"use client"

import { useState } from "react"
import { MapPin, Maximize2, Filter, List, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const regions = [
  { id: "south", name: "华南", count: 128, color: "bg-primary" },
  { id: "east", name: "华东", count: 95, color: "bg-accent" },
  { id: "north", name: "华北", count: 76, color: "bg-chart-3" },
  { id: "central", name: "华中", count: 64, color: "bg-chart-4" },
  { id: "southwest", name: "西南", count: 52, color: "bg-chart-5" },
  { id: "northwest", name: "西北", count: 38, color: "bg-muted-foreground" },
  { id: "northeast", name: "东北", count: 45, color: "bg-chart-1" },
]

const hotCities = [
  { name: "广州", count: 45 },
  { name: "深圳", count: 38 },
  { name: "上海", count: 42 },
  { name: "北京", count: 35 },
  { name: "成都", count: 28 },
  { name: "武汉", count: 25 },
]

export function WarehouseMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">仓储地图</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "map" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              地图
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4 mr-1" />
              列表
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            筛选
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* 地图区域 - 模拟中国地图分区 */}
            <div className="lg:col-span-3 p-6 bg-muted/30 min-h-[400px] relative">
              <div className="absolute inset-6 flex items-center justify-center">
                {/* 简化的区域分布展示 */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                  {regions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => setSelectedRegion(region.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all hover:scale-105",
                        selectedRegion === region.id
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="text-center">
                        <div className={cn("w-4 h-4 rounded-full mx-auto mb-2", region.color)} />
                        <h3 className="font-medium text-card-foreground">{region.name}</h3>
                        <p className="text-2xl font-bold text-primary mt-1">{region.count}</p>
                        <p className="text-xs text-muted-foreground">个站点</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 热门城市列表 */}
            <div className="border-l border-border p-4">
              <h3 className="font-medium text-card-foreground mb-4">热门城市</h3>
              <div className="space-y-3">
                {hotCities.map((city, index) => (
                  <div
                    key={city.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-5 h-5 rounded flex items-center justify-center text-xs font-medium",
                        index < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                      <span className="text-card-foreground">{city.name}</span>
                    </div>
                    <Badge variant="secondary">{city.count}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-primary">
                查看全部城市
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
