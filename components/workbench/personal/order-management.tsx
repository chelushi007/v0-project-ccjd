"use client"

import { useState } from "react"
import {
  Search,
  FileDown,
  Warehouse,
  PackageOpen,
  Package,
  TrendingUp,
  CircleDollarSign,
  ClipboardCheck,
  Layers,
  ShoppingBag,
  Tags,
  HandCoins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  OrderPaymentDialog,
  type FeeKind,
  type OrderType,
  type PaymentOrder,
  type PaymentRecord,
} from "./order-payment-dialog"
import {
  OrderRenewalDialog,
  OrderRefundDialog,
} from "./order-renewal-refund-dialog"
import { OrderContractDialog } from "./order-contract-dialog"
import { OrderContractConfirmDialog } from "./order-contract-confirm-dialog"

// 主状态
type MainStatus = "履约中" | "已完成" | "合同到期"
// 仓储/物资交易子状态
type RentSubStatus =
  | "待确认合同"
  | "待签署合同"
  | "待支付押金"
  | "待支付服务费"
  | "待支付租金"
  | "在租履约"
  | "已完成"
  | "待续租"
  | "待退还押金"
// 物资存放子状态
type StorageSubStatus =
  | "待确认合同"
  | "待签署合同"
  | "待支付保证金"
  | "待支付服务费"
  | "待支付保管费"
  | "保管履约"
  | "已完成"
  | "待续租"
  | "待退还保证金"

// 仓储交易订单
const warehouseOrders: Array<{
  id: string
  title: string
  area: string
  tenant: string
  landlord: string
  amount: string
  period: string
  signDate: string
  status: MainStatus
  subStatus: RentSubStatus
}> = [
  {
    id: "CCJY20260512001",
    title: "中铁建广州南沙综合仓储基地 8000m²",
    area: "8000m²",
    tenant: "中铁十一局广深城际项目部",
    landlord: "中铁建物资华南仓储有限公司",
    amount: "134,400",
    period: "2026-05-15 至 2027-05-14",
    signDate: "2026-05-11",
    status: "履约中",
    subStatus: "待确认合同",
  },
  {
    id: "CCJY20260510002",
    title: "中铁建深圳前海智慧仓储基地 5000m²",
    area: "5000m²",
    tenant: "中铁十四局深圳地铁13号线项目部",
    landlord: "中铁建物资华南专业运营有限公司",
    amount: "78,000",
    period: "2026-05-12 至 2026-11-11",
    signDate: "2026-05-09",
    status: "履约中",
    subStatus: "待签署合同",
  },
  {
    id: "CCJY20260508003",
    title: "中铁建东莞虎门港务仓储基地 12000m²",
    area: "12000m²",
    tenant: "中铁二十二局莞惠城际项目部",
    landlord: "中铁十四局集团广州分公司",
    amount: "136,800",
    period: "2026-05-12 至 2026-11-11",
    signDate: "2026-05-07",
    status: "履约中",
    subStatus: "待支付押金",
  },
  {
    id: "CCJY20260506004",
    title: "中铁十六局佛山顺德钢构仓储基地 3000m²",
    area: "3000m²",
    tenant: "中铁二十局广佛环线项目部",
    landlord: "中铁十六局集团华南分公司",
    amount: "40,500",
    period: "2026-05-10 至 2026-08-09",
    signDate: "2026-05-05",
    status: "履约中",
    subStatus: "待支付服务费",
  },
  {
    id: "CCJY20260428005",
    title: "中铁建广州黄埔恒温仓储基地 4500m²",
    area: "4500m²",
    tenant: "中铁十八局深惠城际项目部",
    landlord: "中铁建物资华南仓储有限公司",
    amount: "229,500",
    period: "2026-05-01 至 2027-04-30",
    signDate: "2026-04-27",
    status: "履约中",
    subStatus: "待支付租金",
  },
  {
    id: "CCJY20260315006",
    title: "中铁二十二局惠州大亚湾仓储基地 6000m²",
    area: "6000m²",
    tenant: "中铁建工集团广州分公司",
    landlord: "中铁二十二局集团华南分公司",
    amount: "324,000",
    period: "2026-03-20 至 2027-03-19",
    signDate: "2026-03-14",
    status: "履约中",
    subStatus: "在租履约",
  },
  {
    id: "CCJY20251015007",
    title: "中铁建广州南沙综合仓储基地 10000m²",
    area: "10000m²",
    tenant: "中铁电气化局集团广州分公司",
    landlord: "中铁建物资华南仓储有限公司",
    amount: "270,000",
    period: "2025-10-20 至 2026-04-19",
    signDate: "2025-10-14",
    status: "已完成",
    subStatus: "已完成",
  },
  {
    id: "CCJY20260420008",
    title: "中铁建深圳龙岗物流仓储基地 4000m²",
    area: "4000m²",
    tenant: "中铁二十五局深中通道项目部",
    landlord: "中铁建物资华南专业运营有限公司",
    amount: "67,200",
    period: "2025-11-20 至 2026-05-19",
    signDate: "2025-11-15",
    status: "合同到期",
    subStatus: "待续租",
  },
  {
    id: "CCJY20260425009",
    title: "中铁二十四局中山火炬仓储基地 3500m²",
    area: "3500m²",
    tenant: "中铁大桥局集团广州分公司",
    landlord: "中铁二十四局集团华南分公司",
    amount: "47,250",
    period: "2025-10-25 至 2026-04-24",
    signDate: "2025-10-20",
    status: "合同到期",
    subStatus: "待退还押金",
  },
]

// 物资存放订单
const materialStorageOrders: Array<{
  id: string
  title: string
  materialType: string
  quantity: string
  owner: string
  site: string
  inDate: string
  outDate: string
  storageFee: string
  occupiedArea: string
  status: MainStatus
  subStatus: StorageSubStatus
}> = [
  {
    id: "WZCF20260512001",
    title: "Q235B 热轧 H 型钢 320 吨",
    materialType: "型材类",
    quantity: "320 吨",
    owner: "中铁十四局集团广州分公司",
    site: "中铁建广州南沙综合仓储基地",
    inDate: "2026-05-15",
    outDate: "—",
    storageFee: "12,800元/月",
    occupiedArea: "480m²",
    status: "履约中",
    subStatus: "待确认合同",
  },
  {
    id: "WZCF20260510002",
    title: "建筑钢管脚手架 1600 套",
    materialType: "脚手架类",
    quantity: "1600 套",
    owner: "中铁十六局集团华南分公司",
    site: "中铁建深圳前海智慧仓储基地",
    inDate: "2026-05-14",
    outDate: "—",
    storageFee: "9,600元/月",
    occupiedArea: "320m²",
    status: "履约中",
    subStatus: "待签署合同",
  },
  {
    id: "WZCF20260508003",
    title: "盾构机刀盘配件 24 件",
    materialType: "拼装类",
    quantity: "24 件",
    owner: "中铁隧道局集团广州分公司",
    site: "中铁建广州南沙综合仓储基地",
    inDate: "2026-05-12",
    outDate: "—",
    storageFee: "6,500元/月",
    occupiedArea: "180m²",
    status: "履约中",
    subStatus: "待支付保证金",
  },
  {
    id: "WZCF20260505004",
    title: "工字钢梁 220 吨",
    materialType: "型材类",
    quantity: "220 吨",
    owner: "中铁十四局集团广州分公司",
    site: "中铁建东莞虎门港务仓储基地",
    inDate: "2026-05-08",
    outDate: "—",
    storageFee: "8,800元/月",
    occupiedArea: "260m²",
    status: "履约中",
    subStatus: "待支付服务费",
  },
  {
    id: "WZCF20260420005",
    title: "塔吊配件 86 件",
    materialType: "拼装类",
    quantity: "86 件",
    owner: "中铁二十局集团华南分公司",
    site: "中铁十六局佛山顺德钢构仓储基地",
    inDate: "2026-04-22",
    outDate: "—",
    storageFee: "4,200元/月",
    occupiedArea: "120m²",
    status: "履约中",
    subStatus: "待支付保管费",
  },
  {
    id: "WZCF20260301006",
    title: "Φ32 螺纹钢 540 吨",
    materialType: "型材类",
    quantity: "540 吨",
    owner: "中铁建工集团广州分公司",
    site: "中铁建广州南沙综合仓储基地",
    inDate: "2026-03-08",
    outDate: "—",
    storageFee: "21,600元/月",
    occupiedArea: "720m²",
    status: "履约中",
    subStatus: "保管履约",
  },
  {
    id: "WZCF20251115007",
    title: "钢板桩 380 吨",
    materialType: "支护类",
    quantity: "380 吨",
    owner: "中铁大桥局集团广州分公司",
    site: "中铁建东莞虎门港务仓储基地",
    inDate: "2025-11-20",
    outDate: "2026-04-30",
    storageFee: "76,000元",
    occupiedArea: "560m²",
    status: "已完成",
    subStatus: "已完成",
  },
  {
    id: "WZCF20251025008",
    title: "WJ-7 型扣件系统 4200 套",
    materialType: "拼装类",
    quantity: "4200 套",
    owner: "中铁电气化局集团广州分公司",
    site: "中铁建深圳前海智慧仓储基地",
    inDate: "2025-11-01",
    outDate: "2026-05-01",
    storageFee: "5,400元/月",
    occupiedArea: "150m²",
    status: "合同到期",
    subStatus: "待续租",
  },
  {
    id: "WZCF20251015009",
    title: "轨枕 III型 1200 根",
    materialType: "轨道类",
    quantity: "1200 根",
    owner: "中铁二十二局集团华南分公司",
    site: "中铁二十二局惠州大亚湾仓储基地",
    inDate: "2025-10-20",
    outDate: "2026-04-20",
    storageFee: "9,000元/月",
    occupiedArea: "420m²",
    status: "合同到期",
    subStatus: "待退还保证金",
  },
]

// 物资交易订单
const materialTradeOrders: Array<{
  id: string
  title: string
  materialType: string
  quantity: string
  provider: string
  user: string
  tradeType: "出租" | "整租"
  amount: string
  unitPrice: string
  period: string
  status: MainStatus
  subStatus: RentSubStatus
}> = [
  {
    id: "WZJY20260512001",
    title: "Q235B 热轧 H 型钢 出租",
    materialType: "型材类",
    quantity: "200 吨",
    provider: "中铁十四局集团广州分公司",
    user: "中铁十一局广深城际项目部",
    tradeType: "出租",
    amount: "360,000",
    unitPrice: "1,800元/吨/月",
    period: "2026-05-15 至 2026-11-14",
    status: "履约中",
    subStatus: "待确认合同",
  },
  {
    id: "WZJY20260511002",
    title: "建筑钢管脚手架 出租",
    materialType: "脚手架类",
    quantity: "1200 套",
    provider: "中铁建物资华南专业运营有限公司",
    user: "中铁十八局深惠城际项目部",
    tradeType: "出租",
    amount: "540,000",
    unitPrice: "15元/套/天",
    period: "2026-05-15 至 2026-08-13",
    status: "履约中",
    subStatus: "待签署合同",
  },
  {
    id: "WZJY20260509003",
    title: "工字钢梁 整租",
    materialType: "型材类",
    quantity: "300 吨",
    provider: "中铁十四局集团广州分公司",
    user: "中铁建物资华南专业运营有限公司",
    tradeType: "整租",
    amount: "1,350,000",
    unitPrice: "1,500元/吨/月",
    period: "2026-05-12 至 2027-05-11",
    status: "履约中",
    subStatus: "待支付押金",
  },
  {
    id: "WZJY20260505004",
    title: "塔吊设备 出租",
    materialType: "其他材料",
    quantity: "5 台",
    provider: "中铁二十局集团华南分公司",
    user: "中铁二十五局深中通道项目部",
    tradeType: "出租",
    amount: "420,000",
    unitPrice: "28,000元/台/月",
    period: "2026-05-08 至 2026-08-07",
    status: "履约中",
    subStatus: "待支付服务费",
  },
  {
    id: "WZJY20260428005",
    title: "WJ-7 型扣件系统 出租",
    materialType: "拼装类",
    quantity: "8000 套",
    provider: "中铁电气化局集团广州分公司",
    user: "中铁二十二局莞惠城际项目部",
    tradeType: "出租",
    amount: "240,000",
    unitPrice: "1元/套/月",
    period: "2026-05-01 至 2026-12-31",
    status: "履约中",
    subStatus: "待支付租金",
  },
  {
    id: "WZJY20260315006",
    title: "60kg/m 钢轨 整租",
    materialType: "轨道类",
    quantity: "180 吨",
    provider: "中铁建物资华南专业运营有限公司",
    user: "中铁十四局深圳地铁13号线项目部",
    tradeType: "整租",
    amount: "972,000",
    unitPrice: "900元/吨/月",
    period: "2026-03-20 至 2027-03-19",
    status: "履约中",
    subStatus: "在租履约",
  },
  {
    id: "WZJY20251108007",
    title: "盾构机刀盘 出租",
    materialType: "其他材料",
    quantity: "2 台",
    provider: "中铁隧道局集团广州分公司",
    user: "中铁建工集团广州分公司",
    tradeType: "出租",
    amount: "480,000",
    unitPrice: "40,000元/台/月",
    period: "2025-11-15 至 2026-05-14",
    status: "已完成",
    subStatus: "已完成",
  },
  {
    id: "WZJY20251020008",
    title: "钢板桩 出租",
    materialType: "支护类",
    quantity: "260 吨",
    provider: "中铁大桥局集团广州分公司",
    user: "中铁二十局广佛环线项目部",
    tradeType: "出租",
    amount: "312,000",
    unitPrice: "200元/吨/月",
    period: "2025-11-01 至 2026-05-01",
    status: "合同到期",
    subStatus: "待续租",
  },
  {
    id: "WZJY20251015009",
    title: "轨枕 III型 出租",
    materialType: "轨道类",
    quantity: "950 根",
    provider: "中铁二十二局集团华南分公司",
    user: "中铁二十五局深中通道项目部",
    tradeType: "出租",
    amount: "171,000",
    unitPrice: "30元/根/月",
    period: "2025-10-20 至 2026-04-19",
    status: "合同到期",
    subStatus: "待退还押金",
  },
]

// 销售订单（专运单位代物权单位销售托管物资）
type SaleSubStatus =
  | "待确认合同"
  | "待签署合同"
  | "待支付货款"
  | "待发货"
  | "运输中"
  | "已交付"
  | "已分成"
  | "已完成"

type SaleStatus = "履约中" | "已完成"

interface SaleOrder {
  id: string
  title: string
  materialType: string
  quantity: string
  propertyOwner: string // 物权单位
  transportUnit: string // 销售执行方（专运单位）
  buyer: string // 买方
  unitPrice: string
  amount: string // 销售总额（元，逗号分隔）
  shareRatio: string // 25 : 75
  transportShare: number // 25
  saleMode: "整批" | "分批"
  signDate: string
  deliveryDate: string
  status: SaleStatus
  subStatus: SaleSubStatus
  paymentStatus: "未付款" | "部分付款" | "已结清"
}

const saleOrders: SaleOrder[] = [
  {
    id: "WZXS20260513001",
    title: "HRB400 螺纹钢 1200 吨整批销售",
    materialType: "型材类",
    quantity: "1200 吨",
    propertyOwner: "中铁十四局集团广州分公司",
    transportUnit: "中铁建物资华南专业运营有限公司",
    buyer: "中铁二十三局深圳分公司",
    unitPrice: "4,200元/吨",
    amount: "5,040,000",
    shareRatio: "25 : 75",
    transportShare: 25,
    saleMode: "整批",
    signDate: "2026-05-13",
    deliveryDate: "2026-05-20 至 2026-05-25",
    status: "履约中",
    subStatus: "运输中",
    paymentStatus: "已结清",
  },
  {
    id: "WZXS20260512002",
    title: "WJ-7 型扣件系统 12000 套",
    materialType: "拼装类",
    quantity: "12000 套",
    propertyOwner: "中铁电气化局集团广州分公司",
    transportUnit: "中铁建物资华南专业运营有限公司",
    buyer: "中铁十一局广深城际项目部",
    unitPrice: "12元/套",
    amount: "144,000",
    shareRatio: "20 : 80",
    transportShare: 20,
    saleMode: "分批",
    signDate: "2026-05-12",
    deliveryDate: "2026-05-15 至 2026-06-30",
    status: "履约中",
    subStatus: "待支付货款",
    paymentStatus: "部分付款",
  },
  {
    id: "WZXS20260510003",
    title: "Φ32 螺纹钢余料 480 吨",
    materialType: "型材类",
    quantity: "480 吨",
    propertyOwner: "中铁建工集团第二建设有限公司",
    transportUnit: "中铁建物资华南专业运营有限公司",
    buyer: "广州市顺德建材贸易公司",
    unitPrice: "3,950元/吨",
    amount: "1,896,000",
    shareRatio: "30 : 70",
    transportShare: 30,
    saleMode: "整批",
    signDate: "2026-05-10",
    deliveryDate: "2026-05-12 至 2026-05-15",
    status: "履约中",
    subStatus: "已交付",
    paymentStatus: "已结清",
  },
  {
    id: "WZXS20260508004",
    title: "工字钢 320 吨 整批销售",
    materialType: "型材类",
    quantity: "320 吨",
    propertyOwner: "中铁十四局集团广州分公司",
    transportUnit: "中铁建物资华南专业运营有限公司",
    buyer: "中铁二十二局莞惠城际项目部",
    unitPrice: "4,600元/吨",
    amount: "1,472,000",
    shareRatio: "25 : 75",
    transportShare: 25,
    saleMode: "整批",
    signDate: "2026-05-08",
    deliveryDate: "2026-05-10 至 2026-05-12",
    status: "已完成",
    subStatus: "已分成",
    paymentStatus: "已结清",
  },
  {
    id: "WZXS20260420005",
    title: "建筑钢管 1500 套",
    materialType: "脚手架类",
    quantity: "1500 套",
    propertyOwner: "中铁二十二局集团第一工程有限公司",
    transportUnit: "中铁建物资华南专业运营有限公司",
    buyer: "中铁二十五局深中通道项目部",
    unitPrice: "180元/套",
    amount: "270,000",
    shareRatio: "25 : 75",
    transportShare: 25,
    saleMode: "分批",
    signDate: "2026-04-20",
    deliveryDate: "2026-04-25 至 2026-05-20",
    status: "已完成",
    subStatus: "已分成",
    paymentStatus: "已结清",
  },
  {
    id: "WZXS20260515006",
    title: "盾构刀片合金 36 件",
    materialType: "其他材料",
    quantity: "36 件",
    propertyOwner: "中铁隧道局集团广州分公司",
    transportUnit: "中铁建物资华南专业运营有限公司",
    buyer: "中铁建工集团广州分公司",
    unitPrice: "12,500元/件",
    amount: "450,000",
    shareRatio: "20 : 80",
    transportShare: 20,
    saleMode: "整批",
    signDate: "2026-05-15",
    deliveryDate: "2026-05-18 至 2026-05-22",
    status: "履约中",
    subStatus: "待签署合同",
    paymentStatus: "未付款",
  },
]

const getSaleStatusBadge = (status: SaleStatus) =>
  status === "履约中" ? (
    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">履约中</Badge>
  ) : (
    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
      已完成
    </Badge>
  )

const SALE_SUB_BADGES: Record<SaleSubStatus, string> = {
  待确认合同: "bg-orange-50 text-orange-700 border-orange-200",
  待签署合同: "bg-orange-50 text-orange-700 border-orange-200",
  待支付货款: "bg-amber-50 text-amber-700 border-amber-200",
  待发货: "bg-purple-50 text-purple-700 border-purple-200",
  运输中: "bg-sky-50 text-sky-700 border-sky-200",
  已交付: "bg-indigo-50 text-indigo-700 border-indigo-200",
  已分成: "bg-emerald-50 text-emerald-700 border-emerald-200",
  已完成: "bg-muted text-muted-foreground border-border",
}

const getPaymentBadge = (s: SaleOrder["paymentStatus"]) => {
  const cls =
    s === "已结清"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : s === "部分付款"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200"
  return (
    <Badge variant="outline" className={cls}>
      {s}
    </Badge>
  )
}

// 主状态徽标
const getMainStatusBadge = (status: MainStatus) => {
  switch (status) {
    case "履约中":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">履约中</Badge>
    case "已完成":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">已完成</Badge>
    case "合同到期":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">合同到期</Badge>
  }
}

const getTradeTypeBadge = (type: string) => {
  if (type === "整租") {
    return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">整租</Badge>
  }
  return <Badge variant="outline">出租</Badge>
}

// 业务样式
const ACTION_CLS = {
  contract: "text-orange-700 hover:text-orange-800 hover:bg-orange-50",
  pay: "text-amber-700 hover:text-amber-800 hover:bg-amber-50",
  renew: "text-sky-700 hover:text-sky-800 hover:bg-sky-50",
  refund: "text-rose-700 hover:text-rose-800 hover:bg-rose-50",
}

// 金额字符串 → 数字（剔除逗号与中文）
function parseAmount(amountStr: string): number {
  return Number(amountStr.replace(/[^\d.]/g, "")) || 0
}

// "2026-05-15 至 2027-05-14" → 12
function parseMonths(periodStr: string): number {
  const parts = periodStr.split(" 至 ")
  if (parts.length !== 2) return 12
  const [sy, sm] = parts[0].trim().split("-").map(Number)
  const [ey, em] = parts[1].trim().split("-").map(Number)
  if (!sy || !sm || !ey || !em) return 12
  const months = (ey - sy) * 12 + (em - sm)
  return Math.max(1, months)
}

// 仓储交易订单 → 支付订单视图
function toWarehousePaymentOrder(o: (typeof warehouseOrders)[number]): PaymentOrder {
  const total = parseAmount(o.amount)
  const months = parseMonths(o.period)
  const monthly = Math.round(total / months)
  return {
    id: o.id,
    title: o.title,
    payer: o.tenant,
    depositPayee: o.landlord,
    periodLabel: o.period,
    totalAmount: total,
    totalMonths: months,
    monthlyAmount: monthly,
    depositAmount: monthly * 2,
    serviceFeeAmount: Math.round(total * 0.03),
    rentStartDate: o.period.split(" 至 ")[0].slice(0, 7),
  }
}

// 物资存放订单 → 支付订单视图（按 12 个月计算）
function toStoragePaymentOrder(o: (typeof materialStorageOrders)[number]): PaymentOrder {
  const monthly = parseAmount(o.storageFee)
  const months = 12
  const total = monthly * months
  return {
    id: o.id,
    title: o.title,
    payer: o.owner,
    depositPayee: o.site,
    periodLabel: `${o.inDate} 起 ${months} 个月`,
    totalAmount: total,
    totalMonths: months,
    monthlyAmount: monthly,
    depositAmount: monthly * 2,
    serviceFeeAmount: Math.round(total * 0.03),
    rentStartDate: o.inDate.slice(0, 7),
  }
}

// 物资交易订单 → 支付订单视图
function toTradePaymentOrder(o: (typeof materialTradeOrders)[number]): PaymentOrder {
  const total = parseAmount(o.amount)
  const months = parseMonths(o.period)
  const monthly = Math.round(total / months)
  return {
    id: o.id,
    title: o.title,
    payer: o.user,
    depositPayee: o.provider,
    periodLabel: o.period,
    totalAmount: total,
    totalMonths: months,
    monthlyAmount: monthly,
    depositAmount: monthly * 2,
    serviceFeeAmount: Math.round(total * 0.03),
    rentStartDate: o.period.split(" 至 ")[0].slice(0, 7),
  }
}

// 子状态 → 默认打开的支付 Tab
function subStatusToTab(s: RentSubStatus | StorageSubStatus): FeeKind | null {
  switch (s) {
    case "待支付押金":
    case "待支付保证金":
      return "deposit"
    case "待支付服务费":
      return "serviceFee"
    case "待支付租金":
    case "待支付保管费":
      return "rent"
    default:
      return null
  }
}

// 初始支付进度：按订单当前所处子状态，反推之前步骤应该已完成
// 在租履约/保管履约/已完成/合同到期等订单：押金、服务费已付，租金按月部分/全部已付
// 待支付租金/待支付保管费：押金、服务费已付，租金未支付或部分已付
// 待支付服务费：押金已付
const INITIAL_PAYMENT_RECORDS: Record<string, PaymentRecord> = {
  // 仓储交易
  CCJY20260506004: { depositPaid: true },
  CCJY20260428005: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 2 },
  CCJY20260315006: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 5 },
  CCJY20251015007: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
  CCJY20260420008: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
  CCJY20260425009: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
  // 物资存放
  WZCF20260505004: { depositPaid: true },
  WZCF20260420005: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 1 },
  WZCF20260301006: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 3 },
  WZCF20251115007: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
  WZCF20251025008: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
  WZCF20251015009: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
  // 物资交易
  WZJY20260505004: { depositPaid: true },
  WZJY20260428005: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 2 },
  WZJY20260315006: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 5 },
  WZJY20251108007: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
  WZJY20251020008: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
  WZJY20251015009: { depositPaid: true, serviceFeePaid: true, rentPaidMonths: 6 },
}

type OrderSubTab = "warehouse" | "storage" | "trade"

interface OrderManagementProps {
  subTab?: OrderSubTab
}

export function OrderManagement({ subTab = "warehouse" }: OrderManagementProps = {}) {
  const activeTab: OrderSubTab = subTab
  const [tradeSubTab, setTradeSubTab] = useState<"rent" | "sale">("rent")
  const [paymentRecords, setPaymentRecords] =
    useState<Record<string, PaymentRecord>>(INITIAL_PAYMENT_RECORDS)
  const [payDialog, setPayDialog] = useState<{
    open: boolean
    order: PaymentOrder | null
    orderType: OrderType
    defaultTab: FeeKind
  }>({ open: false, order: null, orderType: "warehouse", defaultTab: "deposit" })

  const [renewalDialog, setRenewalDialog] = useState<{
    open: boolean
    order: PaymentOrder | null
    orderType: OrderType
    originalEndDate?: string
  }>({ open: false, order: null, orderType: "warehouse" })

  const [refundDialog, setRefundDialog] = useState<{
    open: boolean
    order: PaymentOrder | null
    orderType: OrderType
  }>({ open: false, order: null, orderType: "warehouse" })

  const [contractDialog, setContractDialog] = useState<{
    open: boolean
    order: PaymentOrder | null
    orderType: OrderType
  }>({ open: false, order: null, orderType: "warehouse" })

  const [confirmContractDialog, setConfirmContractDialog] = useState<{
    open: boolean
    order: PaymentOrder | null
    orderType: OrderType
  }>({ open: false, order: null, orderType: "warehouse" })

  // 续租 / 退款 / 合同签署 / 合同确认 完成后将订单标记
  const [renewedIds, setRenewedIds] = useState<Set<string>>(new Set())
  const [refundedIds, setRefundedIds] = useState<Set<string>>(new Set())
  const [signedIds, setSignedIds] = useState<Set<string>>(new Set())
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())

  const openPay = (order: PaymentOrder, orderType: OrderType, defaultTab: FeeKind) => {
    setPayDialog({ open: true, order, orderType, defaultTab })
  }

  const openRenewal = (
    order: PaymentOrder,
    orderType: OrderType,
    originalEndDate?: string,
  ) => {
    setRenewalDialog({ open: true, order, orderType, originalEndDate })
  }

  const openRefund = (order: PaymentOrder, orderType: OrderType) => {
    setRefundDialog({ open: true, order, orderType })
  }

  const openContract = (order: PaymentOrder, orderType: OrderType) => {
    setContractDialog({ open: true, order, orderType })
  }

  const openConfirmContract = (order: PaymentOrder, orderType: OrderType) => {
    setConfirmContractDialog({ open: true, order, orderType })
  }

  const handleRenewalConfirm = () => {
    const id = renewalDialog.order?.id
    if (id) setRenewedIds((s) => new Set(s).add(id))
  }

  const handleRefundConfirm = () => {
    const id = refundDialog.order?.id
    if (id) setRefundedIds((s) => new Set(s).add(id))
  }

  const handleContractConfirm = () => {
    const id = contractDialog.order?.id
    if (id) setSignedIds((s) => new Set(s).add(id))
  }

  const handleContractConfirmAccept = () => {
    const id = confirmContractDialog.order?.id
    if (id) setConfirmedIds((s) => new Set(s).add(id))
  }

  const handlePay = (kind: FeeKind) => {
    const id = payDialog.order?.id
    if (!id) return
    setPaymentRecords((prev) => {
      const cur = prev[id] ?? {}
      if (kind === "deposit") return { ...prev, [id]: { ...cur, depositPaid: true } }
      if (kind === "serviceFee") return { ...prev, [id]: { ...cur, serviceFeePaid: true } }
      if (kind === "rent") {
        return {
          ...prev,
          [id]: { ...cur, rentPaidMonths: (cur.rentPaidMonths ?? 0) + 1 },
        }
      }
      return prev
    })
  }

  // 行操作渲染：基于子状态 + 当前支付进度共同决定显示哪个主操作按钮
  const renderRowActions = (
    paymentOrder: PaymentOrder,
    orderType: OrderType,
    subStatus: RentSubStatus | StorageSubStatus,
  ) => {
    const record = paymentRecords[paymentOrder.id] ?? {}
    let primary: { label: string; className: string; onClick?: () => void } | null = null

    switch (subStatus) {
      case "待确认合同":
        if (!confirmedIds.has(paymentOrder.id)) {
          primary = {
            label: "确认合同",
            className: ACTION_CLS.contract,
            onClick: () => openConfirmContract(paymentOrder, orderType),
          }
        }
        break
      case "待签署合同":
        if (!signedIds.has(paymentOrder.id)) {
          primary = {
            label: "签署合同",
            className: ACTION_CLS.contract,
            onClick: () => openContract(paymentOrder, orderType),
          }
        }
        break
      case "待支付押金":
      case "待支付保证金":
        if (!record.depositPaid) {
          primary = {
            label: subStatus.replace("待", ""),
            className: ACTION_CLS.pay,
            onClick: () => openPay(paymentOrder, orderType, "deposit"),
          }
        }
        break
      case "待支付服务费":
        if (!record.serviceFeePaid) {
          primary = {
            label: "支付服务费",
            className: ACTION_CLS.pay,
            onClick: () => openPay(paymentOrder, orderType, "serviceFee"),
          }
        }
        break
      case "待支付租金":
      case "待支付保管费": {
        const paid = record.rentPaidMonths ?? 0
        if (paid < paymentOrder.totalMonths) {
          primary = {
            label: subStatus.replace("待", ""),
            className: ACTION_CLS.pay,
            onClick: () => openPay(paymentOrder, orderType, "rent"),
          }
        }
        break
      }
      case "待续租":
        if (!renewedIds.has(paymentOrder.id)) {
          primary = {
            label: "续租",
            className: ACTION_CLS.renew,
            onClick: () => openRenewal(paymentOrder, orderType),
          }
        }
        break
      case "待退还押金":
        if (!refundedIds.has(paymentOrder.id)) {
          primary = {
            label: "退还押金",
            className: ACTION_CLS.refund,
            onClick: () => openRefund(paymentOrder, orderType),
          }
        }
        break
      case "待退还保证金":
        if (!refundedIds.has(paymentOrder.id)) {
          primary = {
            label: "退还保证金",
            className: ACTION_CLS.refund,
            onClick: () => openRefund(paymentOrder, orderType),
          }
        }
        break
    }

    return (
      <div className="flex items-center justify-center gap-0.5">
        {primary && (
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 font-medium ${primary.className}`}
            onClick={primary.onClick}
          >
            {primary.label}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          查看
        </Button>
      </div>
    )
  }

  // 仓储交易统计
  const warehouseStats = {
    total: warehouseOrders.length,
    active: warehouseOrders.filter((o) => o.status === "履约中").length,
    expired: warehouseOrders.filter((o) => o.status === "合同到期").length,
    totalAmount: warehouseOrders
      .reduce((s, o) => s + Number(o.amount.replace(/,/g, "")), 0)
      .toLocaleString("zh-CN"),
  }

  // 物资存放统计
  const storageStats = {
    total: materialStorageOrders.length,
    active: materialStorageOrders.filter((o) => o.status === "履约中").length,
    totalArea: materialStorageOrders
      .reduce((s, o) => s + Number(o.occupiedArea.replace(/[^\d.]/g, "")), 0)
      .toLocaleString("zh-CN"),
    monthlyFee: materialStorageOrders
      .filter((o) => o.status === "履约中")
      .reduce((s, o) => s + Number(o.storageFee.replace(/[^\d.]/g, "")), 0)
      .toLocaleString("zh-CN"),
  }

  // 物资交易统计
  const tradeStats = {
    total: materialTradeOrders.length,
    active: materialTradeOrders.filter((o) => o.status === "履约中").length,
    fullRent: materialTradeOrders.filter((o) => o.tradeType === "整租").length,
    totalAmount: materialTradeOrders
      .reduce((s, o) => s + Number(o.amount.replace(/,/g, "")), 0)
      .toLocaleString("zh-CN"),
  }

  // 销售订单统计
  const saleStats = (() => {
    const totalGmv = saleOrders.reduce(
      (s, o) => s + Number(o.amount.replace(/,/g, "")),
      0,
    )
    const transportShareTotal = saleOrders.reduce(
      (s, o) =>
        s +
        Math.round(
          (Number(o.amount.replace(/,/g, "")) * o.transportShare) / 100,
        ),
      0,
    )
    return {
      total: saleOrders.length,
      active: saleOrders.filter((o) => o.status === "履约中").length,
      gmv: totalGmv.toLocaleString("zh-CN"),
      transportShare: transportShareTotal.toLocaleString("zh-CN"),
    }
  })()

  // 子页面元信息
  const pageMeta: Record<
    OrderSubTab,
    { title: string; desc: string; icon: typeof Warehouse; iconBg: string; iconColor: string }
  > = {
    warehouse: {
      title: "仓储交易订单",
      desc: "管理已签订的仓储租赁订单，跟踪合同、押金、租金与履约状态",
      icon: Warehouse,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    storage: {
      title: "物资存放订单",
      desc: "管理客户委托保管的物资存放订单，跟踪保证金、保管费与出入库状态",
      icon: PackageOpen,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
    },
    trade: {
      title: "物资交易订单",
      desc: "管理物资的租赁与销售订单：出租 / 整租 跟踪租金；销售订单跟踪货款与分成",
      icon: Package,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
  }
  const meta = pageMeta[activeTab]
  const PageIcon = meta.icon

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-lg ${meta.iconBg} flex items-center justify-center shrink-0`}
          >
            <PageIcon className={`w-5 h-5 ${meta.iconColor}`} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate">{meta.title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{meta.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            导出订单
          </Button>
        </div>
      </div>

      {/* 数据概览（按 subTab 切换） */}
      {activeTab === "warehouse" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="仓储订单总数"
            value={warehouseStats.total.toString()}
            icon={Warehouse}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <StatCard
            label="履约中"
            value={warehouseStats.active.toString()}
            icon={TrendingUp}
            iconBg="bg-blue-100"
            iconColor="text-blue-700"
          />
          <StatCard
            label="合同到期待处理"
            value={warehouseStats.expired.toString()}
            icon={ClipboardCheck}
            iconBg="bg-amber-100"
            iconColor="text-amber-700"
          />
          <StatCard
            label="累计成交金额(元)"
            value={warehouseStats.totalAmount}
            icon={CircleDollarSign}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-700"
            valueSize="xl"
          />
        </div>
      )}

      {activeTab === "storage" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="存放订单总数"
            value={storageStats.total.toString()}
            icon={PackageOpen}
            iconBg="bg-purple-100"
            iconColor="text-purple-700"
          />
          <StatCard
            label="保管中订单"
            value={storageStats.active.toString()}
            icon={TrendingUp}
            iconBg="bg-blue-100"
            iconColor="text-blue-700"
          />
          <StatCard
            label="累计占用面积(m²)"
            value={storageStats.totalArea}
            icon={Layers}
            iconBg="bg-orange-100"
            iconColor="text-orange-700"
          />
          <StatCard
            label="月保管费收入(元)"
            value={storageStats.monthlyFee}
            icon={CircleDollarSign}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-700"
            valueSize="xl"
          />
        </div>
      )}

      {activeTab === "trade" && tradeSubTab === "rent" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="交易订单总数"
            value={tradeStats.total.toString()}
            icon={Package}
            iconBg="bg-accent/10"
            iconColor="text-accent"
          />
          <StatCard
            label="履约中"
            value={tradeStats.active.toString()}
            icon={TrendingUp}
            iconBg="bg-blue-100"
            iconColor="text-blue-700"
          />
          <StatCard
            label="整租订单"
            value={tradeStats.fullRent.toString()}
            icon={ShoppingBag}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <StatCard
            label="累计成交金额(元)"
            value={tradeStats.totalAmount}
            icon={CircleDollarSign}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-700"
            valueSize="xl"
          />
        </div>
      )}

      {activeTab === "trade" && tradeSubTab === "sale" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="销售订单总数"
            value={saleStats.total.toString()}
            icon={Tags}
            iconBg="bg-amber-100"
            iconColor="text-amber-700"
          />
          <StatCard
            label="履约中"
            value={saleStats.active.toString()}
            icon={TrendingUp}
            iconBg="bg-blue-100"
            iconColor="text-blue-700"
          />
          <StatCard
            label="销售总额(元)"
            value={saleStats.gmv}
            icon={CircleDollarSign}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-700"
            valueSize="xl"
          />
          <StatCard
            label="专运分成累计(元)"
            value={saleStats.transportShare}
            icon={HandCoins}
            iconBg="bg-orange-100"
            iconColor="text-orange-700"
            valueSize="xl"
          />
        </div>
      )}

      {/* 订单列表 */}
      <Card className="w-full min-w-0 overflow-hidden">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} className="w-full min-w-0">
            <div className="flex items-center justify-end flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="搜索订单号或标题" className="pl-9 w-64" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="processing">履约中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="expired">合同到期</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 仓储交易订单 */}
            <TabsContent value="warehouse" className="mt-4 min-w-0">
              <CardTitle className="text-base mb-3 flex items-center gap-2 text-muted-foreground font-normal">
                <ClipboardCheck className="w-4 h-4 text-primary" />
                <span>订单列表</span>
                <span className="text-xs">共 {warehouseOrders.length} 条</span>
              </CardTitle>
              <CardContent className="px-0 py-0">
                <div className="w-full overflow-x-auto border rounded-md">
                  <table className="w-full caption-bottom text-sm" style={{ minWidth: "1560px" }}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[56px] text-center whitespace-nowrap">序号</TableHead>
                        <TableHead className="whitespace-nowrap">订单号</TableHead>
                        <TableHead className="whitespace-nowrap">标的仓储</TableHead>
                        <TableHead className="whitespace-nowrap">面积</TableHead>
                        <TableHead className="whitespace-nowrap">承租方</TableHead>
                        <TableHead className="whitespace-nowrap">出租方</TableHead>
                        <TableHead className="whitespace-nowrap">成交金额(元)</TableHead>
                        <TableHead className="whitespace-nowrap">租期</TableHead>
                        <TableHead className="whitespace-nowrap">状态</TableHead>
                        <TableHead className="whitespace-nowrap text-center sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {warehouseOrders.map((order, idx) => (
                        <TableRow key={order.id}>
                          <TableCell className="text-center text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-mono text-xs whitespace-nowrap">{order.id}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.title}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.area}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{order.tenant}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{order.landlord}</TableCell>
                          <TableCell className="text-primary font-medium whitespace-nowrap">{order.amount}</TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{order.period}</TableCell>
                          <TableCell className="whitespace-nowrap">{getMainStatusBadge(order.status)}</TableCell>
                          <TableCell className="whitespace-nowrap sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                            {renderRowActions(toWarehousePaymentOrder(order), "warehouse", order.subStatus)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </table>
                </div>
              </CardContent>
            </TabsContent>

            {/* 物资存放订单 */}
            <TabsContent value="storage" className="mt-4 min-w-0">
              <CardTitle className="text-base mb-3 flex items-center gap-2 text-muted-foreground font-normal">
                <ClipboardCheck className="w-4 h-4 text-purple-700" />
                <span>订单列表</span>
                <span className="text-xs">共 {materialStorageOrders.length} 条</span>
              </CardTitle>
              <CardContent className="px-0 py-0">
                <div className="w-full overflow-x-auto border rounded-md">
                  <table className="w-full caption-bottom text-sm" style={{ minWidth: "1760px" }}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[56px] text-center whitespace-nowrap">序号</TableHead>
                        <TableHead className="whitespace-nowrap">订单号</TableHead>
                        <TableHead className="whitespace-nowrap">物资名称</TableHead>
                        <TableHead className="whitespace-nowrap">物资类型</TableHead>
                        <TableHead className="whitespace-nowrap">数量</TableHead>
                        <TableHead className="whitespace-nowrap">物权单位</TableHead>
                        <TableHead className="whitespace-nowrap">存放站点</TableHead>
                        <TableHead className="whitespace-nowrap">占用面积</TableHead>
                        <TableHead className="whitespace-nowrap">入库时间</TableHead>
                        <TableHead className="whitespace-nowrap">保管费</TableHead>
                        <TableHead className="whitespace-nowrap">状态</TableHead>
                        <TableHead className="whitespace-nowrap text-center sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materialStorageOrders.map((order, idx) => (
                        <TableRow key={order.id}>
                          <TableCell className="text-center text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-mono text-xs whitespace-nowrap">{order.id}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.title}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.materialType}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.quantity}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{order.owner}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{order.site}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.occupiedArea}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{order.inDate}</TableCell>
                          <TableCell className="text-primary font-medium whitespace-nowrap">{order.storageFee}</TableCell>
                          <TableCell className="whitespace-nowrap">{getMainStatusBadge(order.status)}</TableCell>
                          <TableCell className="whitespace-nowrap sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                            {renderRowActions(toStoragePaymentOrder(order), "storage", order.subStatus)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </table>
                </div>
              </CardContent>
            </TabsContent>

            {/* 物资交易订单 */}
            <TabsContent value="trade" className="mt-4 min-w-0">
              {/* 内部子标签：租赁 / 销售 */}
              <div className="inline-flex items-center gap-1 mb-3 p-1 bg-muted/60 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTradeSubTab("rent")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    tradeSubTab === "rent"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  租赁订单
                  <span
                    className={`tabular-nums text-[10px] rounded px-1.5 py-0.5 ${
                      tradeSubTab === "rent"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {materialTradeOrders.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTradeSubTab("sale")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    tradeSubTab === "sale"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Tags className="w-3.5 h-3.5" />
                  销售订单
                  <span
                    className={`tabular-nums text-[10px] rounded px-1.5 py-0.5 ${
                      tradeSubTab === "sale"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {saleOrders.length}
                  </span>
                </button>
              </div>

              {tradeSubTab === "rent" ? (
                <>
                  <CardTitle className="text-base mb-3 flex items-center gap-2 text-muted-foreground font-normal">
                    <ClipboardCheck className="w-4 h-4 text-accent" />
                    <span>租赁订单列表</span>
                    <span className="text-xs">
                      共 {materialTradeOrders.length} 条
                    </span>
                  </CardTitle>
                  <CardContent className="px-0 py-0">
                    <div className="w-full overflow-x-auto border rounded-md">
                      <table
                        className="w-full caption-bottom text-sm"
                        style={{ minWidth: "1860px" }}
                      >
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[56px] text-center whitespace-nowrap">
                              序号
                            </TableHead>
                            <TableHead className="whitespace-nowrap">订单号</TableHead>
                            <TableHead className="whitespace-nowrap">物资名称</TableHead>
                            <TableHead className="whitespace-nowrap">数量</TableHead>
                            <TableHead className="whitespace-nowrap">交易方式</TableHead>
                            <TableHead className="whitespace-nowrap">出租方</TableHead>
                            <TableHead className="whitespace-nowrap">承租方</TableHead>
                            <TableHead className="whitespace-nowrap">租金单价</TableHead>
                            <TableHead className="whitespace-nowrap">成交金额(元)</TableHead>
                            <TableHead className="whitespace-nowrap">租期</TableHead>
                            <TableHead className="whitespace-nowrap">状态</TableHead>
                            <TableHead className="whitespace-nowrap text-center sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                              操作
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {materialTradeOrders.map((order, idx) => (
                            <TableRow key={order.id}>
                              <TableCell className="text-center text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                                {idx + 1}
                              </TableCell>
                              <TableCell className="font-mono text-xs whitespace-nowrap">{order.id}</TableCell>
                              <TableCell className="whitespace-nowrap">{order.title}</TableCell>
                              <TableCell className="whitespace-nowrap">{order.quantity}</TableCell>
                              <TableCell className="whitespace-nowrap">{getTradeTypeBadge(order.tradeType)}</TableCell>
                              <TableCell className="text-muted-foreground whitespace-nowrap">{order.provider}</TableCell>
                              <TableCell className="text-muted-foreground whitespace-nowrap">{order.user}</TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{order.unitPrice}</TableCell>
                              <TableCell className="text-primary font-medium whitespace-nowrap">{order.amount}</TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{order.period}</TableCell>
                              <TableCell className="whitespace-nowrap">{getMainStatusBadge(order.status)}</TableCell>
                              <TableCell className="whitespace-nowrap sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                                {renderRowActions(toTradePaymentOrder(order), "trade", order.subStatus)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </table>
                    </div>
                  </CardContent>
                </>
              ) : (
                <SaleOrdersTable orders={saleOrders} />
              )}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* 订单支付弹窗 */}
      <OrderPaymentDialog
        open={payDialog.open}
        onOpenChange={(o) => setPayDialog((d) => ({ ...d, open: o }))}
        order={payDialog.order}
        orderType={payDialog.orderType}
        defaultTab={payDialog.defaultTab}
        record={payDialog.order ? paymentRecords[payDialog.order.id] ?? {} : {}}
        onPay={handlePay}
      />

      {/* 续租弹窗 */}
      <OrderRenewalDialog
        open={renewalDialog.open}
        onOpenChange={(o) => setRenewalDialog((d) => ({ ...d, open: o }))}
        order={renewalDialog.order}
        orderType={renewalDialog.orderType}
        originalEndDate={renewalDialog.originalEndDate}
        onConfirm={handleRenewalConfirm}
      />

      {/* 退还押金/保证金弹窗 */}
      <OrderRefundDialog
        open={refundDialog.open}
        onOpenChange={(o) => setRefundDialog((d) => ({ ...d, open: o }))}
        order={refundDialog.order}
        orderType={refundDialog.orderType}
        onConfirm={handleRefundConfirm}
      />

      {/* 合同签署弹窗 */}
      <OrderContractDialog
        open={contractDialog.open}
        onOpenChange={(o) => setContractDialog((d) => ({ ...d, open: o }))}
        order={contractDialog.order}
        orderType={contractDialog.orderType}
        onConfirm={handleContractConfirm}
      />

      {/* 确认合同弹窗 */}
      <OrderContractConfirmDialog
        open={confirmContractDialog.open}
        onOpenChange={(o) => setConfirmContractDialog((d) => ({ ...d, open: o }))}
        order={confirmContractDialog.order}
        orderType={confirmContractDialog.orderType}
        onConfirm={handleContractConfirmAccept}
      />
    </div>
  )
}

// 销售订单表
function SaleOrdersTable({ orders }: { orders: SaleOrder[] }) {
  return (
    <>
      <CardTitle className="text-base mb-3 flex items-center gap-2 text-muted-foreground font-normal">
        <Tags className="w-4 h-4 text-amber-700" />
        <span>销售订单列表</span>
        <span className="text-xs">共 {orders.length} 条</span>
        <Badge
          variant="outline"
          className="ml-2 border-amber-200 text-amber-700 bg-amber-50 text-[10px] h-5"
        >
          <HandCoins className="w-3 h-3 mr-1" />
          专运代销
        </Badge>
      </CardTitle>
      <CardContent className="px-0 py-0">
        <div className="w-full overflow-x-auto border rounded-md">
          <table
            className="w-full caption-bottom text-sm"
            style={{ minWidth: "2000px" }}
          >
            <TableHeader>
              <TableRow>
                <TableHead className="w-[56px] text-center whitespace-nowrap">
                  序号
                </TableHead>
                <TableHead className="whitespace-nowrap">订单号</TableHead>
                <TableHead className="whitespace-nowrap">物资名称</TableHead>
                <TableHead className="whitespace-nowrap">数量</TableHead>
                <TableHead className="whitespace-nowrap">销售模式</TableHead>
                <TableHead className="whitespace-nowrap">物权单位</TableHead>
                <TableHead className="whitespace-nowrap">买方</TableHead>
                <TableHead className="whitespace-nowrap">销售单价</TableHead>
                <TableHead className="whitespace-nowrap">销售总额(元)</TableHead>
                <TableHead className="whitespace-nowrap">
                  分成 (专运:物权)
                </TableHead>
                <TableHead className="whitespace-nowrap">付款</TableHead>
                <TableHead className="whitespace-nowrap">业务节点</TableHead>
                <TableHead className="whitespace-nowrap">主状态</TableHead>
                <TableHead className="whitespace-nowrap text-center sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o, idx) => {
                const totalNumber = Number(o.amount.replace(/,/g, ""))
                const transportAmount = Math.round(
                  (totalNumber * o.transportShare) / 100,
                )
                const propertyAmount = totalNumber - transportAmount
                const [tShare, pShare] = o.shareRatio
                  .split(":")
                  .map((s) => s.trim())
                return (
                  <TableRow key={o.id}>
                    <TableCell className="text-center text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {o.id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{o.title}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {o.quantity}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={
                          o.saleMode === "整批"
                            ? "border-primary/40 text-primary"
                            : "border-accent/40 text-accent"
                        }
                      >
                        {o.saleMode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {o.propertyOwner}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {o.buyer}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {o.unitPrice}
                    </TableCell>
                    <TableCell className="text-primary font-medium whitespace-nowrap tabular-nums">
                      <div className="flex flex-col leading-tight">
                        <span>{o.amount}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          专运 ¥{transportAmount.toLocaleString("zh-CN")} ·
                          物权 ¥{propertyAmount.toLocaleString("zh-CN")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs tabular-nums">
                        <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 font-medium">
                          {tShare}
                        </span>
                        <span className="text-muted-foreground">:</span>
                        <span className="rounded bg-orange-100 text-orange-700 px-1.5 py-0.5 font-medium">
                          {pShare}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {getPaymentBadge(o.paymentStatus)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={SALE_SUB_BADGES[o.subStatus]}
                      >
                        {o.subStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {getSaleStatusBadge(o.status)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center justify-center gap-0.5">
                        {o.subStatus === "待签署合同" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 font-medium ${ACTION_CLS.contract}`}
                          >
                            签署合同
                          </Button>
                        )}
                        {o.subStatus === "待确认合同" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 font-medium ${ACTION_CLS.contract}`}
                          >
                            确认合同
                          </Button>
                        )}
                        {o.subStatus === "待支付货款" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 font-medium ${ACTION_CLS.pay}`}
                          >
                            收款核对
                          </Button>
                        )}
                        {o.subStatus === "待发货" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 font-medium text-purple-700 hover:bg-purple-50"
                          >
                            发起出库
                          </Button>
                        )}
                        {o.subStatus === "运输中" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 font-medium text-sky-700 hover:bg-sky-50"
                          >
                            物流跟踪
                          </Button>
                        )}
                        {o.subStatus === "已交付" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 font-medium text-emerald-700 hover:bg-emerald-50"
                          >
                            发起分成
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-muted-foreground hover:text-foreground"
                        >
                          查看
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </table>
        </div>
      </CardContent>
    </>
  )
}

// 统计卡组件
function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  valueSize = "2xl",
}: {
  label: string
  value: string
  icon: typeof Warehouse
  iconBg: string
  iconColor: string
  valueSize?: "xl" | "2xl"
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div
              className={`${
                valueSize === "xl" ? "text-xl" : "text-2xl"
              } font-bold text-foreground tabular-nums truncate`}
            >
              {value}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
