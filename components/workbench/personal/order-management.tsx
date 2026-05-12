"use client"

import { useState } from "react"
import {
  Search,
  FileDown,
  Printer,
  Warehouse,
  PackageOpen,
  Package,
  TrendingUp,
  CircleDollarSign,
  ClipboardCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    materialType: "钢材",
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
    materialType: "钢材",
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
    materialType: "机械设备",
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
    materialType: "钢材",
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
    materialType: "机械设备",
    quantity: "86 件",
    owner: "中铁二十局集团华南分公司",
    site: "中铁十六局佛山顺德钢构��储基地",
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
    materialType: "钢材",
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
    materialType: "钢材",
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
    materialType: "配件",
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
    materialType: "轨道材料",
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
    materialType: "钢材",
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
    materialType: "钢材",
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
    materialType: "钢材",
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
    materialType: "机械设备",
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
    materialType: "配件",
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
    materialType: "轨道材料",
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
    materialType: "机械设备",
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
    materialType: "钢材",
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
    materialType: "轨道材料",
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

// 根据子状态返回主操作按钮配色
const getPrimaryAction = (
  subStatus: RentSubStatus | StorageSubStatus,
): { label: string; className: string } | null => {
  const contractCls = "text-orange-700 hover:text-orange-800 hover:bg-orange-50"
  const payCls = "text-amber-700 hover:text-amber-800 hover:bg-amber-50"
  const renewCls = "text-sky-700 hover:text-sky-800 hover:bg-sky-50"
  const refundCls = "text-rose-700 hover:text-rose-800 hover:bg-rose-50"
  switch (subStatus) {
    case "待确认合同":
      return { label: "确认合同", className: contractCls }
    case "待签署合同":
      return { label: "签署合同", className: contractCls }
    case "待支付押金":
    case "待支付保证金":
    case "待支付服务费":
    case "待支付租金":
    case "待支付保管费":
      return { label: subStatus.replace("待", ""), className: payCls }
    case "待续租":
      return { label: "续租", className: renewCls }
    case "待退还押金":
      return { label: "退还押金", className: refundCls }
    case "待退还保证金":
      return { label: "退还保证金", className: refundCls }
    case "在租履约":
    case "保管履约":
    case "已完成":
      return null
    default:
      return null
  }
}

// 操作按钮组渲染（全部以文字呈现）
const renderActions = (subStatus: RentSubStatus | StorageSubStatus) => {
  const primary = getPrimaryAction(subStatus)
  return (
    <div className="flex items-center justify-end gap-0.5">
      {primary && (
        <Button variant="ghost" size="sm" className={`h-8 px-2 font-medium ${primary.className}`}>
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
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-muted-foreground hover:text-foreground"
      >
        合同
      </Button>
    </div>
  )
}

export function OrderManagement() {
  const [activeTab, setActiveTab] = useState("warehouse")

  const warehouseTotal = warehouseOrders.reduce(
    (sum, o) => sum + Number(o.amount.replace(/,/g, "")),
    0,
  )
  const materialTradeTotal = materialTradeOrders.reduce(
    (sum, o) => sum + Number(o.amount.replace(/,/g, "")),
    0,
  )
  const monthTotalAmount = (warehouseTotal + materialTradeTotal).toLocaleString("zh-CN")

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">订单管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理已成交并形成订单的仓储交易、物资存放与物资交易记录，跟踪履约状态与结算进度
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            导出订单
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            打印汇总
          </Button>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Warehouse className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground mb-1">仓储交易订单</div>
                <div className="text-2xl font-bold text-foreground">{warehouseOrders.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <PackageOpen className="w-6 h-6 text-purple-700" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground mb-1">物资存放订单</div>
                <div className="text-2xl font-bold text-foreground">{materialStorageOrders.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground mb-1">物资交易订单</div>
                <div className="text-2xl font-bold text-foreground">{materialTradeOrders.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <CircleDollarSign className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground mb-1">本月成交金额（元）</div>
                <div className="text-xl font-bold text-foreground">{monthTotalAmount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 订单列表 */}
      <Card className="w-full min-w-0 overflow-hidden">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <TabsList>
                <TabsTrigger value="warehouse">
                  <Warehouse className="w-4 h-4 mr-2" />
                  仓储交易订单
                </TabsTrigger>
                <TabsTrigger value="storage">
                  <PackageOpen className="w-4 h-4 mr-2" />
                  物资存放订单
                </TabsTrigger>
                <TabsTrigger value="trade">
                  <Package className="w-4 h-4 mr-2" />
                  物资交易订单
                </TabsTrigger>
              </TabsList>

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
              <CardTitle className="text-base mb-3 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-primary" />
                仓储交易订单
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  共 {warehouseOrders.length} 条
                </span>
              </CardTitle>
              <CardContent className="px-0 py-0">
                <div className="w-full overflow-x-auto border rounded-md">
                  <table className="w-full caption-bottom text-sm" style={{ minWidth: "1500px" }}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">订单号</TableHead>
                        <TableHead className="whitespace-nowrap">标的仓储</TableHead>
                        <TableHead className="whitespace-nowrap">面积</TableHead>
                        <TableHead className="whitespace-nowrap">承租方</TableHead>
                        <TableHead className="whitespace-nowrap">出租方</TableHead>
                        <TableHead className="whitespace-nowrap">成交金额(元)</TableHead>
                        <TableHead className="whitespace-nowrap">租期</TableHead>
                        <TableHead className="whitespace-nowrap">状态</TableHead>
                        <TableHead className="whitespace-nowrap text-right sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {warehouseOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs whitespace-nowrap">{order.id}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.title}</TableCell>
                          <TableCell className="whitespace-nowrap">{order.area}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{order.tenant}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{order.landlord}</TableCell>
                          <TableCell className="text-primary font-medium whitespace-nowrap">{order.amount}</TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{order.period}</TableCell>
                          <TableCell className="whitespace-nowrap">{getMainStatusBadge(order.status)}</TableCell>
                          <TableCell className="whitespace-nowrap sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                            {renderActions(order.subStatus)}
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
              <CardTitle className="text-base mb-3 flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-purple-700" />
                物资存放订单
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  共 {materialStorageOrders.length} 条
                </span>
              </CardTitle>
              <CardContent className="px-0 py-0">
                <div className="w-full overflow-x-auto border rounded-md">
                  <table className="w-full caption-bottom text-sm" style={{ minWidth: "1700px" }}>
                    <TableHeader>
                      <TableRow>
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
                        <TableHead className="whitespace-nowrap text-right sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materialStorageOrders.map((order) => (
                        <TableRow key={order.id}>
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
                            {renderActions(order.subStatus)}
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
              <CardTitle className="text-base mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                物资交易订单
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  共 {materialTradeOrders.length} 条
                </span>
              </CardTitle>
              <CardContent className="px-0 py-0">
                <div className="w-full overflow-x-auto border rounded-md">
                  <table className="w-full caption-bottom text-sm" style={{ minWidth: "1800px" }}>
                    <TableHeader>
                      <TableRow>
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
                        <TableHead className="whitespace-nowrap text-right sticky right-0 bg-card shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materialTradeOrders.map((order) => (
                        <TableRow key={order.id}>
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
                            {renderActions(order.subStatus)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </table>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  )
}
