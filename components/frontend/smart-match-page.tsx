"use client"

import { useEffect, useState } from "react"
import {
  Sparkles,
  ChevronRight,
  Building2,
  MapPin,
  Maximize2,
  CheckCircle,
  Star,
  ArrowRight,
  ArrowLeft,
  Package,
  Weight,
  ShoppingCart,
  Search,
  Warehouse,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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

type DemandType = "material" | "purchase" | "rent"

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

// 需求类型配置
const typeConfig: Record<
  DemandType,
  { label: string; sub: string; icon: typeof Search; emoji: string }
> = {
    material: { label: "物资寻租", sub: "寻找出租中的循环物资", icon: Search, emoji: "🔍" },
  purchase: { label: "物资采购", sub: "采购闲置/出售中的物资", icon: ShoppingCart, emoji: "🛒" },
  rent: { label: "仓储承租", sub: "寻找合适的仓储空间", icon: Warehouse, emoji: "🏭" },
}

  const typeOrder: DemandType[] = ["rent", "material", "purchase"]

export function SmartMatchPage({
  onNavigate,
  initialType = "rent",
}: SmartMatchPageProps) {
  const [demandType, setDemandType] = useState<DemandType>(initialType)
  const [textDescription, setTextDescription] = useState("")
  const [hasResults, setHasResults] = useState(false)
  const [isMatching, setIsMatching] = useState(false)

  // 入口联动：当外部 initialType 变化时同步切换需求类型并重置匹配结果
  useEffect(() => {
    setDemandType(initialType)
    setHasResults(false)
    setTextDescription("")
  }, [initialType])

  const handleMatch = () => {
    setIsMatching(true)
    setTimeout(() => {
      setIsMatching(false)
      setHasResults(true)
    }, 1200)
  }

  const placeholder =
    demandType === "material"
      ? "例如：项目需要在广州黄埔承租 200 吨 H 型钢，租期 3 个月，需带质保书..."
      : demandType === "purchase"
        ? "例如：希望采购 500 张闲置清水模板，1830×915 规格，预算单价不高于 70 元..."
        : "例如：我需要在广州番禺区找一个 3000 平方米左右的仓库，最好有铁路专用线..."

  return (
    <div className="space-y-6">
      {/* 顶部操作栏：返回 + 面包屑 + 关闭 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 shrink-0 bg-transparent"
            onClick={() => onNavigate?.("home")}
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <div className="flex items-center gap-2 text-sm min-w-0">
            <Button
              variant="link"
              className="p-0 h-auto text-muted-foreground hover:text-primary"
              onClick={() => onNavigate?.("home")}
            >
              首页
            </Button>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate">智能匹配</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <Badge variant="secondary" className="shrink-0">
              {typeConfig[demandType].label}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => onNavigate?.("home")}
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧需求输入 */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">智能匹配</h2>
                <Badge variant="secondary">AI 匹配</Badge>
              </div>

              {/* 需求类型选择 */}
              <div className="space-y-3 mb-6">
                <Label>需求类型</Label>
                <div className="grid grid-cols-3 gap-2">
                  {typeOrder.map((t) => {
                    const cfg = typeConfig[t]
                    const active = demandType === t
                    return (
                      <Button
                        key={t}
                        variant={active ? "default" : "outline"}
                        className={cn(
                          "h-auto py-3 flex-col gap-1 px-1",
                          active && "shadow-sm",
                        )}
                        onClick={() => {
                          setDemandType(t)
                          setHasResults(false)
                        }}
                      >
                        <span className="text-lg leading-none">{cfg.emoji}</span>
                        <span className="text-xs font-medium">{cfg.label}</span>
                      </Button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {typeConfig[demandType].sub}
                </p>
              </div>

              {/* 快捷输入表单 */}
              {demandType === "material" && (
                <div className="space-y-4 mb-6">
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
                  <div className="space-y-2">
                    <Label>承租数量</Label>
                    <Input placeholder="如：100吨 或 500件" />
                  </div>
                </div>
              )}

              {demandType === "purchase" && (
                <div className="space-y-4 mb-6">
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
                        <SelectItem value="profile">型材类</SelectItem>
                        <SelectItem value="cable">电线电缆</SelectItem>
                        <SelectItem value="other">其他材料</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>采购数量</Label>
                      <Input placeholder="如：500 张" />
                    </div>
                    <div className="space-y-2">
                      <Label>预算单价</Label>
                      <Input placeholder="如：≤70 元/张" />
                    </div>
                  </div>
                  <div className="space-y-2">
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
              )}

              {demandType === "rent" && (
                <div className="space-y-4 mb-6">
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
                    <Input placeholder="如：3000m²" />
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <Label>需求描述（支持自然语言）</Label>
                <Textarea
                  placeholder={placeholder}
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  使用自然语言描述需求，AI 将自动提取关键字段并匹配最合适的资源。
                </p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleMatch}
                disabled={isMatching}
              >
                {isMatching ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    智能匹配中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    智能匹配
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧匹配结果 */}
        <div className="lg:col-span-2">
          {!hasResults ? (
            <Card className="h-full">
              <CardContent className="h-full flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  输入您的需求，AI 将为您智能匹配
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md leading-relaxed">
                  {demandType === "material" &&
                    "支持自然语言描述，系统将根据区域、物资类型、数量、成色等维度进行智能分析，为您推荐最合适的循环物资租赁资源。"}
                  {demandType === "purchase" &&
                    "支持自然语言描述，系统将结合区域、物资类型、采购数量、预算单价、成色要求等维度，为您推荐最合适的闲置 / 出售物资。"}
                  {demandType === "rent" &&
                    "支持自然语言描述，系统将根据区域、类型、面积、配套设施等维度进行智能分析，为您推荐最合适的仓储资源。"}
                </p>
              </CardContent>
            </Card>
          ) : demandType === "material" ? (
            <MaterialResultList
              results={materialResults}
              onReset={() => setHasResults(false)}
            />
          ) : demandType === "purchase" ? (
            <PurchaseResultList
              results={purchaseResults}
              onReset={() => setHasResults(false)}
            />
          ) : (
            <WarehouseResultList
              results={warehouseResults}
              onReset={() => setHasResults(false)}
            />
          )}
        </div>
      </div>
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
