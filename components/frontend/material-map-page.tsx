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
  Package,
  Maximize2,
  Eye,
  Navigation,
  ArrowLeft,
  Tags,
  Building2,
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

interface MaterialMapPageProps {
  onNavigate?: (page: string) => void
}

type MaterialCluster = {
  id: string
  /** 聚合区域名称，如「南山科技园物资集散区」 */
  name: string
  /** 出租需求单数 */
  rent: number
  /** 出售需求单数 */
  sale: number
  /** 关联仓储数 */
  warehouses: number
  /** 累计成交金额（万元） */
  deal: number
  /** 0~100 百分比坐标 */
  x: number
  y: number
  /** 主推物资类目 */
  topCategory: string
  /** 主仓储名称 */
  topWarehouse: string
}

// 默认定位：广东省 / 深圳市 / 南山区
const DEFAULT_LOCATION = {
  province: "广东省",
  city: "深圳市",
  district: "南山区",
}

const CLUSTERS_BY_CITY: Record<string, MaterialCluster[]> = {
  深圳市: [
    { id: "sz-1", name: "南山科技园物资集散区", rent: 86, sale: 42, warehouses: 12, deal: 1840, x: 32, y: 58, topCategory: "脚手架类", topWarehouse: "深圳前海综合物流仓" },
    { id: "sz-2", name: "宝安机场临港物资园", rent: 124, sale: 68, warehouses: 18, deal: 3260, x: 22, y: 42, topCategory: "型材类", topWarehouse: "宝安空港材料中心" },
    { id: "sz-3", name: "前海保税物资集群", rent: 58, sale: 36, warehouses: 8, deal: 1280, x: 28, y: 50, topCategory: "电线电缆", topWarehouse: "前海保税仓" },
    { id: "sz-4", name: "龙岗大运组团周转区", rent: 32, sale: 18, warehouses: 6, deal: 720, x: 64, y: 36, topCategory: "模板类", topWarehouse: "龙岗大运周转库" },
    { id: "sz-5", name: "盐田港后方陆域", rent: 26, sale: 14, warehouses: 5, deal: 540, x: 78, y: 56, topCategory: "型材类", topWarehouse: "盐田港堆场" },
    { id: "sz-6", name: "光明科学城建材库", rent: 42, sale: 24, warehouses: 7, deal: 980, x: 38, y: 28, topCategory: "支护类", topWarehouse: "光明科学城材料库" },
    { id: "sz-7", name: "坪山新能源物资园", rent: 18, sale: 12, warehouses: 4, deal: 380, x: 76, y: 30, topCategory: "其他材料", topWarehouse: "坪山综合仓" },
  ],
  广州市: [
    { id: "gz-1", name: "黄埔综合物资集群", rent: 92, sale: 48, warehouses: 14, deal: 2280, x: 64, y: 52, topCategory: "型材类", topWarehouse: "广州黄埔保税仓" },
    { id: "gz-2", name: "南沙自贸物资园", rent: 68, sale: 38, warehouses: 11, deal: 1620, x: 48, y: 76, topCategory: "拼装类", topWarehouse: "南沙桥隧周转仓" },
    { id: "gz-3", name: "白云空港物资片区", rent: 54, sale: 28, warehouses: 9, deal: 1280, x: 40, y: 30, topCategory: "电线电缆", topWarehouse: "白云空港中心仓" },
    { id: "gz-4", name: "番禺周转仓集群", rent: 32, sale: 18, warehouses: 6, deal: 720, x: 54, y: 64, topCategory: "脚手架类", topWarehouse: "番禺周转仓" },
    { id: "gz-5", name: "增城物资中转园", rent: 22, sale: 12, warehouses: 4, deal: 480, x: 76, y: 40, topCategory: "模板类", topWarehouse: "增城综合仓" },
  ],
  default: [
    { id: "d-1", name: "市中心物资集群", rent: 48, sale: 26, warehouses: 8, deal: 1080, x: 48, y: 50, topCategory: "型材类", topWarehouse: "中心枢纽仓" },
    { id: "d-2", name: "西区周转堆场", rent: 24, sale: 14, warehouses: 5, deal: 520, x: 28, y: 56, topCategory: "支护类", topWarehouse: "西区堆场" },
    { id: "d-3", name: "北区综合物资库", rent: 36, sale: 18, warehouses: 6, deal: 760, x: 56, y: 30, topCategory: "脚手架类", topWarehouse: "北区物资库" },
    { id: "d-4", name: "东区开发区物资园", rent: 18, sale: 10, warehouses: 4, deal: 360, x: 70, y: 48, topCategory: "电线电缆", topWarehouse: "东区开发区仓" },
    { id: "d-5", name: "南区港口物资堆场", rent: 42, sale: 22, warehouses: 7, deal: 940, x: 50, y: 74, topCategory: "拼装类", topWarehouse: "南区港口堆场" },
  ],
}

function getClusterColor(total: number) {
  // 基于「出租 + 出售」总需求量分级，主色系采用 emerald → amber → red 渐进
  if (total >= 120) return { bg: "#dc2626", ring: "rgba(220,38,38,0.25)" }
  if (total >= 60) return { bg: "#f97316", ring: "rgba(249,115,22,0.25)" }
  return { bg: "#10b981", ring: "rgba(16,185,129,0.25)" }
}

function getClusterSize(total: number, zoom: number) {
  const base = Math.min(60, Math.max(30, 26 + Math.log10(Math.max(1, total)) * 22))
  return base * zoom
}

export function MaterialMapPage({ onNavigate }: MaterialMapPageProps) {
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [regionOpen, setRegionOpen] = useState(false)
  const [hoverProvince, setHoverProvince] = useState<string>(location.province)
  const [hoverCity, setHoverCity] = useState<string>(location.city)

  const [keyword, setKeyword] = useState("")
  const [materialType, setMaterialType] = useState("all")
  const [demandType, setDemandType] = useState("all")

  const [zoom, setZoom] = useState(1)
  const [activeCluster, setActiveCluster] = useState<string | null>(null)

  const clusters = CLUSTERS_BY_CITY[location.city] ?? CLUSTERS_BY_CITY.default
  const totals = useMemo(
    () =>
      clusters.reduce(
        (acc, c) => {
          acc.rent += c.rent
          acc.sale += c.sale
          acc.warehouses += c.warehouses
          acc.deal += c.deal
          return acc
        },
        { rent: 0, sale: 0, warehouses: 0, deal: 0 },
      ),
    [clusters],
  )
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
            <pattern id="mm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dde4ee" strokeWidth="0.5" />
            </pattern>
            <pattern id="mm-grid-major" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#c5d0df" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="mm-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfe3f5" />
              <stop offset="100%" stopColor="#aacae4" />
            </linearGradient>
            <linearGradient id="mm-park" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d8ecd2" />
              <stop offset="100%" stopColor="#c3e1bb" />
            </linearGradient>
          </defs>
          <rect width="1000" height="700" fill="url(#mm-grid)" />
          <rect width="1000" height="700" fill="url(#mm-grid-major)" />

          {/* 水域 */}
          <path
            d="M 760 0 L 1000 0 L 1000 700 L 720 700 C 760 600 700 520 780 440 C 860 360 740 280 800 200 C 860 120 760 80 760 0 Z"
            fill="url(#mm-water)"
            opacity="0.85"
          />
          <path
            d="M 0 240 C 120 220 220 280 340 250 C 460 220 560 300 700 280 C 760 270 800 290 860 270"
            fill="none"
            stroke="#9cc4e3"
            strokeWidth="6"
            opacity="0.7"
          />

          {/* 公园/绿地 */}
          <path d="M 80 460 Q 160 420 240 470 T 380 480 L 380 580 L 80 580 Z" fill="url(#mm-park)" opacity="0.6" />
          <circle cx="540" cy="140" r="60" fill="url(#mm-park)" opacity="0.6" />

          {/* 高速公路 */}
          <g>
            <path d="M 40 360 C 220 320 360 380 540 340 C 720 300 840 360 980 340"
              stroke="#f9c75d" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 40 360 C 220 320 360 380 540 340 C 720 300 840 360 980 340"
              stroke="#ffe9a8" strokeWidth="4" fill="none" strokeDasharray="14 10" />

            <path d="M 220 40 C 260 200 200 380 280 540 C 320 620 360 660 380 700"
              stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.95" />
            <path d="M 620 60 C 580 220 660 380 600 540 C 580 600 620 660 640 700"
              stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.95" />
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

          {/* 标签 */}
          <g fill="#5a6677" fontSize="12" fontFamily="sans-serif">
            <text x="160" y="180">中心商务区</text>
            <text x="600" y="140">滨海港区</text>
            <text x="420" y="420">物流园区</text>
            <text x="780" y="540">保税物资集群</text>
            <text x="180" y="540">综合产业园</text>
          </g>
        </svg>
      </div>

      {/* ===================== 聚合圆圈 marker ===================== */}
      <div className="absolute inset-0 pointer-events-none">
        {clusters.map((c) => {
          const total = c.rent + c.sale
          const size = getClusterSize(total, zoom)
          const { bg, ring } = getClusterColor(total)
          const isActive = activeCluster === c.id
          return (
            <button
              key={c.id}
              onClick={() => setActiveCluster(isActive ? null : c.id)}
              className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
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
                <span>{total}</span>
                <span className="text-[9px] font-normal opacity-90">条需求</span>
              </span>
              <span
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-2 py-1 rounded bg-slate-900/90 text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity",
                  isActive && "opacity-100",
                )}
                style={{ top: size }}
              >
                {c.name} · 出租 {c.rent} / 出售 {c.sale}
              </span>
            </button>
          )
        })}
      </div>

      {/* ===================== 顶部浮层：定位 + 区域 + 搜索 + 筛选 ===================== */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="h-10 gap-1.5 shadow-lg bg-white text-slate-900 hover:bg-white hover:text-primary border border-slate-200 px-3"
          onClick={() => onNavigate?.("material-list")}
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
            placeholder="在地图区域内搜索物资名称 / 仓储 / 地标"
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

        {/* 物资类别 */}
        <Select value={materialType} onValueChange={setMaterialType}>
          <SelectTrigger className="h-10 w-32 bg-white shadow-lg border-slate-200">
            <SelectValue placeholder="物资类别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部物资</SelectItem>
            <SelectItem value="template">模板类</SelectItem>
            <SelectItem value="support">支护类</SelectItem>
            <SelectItem value="section">型材类</SelectItem>
            <SelectItem value="rail">轨道类</SelectItem>
            <SelectItem value="scaffold">脚手架类</SelectItem>
            <SelectItem value="house">房屋建筑类</SelectItem>
            <SelectItem value="assembly">拼装类</SelectItem>
            <SelectItem value="cable">电线电缆</SelectItem>
            <SelectItem value="other">其他材料</SelectItem>
          </SelectContent>
        </Select>

        {/* 需求类型 */}
        <Select value={demandType} onValueChange={setDemandType}>
          <SelectTrigger className="h-10 w-32 bg-white shadow-lg border-slate-200">
            <SelectValue placeholder="需求类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">出租 + 出售</SelectItem>
            <SelectItem value="rent">仅出租</SelectItem>
            <SelectItem value="sale">仅出售</SelectItem>
          </SelectContent>
        </Select>

        {/* 切回列表 */}
        <div className="ml-auto flex items-center gap-1 bg-white shadow-lg border border-slate-200 rounded-md p-1 h-10">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => onNavigate?.("material-list")}
          >
            <List className="w-3.5 h-3.5 mr-1" />
            列表
          </Button>
          <Button variant="secondary" size="sm" className="h-8 px-3 text-xs">
            <Layers className="w-3.5 h-3.5 mr-1" />
            地图
          </Button>
        </div>
      </div>

      {/* ===================== 顶部摘要小卡 ===================== */}
      <div className="absolute top-20 left-4 z-10 bg-white/95 backdrop-blur rounded-md shadow-lg border border-slate-200 px-3 py-2 text-xs flex items-center gap-3 flex-wrap">
        <Navigation className="w-3.5 h-3.5 text-primary" />
        <span className="text-muted-foreground">当前视图</span>
        <span className="font-medium text-slate-800">
          {location.province} · {location.city} · {location.district}
        </span>
        <span className="w-px h-3 bg-slate-200" />
        <span className="text-muted-foreground">出租</span>
        <span className="font-semibold text-emerald-600">{totals.rent}</span>
        <span className="w-px h-3 bg-slate-200" />
        <span className="text-muted-foreground">出售</span>
        <span className="font-semibold text-amber-600">{totals.sale}</span>
        <span className="w-px h-3 bg-slate-200" />
        <span className="text-muted-foreground">关联仓储</span>
        <span className="font-semibold text-sky-600">{totals.warehouses}</span>
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

      {/* ===================== 左下：图例 ===================== */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur shadow-lg rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-600">
        <div className="font-medium text-slate-800 mb-1.5">物资需求规模（出租 + 出售）</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
            <span>&lt; 60 条</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full" style={{ background: "#f97316" }} />
            <span>60–120 条</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full" style={{ background: "#dc2626" }} />
            <span>≥ 120 条</span>
          </div>
        </div>
      </div>

      {/* ===================== 聚合点详情浮窗 ===================== */}
      {active && (
        <div className="absolute right-4 top-20 z-30 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
          <div className="relative h-28 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent flex items-center justify-center">
            <Package className="w-12 h-12 text-emerald-500/40" />
            <button
              onClick={() => setActiveCluster(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
              aria-label="关闭"
            >
              <X className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <Badge className="absolute top-2 left-2 gap-1 bg-emerald-500 hover:bg-emerald-500 text-white">
              <Tags className="w-3 h-3" />
              {active.topCategory}
            </Badge>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">聚合区域</div>
              <div className="font-semibold text-slate-900 text-base mt-0.5">{active.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-emerald-50 rounded p-2">
                <div className="text-lg font-bold text-emerald-600 leading-none">{active.rent}</div>
                <div className="text-[10px] text-muted-foreground mt-1">出租需求</div>
              </div>
              <div className="bg-amber-50 rounded p-2">
                <div className="text-lg font-bold text-amber-600 leading-none">{active.sale}</div>
                <div className="text-[10px] text-muted-foreground mt-1">出售需求</div>
              </div>
              <div className="bg-sky-50 rounded p-2">
                <div className="text-lg font-bold text-sky-600 leading-none">{active.warehouses}</div>
                <div className="text-[10px] text-muted-foreground mt-1">关联仓储</div>
              </div>
              <div className="bg-primary/5 rounded p-2">
                <div className="text-sm font-bold text-primary leading-tight">{active.deal} 万</div>
                <div className="text-[10px] text-muted-foreground mt-1">累计成交金额</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate" title={active.topWarehouse}>主仓储 · {active.topWarehouse}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {location.province} {location.city} {location.district}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1 h-8"
                onClick={() => onNavigate?.("material-list")}
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                查看 {active.rent + active.sale} 条需求
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={() => onNavigate?.("material-detail")}
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
