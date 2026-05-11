"use client"

import { useState } from "react"
import { MapPin, Building2, ArrowRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WarehouseMapProps {
  onNavigate?: (page: string) => void
}

// 省份数据（简化版）
const provinces = [
  { id: "guangdong", name: "广东", warehouses: 23, totalArea: 23422, rentableArea: 20110, position: { x: 76, y: 78 } },
  { id: "fujian", name: "福建", warehouses: 15, totalArea: 12000, rentableArea: 8500, position: { x: 82, y: 68 } },
  { id: "jiangxi", name: "江西", warehouses: 10, totalArea: 7800, rentableArea: 5600, position: { x: 78, y: 64 } },
  { id: "hunan", name: "湖南", warehouses: 14, totalArea: 10500, rentableArea: 7800, position: { x: 72, y: 62 } },
  { id: "hubei", name: "湖北", warehouses: 18, totalArea: 15000, rentableArea: 11200, position: { x: 72, y: 56 } },
  { id: "henan", name: "河南", warehouses: 20, totalArea: 18000, rentableArea: 14000, position: { x: 72, y: 48 } },
  { id: "shandong", name: "山东", warehouses: 25, totalArea: 22000, rentableArea: 17500, position: { x: 78, y: 44 } },
  { id: "jiangsu", name: "江苏", warehouses: 28, totalArea: 25000, rentableArea: 19800, position: { x: 80, y: 52 } },
  { id: "zhejiang", name: "浙江", warehouses: 22, totalArea: 19500, rentableArea: 15200, position: { x: 84, y: 58 } },
  { id: "shanghai", name: "上海", warehouses: 30, totalArea: 28000, rentableArea: 21000, position: { x: 84, y: 54 } },
  { id: "beijing", name: "北京", warehouses: 35, totalArea: 32000, rentableArea: 24500, position: { x: 74, y: 36 } },
  { id: "sichuan", name: "四川", warehouses: 21, totalArea: 18500, rentableArea: 14200, position: { x: 58, y: 58 } },
  { id: "liaoning", name: "辽宁", warehouses: 18, totalArea: 15500, rentableArea: 11800, position: { x: 82, y: 32 } },
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
  },
  {
    id: 2,
    name: "深圳宝安立体库 自动化设备齐全",
    type: "立体库",
    location: "广东省-广州市-番禺万博",
    rentType: "自主出租",
    price: "0.52",
    area: "300",
    priceStatus: "竞价中",
  },
  {
    id: 3,
    name: "东莞虎门港 大型堆场近港口",
    type: "平面仓储",
    location: "广东省-广州市-黄埔香雪",
    rentType: "委托出租",
    price: "0.56",
    area: "800",
    priceStatus: "竞价中",
  },
]

export function WarehouseMap({ onNavigate }: WarehouseMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>("guangdong")

  // 计算总计数据
  const totalStats = {
    warehouses: provinces.reduce((sum, p) => sum + p.warehouses, 0),
    totalArea: provinces.reduce((sum, p) => sum + p.totalArea, 0),
    rentableArea: provinces.reduce((sum, p) => sum + p.rentableArea, 0),
    infoCount: 8960,
  }

  const selectedProvinceData = provinces.find(p => p.id === selectedProvince)

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">仓储地图</h2>
        </div>
        <Button variant="link" className="text-primary" onClick={() => onNavigate?.("warehouse-map")}>
          查看完整地图
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 左侧统计面板 */}
        <div className="col-span-2">
          <Card className="bg-sidebar text-sidebar-foreground h-full">
            <CardContent className="p-4">
              <h3 className="text-primary font-medium mb-4 text-sm">全国仓库统计</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-primary">{totalStats.warehouses.toLocaleString()}</div>
                  <div className="text-xs text-sidebar-foreground/70">总仓库数量</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{(totalStats.totalArea / 10000).toFixed(0)}万</div>
                  <div className="text-xs text-sidebar-foreground/70">总面积(㎡)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{(totalStats.rentableArea / 10000).toFixed(0)}万</div>
                  <div className="text-xs text-sidebar-foreground/70">可出租面积(㎡)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalStats.infoCount.toLocaleString()}</div>
                  <div className="text-xs text-sidebar-foreground/70">发布信息数</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-sidebar-border">
                <h4 className="text-primary font-medium mb-1 text-sm">选择省份查看详情</h4>
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
            <CardContent className="p-4 relative h-[400px]">
              {/* 简化的中国地图 */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* 省份点位 */}
                {provinces.map((province) => (
                  <g
                    key={province.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedProvince(province.id)}
                    onClick={() => {
                      setSelectedProvince(province.id)
                      onNavigate?.("warehouse-map")
                    }}
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
                    <text
                      x={province.position.x}
                      y={province.position.y - 4}
                      textAnchor="middle"
                      className="text-[3px] fill-muted-foreground"
                    >
                      {province.name}
                    </text>
                  </g>
                ))}

                {/* 中国地图轮廓简化路径 */}
                <path
                  d="M25,20 Q35,15 50,18 Q70,12 85,25 Q92,35 88,50 Q90,65 82,75 Q75,85 65,88 Q55,92 45,85 Q35,80 28,70 Q20,60 18,45 Q15,30 25,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-primary/30"
                />
              </svg>

              {/* 省份信息卡片 */}
              {selectedProvinceData && (
                <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
                  <h4 className="font-semibold mb-2">{selectedProvinceData.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">仓库数量：</span>
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
                  </div>
                </div>
              )}

              {/* 南海诸岛小图 */}
              <div className="absolute bottom-4 right-4 w-16 h-20 border border-border rounded bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
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
                    <div className="w-24 h-24 bg-muted relative flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                      <Badge className="absolute top-1 left-1 text-xs bg-accent">
                        出租
                      </Badge>
                    </div>
                    {/* 信息 */}
                    <div className="flex-1 p-2">
                      <Badge variant="outline" className="text-xs mb-1">
                        {warehouse.rentType}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm mb-1">
                        <span className="text-primary font-medium">{warehouse.price}</span>
                        <span className="text-xs text-muted-foreground">元/㎡/天</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" />
                          {warehouse.area}㎡
                        </span>
                        <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                          {warehouse.priceStatus}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {warehouse.name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* 分页 */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">1</span>
              <span className="text-xs text-muted-foreground">2</span>
              <span className="text-xs text-muted-foreground">3</span>
            </div>
            <Button variant="link" className="w-full text-primary text-sm" onClick={() => onNavigate?.("warehouse-list")}>
              更多 &gt;&gt;
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
