"use client"

import { useMemo, useState } from "react"
import {
  MapPin,
  ArrowRight,
  Package,
  Maximize2,
  ChevronDown,
  Layers,
  Home as HomeIcon,
  Boxes,
  PanelsTopLeft,
  Wrench,
  Recycle,
  Hammer,
  Construction,
  Tags,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MaterialMapProps {
  onNavigate?: (page: string) => void
}

// 中国地图底图（与仓储地图复用同一资源）
const CHINA_MAP_IMG =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E4%B8%8B%E8%BD%BD-pWQJMDERqh5FaOT1WHhzsw5iTgUNnG.png"

// 各省/直辖市/自治区在中国地图图片上的近似中心点（与仓储地图保持一致）
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
  内蒙古自治区: { x: 55, y: 24 },
  广西壮族自治区: { x: 56, y: 70 },
  西藏自治区: { x: 25, y: 53 },
  宁夏回族自治区: { x: 53, y: 39 },
  新疆维吾尔自治区: { x: 20, y: 30 },
}

// 物资 8 大分类
type CategoryKey =
  | "all"
  | "house"
  | "assemble"
  | "template"
  | "machine"
  | "turnaround"
  | "steel"
  | "recycle"
  | "other"

const categories: { key: CategoryKey; label: string; icon: typeof HomeIcon; types: string[] }[] = [
  { key: "house", label: "房屋建筑类", icon: HomeIcon, types: ["集装箱房", "装配式板房", "活动板房", "工地围挡"] },
  { key: "assemble", label: "拼装类", icon: PanelsTopLeft, types: ["盘扣脚手架", "钢管扣件", "支撑体系", "工具式模架"] },
  { key: "template", label: "模板类", icon: Layers, types: ["建筑模板", "钢模板", "铝模板", "木模板"] },
  { key: "machine", label: "机械设备", icon: Wrench, types: ["塔吊", "施工电梯", "挖掘机", "装载机", "发电机组"] },
  { key: "turnaround", label: "周转材料", icon: Boxes, types: ["木方", "钢支撑", "顶托底座", "型钢"] },
  { key: "steel", label: "钢结构类", icon: Construction, types: ["H 型钢", "工字钢", "钢梁", "钢柱"] },
  { key: "recycle", label: "再生材料", icon: Recycle, types: ["废旧钢筋", "废旧模板", "废旧木方", "再生骨料"] },
  { key: "other", label: "其他材料", icon: Hammer, types: ["塔吊标准节", "防护网", "安全帽", "其他易耗"] },
]

// 各省份按分类分布的「出租 / 出售」需求单数
type CategoryStat = Partial<Record<CategoryKey, { rent: number; sale: number }>>
const provinceMaterialData: Record<string, CategoryStat> = {
  广东省: {
    house: { rent: 86, sale: 42 },
    assemble: { rent: 124, sale: 56 },
    template: { rent: 78, sale: 88 },
    machine: { rent: 156, sale: 32 },
    turnaround: { rent: 98, sale: 62 },
    steel: { rent: 64, sale: 48 },
    recycle: { rent: 12, sale: 142 },
    other: { rent: 36, sale: 28 },
  },
  北京市: {
    house: { rent: 56, sale: 22 },
    assemble: { rent: 98, sale: 28 },
    template: { rent: 62, sale: 54 },
    machine: { rent: 124, sale: 18 },
    turnaround: { rent: 68, sale: 32 },
    steel: { rent: 52, sale: 24 },
    recycle: { rent: 8, sale: 96 },
    other: { rent: 22, sale: 16 },
  },
  上海市: {
    house: { rent: 68, sale: 32 },
    assemble: { rent: 102, sale: 36 },
    template: { rent: 72, sale: 64 },
    machine: { rent: 138, sale: 24 },
    turnaround: { rent: 82, sale: 46 },
    steel: { rent: 58, sale: 32 },
    recycle: { rent: 10, sale: 118 },
    other: { rent: 28, sale: 20 },
  },
  江苏省: {
    house: { rent: 72, sale: 36 },
    assemble: { rent: 116, sale: 48 },
    template: { rent: 84, sale: 72 },
    machine: { rent: 142, sale: 28 },
    turnaround: { rent: 92, sale: 54 },
    steel: { rent: 64, sale: 38 },
    recycle: { rent: 14, sale: 132 },
    other: { rent: 32, sale: 24 },
  },
  浙江省: {
    house: { rent: 64, sale: 28 },
    assemble: { rent: 98, sale: 42 },
    template: { rent: 72, sale: 58 },
    machine: { rent: 118, sale: 22 },
    turnaround: { rent: 78, sale: 48 },
    steel: { rent: 56, sale: 32 },
    recycle: { rent: 12, sale: 108 },
    other: { rent: 26, sale: 20 },
  },
  山东省: {
    house: { rent: 58, sale: 26 },
    assemble: { rent: 92, sale: 40 },
    template: { rent: 68, sale: 54 },
    machine: { rent: 112, sale: 22 },
    turnaround: { rent: 72, sale: 42 },
    steel: { rent: 68, sale: 42 },
    recycle: { rent: 14, sale: 112 },
    other: { rent: 24, sale: 18 },
  },
  四川省: {
    house: { rent: 52, sale: 24 },
    assemble: { rent: 86, sale: 36 },
    template: { rent: 58, sale: 48 },
    machine: { rent: 96, sale: 18 },
    turnaround: { rent: 62, sale: 36 },
    steel: { rent: 48, sale: 28 },
    recycle: { rent: 10, sale: 92 },
    other: { rent: 20, sale: 16 },
  },
  湖北省: {
    house: { rent: 48, sale: 22 },
    assemble: { rent: 82, sale: 32 },
    template: { rent: 56, sale: 46 },
    machine: { rent: 92, sale: 18 },
    turnaround: { rent: 58, sale: 32 },
    steel: { rent: 44, sale: 26 },
    recycle: { rent: 8, sale: 86 },
    other: { rent: 18, sale: 14 },
  },
  福建省: {
    house: { rent: 42, sale: 18 },
    assemble: { rent: 72, sale: 28 },
    template: { rent: 48, sale: 40 },
    machine: { rent: 84, sale: 16 },
    turnaround: { rent: 52, sale: 28 },
    steel: { rent: 38, sale: 22 },
    recycle: { rent: 6, sale: 74 },
    other: { rent: 16, sale: 12 },
  },
  河南省: {
    house: { rent: 46, sale: 22 },
    assemble: { rent: 78, sale: 32 },
    template: { rent: 54, sale: 44 },
    machine: { rent: 88, sale: 18 },
    turnaround: { rent: 56, sale: 32 },
    steel: { rent: 42, sale: 26 },
    recycle: { rent: 8, sale: 84 },
    other: { rent: 18, sale: 14 },
  },
  湖南省: {
    house: { rent: 38, sale: 18 },
    assemble: { rent: 64, sale: 24 },
    template: { rent: 48, sale: 38 },
    machine: { rent: 78, sale: 14 },
    turnaround: { rent: 52, sale: 28 },
    steel: { rent: 36, sale: 22 },
    recycle: { rent: 6, sale: 72 },
    other: { rent: 16, sale: 12 },
  },
  重庆市: {
    house: { rent: 36, sale: 16 },
    assemble: { rent: 62, sale: 22 },
    template: { rent: 44, sale: 36 },
    machine: { rent: 72, sale: 14 },
    turnaround: { rent: 48, sale: 26 },
    steel: { rent: 32, sale: 18 },
    recycle: { rent: 6, sale: 68 },
    other: { rent: 14, sale: 10 },
  },
  辽宁省: {
    house: { rent: 28, sale: 12 },
    assemble: { rent: 52, sale: 18 },
    template: { rent: 36, sale: 28 },
    machine: { rent: 62, sale: 12 },
    turnaround: { rent: 38, sale: 22 },
    steel: { rent: 28, sale: 16 },
    recycle: { rent: 4, sale: 58 },
    other: { rent: 12, sale: 8 },
  },
  陕西省: {
    house: { rent: 24, sale: 10 },
    assemble: { rent: 46, sale: 16 },
    template: { rent: 32, sale: 24 },
    machine: { rent: 54, sale: 10 },
    turnaround: { rent: 32, sale: 18 },
    steel: { rent: 24, sale: 14 },
    recycle: { rent: 4, sale: 52 },
    other: { rent: 10, sale: 8 },
  },
}

type MaterialItem = {
  id: number
  name: string
  category: CategoryKey
  dealType: "出租" | "出售"
  province: string
  location: string
  price: string
  unit: string
  feature: string
}

// 推荐物资池（按分类与省份过滤）
const materialPool: MaterialItem[] = [
  { id: 1, name: "盘扣式脚手架 8000 套", category: "assemble", dealType: "出租", province: "广东省", location: "广州番禺", price: "0.8", unit: "元/套/天", feature: "国标认证" },
  { id: 2, name: "二手钢管扣件 500 吨", category: "assemble", dealType: "出售", province: "广东省", location: "广州黄埔", price: "3500", unit: "元/吨", feature: "可检测" },
  { id: 3, name: "建筑模板 1000 张", category: "template", dealType: "出售", province: "广东省", location: "佛山顺德", price: "45", unit: "元/张", feature: "支持开票" },
  { id: 4, name: "施工电梯 SC200/200 双笼", category: "machine", dealType: "出租", province: "广东省", location: "珠海横琴", price: "2.6", unit: "万元/月", feature: "含安拆" },
  { id: 5, name: "PC200-8 二手挖掘机", category: "machine", dealType: "出售", province: "广东省", location: "东莞厚街", price: "26", unit: "万元/台", feature: "手续齐全" },
  { id: 6, name: "工地周转木方 200 方", category: "turnaround", dealType: "出租", province: "广东省", location: "深圳龙岗", price: "12", unit: "元/方/月", feature: "现货供应" },
  { id: 7, name: "废旧钢筋头 80 吨", category: "recycle", dealType: "出售", province: "广东省", location: "惠州仲恺", price: "2800", unit: "元/吨", feature: "现场过磅" },
  { id: 8, name: "塔吊标准节 10 节", category: "other", dealType: "出租", province: "广东省", location: "东莞虎门", price: "1800", unit: "元/节/月", feature: "原厂配件" },
  { id: 9, name: "集装箱房 30 套", category: "house", dealType: "出租", province: "江苏省", location: "苏州工业园", price: "320", unit: "元/套/月", feature: "九成新" },
  { id: 10, name: "铝模板 300 套", category: "template", dealType: "出租", province: "上海市", location: "外高桥", price: "85", unit: "元/m²/月", feature: "可整套租" },
  { id: 11, name: "塔吊 QTZ80 一台", category: "machine", dealType: "出租", province: "上海市", location: "浦东青浦", price: "5.2", unit: "万元/月", feature: "持证操作员" },
  { id: 12, name: "H 型钢 200 吨", category: "steel", dealType: "出售", province: "山东省", location: "青岛胶州", price: "4200", unit: "元/吨", feature: "现货" },
  { id: 13, name: "工字钢 100 吨", category: "steel", dealType: "出租", province: "北京市", location: "通州马驹桥", price: "0.55", unit: "元/吨/天", feature: "可送货" },
  { id: 14, name: "再生骨料 800 方", category: "recycle", dealType: "出售", province: "浙江省", location: "宁波北仑", price: "55", unit: "元/方", feature: "环保达标" },
  { id: 15, name: "钢支撑 400 根", category: "turnaround", dealType: "出租", province: "江苏省", location: "南京江宁", price: "1.2", unit: "元/根/天", feature: "整批可议" },
  { id: 16, name: "活动板房 60 间", category: "house", dealType: "出售", province: "四川省", location: "成都新都", price: "5800", unit: "元/间", feature: "拆除可议" },
  { id: 17, name: "废旧模板 600 张", category: "recycle", dealType: "出售", province: "湖北省", location: "武汉东西湖", price: "18", unit: "元/张", feature: "随提随结" },
  { id: 18, name: "钢梁 80 吨", category: "steel", dealType: "出售", province: "河南省", location: "郑州航空港", price: "4500", unit: "元/吨", feature: "支持开票" },
  { id: 19, name: "防护网 5000 m²", category: "other", dealType: "出售", province: "福建省", location: "厦门海沧", price: "8", unit: "元/m²", feature: "国标" },
  { id: 20, name: "钢管扣件 200 吨", category: "assemble", dealType: "出租", province: "重庆市", location: "两江新区", price: "0.18", unit: "元/件/天", feature: "整批长租" },
]

export function MaterialMap({ onNavigate }: MaterialMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all")
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string | null>("广东省")
  // 默认展开 8 大分类
  const [expanded, setExpanded] = useState(true)

  const displayProvince = hoveredProvince || selectedProvince

  // 按分类计算每省总数（rent + sale）
  const provinceTotals = useMemo(() => {
    const result: Record<string, { rent: number; sale: number; total: number }> = {}
    Object.entries(provinceMaterialData).forEach(([prov, stat]) => {
      let rent = 0
      let sale = 0
      if (selectedCategory === "all") {
        Object.values(stat).forEach((v) => {
          if (v) {
            rent += v.rent
            sale += v.sale
          }
        })
      } else {
        const v = stat[selectedCategory]
        if (v) {
          rent = v.rent
          sale = v.sale
        }
      }
      result[prov] = { rent, sale, total: rent + sale }
    })
    return result
  }, [selectedCategory])

  // 用于热力上色的最大值
  const maxTotal = useMemo(() => {
    return Math.max(1, ...Object.values(provinceTotals).map((v) => v.total))
  }, [provinceTotals])

  // 各分类合计（左侧导航徽标）
  const categoryTotals = useMemo(() => {
    const result: Record<CategoryKey, number> = {
      all: 0,
      house: 0,
      assemble: 0,
      template: 0,
      machine: 0,
      turnaround: 0,
      steel: 0,
      recycle: 0,
      other: 0,
    }
    Object.values(provinceMaterialData).forEach((stat) => {
      categories.forEach((c) => {
        const v = stat[c.key]
        if (v) {
          result[c.key] += v.rent + v.sale
          result.all += v.rent + v.sale
        }
      })
    })
    return result
  }, [])

  const recommended = useMemo(() => {
    return materialPool
      .filter((m) => (selectedCategory === "all" ? true : m.category === selectedCategory))
      .filter((m) => (displayProvince ? m.province === displayProvince : true))
      .slice(0, 6)
  }, [selectedCategory, displayProvince])

  return (
    <section className="w-full relative">
      {/* 右上角浮动入口 */}
      <div className="absolute -top-1 right-0 z-30">
        <Button
          variant="link"
          className="text-primary h-7"
          onClick={() => onNavigate?.("material-list")}
        >
          物资地图
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-[minmax(180px,18%)_minmax(0,1fr)_minmax(240px,24%)] gap-0 h-[460px]">
        {/* 左侧：物资分类导航 */}
        <div className="bg-[#0f2742] text-white rounded-l-lg p-3 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#60a5fa] font-medium text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              物资分类
            </h3>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-white/60 hover:text-white text-[11px] flex items-center gap-0.5"
              aria-label="展开/收起分类"
            >
              {expanded ? "收起" : "展开"}
              <ChevronDown
                className={cn("w-3 h-3 transition-transform", expanded ? "" : "-rotate-90")}
              />
            </button>
          </div>

          <div className="flex-1 overflow-auto -mx-1 px-1 space-y-1">
            {/* 全部类型 */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1.5 rounded text-[12px] transition-colors",
                selectedCategory === "all"
                  ? "bg-[#60a5fa] text-white font-medium"
                  : "text-white/85 hover:bg-white/10",
              )}
            >
              <span className="flex items-center gap-1.5">
                <Tags className="w-3.5 h-3.5" />
                全部类型
              </span>
              <span className="text-[10px] opacity-80">{categoryTotals.all}</span>
            </button>

            {expanded && (
              <div className="space-y-0.5 pt-1">
                {categories.map((c) => {
                  const Icon = c.icon
                  const active = selectedCategory === c.key
                  return (
                    <div key={c.key}>
                      <button
                        onClick={() => setSelectedCategory(c.key)}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-1.5 rounded text-[12px] transition-colors",
                          active
                            ? "bg-[#60a5fa] text-white font-medium"
                            : "text-white/85 hover:bg-white/10",
                        )}
                      >
                        <span className="flex items-center gap-1.5 min-w-0">
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{c.label}</span>
                        </span>
                        <span className="text-[10px] opacity-80 shrink-0 ml-1">
                          {categoryTotals[c.key]}
                        </span>
                      </button>
                      {active && (
                        <div className="ml-5 mt-0.5 mb-1 space-y-0.5">
                          {c.types.map((t) => (
                            <div
                              key={t}
                              className="text-[11px] text-white/55 px-2 py-0.5 truncate"
                            >
                              · {t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/15 mt-auto">
            <p className="text-[11px] text-white/60 leading-relaxed">
              切换分类与省份，右侧物资推荐自动联动
            </p>
          </div>
        </div>

        {/* 中间：地图 */}
        <div className="bg-[#e8f4fc] border-y border-border relative h-full overflow-hidden">
          {/* 图例 */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 border border-border rounded-md px-3 py-2 shadow-sm">
            <div className="text-[11px] text-muted-foreground mb-1.5">
              {selectedCategory === "all"
                ? "全部物资租售需求单（条）"
                : `${categories.find((c) => c.key === selectedCategory)?.label}需求单（条）`}
            </div>
            <div className="flex items-center gap-2">
              {[
                { color: "#dcfce7", label: "<60" },
                { color: "#86efac", label: "60-149" },
                { color: "#22c55e", label: "150-299" },
                { color: "#15803d", label: "300-499" },
                { color: "#14532d", label: "≥500" },
              ].map((bin) => (
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

          {/* 中国地图底图 + 圆点 */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-full max-h-full aspect-[785/645] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CHINA_MAP_IMG || "/placeholder.svg"}
                alt="中国地图"
                className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />

              {Object.entries(PROVINCE_CENTER_PCT).map(([province, pos]) => {
                const stat = provinceTotals[province]
                if (!stat) return null
                const total = stat.total
                const isSelected = selectedProvince === province
                const isHovered = hoveredProvince === province
                const fill = getMaterialHeatColor(total, isSelected, isHovered)
                const ratio = Math.min(1, total / Math.max(maxTotal, 1))
                const size = 12 + ratio * 28
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
                    title={`${province} · 共 ${total} 条 · 出租 ${stat.rent} / 出售 ${stat.sale}`}
                  >
                    {total > 0 && size >= 24 && (
                      <span className="text-[10px] font-semibold text-white leading-none drop-shadow">
                        {total}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 省份信息卡片：默认展示总数；hover 展示出租/出售明细 */}
          {displayProvince && provinceTotals[displayProvince] && (
            <div className="absolute top-3 right-3 bg-white/97 border border-border rounded-lg shadow-lg p-3.5 min-w-[210px] z-10 pointer-events-none">
              <h4 className="font-bold text-base mb-2.5 text-foreground">{displayProvince}</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">需求单总数</span>
                  <span className="font-semibold text-primary">
                    {provinceTotals[displayProvince].total} 条
                  </span>
                </div>
                {hoveredProvince ? (
                  <>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                        出租需求
                      </span>
                      <span className="font-medium text-foreground">
                        {provinceTotals[displayProvince].rent} 条
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                        出售需求
                      </span>
                      <span className="font-medium text-foreground">
                        {provinceTotals[displayProvince].sale} 条
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] text-muted-foreground pt-1">
                    悬停查看出租 / 出售明细
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：物资推荐（与分类 + 省份联动） */}
        <Card className="rounded-l-none rounded-r-lg border-l-0 h-full flex flex-col">
          <CardContent className="p-3 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
              <div className="flex items-center gap-1.5 min-w-0">
                <Package className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground truncate">
                  {displayProvince || "全国"}
                  {selectedCategory === "all"
                    ? "物资推荐"
                    : `· ${categories.find((c) => c.key === selectedCategory)?.label}`}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">
                共 {recommended.length} 条
              </span>
            </div>

            <div className="flex-1 space-y-2 overflow-auto">
              {recommended.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                  <Package className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs">暂无匹配物资</p>
                  <p className="text-[10px] mt-1 opacity-70">尝试切换分类或省份</p>
                </div>
              ) : (
                recommended.map((item) => {
                  const isRent = item.dealType === "出租"
                  return (
                    <div
                      key={item.id}
                      onClick={() => onNavigate?.("material-detail")}
                      className="border border-border rounded-lg overflow-hidden hover:shadow-md hover:border-primary/40 transition-all cursor-pointer bg-card"
                    >
                      <div className="flex">
                        <div
                          className={cn(
                            "w-20 h-20 relative flex-shrink-0 flex items-center justify-center",
                            isRent
                              ? "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent"
                              : "bg-gradient-to-br from-accent/15 via-accent/5 to-transparent",
                          )}
                        >
                          <Package
                            className={cn(
                              "w-5 h-5",
                              isRent ? "text-primary/30" : "text-accent/40",
                            )}
                          />
                          <Badge
                            className={cn(
                              "absolute top-1 left-1 text-[10px] text-white px-1 py-0",
                              isRent ? "bg-primary" : "bg-accent",
                            )}
                          >
                            {item.dealType}
                          </Badge>
                        </div>
                        <div className="flex-1 p-2 min-w-0">
                          <div className="flex items-baseline gap-1 mb-1">
                            <span
                              className={cn(
                                "font-bold text-sm",
                                isRent ? "text-primary" : "text-accent",
                              )}
                            >
                              {item.price}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{item.unit}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                            <Maximize2 className="w-3 h-3" />
                            <span className="truncate">{item.location}</span>
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-muted text-muted-foreground px-1 py-0 ml-1"
                            >
                              {item.feature}
                            </Badge>
                          </div>
                          <div className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="pt-2 mt-auto border-t border-border">
              <Button
                variant="link"
                className="w-full text-primary text-xs h-6"
                onClick={() => onNavigate?.("material-list")}
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

function getMaterialHeatColor(value: number, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return "#0f766e"
  if (isHovered) return "#10b981"
  if (value >= 500) return "#14532d"
  if (value >= 300) return "#15803d"
  if (value >= 150) return "#22c55e"
  if (value >= 60) return "#86efac"
  if (value > 0) return "#dcfce7"
  return "#f1f5f9"
}

// 同时导出地图位置与分类常量（独立页面会复用）
export { categories as materialCategories, PROVINCE_CENTER_PCT, provinceMaterialData }
export type { CategoryKey }
