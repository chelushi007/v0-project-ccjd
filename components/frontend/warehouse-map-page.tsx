"use client"

import { useState } from "react"
import { MapPin, Building2, Maximize2, Grid3X3, List, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WarehouseMapPageProps {
  onNavigate?: (page: string) => void
}

// 省份数据
const provinces = [
  { id: "guangdong", name: "广东", warehouses: 23, totalArea: 23422, rentableArea: 20110, infoCount: 897, position: { x: 76, y: 78 } },
  { id: "guangxi", name: "广西", warehouses: 12, totalArea: 8500, rentableArea: 6200, infoCount: 234, position: { x: 68, y: 76 } },
  { id: "fujian", name: "福建", warehouses: 15, totalArea: 12000, rentableArea: 8500, infoCount: 356, position: { x: 82, y: 68 } },
  { id: "jiangxi", name: "江西", warehouses: 10, totalArea: 7800, rentableArea: 5600, infoCount: 198, position: { x: 78, y: 64 } },
  { id: "hunan", name: "湖南", warehouses: 14, totalArea: 10500, rentableArea: 7800, infoCount: 287, position: { x: 72, y: 62 } },
  { id: "hubei", name: "湖北", warehouses: 18, totalArea: 15000, rentableArea: 11200, infoCount: 423, position: { x: 72, y: 56 } },
  { id: "henan", name: "河南", warehouses: 20, totalArea: 18000, rentableArea: 14000, infoCount: 512, position: { x: 72, y: 48 } },
  { id: "shandong", name: "山东", warehouses: 25, totalArea: 22000, rentableArea: 17500, infoCount: 634, position: { x: 78, y: 44 } },
  { id: "jiangsu", name: "江苏", warehouses: 28, totalArea: 25000, rentableArea: 19800, infoCount: 756, position: { x: 80, y: 52 } },
  { id: "zhejiang", name: "浙江", warehouses: 22, totalArea: 19500, rentableArea: 15200, infoCount: 567, position: { x: 84, y: 58 } },
  { id: "anhui", name: "安徽", warehouses: 13, totalArea: 9800, rentableArea: 7200, infoCount: 276, position: { x: 78, y: 56 } },
  { id: "shanghai", name: "上海", warehouses: 30, totalArea: 28000, rentableArea: 21000, infoCount: 823, position: { x: 84, y: 54 } },
  { id: "beijing", name: "北京", warehouses: 35, totalArea: 32000, rentableArea: 24500, infoCount: 945, position: { x: 74, y: 36 } },
  { id: "tianjin", name: "天津", warehouses: 16, totalArea: 13500, rentableArea: 10200, infoCount: 389, position: { x: 76, y: 38 } },
  { id: "hebei", name: "河北", warehouses: 19, totalArea: 16000, rentableArea: 12500, infoCount: 456, position: { x: 74, y: 40 } },
  { id: "shanxi", name: "山西", warehouses: 11, totalArea: 8200, rentableArea: 6100, infoCount: 212, position: { x: 70, y: 42 } },
  { id: "shaanxi", name: "陕西", warehouses: 12, totalArea: 9500, rentableArea: 7000, infoCount: 267, position: { x: 66, y: 48 } },
  { id: "gansu", name: "甘肃", warehouses: 8, totalArea: 5800, rentableArea: 4200, infoCount: 145, position: { x: 54, y: 42 } },
  { id: "qinghai", name: "青海", warehouses: 4, totalArea: 2500, rentableArea: 1800, infoCount: 56, position: { x: 48, y: 44 } },
  { id: "ningxia", name: "宁夏", warehouses: 5, totalArea: 3200, rentableArea: 2400, infoCount: 78, position: { x: 62, y: 42 } },
  { id: "xinjiang", name: "新疆", warehouses: 6, totalArea: 4500, rentableArea: 3200, infoCount: 98, position: { x: 32, y: 36 } },
  { id: "xizang", name: "西藏", warehouses: 2, totalArea: 1200, rentableArea: 800, infoCount: 23, position: { x: 36, y: 54 } },
  { id: "sichuan", name: "四川", warehouses: 21, totalArea: 18500, rentableArea: 14200, infoCount: 534, position: { x: 58, y: 58 } },
  { id: "chongqing", name: "重庆", warehouses: 15, totalArea: 12500, rentableArea: 9500, infoCount: 367, position: { x: 64, y: 58 } },
  { id: "guizhou", name: "贵州", warehouses: 9, totalArea: 6800, rentableArea: 5000, infoCount: 178, position: { x: 64, y: 66 } },
  { id: "yunnan", name: "云南", warehouses: 11, totalArea: 8000, rentableArea: 5800, infoCount: 213, position: { x: 56, y: 70 } },
  { id: "heilongjiang", name: "黑龙江", warehouses: 14, totalArea: 11500, rentableArea: 8500, infoCount: 312, position: { x: 82, y: 18 } },
  { id: "jilin", name: "吉林", warehouses: 12, totalArea: 9800, rentableArea: 7200, infoCount: 267, position: { x: 84, y: 26 } },
  { id: "liaoning", name: "辽宁", warehouses: 18, totalArea: 15500, rentableArea: 11800, infoCount: 445, position: { x: 82, y: 32 } },
  { id: "neimenggu", name: "内蒙古", warehouses: 7, totalArea: 5200, rentableArea: 3800, infoCount: 134, position: { x: 68, y: 28 } },
  { id: "hainan", name: "海南", warehouses: 6, totalArea: 4200, rentableArea: 3100, infoCount: 112, position: { x: 72, y: 88 } },
]

// 仓储列表数据
const warehouseList = [
  {
    id: 1,
    name: "新出2字头 黄埔带16-32吨行吊钢构18000平可分租",
    type: "平面仓储",
    location: "广东省-广州市-黄埔香雪",
    rentType: "委托出租",
    price: "0.56",
    area: "800",
    priceStatus: "竞价中",
    image: "/warehouse-1.jpg",
  },
  {
    id: 2,
    name: "新出2字头 黄埔带16-32吨行吊钢构18000平可分租",
    type: "立体库",
    location: "广东省-广州市-番禺万博",
    rentType: "自主出租",
    price: "0.52",
    area: "300",
    priceStatus: "竞价中",
    image: "/warehouse-2.jpg",
  },
  {
    id: 3,
    name: "新出2字头 黄埔带16-32吨行吊钢构18000平可分租",
    type: "平面仓储",
    location: "广东省-广州市-黄埔香雪",
    rentType: "委托出租",
    price: "0.56",
    area: "800",
    priceStatus: "竞价中",
    image: "/warehouse-3.jpg",
  },
]

export function WarehouseMapPage({ onNavigate }: WarehouseMapPageProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>("guangdong")
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [currentPage, setCurrentPage] = useState(1)

  const selectedProvinceData = provinces.find(p => p.id === selectedProvince)

  // 计算总计数据
  const totalStats = {
    warehouses: provinces.reduce((sum, p) => sum + p.warehouses, 0),
    totalArea: provinces.reduce((sum, p) => sum + p.totalArea, 0),
    rentableArea: provinces.reduce((sum, p) => sum + p.rentableArea, 0),
    infoCount: provinces.reduce((sum, p) => sum + p.infoCount, 0),
  }

  return (
    <div className="space-y-4">
      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="link"
          className="p-0 h-auto text-muted-foreground hover:text-primary"
          onClick={() => onNavigate?.("frontend")}
        >
          首页
        </Button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">仓储地图</span>
        <div className="ml-auto flex items-center gap-2">
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
              onClick={() => {
                setViewMode("list")
                onNavigate?.("warehouse-list")
              }}
            >
              <List className="w-4 h-4 mr-1" />
              列表
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 左侧统计面板 */}
        <div className="col-span-2">
          <Card className="bg-sidebar text-sidebar-foreground">
            <CardContent className="p-5">
              <h3 className="text-primary font-medium mb-6">全国仓库统计</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary">{totalStats.warehouses.toLocaleString()}</div>
                  <div className="text-sm text-sidebar-foreground/70">总仓库数量</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">{(totalStats.totalArea / 10000).toFixed(0)}万</div>
                  <div className="text-sm text-sidebar-foreground/70">总面积(㎡)</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">{(totalStats.rentableArea / 10000).toFixed(0)}万</div>
                  <div className="text-sm text-sidebar-foreground/70">可出租面积(㎡)</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{totalStats.infoCount.toLocaleString()}</div>
                  <div className="text-sm text-sidebar-foreground/70">发布信息数</div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-sidebar-border">
                <h4 className="text-primary font-medium mb-2">选择省份查看详情</h4>
                <p className="text-xs text-sidebar-foreground/70">
                  鼠标移至地图上的省份可查看该省份的仓库统计情况
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 中间地图区域 */}
        <div className="col-span-7">
          <Card className="h-full">
            <CardContent className="p-4 relative h-[600px]">
              {/* 简化的中国地图 - 使用SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* 背景 */}
                <rect width="100" height="100" fill="transparent" />
                
                {/* 省份点位 */}
                {provinces.map((province) => (
                  <g
                    key={province.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedProvince(province.id)}
                    onClick={() => setSelectedProvince(province.id)}
                  >
                    <circle
                      cx={province.position.x}
                      cy={province.position.y}
                      r={selectedProvince === province.id ? 3 : 2}
                      className={cn(
                        "transition-all",
                        selectedProvince === province.id
                          ? "fill-primary"
                          : province.warehouses > 20
                          ? "fill-chart-3"
                          : province.warehouses > 10
                          ? "fill-primary/60"
                          : "fill-primary/30"
                      )}
                    />
                    {selectedProvince === province.id && (
                      <circle
                        cx={province.position.x}
                        cy={province.position.y}
                        r={5}
                        className="fill-none stroke-primary stroke-1 animate-ping"
                      />
                    )}
                  </g>
                ))}

                {/* 中国地图轮廓简化路径 */}
                <path
                  d="M25,20 Q35,15 50,18 Q70,12 85,25 Q92,35 88,50 Q90,65 82,75 Q75,85 65,88 Q55,92 45,85 Q35,80 28,70 Q20,60 18,45 Q15,30 25,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border"
                />
              </svg>

              {/* 省份信息卡片 */}
              {selectedProvinceData && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold">{selectedProvinceData.name}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setSelectedProvince(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">共享仓数量：</span>
                      <span className="font-medium">{selectedProvinceData.warehouses}座</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">总面积：</span>
                      <span className="font-medium">{selectedProvinceData.totalArea.toLocaleString()}㎡</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">可出租面积：</span>
                      <span className="font-medium">{selectedProvinceData.rentableArea.toLocaleString()}㎡</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">发布信息数：</span>
                      <span className="font-medium">{selectedProvinceData.infoCount}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-3" size="sm" onClick={() => onNavigate?.("warehouse-list")}>
                    查看该省份仓储
                  </Button>
                </div>
              )}

              {/* 南海诸岛小图 */}
              <div className="absolute bottom-4 right-4 w-20 h-24 border border-border rounded bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                南海诸岛
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧仓储列表 */}
        <div className="col-span-3">
          <div className="space-y-3">
            {warehouseList.map((warehouse) => (
              <Card key={warehouse.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* 图片 */}
                    <div className="w-28 h-28 bg-muted relative flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      <Badge className="absolute top-1 left-1 text-xs bg-accent">
                        出租
                      </Badge>
                    </div>
                    {/* 信息 */}
                    <div className="flex-1 p-3">
                      <div className="flex items-start gap-2 mb-1">
                        <Badge variant="outline" className="text-xs shrink-0">
                          {warehouse.rentType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm mb-1">
                        <span className="text-primary font-medium">{warehouse.price}</span>
                        <span className="text-xs text-muted-foreground">元/㎡/天</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm mb-1">
                        <Maximize2 className="w-3 h-3 text-muted-foreground" />
                        <span>{warehouse.area}㎡</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                          {warehouse.priceStatus}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {warehouse.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Building2 className="w-3 h-3" />
                        <span>{warehouse.type}</span>
                        <MapPin className="w-3 h-3 ml-2" />
                        <span className="line-clamp-1">{warehouse.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* 分页 */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">1</span>
              <span className="text-sm text-muted-foreground">2</span>
              <span className="text-sm text-muted-foreground">3</span>
            </div>
            <Button variant="link" className="w-full text-primary">
              更多 &gt;&gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
