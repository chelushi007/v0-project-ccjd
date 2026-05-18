"use client"

import { useState } from "react"
import {
  ArrowLeft,
  X,
  MapPin,
  Star,
  Building2,
  Maximize2,
  Ruler,
  TrendingUp,
  Layers,
  Flame,
  Shield,
  Phone,
  User,
  Heart,
  Share2,
  CheckCircle2,
  ChevronRight,
  Truck,
  Boxes,
  Wrench,
  Sparkles,
  FileSignature,
  PackageOpen,
  Warehouse,
  Eye,
  Clock,
  Tag,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface WarehouseDetailPageProps {
  onNavigate: (page: string) => void
  warehouseId?: number | string
  defaultBusinessType?: "storage" | "rent"
}

// 模拟从「详细发布」表单生成的详情数据（与 detail-publish-page.tsx 字段一一对应）
const detail = {
  name: "中铁建广州南沙综合仓储基地",
  tier: "一级" as "一级" | "二级",
  tags: ["铁建", "央企品质", "认证仓"],
  rating: 4.9,
  reviews: 128,
  views: 2384,
  publishTime: "3 天前",
  location: "广东省广州市南沙区龙穴大道东 88 号",
  region: { province: "广东省", city: "广州市", district: "南沙区" },
  operator: "中铁建物资华南仓储有限公司",
  contact: { name: "陈经理", phone: "138-0000-8888" },
  // 运营模式
  operationMode: "自主",
  // 基础信息
  base: {
    type: "综合仓储",
    floor: "1 层",
    minLeaseDays: 60,
    publicArea: 1200,
    buildingArea: 80000,
    availableArea: 25000,
    minRentArea: 500,
    price: 0.48,
    deposit: 30000,
    rentMethods: ["整租", "分租"],
    taxRate: 9,
  },
  // 详细信息
  spec: {
    stackHeight: 9,
    structure: "钢结构",
    fireLevel: "甲级",
    floorLoad: 3,
  },
  features: ["铁路专用线", "靠近高速", "随时看仓", "设施齐全", "24 小时安保"],
  // 配套信息
  facilities: {
    loading: ["龙门吊", "叉车", "行车", "地磅"],
    rack: ["重型货架", "悬臂货架", "托盘"],
    base: ["办公室", "水电", "暖气", "员工宿舍", "停车场"],
    safety: ["消火栓", "灭火器", "自动喷淋系统", "应急照明", "粉尘抑制设备"],
    security: ["封闭式围墙", "车辆进出车牌识别", "人员进出人脸识别", "监控全覆盖"],
    processing: ["改制", "加工"],
    processingDesc: "支持钢结构改制、钢板切割、防腐处理等加工服务",
  },
  certifications: ["ISO9001", "安全生产标准化", "AAAA 物流企业"],
  description:
    "本仓储基地位于南沙自贸区核心位置，紧邻南沙港与高速路口，铁路专用线直达仓内，配备大型装卸设备与重载平台地面，可承接各类大宗物资、钢材、设备及循环物资的存放与流转。园区采取封闭式管理，全区域 24 小时监控覆盖，配套办公区、员工宿舍及大面积停车场，能为客户提供从入库、保管到分拨配送的一站式服务。",
  // 物资存放（托管）业务字段
  storage: {
    fee: 18, // 元/吨/月
    feeUnit: "元/吨/月",
    minMonths: 1,
    insurance: "可代办货损货差保险",
    accepted: ["钢材", "建材", "机电设备", "周转材料", "工程辅料"],
    services: ["代收代发", "在库盘点", "电子台账", "出入库 SMS 通知"],
  },
  images: [
    "/placeholder.svg?height=420&width=720",
    "/placeholder.svg?height=120&width=160",
    "/placeholder.svg?height=120&width=160",
    "/placeholder.svg?height=120&width=160",
    "/placeholder.svg?height=120&width=160",
  ],
}

export function WarehouseDetailPage({
  onNavigate,
  defaultBusinessType = "rent",
}: WarehouseDetailPageProps) {
  const [bizType, setBizType] = useState<"storage" | "rent">(defaultBusinessType)
  const [activeImage, setActiveImage] = useState(0)

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    valueClass,
  }: {
    icon?: React.ComponentType<{ className?: string }>
    label: string
    value: React.ReactNode
    valueClass?: string
  }) => (
    <div className="flex items-center gap-2 py-2 text-sm">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn("font-medium text-foreground", valueClass)}>
        {value}
      </span>
    </div>
  )

  const ChipGroup = ({ items, tone = "default" }: { items: string[]; tone?: "default" | "primary" | "accent" }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge
          key={item}
          variant="outline"
          className={cn(
            "text-xs font-normal",
            tone === "primary" && "border-primary/40 text-primary bg-primary/5",
            tone === "accent" && "border-accent/40 text-accent bg-accent/5"
          )}
        >
          {item}
        </Badge>
      ))}
    </div>
  )

  const SectionCard = ({
    title,
    icon: Icon,
    children,
    extra,
  }: {
    title: string
    icon: React.ComponentType<{ className?: string }>
    children: React.ReactNode
    extra?: React.ReactNode
  }) => (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              {title}
            </h3>
          </div>
          {extra}
        </div>
        {children}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 shrink-0 bg-transparent"
            onClick={() => onNavigate("home")}
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <div className="flex items-center gap-2 text-sm min-w-0 overflow-hidden">
            <Button
              variant="link"
              className="p-0 h-auto text-muted-foreground hover:text-primary shrink-0"
              onClick={() => onNavigate("home")}
            >
              首页
            </Button>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <Button
              variant="link"
              className="p-0 h-auto text-muted-foreground hover:text-primary shrink-0"
              onClick={() => onNavigate("warehouse-list")}
            >
              仓储列表
            </Button>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate">仓储详情</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <Heart className="w-4 h-4" />
            收藏
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <Share2 className="w-4 h-4" />
            分享
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onNavigate("home")}
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hero 区：左大图+缩略图 / 右核心信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 图片区 */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-24 h-24 text-primary/20" />
            </div>
            <img
              src={detail.images[activeImage] || "/placeholder.svg"}
              alt={detail.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-3 left-3 bg-primary gap-1">
              <Shield className="w-3 h-3" />
              央企品质
            </Badge>
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{detail.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({detail.reviews})
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {detail.images.slice(1).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i + 1)}
                className={cn(
                  "aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all bg-muted",
                  activeImage === i + 1
                    ? "border-primary"
                    : "border-transparent hover:border-primary/50"
                )}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 标题/价格/业务类型卡 */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge
                className={
                  detail.tier === "一级"
                    ? "bg-amber-500 hover:bg-amber-500 text-white text-xs gap-1"
                    : "text-xs gap-1 text-slate-600 border-slate-300 bg-transparent"
                }
                variant={detail.tier === "一级" ? "default" : "outline"}
              >
                {detail.tier === "一级" && <Crown className="w-3 h-3" />}
                {detail.tier}站点
              </Badge>
              {detail.tags.map((t) => (
                <Badge key={t} variant="secondary" className="bg-primary/10 text-primary text-xs">
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-foreground text-balance leading-snug">
              {detail.name}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{detail.location}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {detail.views} 浏览
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                发布于 {detail.publishTime}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                运营模式：{detail.operationMode}
              </span>
            </div>
          </div>

          {/* 业务类型 Tab + 关键信息 */}
          <Card className="flex-1 border-primary/20 shadow-sm">
            <CardContent className="p-5">
              <Tabs value={bizType} onValueChange={(v) => setBizType(v as "storage" | "rent")}>
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="storage" className="gap-1.5">
                    <PackageOpen className="w-4 h-4" />
                    物资存放
                  </TabsTrigger>
                  <TabsTrigger value="rent" className="gap-1.5">
                    <Warehouse className="w-4 h-4" />
                    仓储承租
                  </TabsTrigger>
                </TabsList>

                {/* 物资存放 */}
                <TabsContent value="storage" className="space-y-3 mt-0">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-accent">
                      {detail.storage.fee}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">
                      {detail.storage.feeUnit}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm bg-muted/40 rounded-lg p-3">
                    <div className="text-muted-foreground">最短托管</div>
                    <div className="font-medium">{detail.storage.minMonths} 个月起</div>
                    <div className="text-muted-foreground">货物保险</div>
                    <div className="font-medium">{detail.storage.insurance}</div>
                    <div className="text-muted-foreground">税率</div>
                    <div className="font-medium">{detail.base.taxRate}%</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1.5">可接收物资</div>
                    <ChipGroup items={detail.storage.accepted} tone="accent" />
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1.5">增值服务</div>
                    <ChipGroup items={detail.storage.services} />
                  </div>
                </TabsContent>

                {/* 仓储承租 */}
                <TabsContent value="rent" className="space-y-3 mt-0">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {detail.base.price}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">
                      元/m²/天
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm bg-muted/40 rounded-lg p-3">
                    <div className="text-muted-foreground">押金</div>
                    <div className="font-medium">
                      {detail.base.deposit.toLocaleString()} 元
                    </div>
                    <div className="text-muted-foreground">起租期</div>
                    <div className="font-medium">{detail.base.minLeaseDays} 天起</div>
                    <div className="text-muted-foreground">起租面积</div>
                    <div className="font-medium">{detail.base.minRentArea} m²</div>
                    <div className="text-muted-foreground">税率</div>
                    <div className="font-medium">{detail.base.taxRate}%</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1.5">出租方式</div>
                    <ChipGroup items={detail.base.rentMethods} tone="primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm pt-1">
                    <div className="bg-primary/5 rounded-lg p-2.5 border border-primary/10">
                      <div className="text-xs text-muted-foreground">可租面积</div>
                      <div className="text-lg font-bold text-primary">
                        {detail.base.availableArea.toLocaleString()}
                        <span className="text-xs font-normal ml-0.5">m²</span>
                      </div>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5 border border-border">
                      <div className="text-xs text-muted-foreground">建筑面积</div>
                      <div className="text-lg font-bold text-foreground">
                        {detail.base.buildingArea.toLocaleString()}
                        <span className="text-xs font-normal ml-0.5">m²</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />

              {/* 联系人 + 主操作 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{detail.contact.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium tabular-nums">
                      {detail.contact.phone}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  运营方：{detail.operator}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button variant="outline" className="gap-1 bg-transparent">
                    <Phone className="w-4 h-4" />
                    在线咨询
                  </Button>
                  <Button className="gap-1">
                    <FileSignature className="w-4 h-4" />
                    {bizType === "storage" ? "申请托管" : "立即下单"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 主体内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* 基础信息 */}
          <SectionCard title="基础信息" icon={Building2}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
              <InfoRow icon={Building2} label="仓储类型" value={detail.base.type} />
              <InfoRow icon={Layers} label="楼层" value={detail.base.floor} />
              <InfoRow icon={Maximize2} label="建筑面积" value={`${detail.base.buildingArea.toLocaleString()} m²`} />
              <InfoRow icon={Maximize2} label="可租面积" value={`${detail.base.availableArea.toLocaleString()} m²`} valueClass="text-primary" />
              <InfoRow icon={Maximize2} label="公摊面积" value={`${detail.base.publicArea} m²`} />
              <InfoRow icon={Maximize2} label="起租面积" value={`${detail.base.minRentArea} m²`} />
              <InfoRow icon={Clock} label="起租期" value={`${detail.base.minLeaseDays} 天起`} />
              <InfoRow icon={TrendingUp} label="租金单价" value={`${detail.base.price} 元/m²/天`} valueClass="text-primary" />
              <InfoRow icon={Tag} label="税率" value={`${detail.base.taxRate}%`} />
            </div>
          </SectionCard>

          {/* 详细信息 */}
          <SectionCard title="详细信息" icon={Ruler}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
              <InfoRow icon={Ruler} label="堆高限高" value={`${detail.spec.stackHeight} 米`} />
              <InfoRow icon={Building2} label="仓储结构" value={detail.spec.structure} />
              <InfoRow icon={Flame} label="消防等级" value={detail.spec.fireLevel} />
              <InfoRow icon={Layers} label="楼板承重" value={`${detail.spec.floorLoad} 吨`} />
            </div>
            <Separator className="my-4" />
            <div>
              <div className="text-sm text-muted-foreground mb-2">仓储特色</div>
              <ChipGroup items={detail.features} tone="primary" />
            </div>
          </SectionCard>

          {/* 配套信息 */}
          <SectionCard title="配套信息" icon={Boxes}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  装卸设备
                </div>
                <ChipGroup items={detail.facilities.loading} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Boxes className="w-4 h-4" />
                  货架设备
                </div>
                <ChipGroup items={detail.facilities.rack} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  基础设施
                </div>
                <ChipGroup items={detail.facilities.base} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Flame className="w-4 h-4" />
                  安全环保
                </div>
                <ChipGroup items={detail.facilities.safety} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  安全配套
                </div>
                <ChipGroup items={detail.facilities.security} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Wrench className="w-4 h-4" />
                  改制 / 加工
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <ChipGroup items={detail.facilities.processing} tone="accent" />
                  <span className="text-sm text-muted-foreground">
                    {detail.facilities.processingDesc}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* 仓储描述 */}
          <SectionCard title="仓储描述" icon={Sparkles}>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {detail.description}
            </p>
            <Separator className="my-4" />
            <div>
              <div className="text-sm text-muted-foreground mb-2">认证 / 资质</div>
              <div className="flex flex-wrap gap-2">
                {detail.certifications.map((c) => (
                  <Badge
                    key={c}
                    className="bg-primary/10 text-primary border-primary/20 gap-1"
                    variant="outline"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* 所在位置 */}
          <SectionCard title="所在位置" icon={MapPin}>
            <div className="space-y-3">
              <div className="text-sm flex items-center gap-2">
                <Badge variant="outline">{detail.region.province}</Badge>
                <Badge variant="outline">{detail.region.city}</Badge>
                <Badge variant="outline">{detail.region.district}</Badge>
                <span className="text-muted-foreground">{detail.location}</span>
              </div>
              <div className="w-full h-64 bg-muted rounded-lg flex flex-col items-center justify-center gap-2 border border-dashed border-border">
                <MapPin className="w-8 h-8 text-destructive" />
                <span className="text-sm text-muted-foreground">
                  地图定位 · {detail.location}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* 右侧侧栏：联系信息 + 相似推荐 */}
        <div className="lg:col-span-4 space-y-6">
          {/* 联系信息 */}
          <Card className="lg:sticky lg:top-20">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  联系信息
                </h3>
              </div>
              <div className="bg-muted/40 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">运营方</span>
                  <span className="font-medium">{detail.operator}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">联系人</span>
                  <span className="font-medium">{detail.contact.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">电话</span>
                  <span className="font-medium tabular-nums">
                    {detail.contact.phone}
                  </span>
                </div>
              </div>
              <Button className="w-full gap-1">
                <FileSignature className="w-4 h-4" />
                {bizType === "storage" ? "申请物资托管" : "立即下单对接"}
              </Button>
              <Button variant="outline" className="w-full gap-1 bg-transparent">
                <Sparkles className="w-4 h-4" />
                智能匹配相似仓储
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-1">
                提示：订单成交后平台收取 0.5% 服务费
              </p>
            </CardContent>
          </Card>

          {/* 相似仓储 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-foreground">相似仓储</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: "中铁建深圳前海智慧仓储基地", area: "30,000 m²", price: "0.65", tier: "一级" as const },
                  { name: "中铁建东莞虎门港务仓储基地", area: "80,000 m²", price: "0.35", tier: "一级" as const },
                  { name: "中铁十六局佛山顺德钢构仓储基地", area: "20,000 m²", price: "0.42", tier: "二级" as const },
                ].map((w) => (
                  <button
                    key={w.name}
                    onClick={() => onNavigate("warehouse-detail")}
                    className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-primary/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={w.tier === "一级" ? "default" : "outline"}
                          className={
                            w.tier === "一级"
                              ? "bg-amber-500 hover:bg-amber-500 text-white text-[10px] gap-0.5 px-1 py-0 shrink-0"
                              : "text-[10px] gap-0.5 px-1 py-0 text-slate-600 border-slate-300 shrink-0"
                          }
                        >
                          {w.tier}
                        </Badge>
                        <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {w.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{w.area}</span>
                        <span className="text-primary font-medium">
                          {w.price} 元/m²/天
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
