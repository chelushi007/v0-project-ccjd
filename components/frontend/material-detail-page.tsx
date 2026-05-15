"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  MapPin,
  Eye,
  Clock,
  Package,
  Recycle,
  ShieldCheck,
  Truck,
  FileCheck,
  Phone,
  MessageCircle,
  Building2,
  Star,
  Tag,
  Boxes,
  Ruler,
  Wrench,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileSignature,
  ShoppingCart,
  CalendarDays,
} from "lucide-react"

interface MaterialDetailPageProps {
  onNavigate?: (page: string) => void
}

// 详情数据：可由列表卡片透传，这里使用与列表映射一致的示例数据
const materialData = {
  id: 1,
  name: "二手钢管扣件 约500吨",
  category: "拼装类",
  subCategory: "钢管脚手架配件",
  location: "广东省广州市黄埔区",
  address: "广州市黄埔区开发大道 1188 号 · 中铁建华南循环资源仓储基地",
  dealType: "出售" as "出租" | "出售",
  price: "3500",
  unit: "元/吨",
  marketPrice: "4200",
  condition: "八成新",
  conditionScore: 80,
  totalQty: "500 吨",
  availableQty: "420 吨",
  minOrder: "10 吨",
  brand: "新兴铸管 / 鞍钢",
  spec: "Φ48×3.0mm 标准管 + 直角扣件 / 旋转扣件",
  weight: "约 4.5 kg/根",
  produceYear: "2020",
  supplier: "中铁十四局集团广州分公司",
  supplierTags: ["国央企", "金牌供应", "已认证"],
  views: 428,
  publishTime: "1小时前",
  validUntil: "2025-12-31",
  features: ["品质保证", "可检测", "量大优惠", "支持自提", "可配送"],
  isHot: true,
  description:
    "本批次钢管扣件来自广州黄埔大型市政项目封顶后退场，已经过统一回收清洗、矫直与防锈处理；钢管壁厚均在 2.8mm 以上，扣件无明显裂纹与变形。提供第三方检测报告、出厂合格证与项目使用台账，支持批量采购与定向配送。",
  highlights: [
    { icon: ShieldCheck, label: "正品溯源", desc: "项目实物退场，附第三方检测报告" },
    { icon: Recycle, label: "周转盘活", desc: "经清洗矫直防锈，复用率高" },
    { icon: Truck, label: "全国配送", desc: "支持自提与省内 24h 直送" },
    { icon: FileCheck, label: "合规结算", desc: "支持线上合同与电子发票" },
  ],
  qualityItems: [
    { label: "壁厚检测", value: "≥ 2.8mm", pass: true },
    { label: "外径偏差", value: "± 0.3mm", pass: true },
    { label: "外观防锈", value: "二次防锈", pass: true },
    { label: "扣件完整度", value: "98%", pass: true },
    { label: "焊缝裂纹", value: "无", pass: true },
    { label: "弯曲度", value: "≤ 1.5‰", pass: true },
  ],
  attrs: [
    { label: "物资分类", value: "拼装类 / 钢管脚手架配件" },
    { label: "规格型号", value: "Φ48×3.0mm" },
    { label: "材质", value: "Q235B 钢" },
    { label: "出厂年份", value: "2020" },
    { label: "成色等级", value: "八成新（B 级）" },
    { label: "存储方式", value: "室内立放，防雨防潮" },
    { label: "可提货方式", value: "自提 / 配送" },
    { label: "发票类型", value: "增值税专用发票" },
  ],
  similar: [
    {
      id: 11,
      name: "工地周转木方 约200方",
      dealType: "出租" as const,
      price: "12 元/方/月",
      condition: "七成新",
      location: "广东省深圳市龙岗区",
    },
    {
      id: 12,
      name: "塔吊标准节 10节",
      dealType: "出租" as const,
      price: "1800 元/节/月",
      condition: "九成新",
      location: "广东省东莞市虎门镇",
    },
    {
      id: 13,
      name: "建筑模板 约1000张",
      dealType: "出售" as const,
      price: "45 元/张",
      condition: "六成新",
      location: "广东省佛山市顺德区",
    },
  ],
}

const isRent = materialData.dealType === "出租"
const accentClass = isRent ? "text-primary" : "text-accent"
const accentBg = isRent ? "bg-primary" : "bg-accent"
const accentBgSoft = isRent ? "bg-primary/10" : "bg-accent/10"
const accentBorder = isRent ? "border-primary/30" : "border-accent/30"

export function MaterialDetailPage({ onNavigate }: MaterialDetailPageProps) {
  const [activeImage, setActiveImage] = useState(0)
  const thumbs = [0, 1, 2, 3]

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
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
            <span className="text-muted-foreground truncate">闲置物资</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate">{materialData.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
            <Heart className="w-4 h-4" />
            收藏
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
            <Share2 className="w-4 h-4" />
            分享
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onNavigate?.("home")}
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hero：图片 + 概览 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 图片区 */}
        <div className="lg:col-span-2 space-y-3">
          <Card className="overflow-hidden">
            <div className={`relative h-80 bg-gradient-to-br ${isRent ? "from-primary/15 to-primary/5" : "from-accent/15 to-accent/5"}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className={`w-32 h-32 ${accentClass} opacity-30`} />
              </div>
              <Badge className={`absolute top-3 left-3 ${accentBg}`}>
                {materialData.dealType}
              </Badge>
              {materialData.isHot && (
                <Badge className="absolute top-3 right-3 bg-destructive">
                  热门
                </Badge>
              )}
              <Badge variant="outline" className="absolute bottom-3 right-3 bg-card/90">
                {materialData.condition}
              </Badge>
            </div>
          </Card>
          <div className="grid grid-cols-4 gap-2">
            {thumbs.map((i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative h-16 rounded-md overflow-hidden border-2 transition-all ${
                  activeImage === i ? (isRent ? "border-primary" : "border-accent") : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <div className={`absolute inset-0 ${isRent ? "bg-primary/10" : "bg-accent/10"} flex items-center justify-center`}>
                  <Package className={`w-6 h-6 ${accentClass} opacity-40`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 概览区 */}
        <div className="lg:col-span-3 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className={accentBorder}>
                <Tag className={`w-3 h-3 mr-1 ${accentClass}`} />
                {materialData.category}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {materialData.subCategory}
              </Badge>
              {materialData.features.slice(0, 2).map((f) => (
                <Badge key={f} variant="secondary" className="text-xs">
                  {f}
                </Badge>
              ))}
            </div>
            <h1 className="text-2xl font-semibold text-foreground text-balance leading-snug">
              {materialData.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {materialData.location}
              </span>
              <Separator orientation="vertical" className="h-3" />
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {materialData.views} 浏览
              </span>
              <Separator orientation="vertical" className="h-3" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {materialData.publishTime}
              </span>
            </div>
          </div>

          {/* 价格卡 */}
          <Card className={`${accentBgSoft} ${accentBorder}`}>
            <CardContent className="p-4 flex items-end justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  {isRent ? "出租单价" : "出售单价"}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${accentClass}`}>
                    ¥{materialData.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {materialData.unit}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  市场参考价 ¥{materialData.marketPrice} {materialData.unit}
                  <span className="text-emerald-600 font-medium">
                    · 节省 {Math.round((1 - Number(materialData.price) / Number(materialData.marketPrice)) * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="lg" className="gap-1 bg-card">
                  <MessageCircle className="w-4 h-4" />
                  在线咨询
                </Button>
                <Button size="lg" className={`gap-1 ${accentBg} hover:${accentBg}/90 text-white`}>
                  {isRent ? (
                    <>
                      <FileSignature className="w-4 h-4" />
                      立即下单
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      立即采购
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Boxes, label: "总量", value: materialData.totalQty },
              { icon: Package, label: "可供应", value: materialData.availableQty, hl: true },
              { icon: Ruler, label: "起订量", value: materialData.minOrder },
              { icon: CalendarDays, label: "有效期至", value: materialData.validUntil },
            ].map((kpi) => (
              <Card key={kpi.label} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <kpi.icon className="w-3.5 h-3.5" />
                    {kpi.label}
                  </div>
                  <div className={`text-base font-semibold ${kpi.hl ? accentClass : "text-foreground"}`}>
                    {kpi.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 主体：左侧详细信息 + 右侧供应商/相似 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 服务亮点 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Recycle className={`w-4 h-4 ${accentClass}`} />
                服务亮点
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {materialData.highlights.map((h) => (
                  <div key={h.label} className={`rounded-md ${accentBgSoft} p-3 border ${accentBorder}`}>
                    <h.icon className={`w-5 h-5 ${accentClass} mb-2`} />
                    <div className="font-medium text-sm mb-0.5">{h.label}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{h.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 物资描述 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">物资描述</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {materialData.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {materialData.features.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs">
                    {f}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 规格参数 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">规格参数</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                {materialData.attrs.map((attr) => (
                  <div key={attr.label} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-b-0">
                    <span className="text-muted-foreground shrink-0 w-20">{attr.label}</span>
                    <span className="text-foreground font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 质量检测 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  质量检测报告
                </h3>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">成色评分</span>
                  <span className="font-semibold text-emerald-600">{materialData.conditionScore}/100</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {materialData.qualityItems.map((q) => (
                  <div key={q.label} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <span className="text-xs text-muted-foreground">{q.label}</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      {q.pass ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {q.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 提货 / 物流 / 售后 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Truck className={`w-4 h-4 ${accentClass}`} />
                {isRent ? "租赁说明" : "交易说明"}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Wrench className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium mb-0.5">提货方式</div>
                    <div className="text-muted-foreground leading-relaxed">
                      支持自提（仓库现场）与配送（华南地区 24h 直送，省外 3-5 天到货）
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileCheck className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium mb-0.5">
                      {isRent ? "押金与租期" : "结算与发票"}
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                      {isRent
                        ? "押金为月租金的 100%，最短租期 1 个月，支持续租与按需归还"
                        : "支持对公转账、平台担保交易，提供增值税专用发票（13%）"}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium mb-0.5">质量保障</div>
                    <div className="text-muted-foreground leading-relaxed">
                      所有物资经平台二次质检并附检测报告，签收 7 日内非人为损坏可申请换货
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 仓库位置 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${accentClass}`} />
                仓库位置
              </h3>
              <div className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {materialData.address}
              </div>
              <div className="relative h-48 rounded-md bg-muted/30 border border-border overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm gap-2">
                  <MapPin className="w-5 h-5" />
                  地图加载中...
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右栏 */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {/* 供应商 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-lg ${accentBgSoft} ${accentClass} flex items-center justify-center shrink-0`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm leading-tight mb-1">
                    {materialData.supplier}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-muted-foreground ml-1">5.0 综合评分</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {materialData.supplierTags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div>
                  <div className="text-base font-semibold text-foreground">128</div>
                  <div className="text-[11px] text-muted-foreground">在售物资</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">96.5%</div>
                  <div className="text-[11px] text-muted-foreground">好评率</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">6 年</div>
                  <div className="text-[11px] text-muted-foreground">合作时长</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                  <Phone className="w-3.5 h-3.5" />
                  电话
                </Button>
                <Button size="sm" className="flex-1 gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  在线咨询
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 相似物资 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <Recycle className={`w-4 h-4 ${accentClass}`} />
                相似闲置物资
              </h3>
              <div className="space-y-3">
                {materialData.similar.map((s) => (
                  <button
                    key={s.id}
                    className="w-full flex gap-2.5 hover:bg-muted/40 rounded-md p-1.5 -m-1.5 transition-colors text-left"
                  >
                    <div className={`w-16 h-16 rounded ${s.dealType === "出租" ? "bg-primary/10" : "bg-accent/10"} flex items-center justify-center shrink-0`}>
                      <Package className={`w-7 h-7 ${s.dealType === "出租" ? "text-primary" : "text-accent"} opacity-50`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Badge className={`${s.dealType === "出租" ? "bg-primary" : "bg-accent"} text-[10px] px-1.5 py-0`}>
                          {s.dealType}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{s.condition}</span>
                      </div>
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {s.location}
                      </div>
                      <div className={`text-sm font-semibold ${s.dealType === "出租" ? "text-primary" : "text-accent"} mt-0.5`}>
                        {s.price}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 移动端 CTA：sticky 不生效时也保留按钮组 */}
          <div className="lg:hidden flex gap-2 sticky bottom-2 z-10 bg-background/95 backdrop-blur p-2 rounded-md border border-border shadow-sm">
            <Button variant="outline" className="flex-1 gap-1 bg-transparent">
              <MessageCircle className="w-4 h-4" />
              咨询
            </Button>
            <Button className={`flex-1 gap-1 ${accentBg} text-white`}>
              {isRent ? "立即下单" : "立即采购"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
