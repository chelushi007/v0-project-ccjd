"use client"

import { useState } from "react"
import {
  Search,
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
  ShieldCheck,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  DialogDescription,
} from "@/components/ui/dialog"

// ============ 类型 ============

type SelfStatus = "草稿" | "待审核" | "已发布" | "被驳回"
type EntrustStatus = "待受理" | "已受理" | "签署中" | "已签署"

// ============ 数据：仓储自主出租 ============

interface SelfRentRow {
  id: string
  title: string
  publisher: string
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
    publisher: "中铁建广州分公司",
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
    publisher: "中铁建深圳分公司",
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
    publisher: "中铁建东莞虎门港务公司",
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
    publisher: "中铁十二局物料分公司",
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
  entruster: string
  trustee: string
  submitDate: string
  acceptDate: string
  status: EntrustStatus
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
  publisher: string
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
    publisher: "中铁十四局集团广州分公司",
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
    publisher: "中铁电气化局集团广州分公司",
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
    publisher: "中铁建工集团第二建设有限公司",
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
    publisher: "中铁二十二局集团第一工程有��公司",
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
  propertyOwner: string
  region: string
  unitPrice: string
  totalAmount: string
  shareRatio: string
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

// ============ 操作按钮配置 ============

type Tone = "default" | "primary" | "destructive" | "warning" | "success"

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
  success: "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50",
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

// 运营方：自主出租 / 物料出租 / 物资出售 通用操作矩阵
function selfStatusOperatorActions(
  status: SelfStatus,
  handlers: {
    onView: () => void
    onApprove: () => void
    onReject: () => void
    onForceDown: () => void
    onViewReject: () => void
  },
): RowAction[] {
  switch (status) {
    case "草稿":
      // 草稿仅用户可见，运营方仅可查看
      return [{ label: "查看", onClick: handlers.onView }]
    case "待审核":
      return [
        { label: "审核", tone: "success", onClick: handlers.onApprove },
        { label: "驳回", tone: "destructive", onClick: handlers.onReject },
        { label: "查看", onClick: handlers.onView },
      ]
    case "已发布":
      return [
        { label: "查看", onClick: handlers.onView },
        { label: "强制下架", tone: "destructive", onClick: handlers.onForceDown },
      ]
    case "被驳回":
      return [
        { label: "查看", onClick: handlers.onView },
        { label: "查看驳回", tone: "warning", onClick: handlers.onViewReject },
      ]
  }
}

// 运营方：委托出租操作矩阵（统一审核 / 查看 / 驳回 / 强制下架）
function entrustOperatorActions(
  status: EntrustStatus,
  handlers: {
    onView: () => void
    onApprove: () => void
    onReject: () => void
    onForceDown: () => void
  },
): RowAction[] {
  switch (status) {
    case "待受理":
      return [
        { label: "审核", tone: "success", onClick: handlers.onApprove },
        { label: "驳回", tone: "destructive", onClick: handlers.onReject },
        { label: "查看", onClick: handlers.onView },
      ]
    case "已受理":
    case "签署中":
      return [
        { label: "查看", onClick: handlers.onView },
        { label: "强制下架", tone: "destructive", onClick: handlers.onForceDown },
      ]
    case "已签署":
      return [{ label: "查看", onClick: handlers.onView }]
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

// ============ 工具栏 ============

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

// ============ 顶部 PageHeader（运营方版本：导出报表） ============

function PageHeader({
  icon: Icon,
  iconTone,
  title,
  desc,
}: {
  icon: React.ElementType
  iconTone: "primary" | "accent" | "emerald" | "amber"
  title: string
  desc: string
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
  }
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${toneMap[iconTone]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            {title}
            <Badge
              variant="outline"
              className="text-[10px] h-5 bg-primary/5 text-primary border-primary/20"
            >
              <ShieldCheck className="w-3 h-3 mr-0.5" />
              运营监管
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">{desc}</p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        <Download className="w-4 h-4 mr-1.5" />
        导出报表
      </Button>
    </div>
  )
}

// ============ 主组件 ============

type DemandSubTab =
  | "op-demand"
  | "op-demand-self"
  | "op-demand-entrust"
  | "op-demand-material"
  | "op-demand-material-sale"

interface OperatorDemandProps {
  subTab?: string
}

export function OperatorDemand({ subTab = "op-demand-self" }: OperatorDemandProps) {
  // 弹窗：审核通过 / 驳回 / 强制下架 / 查看驳回原因
  const [approveDlg, setApproveDlg] = useState<{ open: boolean; id?: string; title?: string }>({
    open: false,
  })
  const [rejectDlg, setRejectDlg] = useState<{ open: boolean; id?: string; title?: string }>({
    open: false,
  })
  const [forceDownDlg, setForceDownDlg] = useState<{ open: boolean; id?: string; title?: string }>(
    { open: false },
  )
  const [viewRejectDlg, setViewRejectDlg] = useState<{
    open: boolean
    id?: string
    reason?: string
  }>({ open: false })

  const openApprove = (id: string, title: string) => setApproveDlg({ open: true, id, title })
  const openReject = (id: string, title: string) => setRejectDlg({ open: true, id, title })
  const openForceDown = (id: string, title: string) =>
    setForceDownDlg({ open: true, id, title })
  const openViewReject = (id: string, reason?: string) =>
    setViewRejectDlg({ open: true, id, reason })

  const tab: DemandSubTab = (subTab as DemandSubTab) ?? "op-demand-self"

  return (
    <div className="space-y-5 min-w-0">
      {tab === "op-demand-entrust" ? (
        <EntrustRentPage
          onApprove={openApprove}
          onReject={openReject}
          onForceDown={openForceDown}
        />
      ) : tab === "op-demand-material" ? (
        <MaterialRentPage
          onApprove={openApprove}
          onReject={openReject}
          onForceDown={openForceDown}
          onViewReject={openViewReject}
        />
      ) : tab === "op-demand-material-sale" ? (
        <MaterialSalePage
          onApprove={openApprove}
          onReject={openReject}
          onForceDown={openForceDown}
          onViewReject={openViewReject}
        />
      ) : (
        <SelfRentPage
          onApprove={openApprove}
          onReject={openReject}
          onForceDown={openForceDown}
          onViewReject={openViewReject}
        />
      )}

      {/* 审核通过 */}
      <ApproveDialog
        open={approveDlg.open}
        id={approveDlg.id}
        title={approveDlg.title}
        onOpenChange={(o) => setApproveDlg({ ...approveDlg, open: o })}
      />

      {/* 驳回 */}
      <RejectDialog
        open={rejectDlg.open}
        id={rejectDlg.id}
        title={rejectDlg.title}
        onOpenChange={(o) => setRejectDlg({ ...rejectDlg, open: o })}
      />

      {/* 强制下架 */}
      <ForceTakedownDialog
        open={forceDownDlg.open}
        id={forceDownDlg.id}
        title={forceDownDlg.title}
        onOpenChange={(o) => setForceDownDlg({ ...forceDownDlg, open: o })}
      />

      {/* 查看驳回原因 */}
      <ViewRejectDialog
        open={viewRejectDlg.open}
        id={viewRejectDlg.id}
        reason={viewRejectDlg.reason}
        onOpenChange={(o) => setViewRejectDlg({ ...viewRejectDlg, open: o })}
      />
    </div>
  )
}

// ============ 子页：仓储自主出租 ============

interface OperatorActionHandlers {
  onApprove: (id: string, title: string) => void
  onReject: (id: string, title: string) => void
  onForceDown: (id: string, title: string) => void
  onViewReject: (id: string, reason?: string) => void
}

function SelfRentPage({
  onApprove,
  onReject,
  onForceDown,
  onViewReject,
}: OperatorActionHandlers) {
  const rows = selfRentRows
  const reviewing = rows.filter((d) => d.status === "待审核").length
  const published = rows.filter((d) => d.status === "已发布").length
  const rejected = rows.filter((d) => d.status === "被驳回").length
  const draft = rows.filter((d) => d.status === "草稿").length

  return (
    <>
      <PageHeader
        icon={Warehouse}
        iconTone="primary"
        title="仓储自主出租"
        desc="审核监管用户企业自主发布的仓储租赁需求单"
      />

      <StatsRow
        items={[
          { label: "草稿（用户编辑中）", value: draft, icon: PenLine, tone: "primary" },
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
              placeholder="搜索需求单号、发布方或标题"
              statusOptions={[
                { value: "draft", label: "草稿" },
                { value: "reviewing", label: "待审核" },
                { value: "published", label: "已发布" },
                { value: "rejected", label: "被驳回" },
              ]}
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1380px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px] text-center">序号</TableHead>
                  <TableHead className="w-[130px]">需求单号</TableHead>
                  <TableHead className="min-w-[220px]">标题</TableHead>
                  <TableHead className="min-w-[180px]">发布方</TableHead>
                  <TableHead className="w-[160px]">所在区域</TableHead>
                  <TableHead className="w-[88px]">面积</TableHead>
                  <TableHead className="w-[100px]">仓储类型</TableHead>
                  <TableHead className="w-[120px]">租金单价</TableHead>
                  <TableHead className="w-[80px]">租期</TableHead>
                  <TableHead className="w-[110px]">发布时间</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
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
                    <TableCell className="max-w-xs truncate" title={d.title}>
                      {d.title}
                    </TableCell>
                    <TableCell className="text-sm" title={d.publisher}>
                      {d.publisher}
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
                        actions={selfStatusOperatorActions(d.status, {
                          onView: () => {},
                          onApprove: () => onApprove(d.id, d.title),
                          onReject: () => onReject(d.id, d.title),
                          onForceDown: () => onForceDown(d.id, d.title),
                          onViewReject: () => onViewReject(d.id, d.rejectReason),
                        })}
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

function EntrustRentPage({
  onApprove,
  onReject,
  onForceDown,
}: {
  onApprove: (id: string, title: string) => void
  onReject: (id: string, title: string) => void
  onForceDown: (id: string, title: string) => void
}) {
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
        desc="监管委托方与受托方（华南公司）之间的代理租赁流程"
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
                  <TableHead className="w-[220px] text-center">操作</TableHead>
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
                        actions={entrustOperatorActions(d.status, {
                          onView: () => {},
                          onApprove: () => onApprove(d.id, d.title),
                          onReject: () => onReject(d.id, d.title),
                          onForceDown: () => onForceDown(d.id, d.title),
                        })}
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

function MaterialRentPage({
  onApprove,
  onReject,
  onForceDown,
  onViewReject,
}: OperatorActionHandlers) {
  const rows = materialRentRows
  const reviewing = rows.filter((d) => d.status === "待审核").length
  const published = rows.filter((d) => d.status === "已发布").length
  const rejected = rows.filter((d) => d.status === "被驳回").length
  const draft = rows.filter((d) => d.status === "草稿").length

  return (
    <>
      <PageHeader
        icon={Package}
        iconTone="emerald"
        title="物料出租"
        desc="审核监管用户企业发布的循环物料出租需求单"
      />

      <StatsRow
        items={[
          { label: "草稿（用户编辑中）", value: draft, icon: PenLine, tone: "primary" },
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
              placeholder="搜索需求单号、发布方或标题"
              statusOptions={[
                { value: "draft", label: "草稿" },
                { value: "reviewing", label: "待审核" },
                { value: "published", label: "已发布" },
                { value: "rejected", label: "被驳回" },
              ]}
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1380px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px] text-center">序号</TableHead>
                  <TableHead className="w-[130px]">需求单号</TableHead>
                  <TableHead className="min-w-[200px]">标题</TableHead>
                  <TableHead className="min-w-[180px]">发布方</TableHead>
                  <TableHead className="w-[100px]">物料类型</TableHead>
                  <TableHead className="w-[90px]">数量</TableHead>
                  <TableHead className="w-[150px]">所在区域</TableHead>
                  <TableHead className="w-[140px]">租金单价</TableHead>
                  <TableHead className="w-[80px]">租期</TableHead>
                  <TableHead className="w-[110px]">发布时间</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
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
                    <TableCell className="max-w-xs truncate" title={d.title}>
                      {d.title}
                    </TableCell>
                    <TableCell className="text-sm" title={d.publisher}>
                      {d.publisher}
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
                        actions={selfStatusOperatorActions(d.status, {
                          onView: () => {},
                          onApprove: () => onApprove(d.id, d.title),
                          onReject: () => onReject(d.id, d.title),
                          onForceDown: () => onForceDown(d.id, d.title),
                          onViewReject: () => onViewReject(d.id, d.rejectReason),
                        })}
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

function MaterialSalePage({
  onApprove,
  onReject,
  onForceDown,
  onViewReject,
}: OperatorActionHandlers) {
  const rows = materialSaleRows
  const reviewing = rows.filter((d) => d.status === "待审核").length
  const published = rows.filter((d) => d.status === "已发布").length
  const rejected = rows.filter((d) => d.status === "被驳回").length
  const draft = rows.filter((d) => d.status === "草稿").length

  const totalGmv = rows
    .filter((r) => r.status === "已发布")
    .reduce((s, r) => s + Number(r.totalAmount.replace(/,/g, "")), 0)

  return (
    <>
      <PageHeader
        icon={Tags}
        iconTone="amber"
        title="物资出售"
        desc="审核监管物资专运单位代物权单位发布的销售需求单，重点核查代理协议与分成比例"
      />

      <StatsRow
        items={[
          { label: "草稿（用户编辑中）", value: draft, icon: PenLine, tone: "primary" },
          { label: "待审核", value: reviewing, icon: Clock, tone: "amber" },
          { label: "已发布", value: published, icon: CheckCircle2, tone: "emerald" },
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
                销售代理业务监管要点
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                审核时重点核查：物资专运单位与物权单位的销售代理协议、分成比例（专运 : 物权）、托管物资台账匹配性；
                <span className="text-primary font-medium">
                  {" "}
                  成交后分成结算见 费用管理 · 销售分成
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
                  <TableHead className="w-[260px] text-center">操作</TableHead>
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
                          actions={selfStatusOperatorActions(d.status, {
                            onView: () => {},
                            onApprove: () => onApprove(d.id, d.title),
                            onReject: () => onReject(d.id, d.title),
                            onForceDown: () => onForceDown(d.id, d.title),
                            onViewReject: () => onViewReject(d.id, d.rejectReason),
                          })}
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

// ============ 弹窗：审核通过 ============

function ApproveDialog({
  open,
  id,
  title,
  onOpenChange,
}: {
  open: boolean
  id?: string
  title?: string
  onOpenChange: (o: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            审核通过
            {id && (
              <Badge variant="outline" className="ml-1 text-[10px] h-5 border-emerald-200 text-emerald-700">
                {id}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="pt-1">
            通过后将自动发布到平台前台需求池。{title && <span className="block mt-1 text-foreground">{title}</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 pt-2">
          <Label className="text-xs">审核备注（选填）</Label>
          <Textarea placeholder="如有特殊提示或建议，可填写后通知���布方……" rows={3} />
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => onOpenChange(false)}
          >
            确认通过
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ 弹窗：驳回 ============

function RejectDialog({
  open,
  id,
  title,
  onOpenChange,
}: {
  open: boolean
  id?: string
  title?: string
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
            驳回需求单
            {id && (
              <Badge variant="destructive" className="ml-1 text-[10px] h-5">
                {id}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="pt-1">
            驳回后将通知发布方修改重提。
            {title && <span className="block mt-1 text-foreground">{title}</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 pt-2">
          <Label className="text-xs">
            驳回原因 <span className="text-rose-600">*</span>
          </Label>
          <Textarea placeholder="请说明驳回原因，建议列点说明便于发布方修改……" rows={4} />
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            确认驳回
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ 弹窗：强制下架 ============

function ForceTakedownDialog({
  open,
  id,
  title,
  onOpenChange,
}: {
  open: boolean
  id?: string
  title?: string
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
            强制下架
            {id && (
              <Badge variant="destructive" className="ml-1 text-[10px] h-5">
                {id}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="pt-1">
            强制下架后该需求将立即从前台需求池移除，并通知发布方。
            {title && <span className="block mt-1 text-foreground">{title}</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 pt-2">
          <Label className="text-xs">
            下架理由 <span className="text-rose-600">*</span>
          </Label>
          <Textarea placeholder="如：信息失实、价格异常、违反平台规则、长期无效咨询……" rows={4} />
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            确认下架
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ 弹窗：查看驳回原因 ============

function ViewRejectDialog({
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
            驳回原因
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
