"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Package,
  Search,
  Download,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react"

interface MaterialOrderManagementProps {
  subTab: string
  roleType: "transport" | "user"
}

// 物料出租订单
const mockMaterialRentOrders = [
  {
    id: "WZCZ-2026-001",
    materialName: "钢轨 60kg/m",
    materialSpec: "60kg/m × 12.5m",
    quantity: 100,
    unit: "根",
    lessee: "中铁十一局广深城际项目部",
    rentPrice: 50,
    totalAmount: 150000,
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    status: "履约中",
    paymentStatus: "已付款",
  },
  {
    id: "WZCZ-2026-002",
    materialName: "道岔",
    materialSpec: "60kg/m-1/12",
    quantity: 5,
    unit: "组",
    lessee: "中铁十四局深圳地铁13号线项目部",
    rentPrice: 5000,
    totalAmount: 150000,
    startDate: "2026-04-01",
    endDate: "2026-09-30",
    status: "待生效",
    paymentStatus: "待付款",
  },
  {
    id: "WZCZ-2026-003",
    materialName: "扣件系统",
    materialSpec: "WJ-7型",
    quantity: 2000,
    unit: "套",
    lessee: "中铁二十二局莞惠城际项目部",
    rentPrice: 5,
    totalAmount: 60000,
    startDate: "2026-02-01",
    endDate: "2026-05-31",
    status: "即将到期",
    paymentStatus: "已付款",
  },
  {
    id: "WZCZ-2025-004",
    materialName: "轨枕",
    materialSpec: "III型混凝土轨枕",
    quantity: 500,
    unit: "根",
    lessee: "中铁二十局广佛环线项目部",
    rentPrice: 20,
    totalAmount: 60000,
    startDate: "2025-10-01",
    endDate: "2026-03-31",
    status: "已完成",
    paymentStatus: "已结清",
  },
]

// 物料承租订单（使用单位视角）
const mockMaterialLeaseOrders = [
  {
    id: "WCCZ-2026-001",
    materialName: "钢轨 60kg/m",
    materialSpec: "60kg/m × 12.5m",
    quantity: 100,
    unit: "根",
    lessor: "中铁十四局集团广州分公司",
    rentPrice: 50,
    totalAmount: 150000,
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    status: "履约中",
    paymentStatus: "已付款",
  },
  {
    id: "WCCZ-2026-002",
    materialName: "道岔",
    materialSpec: "60kg/m-1/12",
    quantity: 3,
    unit: "组",
    lessor: "中铁建物料华南专业运营有限公司",
    rentPrice: 5000,
    totalAmount: 90000,
    startDate: "2026-04-15",
    endDate: "2026-10-14",
    status: "待生效",
    paymentStatus: "待付款",
  },
  {
    id: "WCCZ-2026-003",
    materialName: "轨道检测设备",
    materialSpec: "GTC-80型",
    quantity: 2,
    unit: "台",
    lessor: "中铁十六局集团华南分公司",
    rentPrice: 8000,
    totalAmount: 96000,
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    status: "履约中",
    paymentStatus: "部分付款",
  },
]

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof CheckCircle }> = {
  "履约中": { label: "履约中", variant: "default", icon: CheckCircle },
  "待生效": { label: "待生效", variant: "secondary", icon: Clock },
  "即将到期": { label: "即将到期", variant: "destructive", icon: AlertCircle },
  "已完成": { label: "已完成", variant: "outline", icon: CheckCircle },
  "已取消": { label: "已取消", variant: "outline", icon: AlertCircle },
}

const paymentStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  "已付款": { label: "已付款", variant: "default" },
  "待付款": { label: "待付款", variant: "destructive" },
  "部分付款": { label: "部分付款", variant: "secondary" },
  "已结清": { label: "已结清", variant: "outline" },
}

export function MaterialOrderManagement({ subTab, roleType }: MaterialOrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const isRentView = subTab.includes("rent") || roleType === "transport"
  const orders = isRentView ? mockMaterialRentOrders : mockMaterialLeaseOrders

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeOrders = orders.filter(o => o.status === "履约中").length
  const pendingOrders = orders.filter(o => o.status === "待生效").length
  const expiringOrders = orders.filter(o => o.status === "即将到期").length
  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">订单总数</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">履约中</p>
                <p className="text-2xl font-bold">{activeOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">待生效</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">合同总额</p>
                <p className="text-2xl font-bold">{(totalAmount / 10000).toFixed(1)}万</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 订单列表 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {isRentView ? "物料出租订单列表" : "物料承租订单列表"}
              </CardTitle>
              <CardDescription>
                {isRentView ? "管理托管物料的出租业务订单" : "管理承租的物料订单"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索物料名称或订单号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="订单状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="履约中">履约中</SelectItem>
                <SelectItem value="待生效">待生效</SelectItem>
                <SelectItem value="即将到期">即将到期</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">序号</TableHead>
                  <TableHead className="w-[140px]">订单编号</TableHead>
                  <TableHead>物料名称</TableHead>
                  <TableHead>规格型号</TableHead>
                  <TableHead className="text-right">数量</TableHead>
                  <TableHead>{isRentView ? "承租方" : "出租方"}</TableHead>
                  <TableHead className="text-right">租金(元/月)</TableHead>
                  <TableHead>租赁期限</TableHead>
                  <TableHead>订单状态</TableHead>
                  <TableHead>付款状态</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, idx) => {
                  const statusInfo = statusConfig[order.status]
                  const StatusIcon = statusInfo?.icon || Clock
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.materialName}</TableCell>
                      <TableCell className="text-muted-foreground">{order.materialSpec}</TableCell>
                      <TableCell className="text-right">
                        {order.quantity} {order.unit}
                      </TableCell>
                      <TableCell>
                        {"lessee" in order ? order.lessee : order.lessor}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {order.rentPrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {order.startDate} 至 {order.endDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo?.variant || "default"} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentStatusConfig[order.paymentStatus]?.variant || "default"}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
