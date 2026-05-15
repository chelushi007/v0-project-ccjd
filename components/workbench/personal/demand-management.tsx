"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Warehouse,
  Package,
  CheckCircle2,
  Clock,
  Handshake,
  AlertCircle,
  PenLine,
  Send,
  CheckCircle,
  Tags,
  HandCoins,
  Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DetailPublishPage } from "@/components/frontend/detail-publish-page"
import { EntrustAcceptancePage } from "./entrust-acceptance-page"
import { MaterialPickerDialog, type MaterialItem } from "./material-picker-dialog"
import { MaterialRentPublishPage } from "./material-rent-publish-page"
import { MaterialSalePublishPage } from "./material-sale-publish-page"

// ============ 类型 ============

type SelfStatus = "草稿" | "待审核" | "已发布" | "被驳回"
type EntrustStatus = "待受理" | "已受理" | "签署中" | "已签署"

// ============ 数据：仓储自主出租 ============

interface SelfRentRow {
  id: string
  title: string
  location: string
  area: string
  type: string
  price: string
  rentTerm: string
  submitDate: string
  publishDate: string
  status: SelfStatus
  views: number
  inquiries: number
  rejectReason?: string
}

const selfRentRows: SelfRentRow[] = [
  {
    id: "ZZ20260512001",
    title: "中铁建广州南沙综合仓储基地 15000m²",
    location: "广东省广州市南沙区",
    area: "15000m²",
    type: "综合仓储",
    price: "0.56元/m²/天",
    rentTerm: "12 个月",
    submitDate: "2026-05-09",
    publishDate: "2026-05-10",
    status: "已发布",
    views: 128,
    inquiries: 6,
  },
  {
    id: "ZZ20260511002",
    title: "中铁建深圳前海智慧仓储基地 8000m²",
    location: "广东省深圳市南山区",
    area: "8000m²",
    type: "智慧仓储",
    price: "0.52元/m²/天",
    rentTerm: "24 个月",
    submitDate: "2026-05-09",
    publishDate: "—",
    status: "待审核",
    views: 0,
    inquiries: 0,
  },
  {
    id: "ZZ20260510003",
    title: "中铁建东莞虎门港务仓储基地 25000m²",
    location: "广东省东莞市虎门镇",
    area: "25000m²",
    type: "港口仓储",
    price: "0.38元/m²/天",
    rentTerm: "36 个月",
    submitDate: "—",
    publishDate: "—",
    status: "草稿",
    views: 0,
    inquiries: 0,
  },
  {
    id: "ZZ20260509004",
    title: "中铁十二局佛山三水二期物流仓 5000m²",
    location: "广东省佛山市三水区",
    area: "5000m²",
    type: "普通仓储",
    price: "0.28元/m²/天",
    rentTerm: "12 个月",
    submitDate: "2026-05-07",
    publishDate: "—",
    status: "被驳回",
    views: 0,
    inquiries: 0,
    rejectReason:
      "1) 租金报价低于本区域市场指导价 (≥0.35 元/m²/天)；2) 仓储证照附件未上传；请补充后重新发起。",
  },
]

// ============ 数据：仓储委托出租 ============

interface EntrustRow {
  id: string
  title: string
  location: string
  area: string
  type: string
  entruster: string // 委托方
  trustee: string // 服务商（受托方）= 华南公司
  submitDate: string
  acceptDate: string
  status: EntrustStatus
  // 受理页面所需的额外字段（可选）
  expectedRent?: string
  expectedTerm?: string
  expectedStart?: string
  contactName?: string
  contactPhone?: string
  description?: string
}

const entrustRows: EntrustRow[] = [
  {
    id: "WT20260513005",
    title: "中铁建工湛江东海岛多式联运仓储 8500m²",
    location: "广东省湛江市东海岛经开区",
    area: "8500m²",
    type: "多式联运仓储",
    entruster: "中铁建工集团第二建设有限公司",
    trustee: "华南公司",
    submitDate: "2026-05-13",
    acceptDate: "—",
    status: "待受理",
    expectedRent: "10 - 13 元/m²/月",
    expectedTerm: "36 个月",
    expectedStart: "2026-07-01",
    contactName: "周建华",
    contactPhone: "138-7621-9930",
    description:
      "本仓储基地紧邻东海岛港区与铁路货运站，具备多式联运对接能力，已建成防爆通风、24h 安保、智能门禁与 6 米卸货平台。委托方期望服务商优先撮合具有港航物流、装备制造或储能新能源行业背景的承租方，并协助办理租赁备案、押金监管及消防变更登记等事项。",
  },
  {
    id: "WT20260512001",
    title: "中铁十六局佛山顺德钢构仓储基地 6000m²",
    location: "广东省佛山市顺德区",
    area: "6000m²",
    type: "钢构仓储",
    entruster: "中铁十六局集团第三工程有限公司",
    trustee: "华南公司",
    submitDate: "2026-05-11",
    acceptDate: "—",
    status: "待受理",
    expectedRent: "12 - 15 元/m²/月",
    expectedTerm: "24 个月（含半年免租期）",
    expectedStart: "2026-06-15",
    contactName: "李文涛",
    contactPhone: "138-2814-5520",
    description:
      "该仓储基地位于产业集中区，紧邻物流主干道，已具备进出场地、自动消防、24h 安保等基础条件。委托方希望服务商优先撮合具备类似业态运营经验的承租企业，并协助办理租赁备案与押金监管事宜。",
  },
  {
    id: "WT20260511002",
    title: "中铁二十二局惠州大亚湾危化品仓库 4000m²",
    location: "广东省惠州市大亚湾区",
    area: "4000m²",
    type: "危化品仓储",
    entruster: "中铁二十二局集团第一工程有限公司",
    trustee: "华南公司",
    submitDate: "2026-05-10",
    acceptDate: "2026-05-11",
    status: "已受理",
  },
  {
    id: "WT20260509003",
    title: "中铁二十四局中山火炬冷链仓库 3500m²",
    location: "广东省中山市火炬开发区",
    area: "3500m²",
    type: "冷链仓储",
    entruster: "中铁二十四局集团第四工程有限公司",
    trustee: "华南公司",
    submitDate: "2026-05-08",
    acceptDate: "2026-05-09",
    status: "签署中",
  },
  {
    id: "WT20260506004",
    title: "中铁十八局集团委托 · 江门台山港口仓 7200m²",
    location: "广东省江门市台山市",
    area: "7200m²",
    type: "港口仓储",
    entruster: "中铁十八局集团第二工程有限公司",
    trustee: "华南公司",
    submitDate: "2026-05-03",
    acceptDate: "2026-05-04",
    status: "已签署",
  },
]

// ============ 数据：物料出租 ============

interface MaterialRentRow {
  id: string
  title: string
  materialType: string
  quantity: string
  location: string
  price: string
  rentTerm: string
  submitDate: string
  publishDate: string
  status: SelfStatus
  views: number
  inquiries: number
  rejectReason?: string
}

const materialRentRows: MaterialRentRow[] = [
  {
    id: "WZ20260512001",
    title: "Q235B 热轧 H 型钢出租 500 吨",
    materialType: "型材类",
    quantity: "500吨",
    location: "广东省广州市黄埔区",
    price: "1800元/吨/月",
    rentTerm: "6 个月",
    submitDate: "2026-05-10",
    publishDate: "2026-05-11",
    status: "已发布",
    views: 84,
    inquiries: 4,
  },
  {
    id: "WZ20260511002",
    title: "建筑钢管脚手架出租 2000 套",
    materialType: "脚手架类",
    quantity: "2000套",
    location: "广东省深圳市宝安区",
    price: "15元/套/天",
    rentTerm: "3 个月",
    submitDate: "2026-05-10",
    publishDate: "—",
    status: "待审核",
    views: 0,
    inquiries: 0,
  },
  {
    id: "WZ20260510003",
    title: "塔吊设备出租 5 台",
    materialType: "其他材料",
    quantity: "5台",
    location: "广东省佛山市顺德区",
    price: "28000元/台/月",
    rentTerm: "12 个月",
    submitDate: "—",
    publishDate: "—",
    status: "草稿",
    views: 0,
    inquiries: 0,
  },
  {
    id: "WZ20260509004",
    title: "工地围挡板出租 800 套",
    materialType: "支护类",
    quantity: "800套",
    location: "广东省东莞市长安镇",
    price: "8元/套/天",
    rentTerm: "6 个月",
    submitDate: "2026-05-07",
    publishDate: "—",
    status: "被驳回",
    views: 0,
    inquiries: 0,
    rejectReason:
      "1) 物料规格型号填写不完整；2) 缺少物料照片附件；3) 单价超过平台基准 20%，请重新核算后提交。",
  },
]

// ============ 数据：物资出售 ============

interface MaterialSaleRow {
  id: string
  title: string
  materialType: string
  quantity: string
  propertyOwner: string // 物权单位
  region: string
  unitPrice: string // 销售单价
  totalAmount: string // 销售总额
  shareRatio: string // 专运 : 物权
  saleMode: "整批" | "分批"
  submitDate: string
  publishDate: string
  status: SelfStatus
  views: number
  inquiries: number
  rejectReason?: string
}

const materialSaleRows: MaterialSaleRow[] = [
  {
    id: "WS20260513001",
    title: "HRB400 螺纹钢 1200 吨整批销售 · 南沙综合仓",
    materialType: "型材类",
    quantity: "1200 吨",
    propertyOwner: "中铁十四局集团广州分公司",
    region: "广东省广州市南沙区",
    unitPrice: "4,200元/吨",
    totalAmount: "5,040,000",
    shareRatio: "25 : 75",
    saleMode: "整批",
    submitDate: "2026-05-11",
    publishDate: "2026-05-12",
    status: "已发布",
    views: 142,
    inquiries: 8,
  },
  {
    id: "WS20260512002",
    title: "WJ-7 型扣件系统 12000 套分批销售",
    materialType: "拼装类",
    quantity: "12000 套",
    propertyOwner: "中铁电气化局集团广州分公司",
    region: "广东省深圳市宝安区",
    unitPrice: "12元/套",
    totalAmount: "144,000",
    shareRatio: "20 : 80",
    saleMode: "分批",
    submitDate: "2026-05-11",
    publishDate: "—",
    status: "待审核",
    views: 0,
    inquiries: 0,
  },
  {
    id: "WS20260510003",
    title: "Φ32 螺纹钢余料 480 吨 整批清仓",
    materialType: "型材类",
    quantity: "480 吨",
    propertyOwner: "中铁建工集团第二建设有限公司",
    region: "广东省广州市黄埔区",
    unitPrice: "3,950元/吨",
    totalAmount: "1,896,000",
    shareRatio: "30 : 70",
    saleMode: "整批",
    submitDate: "—",
    publishDate: "—",
    status: "草稿",
    views: 0,
    inquiries: 0,
  },
  {
    id: "WS20260509004",
    title: "建筑钢管 1500 套 分批销售",
    materialType: "脚手架类",
    quantity: "1500 套",
    propertyOwner: "中铁二十二局集团第一工程有限公司",
    region: "广东省佛山市顺德区",
    unitPrice: "180元/套",
    totalAmount: "270,000",
    shareRatio: "25 : 75",
    saleMode: "分批",
    submitDate: "2026-05-07",
    publishDate: "—",
    status: "被驳回",
    views: 0,
    inquiries: 0,
    rejectReason:
      "1) 缺少与物权单位签署的销售代理协议附件；2) 分成比例未在协议中明确，请上传协议正本后重新提交。",
  },
  {
    id: "WS20260507005",
    title: "工字钢 320 吨 整批销售",
    materialType: "型材类",
    quantity: "320 吨",
    propertyOwner: "中铁十四局集团广州分公司",
    region: "广东省东莞市虎门镇",
    unitPrice: "4,600元/吨",
    totalAmount: "1,472,000",
    shareRatio: "25 : 75",
    saleMode: "整批",
    submitDate: "2026-05-04",
    publishDate: "2026-05-05",
    status: "已发布",
    views: 96,
    inquiries: 5,
  },
]

// ============ 工具：状态徽标 ============

const statusBadge = (status: SelfStatus | EntrustStatus) => {
  const map: Record<string, string> = {
    草稿: "bg-muted text-muted-foreground hover:bg-muted",
    待审核: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    已发布: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    被驳回: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    待受理: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    已受理: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
    签署中: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    已签署: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  }
  return <Badge className={map[status] ?? ""}>{status}</Badge>
}

// ============ 工具：操作按钮配置 ============

type Tone = "default" | "primary" | "destructive" | "warning"

interface RowAction {
  label: string
  tone?: Tone
  onClick?: () => void
}

const toneCls: Record<Tone, string> = {
  default: "text-muted-foreground hover:text-foreground",
  primary: "text-primary hover:text-primary",
  destructive: "text-destructive hover:text-destructive hover:bg-destructive/10",
  warning: "text-rose-700 hover:text-rose-800 hover:bg-rose-50",
}

function RowActions({ actions }: { actions: RowAction[] }) {
  if (!actions.length) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  return (
    <div className="flex items-center justify-center gap-0.5 flex-wrap">
      {actions.map((a, i) => (
        <Button
          key={i}
          variant="ghost"
          size="sm"
          onClick={a.onClick}
          className={`h-7 px-2 text-xs ${toneCls[a.tone ?? "default"]}`}
        >
          {a.label}
        </Button>
      ))}
    </div>
  )
}

// 自主出租 & 物料出租：基于状态的操作矩阵
function selfStatusActions(status: SelfStatus, onViewReject?: () => void): RowAction[] {
  switch (status) {
    case "草稿":
      return [
        { label: "编辑", tone: "primary" },
        { label: "提交审核", tone: "primary" },
        { label: "删除", tone: "destructive" },
      ]
    case "待审核":
      return [
        { label: "查看" },
        { label: "撤回审核", tone: "destructive" },
      ]
    case "已发布":
      return [
        { label: "查看" },
        { label: "编辑", tone: "primary" },
        { label: "下架", tone: "destructive" },
      ]
    case "被驳回":
      return [
        { label: "驳回原因", tone: "warning", onClick: onViewReject },
        { label: "编辑重提", tone: "primary" },
        { label: "删除", tone: "destructive" },
      ]
  }
}

// 委托出租：基于状态的操作矩阵（服务商视角）
function entrustStatusActions(
  status: EntrustStatus,
  onAccept?: () => void,
): RowAction[] {
  switch (status) {
    case "待受理":
      return [
        { label: "查看" },
        { label: "受理", tone: "primary", onClick: onAccept },
        { label: "拒绝", tone: "destructive" },
      ]
    case "已受理":
      return [
        { label: "查看" },
        { label: "联系委托方", tone: "primary" },
        { label: "推进签署" },
      ]
    case "签署中":
      return [
        { label: "查看" },
        { label: "上传合同", tone: "primary" },
        { label: "合同详情" },
      ]
    case "已签署":
      return [
        { label: "查看" },
        { label: "查看合同", tone: "primary" },
        { label: "转订单" },
      ]
  }
}

// ============ 统计卡 ============

interface StatItem {
  label: string
  value: number | string
  icon: React.ElementType
  tone: "primary" | "accent" | "emerald" | "amber" | "blue" | "purple" | "rose" | "cyan"
}

const toneClass: Record<StatItem["tone"], string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  rose: "bg-rose-100 text-rose-700",
  cyan: "bg-cyan-100 text-cyan-700",
}

function StatsRow({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <Card key={it.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${toneClass[it.tone]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    {it.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {it.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function Toolbar({
  placeholder,
  statusOptions,
}: {
  placeholder: string
  statusOptions: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder={placeholder} className="pl-9 w-72" />
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          {statusOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// ============ 主组件 ============

type DemandSubTab = "self-rent" | "entrust-rent" | "material-rent" | "material-sale"
type DemandMode =
  | "list"
  | "publish-warehouse"
  | "publish-material"
  | "publish-sale"
  | "accept-entrust"

interface DemandManagementProps {
  subTab?: DemandSubTab
}

export function DemandManagement({ subTab = "self-rent" }: DemandManagementProps) {
  const [mode, setMode] = useState<DemandMode>("list")
  const [materialPickerOpen, setMaterialPickerOpen] = useState(false)
  const [pickedMaterials, setPickedMaterials] = useState<MaterialItem[]>([])
  const [acceptTarget, setAcceptTarget] = useState<EntrustRow | null>(null)
  const [rejectInfo, setRejectInfo] = useState<{
    open: boolean
    id?: string
    reason?: string
  }>({ open: false })

  if (mode === "publish-warehouse") {
    return (
      <DetailPublishPage defaultTab="detail" onNavigate={() => setMode("list")} />
    )
  }

  if (mode === "publish-material") {
    return (
      <MaterialRentPublishPage
        onBack={() => {
          setMode("list")
          setPickedMaterials([])
        }}
        initialMaterials={pickedMaterials}
      />
    )
  }

  if (mode === "publish-sale") {
    return (
      <MaterialSalePublishPage
        onBack={() => {
          setMode("list")
          setPickedMaterials([])
        }}
        initialMaterials={pickedMaterials}
      />
    )
  }

  if (mode === "accept-entrust" && acceptTarget) {
    return (
      <EntrustAcceptancePage
        data={acceptTarget}
        onBack={() => {
          setMode("list")
          setAcceptTarget(null)
        }}
      />
    )
  }

  const openReject = (id: string, reason?: string) =>
    setRejectInfo({ open: true, id, reason })

  const openAccept = (row: EntrustRow) => {
    setAcceptTarget(row)
    setMode("accept-entrust")
  }

  const renderPage = () => {
    if (subTab === "self-rent") return renderSelfRent(setMode, openReject)
    if (subTab === "entrust-rent") return renderEntrustRent(setMode, openAccept)
    if (subTab === "material-sale")
      return renderMaterialSale(setMode, openReject)
    return renderMaterialRent(setMaterialPickerOpen, openReject)
  }

  return (
    <div className="space-y-5 min-w-0">
      {renderPage()}

      {/* 物料分类选择弹窗 */}
      <MaterialPickerDialog
        open={materialPickerOpen}
        onOpenChange={setMaterialPickerOpen}
        onConfirm={(items) => {
          setPickedMaterials(items)
          setMode("publish-material")
        }}
        initialSelected={pickedMaterials}
      />

      {/* 驳回原因弹窗（草稿/待审核/已发布/被驳回 流程中的"被驳回"状态使用） */}
      <RejectReasonDialog
        open={rejectInfo.open}
        id={rejectInfo.id}
        reason={rejectInfo.reason}
        onOpenChange={(o) => setRejectInfo({ ...rejectInfo, open: o })}
      />
    </div>
  )
}

// ============ 子组件：驳回原因弹窗 ============

function RejectReasonDialog({
  open,
  id,
  reason,
  onOpenChange,
}: {
  open: boolean
  id?: string
  reason?: string
  onOpenChange: (o: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-rose-100">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <span>需求单被驳回</span>
            {id && (
              <Badge variant="destructive" className="ml-1 text-[10px] h-5">
                {id}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="rounded-md border border-rose-200 bg-rose-50/60 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              驳回原因
            </div>
            <p className="text-sm text-rose-900 leading-relaxed whitespace-pre-line">
              {reason ?? "未填写驳回原因"}
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button onClick={() => onOpenChange(false)}>编辑后重新提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ 子页：仓储自主出租 ============

function renderSelfRent(
  setMode: (m: DemandMode) => void,
  openReject: (id: string, reason?: string) => void,
) {
  const rows = selfRentRows
  const draft = rows.filter((d) => d.status === "草稿").length
  const reviewing = rows.filter((d) => d.status === "待审核").length
  const published = rows.filter((d) => d.status === "已发布").length
  const rejected = rows.filter((d) => d.status === "被驳回").length

  return (
    <>
      <PageHeader
        icon={Warehouse}
        iconTone="primary"
        title="仓储自主出租"
        desc="管理由本企业直接发布、面向市场出租的仓储资源需求单"
        actionLabel="新建仓储自主出租"
        onAction={() => setMode("publish-warehouse")}
      />

      <StatsRow
        items={[
          { label: "草稿", value: draft, icon: PenLine, tone: "primary" },
          { label: "待审核", value: reviewing, icon: Clock, tone: "amber" },
          { label: "已发布", value: published, icon: CheckCircle2, tone: "emerald" },
          { label: "被驳回", value: rejected, icon: AlertCircle, tone: "rose" },
        ]}
      />

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">
              需求单列表
              <span className="text-xs text-muted-foreground ml-2">
                共 {rows.length} 条
              </span>
            </h3>
            <Toolbar
              placeholder="搜索需求单号或标题"
              statusOptions={[
                { value: "draft", label: "草稿" },
                { value: "reviewing", label: "待审核" },
                { value: "published", label: "已发布" },
                { value: "rejected", label: "被驳回" },
              ]}
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px] text-center">序号</TableHead>
                  <TableHead className="w-[130px]">需求单号</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead className="w-[160px]">所在区域</TableHead>
                  <TableHead className="w-[88px]">面积</TableHead>
                  <TableHead className="w-[100px]">仓储类型</TableHead>
                  <TableHead className="w-[120px]">租金单价</TableHead>
                  <TableHead className="w-[80px]">租期</TableHead>
                  <TableHead className="w-[110px]">发布时间</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
                  <TableHead className="w-[230px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d, idx) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="max-w-xs truncate" title={d.title}>
                      {d.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {d.location}
                    </TableCell>
                    <TableCell>{d.area}</TableCell>
                    <TableCell>{d.type}</TableCell>
                    <TableCell className="text-primary font-medium">
                      {d.price}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {d.rentTerm}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {d.publishDate}
                    </TableCell>
                    <TableCell>{statusBadge(d.status)}</TableCell>
                    <TableCell>
                      <RowActions
                        actions={selfStatusActions(d.status, () =>
                          openReject(d.id, d.rejectReason),
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// ============ 子页：仓储委托出租 ============

function renderEntrustRent(
  setMode: (m: DemandMode) => void,
  openAccept: (row: EntrustRow) => void,
) {
  const rows = entrustRows
  const pending = rows.filter((d) => d.status === "待受理").length
  const accepted = rows.filter((d) => d.status === "已受理").length
  const signing = rows.filter((d) => d.status === "签署中").length
  const signed = rows.filter((d) => d.status === "已签署").length

  return (
    <>
      <PageHeader
        icon={Handshake}
        iconTone="accent"
        title="仓储委托出租"
        desc="由委托方授权服务商（华南公司）代理发布与撮合的仓储租赁需求单"
        actionLabel="新建仓储委托出租"
        onAction={() => setMode("publish-warehouse")}
      />

      <StatsRow
        items={[
          { label: "待受理", value: pending, icon: Clock, tone: "blue" },
          { label: "已受理", value: accepted, icon: CheckCircle, tone: "cyan" },
          { label: "签署中", value: signing, icon: Send, tone: "purple" },
          { label: "已签署", value: signed, icon: CheckCircle2, tone: "emerald" },
        ]}
      />

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">
              委托需求单列表
              <span className="text-xs text-muted-foreground ml-2">
                共 {rows.length} 条
              </span>
            </h3>
            <Toolbar
              placeholder="搜索需求单号、标题或委托方"
              statusOptions={[
                { value: "pending", label: "待受理" },
                { value: "accepted", label: "已受理" },
                { value: "signing", label: "签署中" },
                { value: "signed", label: "已签署" },
              ]}
            />
          </div>

          {/* 本板块内水平滚动 */}
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1300px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px] text-center">序号</TableHead>
                  <TableHead className="w-[140px]">需求单号</TableHead>
                  <TableHead className="min-w-[240px]">标题</TableHead>
                  <TableHead className="w-[170px]">所在区域</TableHead>
                  <TableHead className="w-[90px]">面积</TableHead>
                  <TableHead className="w-[110px]">仓储类型</TableHead>
                  <TableHead className="min-w-[220px]">委托方</TableHead>
                  <TableHead className="w-[120px]">受托方</TableHead>
                  <TableHead className="w-[110px]">提交时间</TableHead>
                  <TableHead className="w-[110px]">受理时间</TableHead>
                  <TableHead className="w-[88px]">状态</TableHead>
                  <TableHead className="w-[260px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d, idx) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="truncate" title={d.title}>
                      {d.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {d.location}
                    </TableCell>
                    <TableCell>{d.area}</TableCell>
                    <TableCell>{d.type}</TableCell>
                    <TableCell className="text-sm" title={d.entruster}>
                      {d.entruster}
                    </TableCell>
                    <TableCell className="text-sm">{d.trustee}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {d.submitDate}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {d.acceptDate}
                    </TableCell>
                    <TableCell>{statusBadge(d.status)}</TableCell>
                    <TableCell>
                      <RowActions
                        actions={entrustStatusActions(d.status, () => openAccept(d))}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// ============ 子页：物料出租 ============

function renderMaterialRent(
  openPicker: (o: boolean) => void,
  openReject: (id: string, reason?: string) => void,
) {
  const rows = materialRentRows
  const draft = rows.filter((d) => d.status === "草稿").length
  const reviewing = rows.filter((d) => d.status === "待审核").length
  const published = rows.filter((d) => d.status === "已发布").length
  const rejected = rows.filter((d) => d.status === "被驳回").length

  return (
    <>
      <PageHeader
        icon={Package}
        iconTone="emerald"
        title="物料出租"
        desc="基于循环物料库的出租需求单，支持按物料分类批量发布"
        actionLabel="新建物料出租"
        onAction={() => openPicker(true)}
      />

      <StatsRow
        items={[
          { label: "草稿", value: draft, icon: PenLine, tone: "primary" },
          { label: "待审核", value: reviewing, icon: Clock, tone: "amber" },
          { label: "已发布", value: published, icon: CheckCircle2, tone: "emerald" },
          { label: "被驳回", value: rejected, icon: AlertCircle, tone: "rose" },
        ]}
      />

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">
              需求单列表
              <span className="text-xs text-muted-foreground ml-2">
                共 {rows.length} 条
              </span>
            </h3>
            <Toolbar
              placeholder="搜索需求单号或标题"
              statusOptions={[
                { value: "draft", label: "草稿" },
                { value: "reviewing", label: "待审核" },
                { value: "published", label: "已发布" },
                { value: "rejected", label: "被驳回" },
              ]}
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px] text-center">序号</TableHead>
                  <TableHead className="w-[130px]">需求单号</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead className="w-[100px]">物料类型</TableHead>
                  <TableHead className="w-[90px]">数量</TableHead>
                  <TableHead className="w-[150px]">所在区域</TableHead>
                  <TableHead className="w-[140px]">租金单价</TableHead>
                  <TableHead className="w-[80px]">租期</TableHead>
                  <TableHead className="w-[110px]">发布时间</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
                  <TableHead className="w-[230px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d, idx) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="max-w-xs truncate" title={d.title}>
                      {d.title}
                    </TableCell>
                    <TableCell>{d.materialType}</TableCell>
                    <TableCell>{d.quantity}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {d.location}
                    </TableCell>
                    <TableCell className="text-primary font-medium">
                      {d.price}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {d.rentTerm}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {d.publishDate}
                    </TableCell>
                    <TableCell>{statusBadge(d.status)}</TableCell>
                    <TableCell>
                      <RowActions
                        actions={selfStatusActions(d.status, () =>
                          openReject(d.id, d.rejectReason),
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// ============ 子页：物资出售 ============

function renderMaterialSale(
  setMode: (m: DemandMode) => void,
  openReject: (id: string, reason?: string) => void,
) {
  const rows = materialSaleRows
  const draft = rows.filter((d) => d.status === "草稿").length
  const reviewing = rows.filter((d) => d.status === "待审核").length
  const published = rows.filter((d) => d.status === "已发布").length
  const rejected = rows.filter((d) => d.status === "被驳回").length

  // 已发布的销售总金额（用作运营指标）
  const totalGmv = rows
    .filter((r) => r.status === "已发布")
    .reduce((s, r) => s + Number(r.totalAmount.replace(/,/g, "")), 0)

  return (
    <>
      <PageHeader
        icon={Tags}
        iconTone="amber"
        title="物资出售"
        desc="由物资专运单位代物权单位销售托管物资，所得按约定比例分成"
        actionLabel="新增物资销售"
        onAction={() => setMode("publish-sale")}
      />

      <StatsRow
        items={[
          { label: "草稿", value: draft, icon: PenLine, tone: "primary" },
          { label: "待审核", value: reviewing, icon: Clock, tone: "amber" },
          {
            label: "已发布",
            value: published,
            icon: CheckCircle2,
            tone: "emerald",
          },
          { label: "被驳回", value: rejected, icon: AlertCircle, tone: "rose" },
        ]}
      />

      {/* 业务说明卡 + 已发布销售额 */}
      <Card className="bg-gradient-to-r from-amber-50/60 via-card to-emerald-50/60 border-amber-200/60">
        <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <HandCoins className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">
                销售代理业务规则
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                物资专运单位与物权单位签署销售代理协议后，可发布托管物资销售需求；成交后按分成比例自动结算，详见
                <span className="text-primary font-medium">
                  {" "}
                  费用管理 · 销售分成
                </span>
                。
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground">
                已发布销售总额
              </div>
              <div className="text-xl font-bold text-emerald-700 tabular-nums">
                ¥ {totalGmv.toLocaleString("zh-CN")}
              </div>
            </div>
            <Coins className="w-8 h-8 text-emerald-600/70" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">
              销售需求单列表
              <span className="text-xs text-muted-foreground ml-2">
                共 {rows.length} 条
              </span>
            </h3>
            <Toolbar
              placeholder="搜索需求单号、物料或物权单位"
              statusOptions={[
                { value: "draft", label: "草稿" },
                { value: "reviewing", label: "待审核" },
                { value: "published", label: "已发布" },
                { value: "rejected", label: "被驳回" },
              ]}
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1500px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px] text-center">序号</TableHead>
                  <TableHead className="w-[130px]">需求单号</TableHead>
                  <TableHead className="min-w-[220px]">标题</TableHead>
                  <TableHead className="w-[100px]">物料类型</TableHead>
                  <TableHead className="w-[110px]">数量</TableHead>
                  <TableHead className="min-w-[200px]">物权单位</TableHead>
                  <TableHead className="w-[120px]">销售单价</TableHead>
                  <TableHead className="w-[130px] text-right">
                    销售总额(元)
                  </TableHead>
                  <TableHead className="w-[140px]">分成 (专运:物权)</TableHead>
                  <TableHead className="w-[80px]">模式</TableHead>
                  <TableHead className="w-[100px]">发布时间</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
                  <TableHead className="w-[230px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d, idx) => {
                  const [transportPart, propertyPart] = d.shareRatio
                    .split(":")
                    .map((s) => s.trim())
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {d.id}
                      </TableCell>
                      <TableCell
                        className="max-w-xs truncate"
                        title={d.title}
                      >
                        {d.title}
                      </TableCell>
                      <TableCell>{d.materialType}</TableCell>
                      <TableCell className="text-sm">{d.quantity}</TableCell>
                      <TableCell
                        className="text-sm text-muted-foreground"
                        title={d.propertyOwner}
                      >
                        {d.propertyOwner}
                      </TableCell>
                      <TableCell className="text-primary font-medium text-sm">
                        {d.unitPrice}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {d.totalAmount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs tabular-nums">
                          <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 font-medium">
                            {transportPart}
                          </span>
                          <span className="text-muted-foreground">:</span>
                          <span className="rounded bg-orange-100 text-orange-700 px-1.5 py-0.5 font-medium">
                            {propertyPart}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            d.saleMode === "整批"
                              ? "border-primary/40 text-primary"
                              : "border-accent/40 text-accent"
                          }
                        >
                          {d.saleMode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {d.publishDate}
                      </TableCell>
                      <TableCell>{statusBadge(d.status)}</TableCell>
                      <TableCell>
                        <RowActions
                          actions={selfStatusActions(d.status, () =>
                            openReject(d.id, d.rejectReason),
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// ============ 子组件：页面头部 ============

function PageHeader({
  icon: Icon,
  iconTone,
  title,
  desc,
  actionLabel,
  onAction,
}: {
  icon: React.ElementType
  iconTone: StatItem["tone"]
  title: string
  desc: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${toneClass[iconTone]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
      <Button onClick={onAction}>
        <Plus className="w-4 h-4 mr-1.5" />
        {actionLabel}
      </Button>
    </div>
  )
}

