"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Warehouse,
  Package,
  Search,
  Download,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Plus,
} from "lucide-react"

interface WarehouseOrderManagementProps {
  subTab: string
  roleType: "warehouse-unit" | "warehouse-site" | "transport"
}

// 仓储出租订单
const mockWarehouseRentOrders = [
  {
    id: "CCZL-2026-001",
    warehouseName: "中铁建广州南沙仓储基地A区",
    lessee: "中铁十一局广深城际项目部",
    lesseeType: "物权单位",
    area: 500,
    unitPrice: 25,
    totalAmount: 75000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "履约中",
    paymentStatus: "已收款",
    rentType: "整租",
  },
  {
    id: "CCZL-2026-002",
    warehouseName: "中铁建广州南沙仓储基地B区",
    lessee: "中铁十四局深圳地铁13号线项目部",
    lesseeType: "物权单位",
    area: 300,
    unitPrice: 28,
    totalAmount: 50400,
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    status: "履约中",
    paymentStatus: "部分收款",
    rentType: "分区租",
  },
  {
    id: "CCZL-2026-003",
    warehouseName: "中铁建广州南沙仓储基地C区",
    lessee: "中铁二十二局莞惠城际项目部",
    lesseeType: "物权单位",
    area: 200,
    unitPrice: 22,
    totalAmount: 26400,
    startDate: "2026-04-15",
    endDate: "2026-10-14",
    status: "待生效",
    paymentStatus: "待收款",
    rentType: "短期租",
  },
  {
    id: "CCZL-2025-004",
    warehouseName: "中铁建广州南沙仓储基地D区",
    lessee: "中铁二十局广佛环线项目部",
    lesseeType: "物权单位",
    area: 400,
    unitPrice: 24,
    totalAmount: 57600,
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    status: "即将到期",
    paymentStatus: "已收款",
    rentType: "整租",
  },
]

// 物资存储订单
const mockMaterialStorageOrders = [
  {
    id: "WZCF-2026-001",
    materialName: "钢轨 60kg/m",
    quantity: 200,
    unit: "根",
    owner: "中铁十一局广深城际项目部",
    storageLocation: "A区-01库房",
    storagePrice: 5,
    totalAmount: 6000,
    entryDate: "2026-01-15",
    status: "存放中",
    paymentStatus: "已收款",
  },
  {
    id: "WZCF-2026-002",
    materialName: "道岔",
    quantity: 10,
    unit: "组",
    owner: "中铁十四局深圳地铁13号线项目部",
    storageLocation: "B区-03库房",
    storagePrice: 200,
    totalAmount: 12000,
    entryDate: "2026-02-20",
    status: "存放中",
    paymentStatus: "待收款",
  },
  {
    id: "WZCF-2026-003",
    materialName: "扣件系统",
    quantity: 5000,
    unit: "套",
    owner: "中铁二十二局莞惠城际项目部",
    storageLocation: "C区-02库房",
    storagePrice: 0.5,
    totalAmount: 15000,
    entryDate: "2026-03-10",
    status: "待入库",
    paymentStatus: "待收款",
  },
]

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof CheckCircle }> = {
  "履约中": { label: "履约中", variant: "default", icon: CheckCircle },
  "存放中": { label: "存放中", variant: "default", icon: CheckCircle },
  "待生效": { label: "待生效", variant: "secondary", icon: Clock },
  "待入库": { label: "待入库", variant: "secondary", icon: Clock },
  "即将到期": { label: "即将到期", variant: "destructive", icon: AlertCircle },
  "已完成": { label: "已完成", variant: "outline", icon: CheckCircle },
  "已出库": { label: "已出库", variant: "outline", icon: CheckCircle },
}

const paymentStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  "已收款": { label: "已收款", variant: "default" },
  "待收款": { label: "待收款", variant: "destructive" },
  "部分收款": { label: "部分收款", variant: "secondary" },
}

export function WarehouseOrderManagement({ subTab, roleType }: WarehouseOrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState(subTab || "warehouse-rent")

  const isWarehouseView = activeTab === "warehouse-rent"

  const getRoleTitle = () => {
    switch (roleType) {
      case "warehouse-unit":
        return "仓储单位"
      case "warehouse-site":
        return "仓储站点"
      case "transport":
        return "专运单位"
      default:
        return ""
    }
  }

  // 统计数据
  const activeRentOrders = mockWarehouseRentOrders.filter(o => o.status === "履约中").length
  const expiringOrders = mockWarehouseRentOrders.filter(o => o.status === "即将到期").length
  const totalRentIncome = mockWarehouseRentOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalStorageIncome = mockMaterialStorageOrders.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Warehouse className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">出租订单</p>
                <p className="text-2xl font-bold">{mockWarehouseRentOrders.length}</p>
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
                <p className="text-2xl font-bold">{activeRentOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">即将到期</p>
                <p className="text-2xl font-bold">{expiringOrders}</p>
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
                <p className="text-sm text-muted-foreground">本月收入</p>
                <p className="text-2xl font-bold">{((totalRentIncome + totalStorageIncome) / 10000).toFixed(1)}万</p>
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
              <CardTitle className="text-lg">订单管理</CardTitle>
              <CardDescription>管理仓储出租和物资存储订单</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                导出
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                新建订单
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="warehouse-rent" className="gap-2">
                <Warehouse className="h-4 w-4" />
                仓储出租状态列表
              </TabsTrigger>
              <TabsTrigger value="material-storage" className="gap-2">
                <Package className="h-4 w-4" />
                物资存储订单列表
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单..."
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

          {isWarehouseView ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] text-center">序号</TableHead>
                    <TableHead className="w-[130px]">订单编号</TableHead>
                    <TableHead>仓库名称</TableHead>
                    <TableHead>承租方</TableHead>
                    <TableHead>租赁类型</TableHead>
                    <TableHead className="text-right">面积(m²)</TableHead>
                    <TableHead className="text-right">单价</TableHead>
                    <TableHead>租赁期限</TableHead>
                    <TableHead>订单状态</TableHead>
                    <TableHead>收款状态</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWarehouseRentOrders.map((order, idx) => {
                    const statusInfo = statusConfig[order.status]
                    const StatusIcon = statusInfo?.icon || Clock
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.warehouseName}</TableCell>
                        <TableCell className="text-muted-foreground">{order.lessee}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.rentType}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{order.area}</TableCell>
                        <TableCell className="text-right">{order.unitPrice}元/m²/月</TableCell>
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
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] text-center">序号</TableHead>
                    <TableHead className="w-[130px]">订单编号</TableHead>
                    <TableHead>物资名称</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead>物权单位</TableHead>
                    <TableHead>存放位置</TableHead>
                    <TableHead className="text-right">存放费(元/月)</TableHead>
                    <TableHead>入库日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>收款状态</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMaterialStorageOrders.map((order, idx) => {
                    const statusInfo = statusConfig[order.status]
                    const StatusIcon = statusInfo?.icon || Clock
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.materialName}</TableCell>
                        <TableCell className="text-right">
                          {order.quantity} {order.unit}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{order.owner}</TableCell>
                        <TableCell className="text-muted-foreground">{order.storageLocation}</TableCell>
                        <TableCell className="text-right">{order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{order.entryDate}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
