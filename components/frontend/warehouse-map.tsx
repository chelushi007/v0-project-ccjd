"use client"

import { useState, useMemo } from "react"
import { MapPin, Building2, ArrowRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"

interface WarehouseMapProps {
  onNavigate?: (page: string) => void
}

// 中国地图 GeoJSON URL
const CHINA_GEO_URL = "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"

// 省份仓储数据
const provinceData: Record<string, { warehouses: number; totalArea: number; rentableArea: number; infoCount: number }> = {
  "广东省": { warehouses: 23, totalArea: 23422, rentableArea: 20110, infoCount: 897 },
  "福建省": { warehouses: 15, totalArea: 12000, rentableArea: 8500, infoCount: 342 },
  "江西省": { warehouses: 10, totalArea: 7800, rentableArea: 5600, infoCount: 186 },
  "湖南省": { warehouses: 14, totalArea: 10500, rentableArea: 7800, infoCount: 298 },
  "湖北省": { warehouses: 18, totalArea: 15000, rentableArea: 11200, infoCount: 412 },
  "河南省": { warehouses: 20, totalArea: 18000, rentableArea: 14000, infoCount: 523 },
  "山东省": { warehouses: 25, totalArea: 22000, rentableArea: 17500, infoCount: 645 },
  "江苏省": { warehouses: 28, totalArea: 25000, rentableArea: 19800, infoCount: 712 },
  "浙江省": { warehouses: 22, totalArea: 19500, rentableArea: 15200, infoCount: 534 },
  "上海市": { warehouses: 30, totalArea: 28000, rentableArea: 21000, infoCount: 823 },
  "北京市": { warehouses: 35, totalArea: 32000, rentableArea: 24500, infoCount: 956 },
  "四川省": { warehouses: 21, totalArea: 18500, rentableArea: 14200, infoCount: 478 },
  "辽宁省": { warehouses: 18, totalArea: 15500, rentableArea: 11800, infoCount: 367 },
  "新疆维吾尔自治区": { warehouses: 6, totalArea: 4500, rentableArea: 3200, infoCount: 89 },
  "西藏自治区": { warehouses: 2, totalArea: 1200, rentableArea: 800, infoCount: 23 },
  "内蒙古自治区": { warehouses: 7, totalArea: 5200, rentableArea: 3800, infoCount: 112 },
  "黑龙江省": { warehouses: 14, totalArea: 11500, rentableArea: 8500, infoCount: 278 },
  "云南省": { warehouses: 11, totalArea: 8000, rentableArea: 5800, infoCount: 198 },
  "广西壮族自治区": { warehouses: 12, totalArea: 8500, rentableArea: 6200, infoCount: 234 },
  "海南省": { warehouses: 6, totalArea: 4200, rentableArea: 3100, infoCount: 87 },
  "天津市": { warehouses: 16, totalArea: 13000, rentableArea: 9800, infoCount: 312 },
  "重庆市": { warehouses: 19, totalArea: 16000, rentableArea: 12000, infoCount: 398 },
  "河北省": { warehouses: 22, totalArea: 19000, rentableArea: 14500, infoCount: 487 },
  "山西省": { warehouses: 12, totalArea: 9500, rentableArea: 6800, infoCount: 212 },
  "陕西省": { warehouses: 15, totalArea: 12500, rentableArea: 9000, infoCount: 298 },
  "甘肃省": { warehouses: 8, totalArea: 6000, rentableArea: 4200, infoCount: 134 },
  "青海省": { warehouses: 4, totalArea: 2800, rentableArea: 1800, infoCount: 56 },
  "宁夏回族自治区": { warehouses: 5, totalArea: 3500, rentableArea: 2400, infoCount: 78 },
  "吉林省": { warehouses: 13, totalArea: 10000, rentableArea: 7200, infoCount: 234 },
  "安徽省": { warehouses: 17, totalArea: 14000, rentableArea: 10500, infoCount: 356 },
  "贵州省": { warehouses: 9, totalArea: 6800, rentableArea: 4800, infoCount: 156 },
  "台湾省": { warehouses: 0, totalArea: 0, rentableArea: 0, infoCount: 0 },
  "香港特别行政区": { warehouses: 8, totalArea: 5500, rentableArea: 4000, infoCount: 145 },
  "澳门特别行政区": { warehouses: 2, totalArea: 800, rentableArea: 500, infoCount: 32 },
}

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

// 根据仓库数量获取颜色
function getProvinceColor(warehouses: number, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return "#1e88e5"
  if (isHovered) return "#42a5f5"
  if (warehouses >= 25) return "#1976d2"
  if (warehouses >= 20) return "#2196f3"
  if (warehouses >= 15) return "#42a5f5"
  if (warehouses >= 10) return "#64b5f6"
  if (warehouses >= 5) return "#90caf9"
  return "#bbdefb"
}

export function WarehouseMap({ onNavigate }: WarehouseMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>("广东省")
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)

  // 计算总计数据
  const totalStats = useMemo(() => {
    const values = Object.values(provinceData)
    return {
      warehouses: values.reduce((sum, p) => sum + p.warehouses, 0),
      totalArea: values.reduce((sum, p) => sum + p.totalArea, 0),
      rentableArea: values.reduce((sum, p) => sum + p.rentableArea, 0),
      infoCount: values.reduce((sum, p) => sum + p.infoCount, 0),
    }
  }, [])

  const displayProvince = hoveredProvince || selectedProvince

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">仓储地图分布</h2>
        </div>
        <Button variant="link" className="text-primary" onClick={() => onNavigate?.("warehouse-map")}>
          仓储地图
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-[180px_1fr_260px] gap-0 h-[420px]">
        {/* 左侧统计面板 - 深蓝色背景 */}
        <div className="bg-[#1a365d] text-white rounded-l-lg p-4 flex flex-col h-full">
          <h3 className="text-[#60a5fa] font-medium mb-4 text-sm">全国仓库统计</h3>
          
          <div className="space-y-4 flex-1">
            <div>
              <div className="text-3xl font-bold text-[#60a5fa]">{totalStats.warehouses.toLocaleString()}</div>
              <div className="text-xs text-white/70 mt-1">总仓库数量</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#60a5fa]">{(totalStats.totalArea / 10000).toFixed(0)},000,000</div>
              <div className="text-xs text-white/70 mt-1">总面积(m²)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#60a5fa]">{(totalStats.rentableArea / 10000).toFixed(0)},000,000</div>
              <div className="text-xs text-white/70 mt-1">可出租面积(m²)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#60a5fa]">{totalStats.infoCount.toLocaleString()}</div>
              <div className="text-xs text-white/70 mt-1">发布信息数</div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/20 mt-auto">
            <h4 className="text-[#60a5fa] font-medium mb-1 text-xs">选择省份查看详情</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              鼠标移至地图上的省份可查看该省份的仓库统计情况
            </p>
          </div>
        </div>

        {/* 中间地图区域 */}
        <div className="bg-white border-y border-border relative h-full overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 620,
              center: [105, 36],
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup center={[105, 36]} zoom={1} minZoom={0.8} maxZoom={3}>
              <Geographies geography={CHINA_GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const provinceName = geo.properties.name
                    const data = provinceData[provinceName] || { warehouses: 0 }
                    const isSelected = selectedProvince === provinceName
                    const isHovered = hoveredProvince === provinceName

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getProvinceColor(data.warehouses, isSelected, isHovered)}
                        stroke="#ffffff"
                        strokeWidth={0.8}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", cursor: "pointer" },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() => setHoveredProvince(provinceName)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => {
                          setSelectedProvince(provinceName)
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* 省份信息卡片 */}
          {displayProvince && provinceData[displayProvince] && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px] z-10 pointer-events-none">
              <h4 className="font-bold text-base mb-3 text-gray-800">{displayProvince}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">共享仓数量：</span>
                  <span className="font-semibold text-blue-600">{provinceData[displayProvince].warehouses}座</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">总面积：</span>
                  <span className="font-semibold">{provinceData[displayProvince].totalArea.toLocaleString()}m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">可出租面积：</span>
                  <span className="font-semibold text-blue-600">{provinceData[displayProvince].rentableArea.toLocaleString()}m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">发布信息数：</span>
                  <span className="font-semibold">{provinceData[displayProvince].infoCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* 南海诸岛小图 */}
          <div className="absolute bottom-2 right-2 w-20 h-24 border border-gray-300 rounded bg-white/90 flex items-center justify-center">
            <span className="text-xs text-gray-500 text-center leading-tight">南海诸岛</span>
          </div>
        </div>

        {/* 右侧仓储列表 */}
        <Card className="rounded-l-none rounded-r-lg border-l-0 h-full flex flex-col">
          <CardContent className="p-3 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 space-y-2 overflow-auto">
              {warehouseList.map((warehouse) => (
                <div key={warehouse.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-card">
                  <div className="flex">
                    {/* 图片 */}
                    <div className="w-20 h-20 bg-muted relative flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                      <Badge className="absolute top-1 left-1 text-[10px] bg-green-500 text-white px-1 py-0">
                        出租
                      </Badge>
                    </div>
                    {/* 信息 */}
                    <div className="flex-1 p-2 min-w-0">
                      <Badge variant="outline" className="text-[10px] mb-1 px-1 py-0">
                        {warehouse.rentType}
                      </Badge>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-primary font-bold text-sm">{warehouse.price}</span>
                        <span className="text-[10px] text-muted-foreground">元/m²/天</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                        <Maximize2 className="w-3 h-3" />
                        <span>{warehouse.area}m²</span>
                        <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-600 px-1 py-0 ml-1">
                          {warehouse.priceStatus}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground line-clamp-1">
                        {warehouse.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页和更多 */}
            <div className="pt-2 mt-auto border-t border-border">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              </div>
              <Button variant="link" className="w-full text-primary text-xs h-6" onClick={() => onNavigate?.("warehouse-list")}>
                更多 &gt;&gt;
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
