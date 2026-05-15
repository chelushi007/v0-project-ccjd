"use client"

import { useState } from "react"
import {
  Sparkles,
  ChevronRight,
  Building2,
  MapPin,
  Maximize2,
  CheckCircle,
  Star,
  ArrowRight,
  Package,
  Weight,
  ShoppingCart,
  Search,
  Warehouse,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type DemandType = "rent" | "material" | "purchase"

interface SmartMatchPageProps {
  onNavigate?: (page: string) => void
  initialType?: DemandType
}

// 仓储匹配结果
const warehouseResults = [
  {
    id: 1,
    name: "中铁建广州南沙综合仓储基地",
    location: "广东省广州市南沙区",
    type: "综合仓储",
    area: "15000m²可租",
    matchScore: 98,
    features: ["铁路专用线", "大型装卸设备", "24小时安保"],
    price: "0.56元/m²/天",
    rating: 4.9,
    reviews: 128,
  },
  {
    id: 2,
    name: "中铁建深圳前海智慧仓储基地",
    location: "广东省深圳市南山区",
    type: "智慧仓储",
    area: "8000m²可租",
    matchScore: 95,
    features: ["自动化设备", "WMS系统", "恒温区"],
    price: "0.52元/m²/天",
    rating: 4.8,
    reviews: 96,
  },
  {
    id: 3,
    name: "中铁建东莞虎门港务仓储基地",
    location: "广东省东莞市虎门镇",
    type: "港口仓储",
    area: "25000m²可租",
    matchScore: 92,
    features: ["近虎门港", "海关监管", "大型堆场"],
    price: "0.38元/m²/天",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "中铁十六局佛山顺德钢构仓储基地",
    location: "广东省佛山市顺德区",
    type: "专业仓储",
    area: "6000m²可租",
    matchScore: 88,
    features: ["钢材专用", "天车设备", "防锈处理"],
    price: "0.45元/m²/天",
    rating: 4.6,
    reviews: 78,
  },
]

// 物资出租匹配结果
const materialResults = [
  {
    id: 1,
    name: "Q235B热轧H型钢",
    provider: "中铁十四局集团广州分公司",
    location: "广东省广州市黄埔区",
    materialType: "型材类",
    quantity: "500吨可租",
    matchScore: 97,
    specs: ["规格齐全", "质量检测报告", "可分批提货"],
    price: "1800元/吨/月",
    condition: "95成新",
  },
  {
    id: 2,
    name: "建筑钢管脚手架",
    provider: "中铁建物资华南专业运营有限公司",
    location: "广东省深圳市宝安区",
    materialType: "脚手架类",
    quantity: "2000套可租",
    matchScore: 94,
    specs: ["48*3.5规格", "带扣件", "现场可验货"],
    price: "15元/套/天",
    condition: "90成新",
  },
  {
    id: 3,
    name: "工字钢梁",
    provider: "中铁十六局集团华南分公司",
    location: "广东省东莞市虎门镇",
    materialType: "型材类",
    quantity: "300吨可租",
    matchScore: 91,
    specs: ["20#工字钢", "12米定尺", "防锈处理"],
    price: "1500元/吨/月",
    condition: "85成新",
  },
  {
    id: 4,
    name: "塔吊设备",
    provider: "中铁二十局集团华南分公司",
    location: "广东省佛山市顺德区",
    materialType: "其他材料",
    quantity: "5台可租",
    matchScore: 88,
    specs: ["QTZ63型", "臂长50m", "含安拆服务"],
    price: "28000元/台/月",
    condition: "良好",
  },
]

// 物资采购匹配结果（出售）
const purchaseResults = [
  {
    id: 1,
    name: "Q345B 螺纹钢（闲置出售）",
    provider: "中铁二十四局南方公司",
    location: "广东省广州市番禺区",
    materialType: "型材类",
    available: "320吨现货",
    minOrder: "起订 5 吨",
    matchScore: 96,
    specs: ["质保书齐全", "可拆批", "支持自提/送货"],
    price: "3 280 元/吨",
    totalPrice: "约 104.96 万元",
    condition: "全新未拆封",
  },
  {
    id: 2,
    name: "建筑模板（清水模板）",
    provider: "中铁建华南循环物资仓",
    location: "广东省东莞市麻涌镇",
    materialType: "模板类",
    available: "12 800 张",
    minOrder: "起订 200 张",
    matchScore: 92,
    specs: ["1830×915×15", "8 成新", "现场可验货"],
    price: "62 元/张",
    totalPrice: "约 79.36 万元",
    condition: "8 成新",
  },
  {
    id: 3,
    name: "扣件式钢管脚手架（整批出售）",
    provider: "中铁十六局集团",
    location: "广东省深圳市光明区",
    materialType: "脚手架类",
    available: "8 600 套",
    minOrder: "整批起售",
    matchScore: 90,
    specs: ["含十字扣件", "整批打包价", "包装完好"],
    price: "108 元/套",
    totalPrice: "约 92.88 万元",
    condition: "9 成新",
  },
  {
    id: 4,
    name: "电缆桥架（库存清仓）",
    provider: "中铁电气化局华南分公司",
    location: "广东省佛山市三水区",
    materialType: "电线电缆",
    available: "4 200 米",
    minOrder: "起订 50 米",
    matchScore: 86,
    specs: ["300×100 镀锌", "含支吊架", "可议价"],
    price: "85 元/米",
    totalPrice: "约 35.70 万元",
    condition: "全新",
  },
]

// 需求类型配置（仓储承租放最前）
const typeConfig: Record<
  DemandType,
  { label: string; icon: typeof Search }
> = {
  rent: { label: "仓储承租", icon: Warehouse },
  material: { label: "物资寻找", icon: Search },
  purchase: { label: "物资采购", icon: ShoppingCart },
}

const typeOrder: DemandType[] = ["rent", "material", "purchase"]

export function SmartMatchPage({
  onNavigate,
  initialType = "rent",
}: SmartMatchPageProps) {
  const [demandType, setDemandType] = useState<DemandType>(initialType)
  const [hasResults, setHasResults] = useState(false)
  const [isMatching, setIsMatching] = useState(false)

  const handleMatch = () => {
    setIsMatching(true)
    setTimeout(() => {
      setIsMatching(false)
      setHasResults(true)
    }, 1000)
  }

  const handleTypeChange = (t: DemandType) => {
    setDemandType(t)
    setHasResults(false)
  }

  return (
    <div className="space-y-6">
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
        <span className="text-foreground">智能匹配</span>
      </div>

      {/* 标题区 */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-semibold">智能匹配</h2>
        <Badge variant="secondary">AI 匹配</Badge>
      </div>

      {/* 需求类型切换：横向 Tab */}
      <div className="grid grid-cols-3 gap-3">
        {typeOrder.map((t) => {
          const cfg = typeConfig[t]
          const TypeIcon = cfg.icon
          const active = demandType === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={cn(
                "rounded-lg border px-4 py-3 flex items-center justify-center gap-2 transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-card-foreground hover:border-primary/40",
              )}
            >
              <TypeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{cfg.label}</span>
            </button>
          )
        })}
      </div>

      {/* 表单区 + 匹配按钮 */}
      <Card>
        <CardContent className="p-5">
          {demandType === "rent" && <RentForm />}
          {demandType === "material" && <MaterialForm />}
          {demandType === "purchase" && <PurchaseForm />}

          <div className="mt-5 flex justify-end">
            <Button onClick={handleMatch} disabled={isMatching} size="lg">
              {isMatching ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  匹配中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  开始智能匹配
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 匹配结果区 */}
      {hasResults && (
        <div>
          {demandType === "rent" && (
            <WarehouseResultList
              results={warehouseResults}
              onReset={() => setHasResults(false)}
            />
          )}
          {demandType === "material" && (
            <MaterialResultList
              results={materialResults}
              onReset={() => setHasResults(false)}
            />
          )}
          {demandType === "purchase" && (
            <PurchaseResultList
              results={purchaseResults}
              onReset={() => setHasResults(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}

/* ---------------- 表单：仓储承租 ---------------- */
function RentForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FieldRegion />
      <div className="space-y-2">
        <Label>仓储类型</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">综合仓储</SelectItem>
            <SelectItem value="cold">冷链仓储</SelectItem>
            <SelectItem value="danger">危化品仓储</SelectItem>
            <SelectItem value="outdoor">露天堆场</SelectItem>
            <SelectItem value="stereo">立体仓库</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>需求面积</Label>
        <Input placeholder="如：3000 m²" />
      </div>
    </div>
  )
}

/* ---------------- 表单：物资寻找 ---------------- */
function MaterialForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FieldRegion />
      <FieldMaterialType />
      <div className="space-y-2">
        <Label>承租数量</Label>
        <Input placeholder="如：100 吨 / 500 套" />
      </div>
    </div>
  )
}

/* ---------------- 表单：物资采购 ---------------- */
function PurchaseForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FieldRegion />
      <FieldMaterialType />
      <div className="space-y-2">
        <Label>采购数量</Label>
        <Input placeholder="如：500 张" />
      </div>
      <div className="space-y-2">
        <Label>预算单价</Label>
        <Input placeholder="如：≤ 70 元/张" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>成色要求</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="选择成色" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">全新未使用</SelectItem>
            <SelectItem value="9">9 成新及以上</SelectItem>
            <SelectItem value="8">8 成新及以上</SelectItem>
            <SelectItem value="any">不限</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

/* ---------------- 复用字段 ---------------- */
function FieldRegion() {
  return (
    <div className="space-y-2">
      <Label>期望区域</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选择区域" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="guangzhou">广州市</SelectItem>
          <SelectItem value="shenzhen">深圳市</SelectItem>
          <SelectItem value="dongguan">东莞市</SelectItem>
          <SelectItem value="foshan">佛山市</SelectItem>
          <SelectItem value="huizhou">惠州市</SelectItem>
          <SelectItem value="zhongshan">中山市</SelectItem>
          <SelectItem value="zhuhai">珠海市</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function FieldMaterialType() {
  return (
    <div className="space-y-2">
      <Label>物资类型</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选择物资类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="template">模板类</SelectItem>
          <SelectItem value="support">支护类</SelectItem>
          <SelectItem value="scaffold">脚手架类</SelectItem>
          <SelectItem value="assembly">拼装类</SelectItem>
          <SelectItem value="rail">轨道类</SelectItem>
          <SelectItem value="profile">型材类</SelectItem>
          <SelectItem value="cable">电线电缆</SelectItem>
          <SelectItem value="building">房屋建筑类</SelectItem>
          <SelectItem value="other">其他材料</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

/* ---------------- 子组件：物资租赁匹配结果 ---------------- */
function MaterialResultList({
  results,
  onReset,
}: {
  results: typeof materialResults
  onReset: () => void
}) {
  return (
    <div className="space-y-4">
      <ResultHeader title="物资匹配结果" count={results.length} onReset={onReset} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result, index) => (
          <Card
            key={result.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <CardContent className="p-0">
              <ResultBanner index={index} matchScore={result.matchScore} />
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {result.name}
                    </h4>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {result.provider}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <InfoLine label="类型" value={result.materialType} />
                  <InfoLine icon={Weight} value={result.quantity} />
                  <InfoLine icon={MapPin} value={result.location} clamp />
                  <InfoLine label="成色" value={result.condition} accent />
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {result.specs.map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-lg font-bold text-primary">{result.price}</span>
                  <Button size="sm">
                    立即下单
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ---------------- 子组件：物资采购匹配结果 ---------------- */
function PurchaseResultList({
  results,
  onReset,
}: {
  results: typeof purchaseResults
  onReset: () => void
}) {
  return (
    <div className="space-y-4">
      <ResultHeader
        title="物资采购匹配结果"
        count={results.length}
        onReset={onReset}
        badge="出售中"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result, index) => (
          <Card
            key={result.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <CardContent className="p-0">
              <ResultBanner index={index} matchScore={result.matchScore} />
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {result.name}
                    </h4>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {result.provider}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <InfoLine label="类型" value={result.materialType} />
                  <InfoLine icon={Weight} value={result.available} />
                  <InfoLine icon={MapPin} value={result.location} clamp />
                  <InfoLine label="成色" value={result.condition} accent />
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {result.specs.map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
                <div className="rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2 mb-3 text-xs text-emerald-800 flex items-center justify-between">
                  <span>{result.minOrder}</span>
                  <span>整批价 {result.totalPrice}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex flex-col leading-tight">
                    <span className="text-lg font-bold text-emerald-700">
                      {result.price}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      单价 · 可议
                    </span>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    立即采购
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ---------------- 子组件：仓储匹配结果 ---------------- */
function WarehouseResultList({
  results,
  onReset,
}: {
  results: typeof warehouseResults
  onReset: () => void
}) {
  return (
    <div className="space-y-4">
      <ResultHeader title="仓储匹配结果" count={results.length} onReset={onReset} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result, index) => (
          <Card
            key={result.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <CardContent className="p-0">
              <ResultBanner index={index} matchScore={result.matchScore} />
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {result.name}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{result.location}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <InfoLine label="类型" value={result.type} />
                  <InfoLine icon={Maximize2} value={result.area} />
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {result.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-lg font-bold text-primary">{result.price}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{result.rating}</span>
                      <span className="text-muted-foreground">({result.reviews})</span>
                    </div>
                    <Button size="sm">
                      查看详情
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ---------------- 公共：标题与横幅 ---------------- */
function ResultHeader({
  title,
  count,
  onReset,
  badge,
}: {
  title: string
  count: number
  onReset: () => void
  badge?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="secondary">找到 {count} 个匹配</Badge>
        {badge && (
          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">{badge}</Badge>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={onReset}>
        重新匹配
      </Button>
    </div>
  )
}

function ResultBanner({ index, matchScore }: { index: number; matchScore: number }) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {index === 0 && <Badge className="bg-accent">最佳匹配</Badge>}
        <span className="text-sm text-muted-foreground">#{index + 1}</span>
      </div>
      <div className="flex items-center gap-1 bg-accent/20 text-accent px-3 py-1 rounded-full">
        <CheckCircle className="w-4 h-4" />
        <span className="font-semibold">{matchScore}%</span>
        <span className="text-xs">匹配</span>
      </div>
    </div>
  )
}

function InfoLine({
  label,
  icon: Icon,
  value,
  clamp,
  accent,
}: {
  label?: string
  icon?: typeof MapPin
  value: string
  clamp?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex items-center gap-1 min-w-0">
      {Icon && <Icon className="w-3 h-3 text-muted-foreground shrink-0" />}
      {label && <span className="text-muted-foreground shrink-0">{label}：</span>}
      <span
        className={cn(
          "font-medium min-w-0",
          clamp && "line-clamp-1",
          accent && "text-accent",
        )}
      >
        {value}
      </span>
    </div>
  )
}
