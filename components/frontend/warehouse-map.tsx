"use client"

import { useState, useMemo } from "react"
import { MapPin, Building2, ArrowRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WarehouseMapProps {
  onNavigate?: (page: string) => void
}

// 中国地图底图（用户上传素材）
const CHINA_MAP_IMG =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E4%B8%8B%E8%BD%BD-pWQJMDERqh5FaOT1WHhzsw5iTgUNnG.png"

// 各省/直辖市/自治区/特别行政区在中国地图图片上的近似中心点（百分比）
const PROVINCE_CENTER_PCT: Record<string, { x: number; y: number }> = {
  北京市: { x: 67.5, y: 31 },
  天津市: { x: 69.5, y: 33 },
  上海市: { x: 78, y: 51 },
  重庆市: { x: 55, y: 55 },
  河北省: { x: 66, y: 33 },
  山西省: { x: 62, y: 37 },
  辽宁省: { x: 76, y: 26 },
  吉林省: { x: 80, y: 21 },
  黑龙江省: { x: 78, y: 13 },
  江苏省: { x: 75, y: 47 },
  浙江省: { x: 76, y: 55 },
  安徽省: { x: 70, y: 49 },
  福建省: { x: 72, y: 63 },
  江西省: { x: 67, y: 60 },
  山东省: { x: 70, y: 39 },
  河南省: { x: 64, y: 45 },
  湖北省: { x: 62, y: 52 },
  湖南省: { x: 60, y: 60 },
  广东省: { x: 64, y: 70 },
  海南省: { x: 60, y: 80 },
  四川省: { x: 49, y: 55 },
  贵州省: { x: 54, y: 64 },
  云南省: { x: 46, y: 68 },
  陕西省: { x: 57, y: 45 },
  甘肃省: { x: 48, y: 41 },
  青海省: { x: 38, y: 43 },
  台湾省: { x: 80, y: 67 },
  内蒙古自治区: { x: 55, y: 24 },
  广西壮族自治区: { x: 56, y: 70 },
  西藏自治区: { x: 25, y: 53 },
  宁夏回族自治区: { x: 53, y: 39 },
  新疆维吾尔自治区: { x: 20, y: 30 },
  香港特别行政区: { x: 67, y: 72 },
  澳门特别行政区: { x: 65, y: 73 },
}

type ProvinceMetrics = {
  warehouses: number
  totalArea: number
  rentableArea: number
  transactionAmount: number // 万元
  publishCount: number
}

// 省份仓储数据（含交易金额：万元 / 发布单数）
const provinceData: Record<string, ProvinceMetrics> = {
  广东省: { warehouses: 23, totalArea: 23422, rentableArea: 20110, transactionAmount: 18650, publishCount: 897 },
  福建省: { warehouses: 15, totalArea: 12000, rentableArea: 8500, transactionAmount: 6420, publishCount: 342 },
  江西省: { warehouses: 10, totalArea: 7800, rentableArea: 5600, transactionAmount: 3210, publishCount: 186 },
  湖南省: { warehouses: 14, totalArea: 10500, rentableArea: 7800, transactionAmount: 5180, publishCount: 298 },
  湖北省: { warehouses: 18, totalArea: 15000, rentableArea: 11200, transactionAmount: 7820, publishCount: 412 },
  河南省: { warehouses: 20, totalArea: 18000, rentableArea: 14000, transactionAmount: 9650, publishCount: 523 },
  山东省: { warehouses: 25, totalArea: 22000, rentableArea: 17500, transactionAmount: 12450, publishCount: 645 },
  江苏省: { warehouses: 28, totalArea: 25000, rentableArea: 19800, transactionAmount: 15320, publishCount: 712 },
  浙江省: { warehouses: 22, totalArea: 19500, rentableArea: 15200, transactionAmount: 11280, publishCount: 534 },
  上海市: { warehouses: 30, totalArea: 28000, rentableArea: 21000, transactionAmount: 19840, publishCount: 823 },
  北京市: { warehouses: 35, totalArea: 32000, rentableArea: 24500, transactionAmount: 22680, publishCount: 956 },
  四川省: { warehouses: 21, totalArea: 18500, rentableArea: 14200, transactionAmount: 9420, publishCount: 478 },
  辽宁省: { warehouses: 18, totalArea: 15500, rentableArea: 11800, transactionAmount: 6850, publishCount: 367 },
  新疆维吾尔自治区: { warehouses: 6, totalArea: 4500, rentableArea: 3200, transactionAmount: 1280, publishCount: 89 },
  西藏自治区: { warehouses: 2, totalArea: 1200, rentableArea: 800, transactionAmount: 320, publishCount: 23 },
  内蒙古自治区: { warehouses: 7, totalArea: 5200, rentableArea: 3800, transactionAmount: 1820, publishCount: 112 },
  黑龙江省: { warehouses: 14, totalArea: 11500, rentableArea: 8500, transactionAmount: 4920, publishCount: 278 },
  云南省: { warehouses: 11, totalArea: 8000, rentableArea: 5800, transactionAmount: 3450, publishCount: 198 },
  广西壮族自治区: { warehouses: 12, totalArea: 8500, rentableArea: 6200, transactionAmount: 3820, publishCount: 234 },
  海南省: { warehouses: 6, totalArea: 4200, rentableArea: 3100, transactionAmount: 1480, publishCount: 87 },
  天津市: { warehouses: 16, totalArea: 13000, rentableArea: 9800, transactionAmount: 5680, publishCount: 312 },
  重庆市: { warehouses: 19, totalArea: 16000, rentableArea: 12000, transactionAmount: 7280, publishCount: 398 },
  河北省: { warehouses: 22, totalArea: 19000, rentableArea: 14500, transactionAmount: 8920, publishCount: 487 },
  山西省: { warehouses: 12, totalArea: 9500, rentableArea: 6800, transactionAmount: 3520, publishCount: 212 },
  陕西省: { warehouses: 15, totalArea: 12500, rentableArea: 9000, transactionAmount: 5180, publishCount: 298 },
  甘肃省: { warehouses: 8, totalArea: 6000, rentableArea: 4200, transactionAmount: 2120, publishCount: 134 },
  青海省: { warehouses: 4, totalArea: 2800, rentableArea: 1800, transactionAmount: 720, publishCount: 56 },
  宁夏回族自治区: { warehouses: 5, totalArea: 3500, rentableArea: 2400, transactionAmount: 1080, publishCount: 78 },
  吉林省: { warehouses: 13, totalArea: 10000, rentableArea: 7200, transactionAmount: 4280, publishCount: 234 },
  安徽省: { warehouses: 17, totalArea: 14000, rentableArea: 10500, transactionAmount: 6420, publishCount: 356 },
  贵州省: { warehouses: 9, totalArea: 6800, rentableArea: 4800, transactionAmount: 2680, publishCount: 156 },
  台湾省: { warehouses: 0, totalArea: 0, rentableArea: 0, transactionAmount: 0, publishCount: 0 },
  香港特别行政区: { warehouses: 8, totalArea: 5500, rentableArea: 4000, transactionAmount: 3920, publishCount: 145 },
  澳门特别行政区: { warehouses: 2, totalArea: 800, rentableArea: 500, transactionAmount: 480, publishCount: 32 },
}

type WarehouseItem = {
  id: number
  name: string
  location: string
  price: string
  area: string
  priceStatus: string
}

// 各省份仓储出租列表（鼠标移入/选中省份时联动展示）
const warehouseListByProvince: Record<string, WarehouseItem[]> = {
  广东省: [
    { id: 101, name: "新出2字头 黄埔带16-32吨行吊钢构18000平可分租", location: "广东省-广州市-黄埔香雪", price: "0.56", area: "800", priceStatus: "竞价中" },
    { id: 102, name: "深圳宝安立体库 自动化设备齐全 近高速口", location: "广东省-深圳市-宝安区", price: "0.52", area: "300", priceStatus: "竞价中" },
    { id: 103, name: "东莞虎门港 大型堆场近港口 配 24h 看管", location: "广东省-东莞市-虎门镇", price: "0.46", area: "1200", priceStatus: "竞价中" },
  ],
  北京市: [
    { id: 201, name: "通州物流园 9% 增票 重载地面 整租优先", location: "北京市-通州区-马驹桥", price: "0.78", area: "1500", priceStatus: "竞价中" },
    { id: 202, name: "大兴亦庄保税仓 紧邻新机场", location: "北京市-大兴区-亦庄", price: "0.82", area: "600", priceStatus: "固定价" },
  ],
  上海市: [
    { id: 301, name: "外高桥保税区现成标准仓 可天车装卸", location: "上海市-浦东新区-外高桥", price: "0.92", area: "2000", priceStatus: "竞价中" },
    { id: 302, name: "青浦综合保税仓 适用电商分拨", location: "上海市-青浦区-华新", price: "0.86", area: "1100", priceStatus: "竞价中" },
  ],
  江苏省: [
    { id: 401, name: "苏州工业园甲类乙类仓 配双回路", location: "江苏省-苏州市-工业园区", price: "0.62", area: "1800", priceStatus: "竞价中" },
    { id: 402, name: "南京江宁立体库 可分租 24h 安保", location: "江苏省-南京市-江宁区", price: "0.58", area: "900", priceStatus: "固定价" },
  ],
  浙江省: [
    { id: 501, name: "宁波北仑港堆场 钢材模板托管", location: "浙江省-宁波市-北仑区", price: "0.48", area: "2200", priceStatus: "竞价中" },
    { id: 502, name: "杭州萧山综合仓 近机场高速", location: "浙江省-杭州市-萧山区", price: "0.66", area: "700", priceStatus: "竞价中" },
  ],
  山东省: [
    { id: 601, name: "青岛胶州保税仓 整租优先", location: "山东省-青岛市-胶州", price: "0.42", area: "2500", priceStatus: "竞价中" },
    { id: 602, name: "济南章丘冷链仓 -22℃可控", location: "山东省-济南市-章丘区", price: "0.95", area: "500", priceStatus: "固定价" },
  ],
  河南省: [
    { id: 701, name: "郑州航空港综合仓 9% 增票", location: "河南省-郑州市-航空港区", price: "0.38", area: "3000", priceStatus: "竞价中" },
  ],
  四川省: [
    { id: 801, name: "成都新都物流园 重载地面可分租", location: "四川省-成都市-新都区", price: "0.36", area: "1600", priceStatus: "竞价中" },
  ],
  福建省: [
    { id: 901, name: "厦门海沧保税港区标准仓", location: "福建省-厦门市-海沧区", price: "0.52", area: "1200", priceStatus: "竞价中" },
  ],
  湖北省: [
    { id: 1001, name: "武汉东西湖综合仓 近多式联运", location: "湖北省-武汉市-东西湖区", price: "0.40", area: "1800", priceStatus: "竞价中" },
  ],
  重庆市: [
    { id: 1101, name: "两江新区综合保税仓 月结", location: "重庆市-两江新区-鱼复", price: "0.44", area: "1400", priceStatus: "竞价中" },
  ],
}

type HeatmapMode = "warehouses"

// 热力分档（按 5 档梯度上色，固定按仓储数量）
function getHeatColor(value: number, _mode: HeatmapMode, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return "#1d4ed8"
  if (isHovered) return "#3b82f6"

  if (value >= 25) return "#1e40af"
  if (value >= 18) return "#2563eb"
  if (value >= 12) return "#60a5fa"
  if (value >= 6) return "#93c5fd"
  if (value > 0) return "#dbeafe"
  return "#f1f5f9"
}

const heatLegend: Record<HeatmapMode, { label: string; bins: { color: string; label: string }[] }> = {
  warehouses: {
    label: "仓储数量（座）",
    bins: [
      { color: "#dbeafe", label: "1-5" },
      { color: "#93c5fd", label: "6-11" },
      { color: "#60a5fa", label: "12-17" },
      { color: "#2563eb", label: "18-24" },
      { color: "#1e40af", label: "≥25" },
    ],
  },
}

export function WarehouseMap({ onNavigate }: WarehouseMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>("广东省")
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [heatmapMode] = useState<HeatmapMode>("warehouses")

  // 计算总计数据
  const totalStats = useMemo(() => {
    const values = Object.values(provinceData)
    return {
      warehouses: values.reduce((sum, p) => sum + p.warehouses, 0),
      totalArea: values.reduce((sum, p) => sum + p.totalArea, 0),
      rentableArea: values.reduce((sum, p) => sum + p.rentableArea, 0),
      transactionAmount: values.reduce((sum, p) => sum + p.transactionAmount, 0),
      publishCount: values.reduce((sum, p) => sum + p.publishCount, 0),
    }
  }, [])

  const displayProvince = hoveredProvince || selectedProvince
  const displayMetrics = displayProvince ? provinceData[displayProvince] : null
  const currentList = displayProvince ? warehouseListByProvince[displayProvince] ?? [] : []

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

      <div className="grid grid-cols-[minmax(180px,18%)_minmax(0,1fr)_minmax(240px,24%)] gap-0 h-[460px]">
        {/* 左侧：全国统计 5 项 */}
        <div className="bg-[#0f2742] text-white rounded-l-lg p-4 flex flex-col h-full">
          <h3 className="text-[#60a5fa] font-medium mb-4 text-sm">全国仓储统计</h3>

          <div className="space-y-4 flex-1">
            <StatItem value={totalStats.warehouses.toLocaleString()} label="仓储数量（座）" />
            <StatItem value={(totalStats.totalArea / 10000).toFixed(2)} label="总面积（万 m²）" />
            <StatItem value={(totalStats.rentableArea / 10000).toFixed(2)} label="可出租面积（万 m²）" />
            <StatItem value={(totalStats.transactionAmount / 10000).toFixed(2)} label="交易金额（亿元）" />
            <StatItem value={totalStats.publishCount.toLocaleString()} label="发布单数（条）" />
          </div>

          <div className="pt-3 border-t border-white/15 mt-auto">
            <p className="text-[11px] text-white/60 leading-relaxed">
              鼠标悬停地图省份可查看该地区的明细数据
            </p>
          </div>
        </div>

        {/* 中间：地图 */}
        <div className="bg-[#e8f4fc] border-y border-border relative h-full overflow-hidden">
          {/* 图例 */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 border border-border rounded-md px-3 py-2 shadow-sm">
            <div className="text-[11px] text-muted-foreground mb-1.5">{heatLegend[heatmapMode].label}</div>
            <div className="flex items-center gap-2">
              {heatLegend[heatmapMode].bins.map((bin) => (
                <div key={bin.label} className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-sm border border-black/5"
                    style={{ backgroundColor: bin.color }}
                  />
                  <span className="text-[10px] text-foreground/70">{bin.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 中国地图底图 + 热力圆点（共享同一容器与比例，保证圆点与省份对齐） */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-full max-h-full aspect-[785/645] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CHINA_MAP_IMG || "/placeholder.svg"}
                alt="中国地图"
                className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
              {/* 各省份热力圆点（按指标值上色与缩放） */}
              {Object.entries(PROVINCE_CENTER_PCT).map(([province, pos]) => {
                const data = provinceData[province]
                if (!data) return null
                const metricValue = data[heatmapMode]
                const isSelected = selectedProvince === province
                const isHovered = hoveredProvince === province
                const fill = getHeatColor(metricValue, heatmapMode, isSelected, isHovered)
                const maxValue = 35
                const ratio = Math.min(1, metricValue / maxValue)
                const size = 14 + ratio * 26
                return (
                  <button
                    key={province}
                    onMouseEnter={() => setHoveredProvince(province)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => setSelectedProvince(province)}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all hover:scale-110",
                      isSelected && "ring-2 ring-primary ring-offset-1 z-10",
                    )}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: size,
                      height: size,
                      backgroundColor: fill,
                    }}
                    title={`${province} · ${metricValue} 座`}
                  >
                    {metricValue > 0 && size >= 24 && (
                      <span className="text-[10px] font-semibold text-white leading-none drop-shadow">
                        {metricValue}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 省份信息卡片 */}
          {displayProvince && displayMetrics && (
            <div className="absolute top-3 right-3 bg-white/97 border border-border rounded-lg shadow-lg p-4 min-w-[230px] z-10 pointer-events-none">
              <h4 className="font-bold text-base mb-3 text-foreground">{displayProvince}</h4>
              <div className="space-y-2 text-sm">
                <DetailRow label="仓储数量" value={`${displayMetrics.warehouses} 座`} highlight />
                <DetailRow label="总面积" value={`${displayMetrics.totalArea.toLocaleString()} m²`} />
                <DetailRow
                  label="可出租面积"
                  value={`${displayMetrics.rentableArea.toLocaleString()} m²`}
                  highlight
                />
                <DetailRow
                  label="交易金额"
                  value={`${displayMetrics.transactionAmount.toLocaleString()} 万元`}
                />
                <DetailRow label="发布单数" value={`${displayMetrics.publishCount.toLocaleString()} 条`} />
              </div>
            </div>
          )}
        </div>

        {/* 右侧：仓储列表（跟随地图省份联动） */}
        <Card className="rounded-l-none rounded-r-lg border-l-0 h-full flex flex-col">
          <CardContent className="p-3 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground truncate">
                  {displayProvince || "全国"}仓储出租
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">
                共 {currentList.length} 条
              </span>
            </div>

            <div className="flex-1 space-y-2 overflow-auto">
              {currentList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                  <Building2 className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs">该地区暂无仓储出租信息</p>
                  <p className="text-[10px] mt-1 opacity-70">悬停其他省份查看</p>
                </div>
              ) : (
                currentList.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-md hover:border-primary/40 transition-all cursor-pointer bg-card"
                  >
                    <div className="flex">
                      <div className="w-20 h-20 bg-muted relative flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-muted-foreground/30" />
                        </div>
                        <Badge className="absolute top-1 left-1 text-[10px] bg-green-500 text-white px-1 py-0">
                          出租
                        </Badge>
                      </div>
                      <div className="flex-1 p-2 min-w-0">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-primary font-bold text-sm">{warehouse.price}</span>
                          <span className="text-[10px] text-muted-foreground">元/m²/天</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                          <Maximize2 className="w-3 h-3" />
                          <span>{warehouse.area}m²</span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-green-100 text-green-600 px-1 py-0 ml-1"
                          >
                            {warehouse.priceStatus}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                          {warehouse.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 mt-auto border-t border-border">
              <Button
                variant="link"
                className="w-full text-primary text-xs h-6"
                onClick={() => onNavigate?.("warehouse-list")}
              >
                查看更多
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-[#60a5fa] leading-none">{value}</div>
      <div className="text-[11px] text-white/70 mt-1.5">{label}</div>
    </div>
  )
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}：</span>
      <span className={cn("font-semibold", highlight ? "text-primary" : "text-foreground")}>{value}</span>
    </div>
  )
}
