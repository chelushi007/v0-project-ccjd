"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ChevronRight,
  X,
  Truck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Star,
  ShieldCheck,
  Award,
  Package,
  Warehouse,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  PackageCheck,
  Boxes,
  Wrench,
  Headphones,
  ClipboardList,
  MessageSquare,
  Share2,
  Heart,
  ArrowRight,
} from "lucide-react"

interface TransportDetailPageProps {
  onNavigate?: (page: string) => void
}

// 专运单位详情数据（与 enterprise-center 的物权/专运角色信息映射）
const unit = {
  name: "中铁建物资华南专业运营有限公司",
  shortName: "华南专运",
  location: "广东省深圳市南山区前海铁建大厦18层",
  region: "广东省深圳市",
  rating: 4.9,
  reviewCount: 286,
  establishedYear: 2018,
  employees: "120+",
  serviceYears: 7,
  isRecommended: true,
  // 顶部 KPI（与企业中心专运角色 stats 对齐）
  kpis: [
    { label: "在运营物资", value: "326", unit: "类", icon: Boxes },
    { label: "托管仓储站点", value: "18", unit: "个", icon: Warehouse },
    { label: "累计完成订单", value: "1,256", unit: "单", icon: PackageCheck },
    { label: "交易金额", value: "2.5", unit: "亿", icon: TrendingUp },
  ],
  // 资质认证
  certifications: [
    { name: "央企资质", desc: "中国铁建直属央企" },
    { name: "AAAA 级物流", desc: "国家 AAAA 级物流企业" },
    { name: "ISO9001", desc: "质量管理体系认证" },
    { name: "AA 级信用", desc: "AA 级信用企业" },
    { name: "供应链管理", desc: "供应链管理服务资质" },
    { name: "安全生产", desc: "安全生产标准化二级" },
  ],
  // 服务范围
  services: [
    {
      icon: Package,
      title: "物资托管",
      desc: "提供闲置物资的统一接收、入库、保管与台账管理服务，按面积或货值计费。",
      features: ["专人对接", "电子台账", "出入库追溯", "保险保障"],
    },
    {
      icon: TrendingUp,
      title: "专业运营",
      desc: "以出租、出售等方式盘活托管物资，运营收益按协议比例与物权方分成。",
      features: ["收益分成", "市场化定价", "运营报表", "结算透明"],
    },
    {
      icon: Boxes,
      title: "调剂服务",
      desc: "在中铁建体系内跨单位调剂闲置物资，匹配缺口需求降低采购成本。",
      features: ["体系内调拨", "需求撮合", "运输协助"],
    },
    {
      icon: Wrench,
      title: "增值加工",
      desc: "提供检测、维修、改制、刷漆等增值服务，提升二手物资再利用价值。",
      features: ["检测报告", "维修翻新", "改制加工"],
    },
  ],
  // 运营品类
  categories: [
    { name: "拼装类", count: 86 },
    { name: "房屋建筑类", count: 64 },
    { name: "模板类", count: 52 },
    { name: "钢材类", count: 48 },
    { name: "机电设备", count: 36 },
    { name: "其他材料", count: 40 },
  ],
  // 下辖仓储站点
  warehouses: [
    {
      name: "深圳前海中心仓",
      area: "12,000 ㎡",
      address: "广东省深圳市南山区前海合作区",
      tags: ["央企自营", "AAAA"],
    },
    {
      name: "广州黄埔综合站",
      area: "8,500 ㎡",
      address: "广东省广州市黄埔区文冲街道",
      tags: ["综合站", "海港联动"],
    },
    {
      name: "佛山顺德分仓",
      area: "5,200 ㎡",
      address: "广东省佛山市顺德区北滘镇",
      tags: ["分仓", "二级"],
    },
  ],
  // 分成模式
  profitSharing: [
    { label: "出租分成", value: "物权 70% / 专运 30%" },
    { label: "出售分成", value: "物权 80% / 专运 20%" },
    { label: "托管基础费", value: "0.5 元 / ㎡ / 天" },
    { label: "结算周期", value: "月结，T+5 内打款" },
  ],
  // 经营范围（来自 enterprise-center 专运角色 businessScope）
  businessScope:
    "专运单位即循环资源物资专业运营单位的简称。物权单位将物资托管至专运单位的仓储站点后，双方达成协议，可委托专运单位对托管物资进行运营（出租、出售），所得运营收益按双方事先协商的比例进行分成。",
  // 合作流程
  workflow: [
    { step: "01", title: "意向洽谈", desc: "在线发起托管咨询，业务经理 24h 内对接需求。" },
    { step: "02", title: "物资盘点", desc: "现场清点物资明细、状态、价值，形成入库清单。" },
    { step: "03", title: "签订协议", desc: "签订托管运营协议，明确分成比例与运营权限。" },
    { step: "04", title: "上架运营", desc: "完成入库后上架平台，启动出租 / 出售运营。" },
    { step: "05", title: "结算分成", desc: "按月对账，按协议比例打款，全程可追溯。" },
  ],
  // 合作客户
  clients: [
    "中铁十四局",
    "中铁十六局",
    "中铁二十局",
    "中铁建华南投资",
    "中铁建大桥局",
  ],
  // 联系信息
  contact: {
    manager: "王经理",
    phone: "0755-8888-8888",
    mobile: "138-0000-0000",
    email: "operation@crccm-hn.com",
    website: "www.crccm-hn.com",
    workHours: "周一至周五 09:00-18:00",
  },
  // 推荐其他专运单位
  similar: [
    {
      name: "中铁建物资深圳前海运营中心",
      region: "广东省深圳市",
      rating: 4.8,
      orders: 856,
    },
    {
      name: "中铁十四局东莞物资专运公司",
      region: "广东省东莞市",
      rating: 4.7,
      orders: 623,
    },
    {
      name: "中铁十六局佛山物资管理中心",
      region: "广东省佛山市",
      rating: 4.6,
      orders: 412,
    },
  ],
}

export function TransportDetailPage({ onNavigate }: TransportDetailPageProps) {
  const [favorited, setFavorited] = useState(false)
  const back = () => onNavigate?.("home")

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 shrink-0 bg-transparent"
            onClick={back}
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <div className="flex items-center gap-2 text-sm min-w-0">
            <Button
              variant="link"
              className="p-0 h-auto text-muted-foreground hover:text-primary"
              onClick={back}
            >
              首页
            </Button>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">精选专运单位</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate">{unit.shortName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={() => setFavorited((v) => !v)}
          >
            <Heart
              className={`w-4 h-4 ${favorited ? "fill-destructive text-destructive" : ""}`}
            />
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
            onClick={back}
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hero：企业头牌 */}
      <Card className="overflow-hidden border-accent/20">
        <div className="relative h-48 bg-gradient-to-br from-accent/15 via-accent/5 to-primary/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <Truck className="w-24 h-24 text-accent/20" />
          </div>
          {unit.isRecommended && (
            <Badge className="absolute top-4 left-4 bg-accent gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              平台推荐
            </Badge>
          )}
          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{unit.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({unit.reviewCount})
            </span>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <Avatar className="w-20 h-20 -mt-14 ring-4 ring-card shadow-md shrink-0">
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-bold">
                {unit.shortName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {unit.name}
                </h1>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  专运单位
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {unit.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  成立于 {unit.establishedYear} 年
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {unit.employees} 员工
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {unit.businessScope}
              </p>
            </div>

            {/* 主操作 */}
            <div className="flex lg:flex-col gap-2 shrink-0">
              <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90">
                <Package className="w-5 h-5" />
                物资托管
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <MessageSquare className="w-5 h-5" />
                托管咨询
              </Button>
            </div>
          </div>

          {/* KPI 行 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            {unit.kpis.map((kpi) => {
              const Icon = kpi.icon
              return (
                <div key={kpi.label} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-foreground">
                        {kpi.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {kpi.unit}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {kpi.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 服务范围 */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader icon={Headphones} title="服务范围" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unit.services.map((svc) => {
                  const Icon = svc.icon
                  return (
                    <div
                      key={svc.title}
                      className="p-4 rounded-lg border border-border hover:border-accent/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {svc.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {svc.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {svc.features.map((f) => (
                          <Badge
                            key={f}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 运营品类 */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader icon={Boxes} title="主要运营品类" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {unit.categories.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {c.name}
                    </span>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      {c.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 下辖仓储站点 */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                icon={Warehouse}
                title="下辖仓储站点"
                extra={
                  <span className="text-xs text-muted-foreground">
                    共 {unit.warehouses.length} 个
                  </span>
                }
              />
              <div className="space-y-3">
                {unit.warehouses.map((w) => (
                  <div
                    key={w.name}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => onNavigate?.("warehouse-detail")}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Warehouse className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground truncate">
                          {w.name}
                        </span>
                        {w.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {w.address}
                        </span>
                        <span>{w.area}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 分成与结算 */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader icon={ClipboardList} title="分成与结算" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unit.profitSharing.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                  >
                    <span className="text-sm text-muted-foreground">
                      {p.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {p.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                * 实际分成比例与结算条款以双方签订的《物资托管运营协议》为准，平台提供合同模板与全流程电子签约。
              </p>
            </CardContent>
          </Card>

          {/* 合作流程 */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader icon={FileText} title="托管合作流程" />
              <div className="space-y-3">
                {unit.workflow.map((w, idx) => (
                  <div key={w.step} className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                        {w.step}
                      </div>
                      {idx < unit.workflow.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <h4 className="font-medium text-foreground mb-1">
                        {w.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {w.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 资质与合作客户 */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader icon={Award} title="资质与合作客户" />
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  企业资质
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {unit.certifications.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-border"
                    >
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {c.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {c.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  长期合作客户
                </h4>
                <div className="flex flex-wrap gap-2">
                  {unit.clients.map((c) => (
                    <Badge key={c} variant="secondary">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：联系信息 + 推荐 */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="lg:sticky lg:top-20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">联系信息</h3>
              <div className="space-y-3 text-sm">
                <ContactRow icon={Users} label="对接经理" value={unit.contact.manager} />
                <ContactRow icon={Phone} label="座机" value={unit.contact.phone} />
                <ContactRow icon={Phone} label="手机" value={unit.contact.mobile} />
                <ContactRow icon={Mail} label="邮箱" value={unit.contact.email} />
                <ContactRow icon={Globe} label="官网" value={unit.contact.website} />
                <ContactRow
                  icon={Calendar}
                  label="工作时间"
                  value={unit.contact.workHours}
                />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Button className="w-full gap-2 bg-accent hover:bg-accent/90">
                  <Package className="w-4 h-4" />
                  物资托管
                </Button>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <MessageSquare className="w-4 h-4" />
                  托管咨询
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 推荐其他专运单位 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">其他专运单位</h3>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs text-primary"
                  onClick={back}
                >
                  更多
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {unit.similar.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground line-clamp-1 mb-0.5">
                        {s.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {s.rating}
                        </span>
                        <span>·</span>
                        <span>{s.orders} 单</span>
                        <span>·</span>
                        <span className="truncate">{s.region}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 底部固定 CTA（移动端友好） */}
      <Card className="lg:hidden sticky bottom-2 z-10 shadow-lg">
        <CardContent className="p-3 flex gap-2">
          <Button variant="outline" className="flex-1 gap-2 bg-transparent">
            <MessageSquare className="w-4 h-4" />
            托管咨询
          </Button>
          <Button className="flex-1 gap-2 bg-accent hover:bg-accent/90">
            <Package className="w-4 h-4" />
            物资托管
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  extra,
}: {
  icon: typeof Truck
  title: string
  extra?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-accent" />
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      {extra}
    </div>
  )
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Truck
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground break-all">
          {value}
        </div>
      </div>
    </div>
  )
}
