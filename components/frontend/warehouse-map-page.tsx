"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Crosshair,
  MapPin,
  Plus,
  Minus,
  Layers,
  List,
  ChevronRight,
  X,
  Check,
  Building2,
  Maximize2,
  Eye,
  Navigation,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CHINA_REGIONS } from "@/lib/china-regions"

interface WarehouseMapPageProps {
  onNavigate?: (page: string) => void
}

type Cluster = {
  id: string
  name: string
  /** 该聚合点上的仓储数量 */
  count: number
  /** 0~100 百分比坐标，便于按容器缩放 */
  x: number
  y: number
  totalArea: string
  avgPrice: string
  tier: "一级" | "二级"
}

// 默认定位：广东省 / 深圳市 / 南山区
const DEFAULT_LOCATION = {
  province: "广东省",
  city: "深圳市",
  district: "南山区",
}

// 不同行政区域示意性聚合点（mock）。真实场景由后端按可视范围聚合。
const CLUSTERS_BY_CITY: Record<string, Cluster[]> = {
  深圳市: [
    { id: "sz-1", name: "南山科技园仓储集群", count: 28, x: 32, y: 58, totalArea: "12.8 万 m²", avgPrice: "1.05", tier: "一级" },
    { id: "sz-2", name: "宝安机场物流园", count: 46, x: 22, y: 42, totalArea: "24.6 万 m²", avgPrice: "0.86", tier: "一级" },
    { id: "sz-3", name: "前海保税仓储区", count: 18, x: 28, y: 50, totalArea: "8.2 万 m²", avgPrice: "1.18", tier: "一级" },
    { id: "sz-4", name: "龙岗大运组团", count: 11, x: 64, y: 36, totalArea: "5.4 万 m²", avgPrice: "0.72", tier: "二级" },
    { id: "sz-5", name: "盐田港后方陆域", count: 9, x: 78, y: 56, totalArea: "4.6 万 m²", avgPrice: "0.95", tier: "二级" },
    { id: "sz-6", name: "光明科学城堆场", count: 14, x: 38, y: 28, totalArea: "6.8 万 m²", avgPrice: "0.68", tier: "二级" },
    { id: "sz-7", name: "坪山新能源物流园", count: 7, x: 76, y: 30, totalArea: "3.2 万 m²", avgPrice: "0.64", tier: "二级" },
  ],
  广州市: [
    { id: "gz-1", name: "黄埔综合保税仓", count: 32, x: 64, y: 52, totalArea: "14.5 万 m²", avgPrice: "0.92", tier: "一级" },
    { id: "gz-2", name: "南沙自贸物流园", count: 24, x: 48, y: 76, totalArea: "11.2 万 m²", avgPrice: "0.78", tier: "一级" },
    { id: "gz-3", name: "白云空港片区", count: 19, x: 40, y: 30, totalArea: "8.4 万 m²", avgPrice: "0.86", tier: "一级" },
    { id: "gz-4", name: "番禺周转仓集群", count: 12, x: 54, y: 64, totalArea: "5.6 万 m²", avgPrice: "0.68", tier: "二级" },
    { id: "gz-5", name: "增城物流园", count: 8, x: 76, y: 40, totalArea: "3.8 万 m²", avgPrice: "0.58", tier: "二级" },
  ],
  default: [
    { id: "d-1", name: "市中心物流集群", count: 16, x: 48, y: 50, totalArea: "7.2 万 m²", avgPrice: "0.78", tier: "一级" },
    { id: "d-2", name: "西区周转堆场", count: 9, x: 28, y: 56, totalArea: "4.1 万 m²", avgPrice: "0.62", tier: "二级" },
    { id: "d-3", name: "北区综合仓储", count: 12, x: 56, y: 30, totalArea: "5.6 万 m²", avgPrice: "0.66", tier: "二级" },
    { id: "d-4", name: "东区开发区", count: 7, x: 70, y: 48, totalArea: "3.4 万 m²", avgPrice: "0.58", tier: "二级" },
    { id: "d-5", name: "南区港口堆场", count: 14, x: 50, y: 74, totalArea: "6.8 万 m²", avgPrice: "0.74", tier: "一级" },
  ],
}

function getClusterColor(count: number) {
  if (count >= 30) return { bg: "#dc2626", ring: "rgba(220,38,38,0.25)" } // red-600
  if (count >= 15) return { bg: "#f97316", ring: "rgba(249,115,22,0.25)" } // orange-500
  return { bg: "#2563eb", ring: "rgba(37,99,235,0.25)" } // blue-600（主色近似）
}

function getClusterSize(count: number, zoom: number) {
  // 数量映射半径 28~56px，再乘以缩放
  const base = Math.min(56, Math.max(28, 24 + Math.log10(Math.max(1, count)) * 22))
  return base * zoom
}

export function WarehouseMapPage({ onNavigate }: WarehouseMapPageProps) {
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [regionOpen, setRegionOpen] = useState(false)
  const [hoverProvince, setHoverProvince] = useState<string>(location.province)
  const [hoverCity, setHoverCity] = useState<string>(location.city)

  const [keyword, setKeyword] = useState("")
  const [warehouseType, setWarehouseType] = useState("all")
  const [areaRange, setAreaRange] = useState("all")

  const [zoom, setZoom] = useState(1)
  const [activeCluster, setActiveCluster] = useState<string | null>(null)

  const clusters = CLUSTERS_BY_CITY[location.city] ?? CLUSTERS_BY_CITY.default
  const total = useMemo(() => clusters.reduce((s, c) => s + c.count, 0), [clusters])
  const active = clusters.find((c) => c.id === activeCluster) ?? null

  const handleLocate = () => {
    setLocation(DEFAULT_LOCATION)
    setHoverProvince(DEFAULT_LOCATION.province)
    setHoverCity(DEFAULT_LOCATION.city)
    setZoom(1)
  }

  const handleZoomIn = () => setZoom((z) => Math.min(2.2, +(z + 0.2).toFixed(2)))
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))

  const hoveredProvinceNode = CHINA_REGIONS.find((p) => p.name === hoverProvince)
  const hoveredCityNode = hoveredProvinceNode?.cities.find((c) => c.name === hoverCity)

  const handlePickProvince = (name: string) => {
    setHoverProvince(name)
    const first = CHINA_REGIONS.find((p) => p.name === name)?.cities[0]
    if (first) setHoverCity(first.name)
  }
  const handlePickCity = (name: string) => setHoverCity(name)
  const handlePickDistrict = (name: string) => {
    setLocation({ province: hoverProvince, city: hoverCity, district: name })
    setRegionOpen(false)
    setActiveCluster(null)
    setZoom(1)
  }

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] min-h-[640px] rounded-lg overflow-hidden border border-border bg-[#eef2f7]">
      {/* ===================== 地图底图（伪地图：网格 + 道路 + 水域） ===================== */}
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 200ms ease-out",
          }}
        >
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dde4ee" strokeWidth="0.5" />
            </pattern>
            <pattern id="map-grid-major" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#c5d0df" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfe3f5" />
              <stop offset="100%" stopColor="#aacae4" />
            </linearGradient>
            <linearGradient id="park" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d8ecd2" />
              <stop offset="100%" stopColor="#c3e1bb" />
            </linearGradient>
          </defs>
          {/* 网格 */}
          <rect width="1000" height="700" fill="url(#map-grid)" />
          <rect width="1000" height="700" fill="url(#map-grid-major)" />

          {/* 水域：海岸线 + 内陆河 */}
          <path
            d="M 760 0 L 1000 0 L 1000 700 L 720 700 C 760 600 700 520 780 440 C 860 360 740 280 800 200 C 860 120 760 80 760 0 Z"
            fill="url(#water)"
            opacity="0.85"
          />
          <path
            d="M 0 240 C 120 220 220 280 340 250 C 460 220 560 300 700 280 C 760 270 800 290 860 270"
            fill="none"
            stroke="#9cc4e3"
            strokeWidth="6"
            opacity="0.7"
          />
          <path
            d="M 0 240 C 120 220 220 280 340 250 C 460 220 560 300 700 280 C 760 270 800 290 860 270"
            fill="none"
            stroke="#c4dcef"
            strokeWidth="2"
          />

          {/* 公园/绿地 */}
          <path d="M 80 460 Q 160 420 240 470 T 380 480 L 380 580 L 80 580 Z" fill="url(#park)" opacity="0.6" />
          <circle cx="540" cy="140" r="60" fill="url(#park)" opacity="0.6" />

          {/* 高速公路（粗白线带描边） */}
          <g>
            <path d="M 40 360 C 220 320 360 380 540 340 C 720 300 840 360 980 340"
              stroke="#f9c75d" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 40 360 C 220 320 360 380 540 340 C 720 300 840 360 980 340"
              stroke="#ffe9a8" strokeWidth="4" fill="none" strokeDasharray="14 10" />

            <path d="M 220 40 C 260 200 200 380 280 540 C 320 620 360 660 380 700"
              stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.95" />
            <path d="M 220 40 C 260 200 200 380 280 540 C 320 620 360 660 380 700"
              stroke="#dfe6f1" strokeWidth="1.5" fill="none" />

            <path d="M 620 60 C 580 220 660 380 600 540 C 580 600 620 660 640 700"
              stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.95" />
            <path d="M 620 60 C 580 220 660 380 600 540 C 580 600 620 660 640 700"
              stroke="#dfe6f1" strokeWidth="1.5" fill="none" />
          </g>

          {/* 次要街道 */}
          <g stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.85">
            <path d="M 60 120 L 720 140" />
            <path d="M 40 520 L 940 480" />
            <path d="M 380 40 L 420 700" />
            <path d="M 820 40 L 800 700" />
            <path d="M 120 240 L 940 260" />
            <path d="M 80 620 L 940 600" />
          </g>

          {/* 城市/地标标签 */}
          <g fill="#5a6677" fontSize="12" fontFamily="sans-serif">
            <text x="160" y="180">中心商务区</text>
            <text x="600" y="140">滨海港区</text>
            <text x="420" y="420">物流园区</text>
            <text x="780" y="540">保税仓集群</text>
            <text x="180" y="540">综合产业园</text>
          </g>
        </svg>
      </div>

      {/* ===================== 聚合圆圈 marker ===================== */}
      <div className="absolute inset-0 pointer-events-none">
        {clusters.map((c) => {
          const size = getClusterSize(c.count, zoom)
          const { bg, ring } = getClusterColor(c.count)
          const isActive = activeCluster === c.id
          return (
            <button
              key={c.id}
              onClick={() => setActiveCluster(isActive ? null : c.id)}
              className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              {/* 外圈光晕 */}
              <span
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  width: size + 16,
                  height: size + 16,
                  left: -8,
                  top: -8,
                  background: ring,
                }}
              />
              {/* 主圈 */}
              <span
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-full text-white font-semibold shadow-lg ring-2 ring-white transition-all",
                  isActive && "scale-110",
                )}
                style={{
                  width: size,
                  height: size,
                  background: bg,
                  fontSize: Math.max(11, size * 0.32),
                  lineHeight: 1,
                }}
              >
                <span>{c.count}</span>
                <span className="text-[9px] font-normal opacity-90">个仓储</span>
              </span>
              {/* hover tooltip */}
              <span
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-2 py-1 rounded bg-slate-900/90 text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity",
                  isActive && "opacity-100",
                )}
                style={{ top: size }}
              >
                {c.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* ===================== 顶部浮层：定位 + 区域 + 搜索 + 筛选 ===================== */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center gap-2">
        {/* 返回 */}
        <Button
          variant="default"
          size="sm"
          className="h-10 gap-1.5 shadow-lg bg-white text-slate-900 hover:bg-white hover:text-primary border border-slate-200 px-3"
          onClick={() => onNavigate?.("warehouse-list")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">返回</span>
        </Button>

        {/* 当前位置 + 三级切换 */}
        <Popover open={regionOpen} onOpenChange={setRegionOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="h-10 gap-2 shadow-lg bg-white text-slate-900 hover:bg-white hover:text-primary border border-slate-200"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{location.province}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="font-medium">{location.city}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="font-medium">{location.district}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0 w-[640px]" sideOffset={8}>
            <div className="grid grid-cols-3 divide-x divide-border h-[340px]">
              {/* 省 */}
              <ScrollArea className="h-full">
                <div className="p-1.5">
                  <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground">
                    省 / 自治区 / 直辖市
                  </div>
                  {CHINA_REGIONS.map((p) => (
                    <button
                      key={p.name}
                      onMouseEnter={() => handlePickProvince(p.name)}
                      onClick={() => handlePickProvince(p.name)}
                      className={cn(
                        "w-full flex items-center justify-between text-left px-2 py-1.5 text-sm rounded hover:bg-accent/40 transition-colors",
                        hoverProvince === p.name && "bg-primary/10 text-primary font-medium",
                      )}
                    >
                      <span>{p.name}</span>
                      {hoverProvince === p.name && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </ScrollArea>
              {/* 市 */}
              <ScrollArea className="h-full">
                <div className="p-1.5">
                  <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground">城市</div>
                  {hoveredProvinceNode?.cities.map((c) => (
                    <button
                      key={c.name}
                      onMouseEnter={() => handlePickCity(c.name)}
                      onClick={() => handlePickCity(c.name)}
                      className={cn(
                        "w-full flex items-center justify-between text-left px-2 py-1.5 text-sm rounded hover:bg-accent/40 transition-colors",
                        hoverCity === c.name && "bg-primary/10 text-primary font-medium",
                      )}
                    >
                      <span>{c.name}</span>
                      {hoverCity === c.name && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </ScrollArea>
              {/* 区/县 */}
              <ScrollArea className="h-full">
                <div className="p-1.5">
                  <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground">区 / 县</div>
                  {hoveredCityNode?.districts.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => handlePickDistrict(d.name)}
                      className={cn(
                        "w-full flex items-center justify-between text-left px-2 py-1.5 text-sm rounded hover:bg-accent/40 transition-colors",
                        location.district === d.name &&
                          hoverCity === location.city &&
                          hoverProvince === location.province &&
                          "bg-primary/10 text-primary font-medium",
                      )}
                    >
                      <span>{d.name}</span>
                      {location.district === d.name &&
                        hoverCity === location.city &&
                        hoverProvince === location.province && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        {/* 关键词搜索 */}
        <div className="flex items-center bg-white rounded-md shadow-lg border border-slate-200 h-10 px-2 gap-1 flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            placeholder="在地图区域内搜索仓储名称 / 地标"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 px-1 text-sm"
          />
          {keyword && (
            <button
              onClick={() => setKeyword("")}
              className="text-slate-400 hover:text-slate-600 shrink-0"
              aria-label="清除"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <Button size="sm" className="h-7 px-3 text-xs">
            搜索
          </Button>
        </div>

        {/* 筛选条件 */}
        <Select value={warehouseType} onValueChange={setWarehouseType}>
          <SelectTrigger className="h-10 w-32 bg-white shadow-lg border-slate-200">
            <SelectValue placeholder="仓储类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="comprehensive">综合仓库</SelectItem>
            <SelectItem value="logistics">物流仓库</SelectItem>
            <SelectItem value="cold">冷链仓库</SelectItem>
            <SelectItem value="outdoor">露天堆场</SelectItem>
            <SelectItem value="stereo">立体仓库</SelectItem>
          </SelectContent>
        </Select>

        <Select value={areaRange} onValueChange={setAreaRange}>
          <SelectTrigger className="h-10 w-32 bg-white shadow-lg border-slate-200">
            <SelectValue placeholder="面积范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">不限面积</SelectItem>
            <SelectItem value="0-500">500m² 以下</SelectItem>
            <SelectItem value="500-1000">500–1000m²</SelectItem>
            <SelectItem value="1000-3000">1000–3000m²</SelectItem>
            <SelectItem value="3000-5000">3000–5000m²</SelectItem>
            <SelectItem value="5000+">5000m² 以上</SelectItem>
          </SelectContent>
        </Select>

        {/* 切回列表 */}
        <div className="ml-auto flex items-center gap-1 bg-white shadow-lg border border-slate-200 rounded-md p-1 h-10">
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs" onClick={() => onNavigate?.("warehouse-list")}>
            <List className="w-3.5 h-3.5 mr-1" />
            列表
          </Button>
          <Button variant="secondary" size="sm" className="h-8 px-3 text-xs">
            <Layers className="w-3.5 h-3.5 mr-1" />
            地图
          </Button>
        </div>
      </div>

      {/* ===================== 顶部摘要小卡（位置 + 仓储数量） ===================== */}
      <div className="absolute top-20 left-4 z-10 bg-white/95 backdrop-blur rounded-md shadow-lg border border-slate-200 px-3 py-2 text-xs flex items-center gap-3">
        <Navigation className="w-3.5 h-3.5 text-primary" />
        <span className="text-muted-foreground">当前视图</span>
        <span className="font-medium text-slate-800">
          {location.province} · {location.city} · {location.district}
        </span>
        <span className="w-px h-3 bg-slate-200" />
        <span className="text-muted-foreground">仓储</span>
        <span className="font-semibold text-primary">{total} 个</span>
        <span className="w-px h-3 bg-slate-200" />
        <span className="text-muted-foreground">聚合点</span>
        <span className="font-semibold text-slate-800">{clusters.length}</span>
      </div>

      {/* ===================== 右下：缩放 + 定位 ===================== */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-white shadow-lg rounded-md border border-slate-200 flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-700"
            aria-label="放大"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200" />
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-700"
            aria-label="缩小"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleLocate}
          className="w-10 h-10 bg-white shadow-lg rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-primary"
          aria-label="回到当前位置"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <div className="bg-white shadow-lg rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 text-center">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* ===================== 右下：图例 ===================== */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur shadow-lg rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-600">
        <div className="font-medium text-slate-800 mb-1.5">仓储聚合规模</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: "#2563eb" }} />
            <span>&lt; 15 个</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full" style={{ background: "#f97316" }} />
            <span>15–30 个</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full" style={{ background: "#dc2626" }} />
            <span>≥ 30 个</span>
          </div>
        </div>
      </div>

      {/* ===================== 聚合点详情浮窗 ===================== */}
      {active && (
        <div className="absolute right-4 top-20 z-30 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
          <div className="relative h-28 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent flex items-center justify-center">
            <Building2 className="w-12 h-12 text-primary/40" />
            <button
              onClick={() => setActiveCluster(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
              aria-label="关闭"
            >
              <X className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <Badge
              className={cn(
                "absolute top-2 left-2 gap-1",
                active.tier === "一级"
                  ? "bg-amber-500 hover:bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-700",
              )}
            >
              {active.tier}站点
            </Badge>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">聚合区域</div>
              <div className="font-semibold text-slate-900 text-base mt-0.5">{active.name}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-primary/5 rounded p-2">
                <div className="text-lg font-bold text-primary leading-none">{active.count}</div>
                <div className="text-[10px] text-muted-foreground mt-1">仓储数量</div>
              </div>
              <div className="bg-accent/5 rounded p-2">
                <div className="text-sm font-bold text-accent leading-tight">{active.totalArea}</div>
                <div className="text-[10px] text-muted-foreground mt-1">总面积</div>
              </div>
              <div className="bg-slate-50 rounded p-2">
                <div className="text-sm font-bold text-slate-800 leading-tight">{active.avgPrice}</div>
                <div className="text-[10px] text-muted-foreground mt-1">均价 元/m²/天</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {location.province} {location.city} {location.district}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1 h-8"
                onClick={() => onNavigate?.("warehouse-list")}
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                查看 {active.count} 个仓储
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={() => onNavigate?.("warehouse-detail")}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
