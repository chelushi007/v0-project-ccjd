"use client"

import { useState, useEffect } from "react"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

interface WarehouseMapProps {
  onNavigate?: (page: string) => void
}

// 中国地图 GeoJSON URL
const CHINA_GEO_URL = "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"

// 省份数据（自主竞价、委托竞价、累计成交单数、累计成交金额）
const provinceData: Record<string, { selfBid: number; entrustBid: number; totalDeals: number; totalAmount: number }> = {
  "广东省": { selfBid: 456, entrustBid: 178, totalDeals: 634, totalAmount: 528.32 },
  "福建省": { selfBid: 234, entrustBid: 89, totalDeals: 323, totalAmount: 267.45 },
  "江西省": { selfBid: 145, entrustBid: 56, totalDeals: 201, totalAmount: 168.23 },
  "湖南省": { selfBid: 198, entrustBid: 78, totalDeals: 276, totalAmount: 231.56 },
  "湖北省": { selfBid: 287, entrustBid: 112, totalDeals: 399, totalAmount: 334.78 },
  "河南省": { selfBid: 345, entrustBid: 134, totalDeals: 479, totalAmount: 398.92 },
  "山东省": { selfBid: 412, entrustBid: 167, totalDeals: 579, totalAmount: 485.34 },
  "江苏省": { selfBid: 478, entrustBid: 189, totalDeals: 667, totalAmount: 556.78 },
  "浙江省": { selfBid: 389, entrustBid: 156, totalDeals: 545, totalAmount: 456.23 },
  "上海市": { selfBid: 523, entrustBid: 212, totalDeals: 735, totalAmount: 612.45 },
  "北京市": { selfBid: 567, entrustBid: 234, totalDeals: 801, totalAmount: 668.92 },
  "四川省": { selfBid: 312, entrustBid: 123, totalDeals: 435, totalAmount: 362.34 },
  "辽宁省": { selfBid: 256, entrustBid: 98, totalDeals: 354, totalAmount: 295.67 },
  "新疆维吾尔自治区": { selfBid: 332, entrustBid: 120, totalDeals: 452, totalAmount: 379.64 },
  "西藏自治区": { selfBid: 34, entrustBid: 12, totalDeals: 46, totalAmount: 38.45 },
  "内蒙古自治区": { selfBid: 98, entrustBid: 45, totalDeals: 143, totalAmount: 119.23 },
  "黑龙江省": { selfBid: 189, entrustBid: 76, totalDeals: 265, totalAmount: 221.56 },
  "云南省": { selfBid: 156, entrustBid: 62, totalDeals: 218, totalAmount: 182.34 },
  "广西壮族自治区": { selfBid: 167, entrustBid: 67, totalDeals: 234, totalAmount: 195.67 },
  "海南省": { selfBid: 89, entrustBid: 34, totalDeals: 123, totalAmount: 102.45 },
  "天津市": { selfBid: 234, entrustBid: 92, totalDeals: 326, totalAmount: 272.34 },
  "重庆市": { selfBid: 278, entrustBid: 109, totalDeals: 387, totalAmount: 323.45 },
  "河北省": { selfBid: 312, entrustBid: 124, totalDeals: 436, totalAmount: 364.23 },
  "山西省": { selfBid: 178, entrustBid: 69, totalDeals: 247, totalAmount: 206.78 },
  "陕西省": { selfBid: 223, entrustBid: 87, totalDeals: 310, totalAmount: 258.92 },
  "甘肃省": { selfBid: 112, entrustBid: 43, totalDeals: 155, totalAmount: 129.34 },
  "青海省": { selfBid: 56, entrustBid: 21, totalDeals: 77, totalAmount: 64.23 },
  "宁夏回族自治区": { selfBid: 78, entrustBid: 30, totalDeals: 108, totalAmount: 90.12 },
  "吉林省": { selfBid: 167, entrustBid: 65, totalDeals: 232, totalAmount: 193.56 },
  "安徽省": { selfBid: 245, entrustBid: 96, totalDeals: 341, totalAmount: 284.67 },
  "贵州省": { selfBid: 134, entrustBid: 52, totalDeals: 186, totalAmount: 155.23 },
  "台湾省": { selfBid: 0, entrustBid: 0, totalDeals: 0, totalAmount: 0 },
  "香港特别行政区": { selfBid: 123, entrustBid: 48, totalDeals: 171, totalAmount: 142.67 },
  "澳门特别行政区": { selfBid: 45, entrustBid: 17, totalDeals: 62, totalAmount: 51.78 },
}

// 右侧推荐物资列表数据
const materialList = [
  {
    id: 1,
    title: "中铁城建集团第一工程有限公司天府新区62亩项目关于处...",
    price: 0,
    unit: "吨",
    location: "四川省成都市天府新区",
    countdown: { days: 3, hours: 17, minutes: 28, seconds: 29 },
    image: "/placeholder-material-1.jpg",
  },
  {
    id: 2,
    title: "中铁十一局丹东粮农综合产业园项目关于废旧钢筋物资处...",
    price: 1900,
    unit: "吨",
    location: "辽宁省丹东市东港市",
    countdown: { days: 2, hours: 23, minutes: 28, seconds: 29 },
    image: "/placeholder-material-2.jpg",
  },
  {
    id: 3,
    title: "中铁城建集团南昌建设有限公司广西飞南资源利用有限公...",
    price: 0,
    unit: "吨",
    location: "广西壮族自治区来宾市象...",
    countdown: { days: 3, hours: 17, minutes: 28, seconds: 29 },
    image: "/placeholder-material-3.jpg",
  },
]

// 根据成交数量获取颜色
function getProvinceColor(totalDeals: number, isHovered: boolean) {
  if (isHovered) return "hsl(205, 85%, 50%)"
  if (totalDeals >= 600) return "hsl(205, 75%, 45%)"
  if (totalDeals >= 400) return "hsl(205, 70%, 52%)"
  if (totalDeals >= 200) return "hsl(205, 65%, 60%)"
  if (totalDeals >= 100) return "hsl(205, 55%, 68%)"
  if (totalDeals >= 50) return "hsl(205, 45%, 75%)"
  return "hsl(205, 35%, 82%)"
}

export function WarehouseMap({ onNavigate }: WarehouseMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [currentPage, setCurrentPage] = useState(0)

  // 倒计时模拟
  const [countdowns, setCountdowns] = useState(materialList.map(m => ({ ...m.countdown })))

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdowns(prev => prev.map(cd => {
        let { days, hours, minutes, seconds } = cd
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0 }
        return { days, hours, minutes, seconds }
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const hoveredData = hoveredProvince ? provinceData[hoveredProvince] : null

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

      <div className="grid grid-cols-[1fr_320px] gap-4 h-[420px]">
        {/* 左侧地图区域 */}
        <Card className="h-full overflow-hidden">
          <CardContent className="p-0 h-full relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 620,
                center: [105, 36],
              }}
              style={{ width: "100%", height: "100%", backgroundColor: "#f8fafc" }}
            >
              <Geographies geography={CHINA_GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const provinceName = geo.properties.name
                    const data = provinceData[provinceName] || { totalDeals: 0 }
                    const isHovered = hoveredProvince === provinceName

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getProvinceColor(data.totalDeals, isHovered)}
                        stroke="#fff"
                        strokeWidth={0.8}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", cursor: "pointer" },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={(e) => {
                          setHoveredProvince(provinceName)
                          const rect = (e.target as SVGElement).getBoundingClientRect()
                          setTooltipPosition({ x: rect.x + rect.width / 2, y: rect.y })
                        }}
                        onMouseLeave={() => setHoveredProvince(null)}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>

            {/* 省份悬停信息卡片 */}
            {hoveredProvince && hoveredData && (
              <div 
                className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px] z-20 pointer-events-none"
                style={{ 
                  left: "50%", 
                  top: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              >
                <h4 className="font-bold text-base mb-3 text-gray-800">{hoveredProvince}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">自主竞价：</span>
                    <span className="text-primary font-medium">{hoveredData.selfBid}<span className="text-gray-500 font-normal">单</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">委托竞价：</span>
                    <span className="text-primary font-medium">{hoveredData.entrustBid}<span className="text-gray-500 font-normal">单</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">累计成交单数：</span>
                    <span className="text-primary font-medium">{hoveredData.totalDeals}<span className="text-gray-500 font-normal">单</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">累计成交金额：</span>
                    <span className="text-primary font-medium">{hoveredData.totalAmount.toFixed(2)}<span className="text-gray-500 font-normal">万元</span></span>
                  </div>
                </div>
              </div>
            )}

            {/* 南海诸岛小图 */}
            <div className="absolute bottom-3 right-3 w-20 h-24 border border-gray-300 rounded bg-white flex flex-col items-center justify-center">
              <div className="w-12 h-14 border border-dashed border-gray-300 rounded mb-1"></div>
              <span className="text-xs text-gray-500">南海诸岛</span>
            </div>
          </CardContent>
        </Card>

        {/* 右侧推荐列表 */}
        <div className="h-full flex flex-col">
          <div className="flex-1 space-y-3 overflow-auto pr-1">
            {materialList.map((item, index) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* 图片 */}
                    <div className="w-28 h-[120px] bg-gray-100 relative flex-shrink-0 overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* 信息 */}
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-2">
                          {item.title}
                        </h4>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-gray-500 text-xs">开盘单价：</span>
                          <span className="text-red-500 font-bold text-base">¥{item.price}</span>
                          <span className="text-gray-500 text-xs">元/{item.unit}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>存放地址：</span>
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded text-gray-700 font-medium">{countdowns[index].days}</span>
                        <span className="text-gray-500">天</span>
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded text-gray-700 font-medium">{countdowns[index].hours}</span>
                        <span className="text-gray-500">时</span>
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded text-gray-700 font-medium">{countdowns[index].minutes}</span>
                        <span className="text-gray-500">分</span>
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded text-primary font-medium">{countdowns[index].seconds}</span>
                        <span className="text-gray-500">秒</span>
                        <span className="text-gray-400 ml-1">后停止报名</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 分页指示器和更多 */}
          <div className="pt-3 mt-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[0, 1, 2].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentPage === page ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-right">
              <Button 
                variant="link" 
                className="text-primary text-sm h-6 p-0" 
                onClick={() => onNavigate?.("warehouse-list")}
              >
                查看更多 →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
