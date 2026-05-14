"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Warehouse,
  Package,
  PackagePlus,
  Tags,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Ban,
  ShieldAlert,
  RotateCcw,
  Building2,
  ClipboardCheck,
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
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// ============ 通用类型 ============

type ReviewStatus = "待审核" | "已通过" | "已驳回" | "已下架"

interface BaseRow {
  id: string
  title: string
  submitter: string // 申请方/物权方
  submitterType?: string // 企业类型
  submitDate: string
  publishDate?: string
  status: ReviewStatus
  views: number
  inquiries: number
  riskTags?: string[] // 风险标签：如「低于市场价」「证照缺失」
  rejectReason?: string
  reviewer?: string
  reviewDate?: string
}

interface SelfRentRow extends BaseRow {
  location: string
  area: string
  warehouseType: string
  price: string
  rentTerm: string
}

interface EntrustRow extends BaseRow {
  location: string
  area: string
  warehouseType: string
  expectedRent: string
  expectedTerm: string
  trustee: string
}

interface MatStorageRow extends BaseRow {
  materialType: string
  quantity: string
  region: string // 期望存放区域
  duration: string // 期望存放周期
  budget: string // 预算
}

interface MatRentRow extends BaseRow {
  materialType: string
  quantity: string
  location: string
  price: string
  rentTerm: string
}

interface MatSaleRow extends BaseRow {
  materialType: string
  quantity: string
  region: string
  unitPrice: string
  totalAmount: string
  shareRatio: string
  saleMode: "整批" | "分批"
}

// ============ 数据 ============

const selfRentRows: SelfRentRow[] = [
  {
    id: "ZZ20260512001",
    title: "中铁建广州南沙综合仓储基地 15000m²",
    submitter: "中铁十四局集团广州分公司",
    submitterType: "仓储业主",
    location: "广东省广州市南沙区",
    area: "15000m²",
    warehouseType: "综合仓储",
    price: "0.56元/m²/天",
    rentTerm: "12 个月",
    submitDate: "2026-05-09",
    publishDate: "2026-05-10",
    status: "已通过",
    views: 128,
    inquiries: 6,
    reviewer: "李运营",
    reviewDate: "2026-05-10 09:32",
  },
  {
    id: "ZZ20260511002",
    title: "中铁建深圳前海智慧仓储基地 8000m²",
    submitter: "中铁建工集团第二建设有限公司",
    submitterType: "仓储业主",
    location: "广东省深圳市南山区",
    area: "8000m²",
    warehouseType: "智慧仓储",
    price: "0.52元/m²/天",
    rentTerm: "24 个月",
    submitDate: "2026-05-09",
    status: "待审核",
    views: 0,
    inquiries: 0,
    riskTags: ["首次发布"],
  },
  {
    id: "ZZ20260510003",
    title: "中铁建东莞虎门港务仓储基地 25000m²",
    submitter: "中铁建东莞虎门港务仓储基地",
    submitterType: "仓储业主",
    location: "广东省东莞市虎门镇",
    area: "25000m²",
    warehouseType: "港口仓储",
    price: "0.38元/m²/天",
    rentTerm: "36 个月",
    submitDate: "2026-05-10",
    status: "待审核",
    views: 0,
    inquiries: 0,
    riskTags: ["低于市场指导价"],
  },
  {
    id: "ZZ20260509004",
    title: "中铁十二局佛山三水二期物流仓 5000m²",
    submitter: "中铁十二局物料分公司",
    submitterType: "仓储业主",
    location: "广东省佛山市三水区",
    area: "5000m²",
    warehouseType: "普通仓储",
    price: "0.28元/m²/天",
    rentTerm: "12 个月",
    submitDate: "2026-05-07",
    status: "已驳回",
    views: 0,
    inquiries: 0,
    rejectReason:
      "1) 租金报价低于本区域市场指导价 (≥0.35 元/m²/天)；2) 仓储证照附件未上传；请补充后重新发起。",
    reviewer: "李运营",
    reviewDate: "2026-05-08 10:15",
  },
  {
    id: "ZZ20260505005",
    title: "中铁十六局集团华南分公司 中山火炬冷链仓 3500m²",
    submitter: "中铁十六局集团华南分公司",
    submitterType: "仓储业主",
    location: "广东省中山市火炬开发区",
    area: "3500m²",
    warehouseType: "冷链仓储",
    price: "1.85元/m²/天",
    rentTerm: "24 个月",
    submitDate: "2026-05-05",
    publishDate: "2026-05-06",
    status: "已下架",
    views: 56,
    inquiries: 2,
    reviewer: "李运营",
    reviewDate: "2026-05-15 14:20",
  },
]

const entrustRows: EntrustRow[] = [
  {
    id: "WT20260513005",
    title: "中铁建工湛江东海岛多式联运仓储 8500m²",
    submitter: "中铁建工集团第二建设有限公司",
    submitterType: "委托方",
    location: "广东省湛江市东海岛经开区",
    area: "8500m²",
    warehouseType: "多式联运仓储",
    expectedRent: "10 - 13 元/m²/月",
    expectedTerm: "36 个月",
    trustee: "华南公司",
    submitDate: "2026-05-13",
    status: "待审核",
    views: 0,
    inquiries: 0,
    riskTags: ["大宗合同 > 500 万"],
  },
  {
    id: "WT20260512001",
    title: "中铁十六局佛山顺德钢构仓储基地 6000m²",
    submitter: "中铁十六局集团第三工程有限公司",
    submitterType: "委托方",
    location: "广东省佛山市顺德区",
    area: "6000m²",
    warehouseType: "钢构仓储",
    expectedRent: "12 - 15 元/m²/月",
    expectedTerm: "24 个月",
    trustee: "华南公司",
    submitDate: "2026-05-11",
    publishDate: "2026-05-12",
    status: "已通过",
    views: 42,
    inquiries: 3,
    reviewer: "王运营",
    reviewDate: "2026-05-12 09:30",
  },
  {
    id: "WT20260511002",
    title: "中铁二十二局惠州大亚湾危化品仓库 4000m²",
    submitter: "中铁二十二局集团第一工程有限公司",
    submitterType: "委托方",
    location: "广东省惠州市大亚湾区",
    area: "4000m²",
    warehouseType: "危化品仓储",
    expectedRent: "18 - 22 元/m²/月",
    expectedTerm: "60 个月",
    trustee: "华南公司",
    submitDate: "2026-05-10",
    status: "待审核",
    views: 0,
    inquiries: 0,
    riskTags: ["危化品仓储", "需特种资质"],
  },
  {
    id: "WT20260506004",
    title: "中铁十八局集团委托 · 江门台山港口仓 7200m²",
    submitter: "中铁十八局集团第二工程有限公司",
    submitterType: "委托方",
    location: "广东省江门市台山市",
    area: "7200m²",
    warehouseType: "港口仓储",
    expectedRent: "9 - 11 元/m²/月",
    expectedTerm: "12 个月",
    trustee: "华南公司",
    submitDate: "2026-05-03",
    publishDate: "2026-05-04",
    status: "已通过",
    views: 78,
    inquiries: 5,
    reviewer: "王运营",
    reviewDate: "2026-05-04 11:08",
  },
]

const matStorageRows: MatStorageRow[] = [
  {
    id: "CF20260513001",
    title: "盘扣脚手架配件包 800 套 · 寻仓存放",
    submitter: "中铁十一局广深城际项目部",
    submitterType: "物权方",
    materialType: "脚手架类",
    quantity: "800 套",
    region: "广州 / 佛山",
    duration: "6 个月",
    budget: "≤ 8,000 元/月",
    submitDate: "2026-05-13",
    status: "待审核",
    views: 0,
    inquiries: 0,
  },
  {
    id: "CF20260512002",
    title: "Q345B 工字钢余料 320 吨 · 寻仓存放",
    submitter: "中铁建工集团第二建设有限公司",
    submitterType: "物权方",
    materialType: "型材类",
    quantity: "320 吨",
    region: "广东省东莞市",
    duration: "12 个月",
    budget: "≤ 25,000 元/月",
    submitDate: "2026-05-12",
    publishDate: "2026-05-12",
    status: "已通过",
    views: 36,
    inquiries: 4,
    reviewer: "陈运营",
    reviewDate: "2026-05-12 16:42",
  },
  {
    id: "CF20260510003",
    title: "盾构管片 120 环 · 寻有港口直通的临时仓",
    submitter: "中铁十四局集团广州分公司",
    submitterType: "物权方",
    materialType: "拼装类",
    quantity: "120 环",
    region: "广东省湛江市 / 茂名市",
    duration: "9 个月",
    budget: "面议",
    submitDate: "2026-05-10",
    status: "待审核",
    views: 0,
    inquiries: 0,
    riskTags: ["超大件", "需特殊场地"],
  },
  {
    id: "CF20260507004",
    title: "建筑钢管 1200 套 · 寻仓存放",
    submitter: "中铁二十二局集团第一工程有限公司",
    submitterType: "物权方",
    materialType: "脚手架类",
    quantity: "1200 套",
    region: "广东省佛山市顺德区",
    duration: "6 个月",
    budget: "≤ 12,000 元/月",
    submitDate: "2026-05-07",
    status: "已驳回",
    views: 0,
    inquiries: 0,
    rejectReason:
      "1) 需求描述未明确堆码与防雨要求；2) 联系人电话填写错误，请修正后重新提交。",
    reviewer: "陈运营",
    reviewDate: "2026-05-08 09:50",
  },
]

const matRentRows: MatRentRow[] = [
  {
    id: "WZ20260512001",
    title: "Q235B 热轧 H 型钢出租 500 吨",
    submitter: "中铁十四局集团广州分公司",
    submitterType: "物权方",
    materialType: "型材类",
    quantity: "500 吨",
    location: "广东省广州市黄埔区",
    price: "1,800 元/吨/月",
    rentTerm: "6 个月",
    submitDate: "2026-05-10",
    publishDate: "2026-05-11",
    status: "已通过",
    views: 84,
    inquiries: 4,
    reviewer: "李运营",
    reviewDate: "2026-05-11 10:08",
  },
  {
    id: "WZ20260511002",
    title: "建筑钢管脚手架出租 2000 套",
    submitter: "中铁建工集团第二建设有限公司",
    submitterType: "物权方",
    materialType: "脚手架类",
    quantity: "2000 套",
    location: "广东省深圳市宝安区",
    price: "15 元/套/天",
    rentTerm: "3 个月",
    submitDate: "2026-05-10",
    status: "待审核",
    views: 0,
    inquiries: 0,
  },
  {
    id: "WZ20260510003",
    title: "塔吊设备出租 5 台",
    submitter: "中铁十二局物料分公司",
    submitterType: "物权方",
    materialType: "其他材料",
    quantity: "5 台",
    location: "广东省佛山市顺德区",
    price: "28,000 元/台/月",
    rentTerm: "12 个月",
    submitDate: "2026-05-08",
    status: "待审核",
    views: 0,
    inquiries: 0,
    riskTags: ["大型设备", "需安装资质核验"],
  },
  {
    id: "WZ20260509004",
    title: "工地围挡板出租 800 套",
    submitter: "中铁二十二局集团第一工程有限公司",
    submitterType: "物权方",
    materialType: "支护类",
    quantity: "800 套",
    location: "广东省东莞市长安镇",
    price: "8 元/套/天",
    rentTerm: "6 个月",
    submitDate: "2026-05-07",
    status: "已驳回",
    views: 0,
    inquiries: 0,
    rejectReason:
      "1) 物料规格型号填写不完整；2) 缺少物料照片附件；3) 单价超过平台基准 20%，请重新核算后提交。",
    reviewer: "李运营",
    reviewDate: "2026-05-08 14:25",
  },
]

const matSaleRows: MatSaleRow[] = [
  {
    id: "WS20260513001",
    title: "HRB400 螺纹钢 1200 吨整批销售 · 南沙综合仓",
    submitter: "中铁十四局集团广州分公司",
    submitterType: "物权方",
    materialType: "型材类",
    quantity: "1200 吨",
    region: "广东省广州市南沙区",
    unitPrice: "4,200 元/吨",
    totalAmount: "5,040,000",
    shareRatio: "25 : 75",
    saleMode: "整批",
    submitDate: "2026-05-11",
    publishDate: "2026-05-12",
    status: "已通过",
    views: 142,
    inquiries: 8,
    reviewer: "王运营",
    reviewDate: "2026-05-12 09:18",
  },
  {
    id: "WS20260512002",
    title: "WJ-7 型扣件系统 12000 套分批销售",
    submitter: "中铁电气化局集团广州分公司",
    submitterType: "物权方",
    materialType: "拼装类",
    quantity: "12000 套",
    region: "广东省深圳市宝安区",
    unitPrice: "12 元/套",
    totalAmount: "144,000",
    shareRatio: "20 : 80",
    saleMode: "分批",
    submitDate: "2026-05-11",
    status: "待审核",
    views: 0,
    inquiries: 0,
  },
  {
    id: "WS20260510003",
    title: "Φ32 螺纹钢余料 480 吨 整批清仓",
    submitter: "中铁建工集团第二建设有限公司",
    submitterType: "物权方",
    materialType: "型材类",
    quantity: "480 吨",
    region: "广东省广州市黄埔区",
    unitPrice: "3,950 元/吨",
    totalAmount: "1,896,000",
    shareRatio: "30 : 70",
    saleMode: "整批",
    submitDate: "2026-05-10",
    status: "待审核",
    views: 0,
    inquiries: 0,
    riskTags: ["低于市场价 5%"],
  },
  {
    id: "WS20260509004",
    title: "建筑钢管 1500 套 分批销售",
    submitter: "中铁二十二局集团第一工程有限公司",
    submitterType: "物权方",
    materialType: "脚手架类",
    quantity: "1500 套",
    region: "广东省佛山市顺德区",
    unitPrice: "180 元/套",
    totalAmount: "270,000",
    shareRatio: "25 : 75",
    saleMode: "分批",
    submitDate: "2026-05-07",
    status: "已驳回",
    views: 0,
    inquiries: 0,
    rejectReason:
      "1) 缺少与物权单位签署的销售代理协议附件；2) 分成比例未在协议中明确，请上传协议正本后重新提交。",
    reviewer: "王运营",
    reviewDate: "2026-05-08 11:30",
  },
  {
    id: "WS20260507005",
    title: "工字钢 320 吨 整批销售",
    submitter: "中铁十四局集团广州分公司",
    submitterType: "物权方",
    materialType: "型材类",
    quantity: "320 吨",
    region: "广东省东莞市虎门镇",
    unitPrice: "4,600 元/吨",
    totalAmount: "1,472,000",
    shareRatio: "25 : 75",
    saleMode: "整批",
    submitDate: "2026-05-04",
    publishDate: "2026-05-05",
    status: "已通过",
    views: 96,
    inquiries: 5,
    reviewer: "王运营",
    reviewDate: "2026-05-05 10:00",
  },
]

// ============ 工具 ============

const statusBadge = (s: ReviewStatus) => {
  const map: Record<ReviewStatus, string> = {
    待审核: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    已通过: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    已驳回: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    已下架: "bg-muted text-muted-foreground hover:bg-muted",
  }
  return <Badge className={map[s]}>{s}</Badge>
}

const statusIcon = (s: ReviewStatus) => {
  const map: Record<ReviewStatus, React.ElementType> = {
    待审核: Clock,
    已通过: CheckCircle2,
    已驳回: XCircle,
    已下架: Ban,
  }
  const Icon = map[s]
  return <Icon className="w-3.5 h-3.5" />
}

// ============ Tab 配置 ============

type DemandTabId =
  | "op-demand-self-rent"
  | "op-demand-entrust"
  | "op-demand-mat-storage"
  | "op-demand-mat-rent"
  | "op-demand-mat-sale"

interface TabMeta {
  id: DemandTabId
  label: string
  icon: React.ElementType
  desc: string
  rows: BaseRow[]
}

const tabMeta: Record<DemandTabId, TabMeta> = {
  "op-demand-self-rent": {
    id: "op-demand-self-rent",
    label: "仓储自主出租",
    icon: Warehouse,
    desc: "审核与监管仓储业主自主发布的仓库出租需求",
    rows: selfRentRows,
  },
  "op-demand-entrust": {
    id: "op-demand-entrust",
    label: "仓储委托出租",
    icon: FileText,
    desc: "审核业主委托华南公司代理出租的仓储需求",
    rows: entrustRows,
  },
  "op-demand-mat-storage": {
    id: "op-demand-mat-storage",
    label: "物资存放需求",
    icon: PackagePlus,
    desc: "审核物权方寻仓存放物资的需求",
    rows: matStorageRows,
  },
  "op-demand-mat-rent": {
    id: "op-demand-mat-rent",
    label: "物资租赁需求",
    icon: Package,
    desc: "审核物权方发布的物资租赁需求单",
    rows: matRentRows,
  },
  "op-demand-mat-sale": {
    id: "op-demand-mat-sale",
    label: "物资销售需求",
    icon: Tags,
    desc: "审核物权方发布的物资销售需求单",
    rows: matSaleRows,
  },
}

// ============ 主组件 ============

interface OperatorDemandProps {
  subTab?: string
}

export function OperatorDemand({ subTab = "op-demand-self-rent" }: OperatorDemandProps) {
  const tab = (tabMeta[subTab as DemandTabId] ?? tabMeta["op-demand-self-rent"]) as TabMeta

  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ReviewStatus>("all")

  // 弹窗状态
  const [reviewTarget, setReviewTarget] = useState<{
    open: boolean
    row?: BaseRow
    action: "approve" | "reject" | "takedown"
  }>({ open: false, action: "approve" })
  const [detailTarget, setDetailTarget] = useState<{
    open: boolean
    row?: BaseRow
  }>({ open: false })

  const filtered = useMemo(() => {
    return tab.rows.filter((r) => {
      const k = keyword.trim().toLowerCase()
      const matchKeyword =
        !k ||
        r.title.toLowerCase().includes(k) ||
        r.id.toLowerCase().includes(k) ||
        r.submitter.toLowerCase().includes(k)
      const matchStatus = statusFilter === "all" || r.status === statusFilter
      return matchKeyword && matchStatus
    })
  }, [tab.rows, keyword, statusFilter])

  const stats = useMemo(() => {
    const pending = tab.rows.filter((r) => r.status === "待审核").length
    const approved = tab.rows.filter((r) => r.status === "已通过").length
    const rejected = tab.rows.filter((r) => r.status === "已驳回").length
    const takedown = tab.rows.filter((r) => r.status === "已下架").length
    return { pending, approved, rejected, takedown, total: tab.rows.length }
  }, [tab.rows])

  const openReview = (
    row: BaseRow,
    action: "approve" | "reject" | "takedown",
  ) => setReviewTarget({ open: true, row, action })

  const openDetail = (row: BaseRow) => setDetailTarget({ open: true, row })

  // 行操作（运营方视角）
  const renderActions = (row: BaseRow) => {
    if (row.status === "待审核") {
      return (
        <div className="flex items-center justify-end gap-0.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openReview(row, "approve")}
            className="h-7 px-2 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            审核通过
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openReview(row, "reject")}
            className="h-7 px-2 text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            驳回
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDetail(row)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            详情
          </Button>
        </div>
      )
    }
    if (row.status === "已通过") {
      return (
        <div className="flex items-center justify-end gap-0.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDetail(row)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            详情
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-50"
          >
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            约谈
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openReview(row, "takedown")}
            className="h-7 px-2 text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50"
          >
            <Ban className="w-3.5 h-3.5 mr-1" />
            强制下架
          </Button>
        </div>
      )
    }
    if (row.status === "已驳回") {
      return (
        <div className="flex items-center justify-end gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDetail(row)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            驳回详情
          </Button>
        </div>
      )
    }
    // 已下架
    return (
      <div className="flex items-center justify-end gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openDetail(row)}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          详情
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          恢复上架
        </Button>
      </div>
    )
  }

  // 子页特有列
  const renderBizColumns = (row: BaseRow) => {
    switch (tab.id) {
      case "op-demand-self-rent": {
        const r = row as SelfRentRow
        return (
          <>
            <TableCell>
              <div className="text-sm">{r.location}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {r.warehouseType} · {r.area}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm font-medium tabular-nums">{r.price}</div>
              <div className="text-xs text-muted-foreground mt-0.5">租期 {r.rentTerm}</div>
            </TableCell>
          </>
        )
      }
      case "op-demand-entrust": {
        const r = row as EntrustRow
        return (
          <>
            <TableCell>
              <div className="text-sm">{r.location}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {r.warehouseType} · {r.area}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm font-medium tabular-nums">{r.expectedRent}</div>
              <div className="text-xs text-muted-foreground mt-0.5">期望租期 {r.expectedTerm}</div>
            </TableCell>
          </>
        )
      }
      case "op-demand-mat-storage": {
        const r = row as MatStorageRow
        return (
          <>
            <TableCell>
              <div className="text-sm">{r.region}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {r.materialType} · {r.quantity}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm font-medium tabular-nums">{r.budget}</div>
              <div className="text-xs text-muted-foreground mt-0.5">存放周期 {r.duration}</div>
            </TableCell>
          </>
        )
      }
      case "op-demand-mat-rent": {
        const r = row as MatRentRow
        return (
          <>
            <TableCell>
              <div className="text-sm">{r.location}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {r.materialType} · {r.quantity}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm font-medium tabular-nums">{r.price}</div>
              <div className="text-xs text-muted-foreground mt-0.5">租期 {r.rentTerm}</div>
            </TableCell>
          </>
        )
      }
      case "op-demand-mat-sale": {
        const r = row as MatSaleRow
        return (
          <>
            <TableCell>
              <div className="text-sm">{r.region}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {r.materialType} · {r.quantity} · {r.saleMode}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm font-medium tabular-nums">{r.unitPrice}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                总额 ¥{r.totalAmount} · 分成 {r.shareRatio}
              </div>
            </TableCell>
          </>
        )
      }
    }
  }

  const bizColTitles = (() => {
    switch (tab.id) {
      case "op-demand-self-rent":
      case "op-demand-mat-rent":
        return ["位置 / 物料", "报价 / 租期"]
      case "op-demand-entrust":
        return ["位置 / 类型", "期望报价 / 租期"]
      case "op-demand-mat-storage":
        return ["期望区域 / 物料", "预算 / 周期"]
      case "op-demand-mat-sale":
        return ["区域 / 物料", "单价 / 总额"]
    }
  })()

  const TabIcon = tab.icon

  return (
    <div className="space-y-5 min-w-0">
      {/* 顶部页头 */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <TabIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              需求监管 · {tab.label}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">{tab.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ClipboardCheck className="w-4 h-4 mr-1" />
            批量审核
          </Button>
          <Button size="sm">
            <FileText className="w-4 h-4 mr-1" />
            导出审核报表
          </Button>
        </div>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="需求总数"
          value={stats.total}
          icon={ClipboardCheck}
          tone="primary"
        />
        <StatCard
          label="待审核"
          value={stats.pending}
          icon={Clock}
          tone="amber"
          highlight={stats.pending > 0}
        />
        <StatCard label="已通过" value={stats.approved} icon={CheckCircle2} tone="emerald" />
        <StatCard label="已驳回" value={stats.rejected} icon={XCircle} tone="rose" />
        <StatCard label="已下架" value={stats.takedown} icon={Ban} tone="muted" />
      </div>

      {/* 待审核高亮提示 */}
      {stats.pending > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>
              当前有 <span className="font-semibold tabular-nums">{stats.pending}</span> 条
              {tab.label}需求等待审核，请尽快处理以免影响业主发布时效
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStatusFilter("待审核")}
            className="border-amber-300 text-amber-800 hover:bg-amber-100"
          >
            查看待审核
          </Button>
        </div>
      )}

      {/* 表格卡片 */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* 筛选条 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索需求标题 / 编号 / 申请方..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="审核状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="待审核">待审核</SelectItem>
                <SelectItem value="已通过">已通过</SelectItem>
                <SelectItem value="已驳回">已驳回</SelectItem>
                <SelectItem value="已下架">已下架</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground ml-auto">
              共 <span className="font-medium text-foreground tabular-nums">{filtered.length}</span> 条
            </div>
          </div>

          {/* 表格 */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">需求编号 / 标题</TableHead>
                  <TableHead className="w-[180px]">申请方</TableHead>
                  <TableHead className="w-[200px]">{bizColTitles[0]}</TableHead>
                  <TableHead className="w-[180px]">{bizColTitles[1]}</TableHead>
                  <TableHead className="w-[130px]">提交 / 发布</TableHead>
                  <TableHead className="w-[120px]">审核状态</TableHead>
                  <TableHead className="w-[120px]">风险 / 数据</TableHead>
                  <TableHead className="text-right w-[260px]">运营操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id} className="align-top">
                    <TableCell>
                      <div className="font-mono text-xs text-muted-foreground">{row.id}</div>
                      <div className="text-sm font-medium text-foreground mt-1 line-clamp-2">
                        {row.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{row.submitter}</span>
                      </div>
                      {row.submitterType && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {row.submitterType}
                        </div>
                      )}
                    </TableCell>
                    {renderBizColumns(row)}
                    <TableCell>
                      <div className="text-xs text-muted-foreground">提交</div>
                      <div className="text-sm tabular-nums">{row.submitDate}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {row.publishDate ? `发布 ${row.publishDate}` : "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {statusIcon(row.status)}
                        {statusBadge(row.status)}
                      </div>
                      {row.reviewer && (
                        <div className="text-xs text-muted-foreground mt-1.5">
                          {row.reviewer}
                        </div>
                      )}
                      {row.reviewDate && (
                        <div className="text-xs text-muted-foreground tabular-nums">
                          {row.reviewDate}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.riskTags && row.riskTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.riskTags.map((t) => (
                            <Badge
                              key={t}
                              variant="outline"
                              className="border-amber-300 text-amber-800 bg-amber-50 text-[10px] h-5"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      ) : row.status === "已通过" ? (
                        <div className="text-xs text-muted-foreground">
                          浏览 <span className="text-foreground tabular-nums">{row.views}</span>
                          <br />
                          咨询 <span className="text-foreground tabular-nums">{row.inquiries}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{renderActions(row)}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
                      暂无匹配的需求单据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 审核 / 驳回 / 下架 弹窗 */}
      <ReviewDialog
        state={reviewTarget}
        onOpenChange={(o) => setReviewTarget({ ...reviewTarget, open: o })}
      />

      {/* 详情弹窗 */}
      <DetailDialog
        state={detailTarget}
        onOpenChange={(o) => setDetailTarget({ ...detailTarget, open: o })}
      />
    </div>
  )
}

// ============ 子组件 ============

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  highlight,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  tone: "primary" | "amber" | "emerald" | "rose" | "muted"
  highlight?: boolean
}) {
  const toneCls: Record<typeof tone, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    muted: "bg-muted text-muted-foreground",
  }
  return (
    <Card className={highlight ? "border-amber-300 shadow-amber-100/50" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneCls[tone]}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-bold tabular-nums text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewDialog({
  state,
  onOpenChange,
}: {
  state: { open: boolean; row?: BaseRow; action: "approve" | "reject" | "takedown" }
  onOpenChange: (o: boolean) => void
}) {
  const [note, setNote] = useState("")

  const cfg = {
    approve: {
      title: "审核通过",
      desc: "通过后该需求将正式上架平台，对所有用户可见",
      btn: "确认通过",
      tone: "default" as const,
      icon: CheckCircle2,
      iconCls: "text-emerald-600",
      noteLabel: "审核备注（可选）",
      placeholder: "例：报价与市场水平相符，证照齐全",
    },
    reject: {
      title: "驳回需求",
      desc: "请填写驳回原因，将通知申请方修改后重新提交",
      btn: "确认驳回",
      tone: "destructive" as const,
      icon: XCircle,
      iconCls: "text-rose-600",
      noteLabel: "驳回原因（必填）",
      placeholder: "例：1) 报价低于市场指导价；2) 仓储证照附件缺失，请补充后重新提交",
    },
    takedown: {
      title: "强制下架",
      desc: "强制下架将立即停止该需求对外展示，请填写下架理由",
      btn: "确认下架",
      tone: "destructive" as const,
      icon: Ban,
      iconCls: "text-rose-600",
      noteLabel: "下架理由（必填）",
      placeholder: "例：经核实该需求存在违规信息，按平台运营规则强制下架",
    },
  }[state.action]

  const Icon = cfg.icon

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${cfg.iconCls}`} />
            {cfg.title}
          </DialogTitle>
          <DialogDescription>{cfg.desc}</DialogDescription>
        </DialogHeader>
        {state.row && (
          <div className="rounded-md border bg-muted/30 p-3 text-sm space-y-1">
            <div className="text-xs text-muted-foreground font-mono">{state.row.id}</div>
            <div className="font-medium text-foreground">{state.row.title}</div>
            <div className="text-xs text-muted-foreground">
              申请方：{state.row.submitter}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-sm">{cfg.noteLabel}</Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={cfg.placeholder}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant={cfg.tone}
            onClick={() => {
              setNote("")
              onOpenChange(false)
            }}
          >
            {cfg.btn}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailDialog({
  state,
  onOpenChange,
}: {
  state: { open: boolean; row?: BaseRow }
  onOpenChange: (o: boolean) => void
}) {
  const row = state.row
  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            需求详情
          </DialogTitle>
        </DialogHeader>
        {row && (
          <div className="space-y-3 text-sm">
            <div className="rounded-md border bg-muted/30 p-3 space-y-1">
              <div className="text-xs text-muted-foreground font-mono">{row.id}</div>
              <div className="font-medium text-foreground">{row.title}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="申请方" value={row.submitter} />
              <Field label="申请方类型" value={row.submitterType ?? "—"} />
              <Field label="提交时间" value={row.submitDate} />
              <Field label="发布时间" value={row.publishDate ?? "—"} />
              <Field
                label="审核状态"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    {statusIcon(row.status)}
                    {statusBadge(row.status)}
                  </span>
                }
              />
              <Field label="审核人 / 时间" value={row.reviewer ? `${row.reviewer} · ${row.reviewDate ?? "—"}` : "—"} />
            </div>
            {row.riskTags && row.riskTags.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5">风险标签</div>
                  <div className="flex flex-wrap gap-1.5">
                    {row.riskTags.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="border-amber-300 text-amber-800 bg-amber-50"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
            {row.rejectReason && (
              <>
                <Separator />
                <div className="rounded-md border border-rose-200 bg-rose-50/60 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 mb-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    驳回原因
                  </div>
                  <p className="text-sm text-rose-900 whitespace-pre-line leading-relaxed">
                    {row.rejectReason}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  )
}
