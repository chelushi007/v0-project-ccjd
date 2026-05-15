"use client"

import { useState } from "react"
import {
  Building2,
  Warehouse,
  MapPin,
  Truck,
  Users,
  Handshake,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Eye,
  Shield,
  FileText,
  Phone,
  Mail,
  Globe,
  ArrowUpRight,
  LogOut,
  Calendar,
  Briefcase,
  CreditCard,
  Award,
  Upload,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 六种企业角色对应的实际企业数据
const enterpriseRoles = [
  {
    id: "property-owner",
    role: "物权单位",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    accent: "bg-blue-500",
    needCertify: false,
    enterprise: {
      shortName: "十四局",
      name: "中铁十四局集团广州分公司",
      code: "CRCC14-GZ-001",
      type: "国有企业（中央驻穗）",
      status: "已激活",
      creditScore: 98,
      registeredCapital: "5,000 万元",
      establishDate: "2010-05-18",
      legalPerson: "张志强",
      contact: "李建国",
      phone: "020-8888 8888",
      email: "contact@crcc14-gz.com",
      address: "广东省广州市天河区珠江新城华夏路30号",
      businessScope:
        "市政与轨道交通施工、隧道与桥梁工程、项目物料采购与调配、工程供应链管理",
      certifications: ["AAA信用企业", "中央驻穗单位", "ISO9001质量体系"],
      stats: [
        { label: "物资存放数量", value: "1,286", unit: "批" },
        { label: "物资托管数量", value: "862", unit: "批" },
        { label: "物资关联仓储数量", value: "32", unit: "座" },
      ],
    },
  },
  {
    id: "warehouse-unit",
    role: "仓储单位",
    icon: Warehouse,
    color: "text-green-600",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    accent: "bg-green-500",
    needCertify: false,
    enterprise: {
      shortName: "建物华南",
      name: "中铁建物料华南仓储有限公司",
      code: "CRCCM-HN-2023-002",
      type: "国有控股企业",
      status: "已激活",
      creditScore: 95,
      registeredCapital: "2,000 万元",
      establishDate: "2015-08-23",
      legalPerson: "陈宏伟",
      contact: "王秀英",
      phone: "020-3838 6666",
      email: "warehouse@crccm-hn.com",
      address: "广东省广州市天河区科韵路38号铁建大厦",
      businessScope:
        "工程物料仓储与中转、工程机械周转管理、循环物料入出库与配送、库存数据化管理",
      certifications: ["仓储服务一级资质", "ISO9001质量体系", "AA级信用企业"],
      stats: [
        { label: "运营仓储面积", value: "12.5", unit: "万m²" },
        { label: "物资托管数量", value: "862", unit: "批" },
        { label: "物资存放数量", value: "1,286", unit: "批" },
      ],
    },
  },
  {
    id: "warehouse-site",
    role: "仓储站点",
    icon: MapPin,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    accent: "bg-orange-500",
    needCertify: true,
    enterprise: {
      shortName: "南沙基地",
      name: "中铁建广州南沙综合仓储基地",
      code: "CRCC-NS-SITE-2022-003",
      type: "仓储站点（中铁建物料华南直属）",
      status: "已认证",
      creditScore: 92,
      registeredCapital: "—",
      establishDate: "2018-11-12",
      legalPerson: "刘大鹏",
      contact: "赵丽华",
      phone: "020-3456 7890",
      email: "nansha.site@crccm-hn.com",
      address: "广东省广州市南沙区进港大道15号铁建仓储园",
      businessScope:
        "工程钢构与轨道物料仓储、危化品仓储、循环周转物料管理、铁路专用线装卸",
      certifications: ["危化品仓储许可证", "消防安全合格证", "海关监管资质"],
      stats: [
        { label: "可用仓储面积", value: "3.2", unit: "万m²" },
        { label: "在库物料批次", value: "1,286", unit: "批" },
        { label: "出租率", value: "86", unit: "%" },
      ],
    },
  },
  {
    id: "transport-unit",
    role: "专运单位",
    icon: Truck,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    accent: "bg-purple-500",
    needCertify: true,
    enterprise: {
      shortName: "建物专运",
      name: "中铁建物料华南专业运营有限公司",
      code: "CRCCM-MO-2021-004",
      type: "国有控股企业",
      status: "已认证",
      creditScore: 94,
      registeredCapital: "1,500 万元",
      establishDate: "2020-03-15",
      legalPerson: "周明辉",
      contact: "孙倩",
      phone: "0755-8866 1234",
      email: "operation@crccm-hn.com",
      address: "广东省深圳市南山区前海铁建大厦18层",
      businessScope:
        "对中铁建体系内物权单位存储在仓储站点的工程物料进行专业化运营（以出租为主），与物权单位采用「运营收益分成」或「物料整租」两种结算模式开展合作",
      certifications: ["物料运营服务资质", "AA级信用企业", "ISO9001质量体系", "供应链管理认证"],
      stats: [
        { label: "在运营物料", value: "326", unit: "类" },
        { label: "合作物权单位", value: "18", unit: "家" },
        { label: "交易金额", value: "1.28", unit: "亿元" },
      ],
    },
  },
  {
    id: "material-user",
    role: "物料使用方",
    icon: Users,
    color: "text-cyan-600",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    accent: "bg-cyan-500",
    needCertify: true,
    enterprise: {
      shortName: "十一局",
      name: "中铁十一局集团广深城际项目部",
      code: "CRCC11-GZSZ-2020-005",
      type: "国有企业项目部",
      status: "已认证",
      creditScore: 96,
      registeredCapital: "3,800 万元",
      establishDate: "2012-09-08",
      legalPerson: "黄志伟",
      contact: "林雅琴",
      phone: "020-8666 2222",
      email: "purchase@crcc11-gzsz.com",
      address: "广东省广州市越秀区中山五路123号铁建广场",
      businessScope: "广深城际高铁施工、城市轨道交通建设、市政基础工程、工程物料计划与领用",
      certifications: ["特级建造资质", "市政公用工程一级", "安全生产许可证"],
      stats: [
        { label: "在用物料数量", value: "1,862", unit: "批" },
        { label: "在用物资价值", value: "8.62", unit: "亿元" },
        { label: "在用物资种类", value: "236", unit: "类" },
      ],
    },
  },
  {
    id: "service-provider",
    role: "服务商",
    icon: Handshake,
    color: "text-rose-600",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    accent: "bg-rose-500",
    needCertify: true,
    enterprise: {
      shortName: "建物华南",
      name: "中国铁建物料集团华南有限公司",
      code: "CRCCM-HN-SP-2014-006",
      type: "中央企业（中国铁建股份有限公司全资子公司）",
      status: "已认证",
      creditScore: 97,
      registeredCapital: "3,000 万元",
      establishDate: "2014-06-08",
      legalPerson: "王宏志",
      contact: "刘海燕",
      phone: "020-3699 5888",
      email: "service@crccm-hn.com",
      address: "广东省广州市越秀区东风中路300号铁建广场",
      businessScope:
        "受理中铁建体系内各局/分公司的仓储出租委托，匹配平台仓储站点资源，撮合并促成委托出租合作，提供合同签署、履约监督、对账结算等全流程服务支持",
      certifications: ["服务运营资质", "AAA信用企业", "ISO9001质量体系", "中央企业服务示范单位"],
      stats: [
        { label: "受理委托单", value: "486", unit: "单" },
        { label: "服务局/分公司", value: "62", unit: "家" },
        { label: "委托交易金额", value: "3.86", unit: "亿元" },
      ],
    },
  },
]

type RoleAction =
  | { type: "apply-site" }
  | { type: "apply-transport" }
  | { type: "exit-transport" }
  | null

export function EnterpriseCenter() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [action, setAction] = useState<RoleAction>(null)
  const active = enterpriseRoles[activeIndex]
  const Icon = active.icon

  // 是否展示资质文件区域：仓储单位作为基础角色不展示
  const showCertFiles = active.id !== "warehouse-unit"

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? enterpriseRoles.length - 1 : prev - 1))
  }
  const handleNext = () => {
    setActiveIndex((prev) => (prev === enterpriseRoles.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-6">
      {/* 企业信息卡片 */}
      <Card className="overflow-hidden">
        <div className={`h-1 ${active.accent}`} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                企业信息
              </CardTitle>
              <Badge variant="outline" className={`${active.color} ${active.border}`}>
                <Icon className="w-3 h-3 mr-1" />
                {active.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="h-8 w-8"
                aria-label="切换上一个企业角色"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {activeIndex + 1} / {enterpriseRoles.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                aria-label="切换下一个企业角色"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 企业 Logo 与基本信息 */}
            <div className="flex items-start gap-4 lg:w-1/3">
              <Avatar className={`w-16 h-16 rounded-lg ${active.bg}`}>
                <AvatarFallback
                  className={`rounded-lg ${active.bg} ${active.color} text-base font-bold`}
                >
                  {active.enterprise.shortName}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-balance">{active.enterprise.name}</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  企业编码：{active.enterprise.code}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                  <span>{active.enterprise.type}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    信用评分 {active.enterprise.creditScore}
                  </span>
                </div>
                <div className="mt-3">
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {active.enterprise.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 联系与地址 */}
            <div className="flex-1 lg:border-l border-border lg:pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem icon={Phone} label="联系电话" value={active.enterprise.phone} />
                <InfoItem icon={Mail} label="联系邮箱" value={active.enterprise.email} />
                <InfoItem icon={Users} label="法定代表人" value={active.enterprise.legalPerson} />
                <InfoItem icon={Briefcase} label="对接联系人" value={active.enterprise.contact} />
                <InfoItem icon={CreditCard} label="注册资本" value={active.enterprise.registeredCapital} />
                <InfoItem icon={Calendar} label="成立日期" value={active.enterprise.establishDate} />
              </div>
              <div className="mt-3 flex items-start gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">注册地址</p>
                  <p className="text-foreground">{active.enterprise.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 核心数据 */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
            {active.enterprise.stats.map((stat) => (
              <div key={stat.label} className={`p-3 rounded-lg ${active.bg}`}>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className={`text-xl font-bold ${active.color}`}>{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 企业详情卡片 */}
      <Card className="overflow-hidden">
        <div className={`h-1 ${active.accent}`} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                企业详情
              </CardTitle>
              <Badge variant="outline" className={`${active.color} ${active.border}`}>
                <Icon className="w-3 h-3 mr-1" />
                {active.enterprise.shortName}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="h-8 w-8"
                aria-label="切换上一个企业角色"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {activeIndex + 1} / {enterpriseRoles.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                aria-label="切换下一个企业角色"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 认证状态横幅：仅需认证角色显示 */}
          {active.needCertify && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${active.bg} border ${active.border}`}
            >
              <CheckCircle2 className={`w-5 h-5 ${active.color} shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className="font-medium text-sm">已通过企业资质认证</p>
                <p className="text-xs text-muted-foreground mt-1">
                  「{active.role}」需经平台审核认证，请确保企业资质有效并及时更新。
                </p>
              </div>
              <Button variant="outline" size="sm">
                查看认证记录
              </Button>
            </div>
          )}

          {/* 业务范围与资质 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">业务范围</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {active.enterprise.businessScope}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">已获资质</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {active.enterprise.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="font-normal">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 资质文件 */}
          {showCertFiles && (
            <div>
              <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                资质文件
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {["营业执照", "组织机构代码证", "税务登记证", "法人授权书"].map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate">{doc}</p>
                        <p className="text-[11px] text-muted-foreground">2024-01-15</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 角色操作入口（去除文字说明，仅保留按钮） */}
          {active.id === "warehouse-unit" && (
            <RoleActionBar
              actions={[
                {
                  label: "申请为站点单位",
                  icon: ArrowUpRight,
                  onClick: () => setAction({ type: "apply-site" }),
                },
              ]}
            />
          )}
          {active.id === "warehouse-site" && (
            <RoleActionBar
              actions={[
                {
                  label: "申请为专运单位",
                  icon: ArrowUpRight,
                  onClick: () => setAction({ type: "apply-transport" }),
                },
              ]}
            />
          )}
          {active.id === "transport-unit" && (
            <RoleActionBar
              actions={[
                {
                  label: "退出专运单位申请",
                  icon: LogOut,
                  variant: "destructive",
                  onClick: () => setAction({ type: "exit-transport" }),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>

      {/* 申请为站点单位 */}
      <ApplySiteDialog
        open={action?.type === "apply-site"}
        onOpenChange={(o) => !o && setAction(null)}
      />
      {/* 申请为专运单位 */}
      <ApplyTransportDialog
        open={action?.type === "apply-transport"}
        onOpenChange={(o) => !o && setAction(null)}
      />
      {/* 退出专运单位申请 */}
      <ExitTransportDialog
        open={action?.type === "exit-transport"}
        onOpenChange={(o) => !o && setAction(null)}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// 角色操作按钮条（取代文字说明）
// ─────────────────────────────────────────────
function RoleActionBar({
  actions,
}: {
  actions: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    variant?: "default" | "destructive"
  }[]
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-dashed border-border">
      {actions.map((a) => {
        const I = a.icon
        return (
          <Button
            key={a.label}
            size="sm"
            variant={a.variant === "destructive" ? "outline" : "default"}
            onClick={a.onClick}
            className={
              a.variant === "destructive"
                ? "text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                : ""
            }
          >
            <I className="w-4 h-4 mr-1.5" />
            {a.label}
          </Button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
// 申请为「站点单位」表单
// ─────────────────────────────────────────────
function ApplySiteDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            申请为站点单位
          </DialogTitle>
          <DialogDescription>
            将旗下仓库登记为「站点单位」后，可在平台独立承接物资托管、出租与运营业务。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <FieldRow>
            <Field label="站点名称" required>
              <Input placeholder="例：中铁建广州南沙综合仓储基地" />
            </Field>
            <Field label="站点类型" required>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">综合仓储基地</SelectItem>
                  <SelectItem value="steel">钢构物料仓</SelectItem>
                  <SelectItem value="chem">危化品仓</SelectItem>
                  <SelectItem value="cold">冷链/恒温仓</SelectItem>
                  <SelectItem value="open">露天堆场</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="所属省/市" required>
              <Input placeholder="例：广东省广州市南沙区" />
            </Field>
            <Field label="详细地址" required>
              <Input placeholder="例：进港大道15号铁建仓储园" />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="占地面积（m²）" required>
              <Input type="number" placeholder="例：32000" />
            </Field>
            <Field label="可租面积（m²）" required>
              <Input type="number" placeholder="例：28000" />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="站点负责人" required>
              <Input placeholder="例：刘大鹏" />
            </Field>
            <Field label="负责人电话" required>
              <Input placeholder="例：13800001234" />
            </Field>
          </FieldRow>

          <Field label="站点资质说明">
            <Textarea
              rows={3}
              placeholder="可填写已取得的仓储许可证、危化品仓储资质、消防安全合格证等资质情况……"
            />
          </Field>

          <Field label="资质文件上传">
            <UploadBox hint="支持 PDF / JPG / PNG，单文件 ≤ 10MB，最多 6 份" />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => onOpenChange(false)}>提交申请</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────
// 申请为「专运单位」表单
// ─────────────────────────────────────────────
function ApplyTransportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-500" />
            申请为专运单位
          </DialogTitle>
          <DialogDescription>
            升级为「专运单位」后，可承接平台物权单位的物料专业运营托管业务。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <FieldRow>
            <Field label="申请主体" required>
              <Input defaultValue="中铁建广州南沙综合仓储基地" />
            </Field>
            <Field label="统一社会信用代码" required>
              <Input placeholder="例：9144000000000000XW" />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="拟运营物料类别" required>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rail">轨道与钢轨</SelectItem>
                  <SelectItem value="steel">钢构与型材</SelectItem>
                  <SelectItem value="machine">工程机械周转</SelectItem>
                  <SelectItem value="formwork">模板与脚手架</SelectItem>
                  <SelectItem value="all">综合类（多品类）</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="结算模式" required>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="share">运营收益分成</SelectItem>
                  <SelectItem value="rent">物料整租</SelectItem>
                  <SelectItem value="both">两种模式并行</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="拟服务区域" required>
              <Input placeholder="例：粤港澳大湾区" />
            </Field>
            <Field label="预计年运营规模（万元）" required>
              <Input type="number" placeholder="例：12800" />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label="业务负责人" required>
              <Input placeholder="例：周明辉" />
            </Field>
            <Field label="负责人电话" required>
              <Input placeholder="例：13900001234" />
            </Field>
          </FieldRow>

          <Field label="运营能力说明">
            <Textarea
              rows={3}
              placeholder="可填写团队规模、专业设备、信息化能力、过往运营业绩等……"
            />
          </Field>

          <Field label="承诺函与资质文件">
            <UploadBox hint="须上传《专业运营承诺函》、运营资质证书等，PDF / JPG / PNG" />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => onOpenChange(false)}>提交申请</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────
// 退出「专运单位」申请表单
// ─────────────────────────────────────────────
function ExitTransportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <LogOut className="w-5 h-5" />
            退出专运单位申请
          </DialogTitle>
          <DialogDescription>
            提交后平台将冻结新业务受理，待存量合同结清并完成清算后正式注销专运资格。
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            退出前请确认：① 所有在租 / 在运合同已结清；② 物权单位已书面确认；③ 平台保证金可正常退还。
            退出审核周期约 15 个工作日。
          </div>
        </div>

        <div className="grid gap-4 mt-2">
          <FieldRow>
            <Field label="退出主体" required>
              <Input defaultValue="中铁建物料华南专业运营有限公司" disabled />
            </Field>
            <Field label="退出生效日期" required>
              <Input type="date" />
            </Field>
          </FieldRow>

          <Field label="退出原因" required>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="请选择退出原因" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strategy">战略调整 / 业务收缩</SelectItem>
                <SelectItem value="restructure">企业重组 / 主体变更</SelectItem>
                <SelectItem value="capacity">运营能力不足</SelectItem>
                <SelectItem value="contract">合作方协商终止</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="存量业务处理方案" required>
            <Textarea
              rows={3}
              placeholder="请说明在租物料、在运订单、未结合同等存量业务的处理与移交方案……"
            />
          </Field>

          <Field label="退出说明">
            <Textarea
              rows={2}
              placeholder="可补充退出后的合作意向、续约设想或其他备注……"
            />
          </Field>

          <Field label="退出申请附件">
            <UploadBox hint="须上传董事会决议 / 股东会决议 / 内部审批文件等" />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            提交退出申请
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────
// 通用表单元素
// ─────────────────────────────────────────────
function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}

function UploadBox({ hint }: { hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-5 rounded-lg border border-dashed border-border bg-muted/30 hover:border-primary/40 transition-colors cursor-pointer">
      <Upload className="w-5 h-5 text-muted-foreground" />
      <p className="text-xs text-foreground">点击或拖拽文件至此上传</p>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </div>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}
