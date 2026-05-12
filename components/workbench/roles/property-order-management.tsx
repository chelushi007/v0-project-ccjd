"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

interface PropertyOrderManagementProps {
  subTab: string
}

// 仓储承租订单
const mockWarehouseLeaseOrders = [
  {
    id: "CCCZ-2026-001",
    warehouseName: "中铁建广州南沙仓储基地A区",
    warehouseOwner: "中铁建物资华南仓储有限公司",
    area: 500,
    unitPrice: 25,
    totalAmount: 75000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "履约中",
    paymentStatus: "已付款",
  },
  {
    id: "CCCZ-2026-002",
    warehouseName: "中铁建深圳前海仓储基地B区",
    warehouseOwner: "中铁建物资华南专业运营有限公司",
    area: 300,
    unitPrice: 30,
    totalAmount: 54000,
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    status: "履约中",
    paymentStatus: "部分付款",
  },
  {
    id: "CCCZ-2026-003",
    warehouseName: "中铁建东莞虎门仓储基地C区",
    warehouseOwner: "中铁十四局集团广州分公司",
    area: 200,
    unitPrice: 20,
    totalAmount: 24000,
    startDate: "2026-04-15",
    endDate: "2026-10-14",
    status: "待生效",
    paymentStatus: "待付款",
  },
]

// 物资存储订单
const mockMaterialStorageOrders = [
  {
    id: "WCCF-2026-001",
    materialName: "钢轨 60kg/m",
    quantity: 200,
    unit: "根",
    storageLocation: "中铁建广州南沙仓储基地A区",
    storageOwner: "中铁建物资华南仓储有限公司",
    storagePrice: 5,
    totalAmount: 6000,
    entryDate: "2026-01-15",
    status: "存放中",
    paymentStatus: "已付款",
  },
  {
    id: "WCCF-2026-002",
    materialName: "道岔",
    quantity: 10,
    unit: "组",
    storageLocation: "中铁建深圳前海仓储基地B区",
    storageOwner: "中铁建物资华南专业运营有限公司",
    storagePrice: 200,
    totalAmount: 12000,
    entryDate: "2026-02-20",
    status: "存放中",
    paymentStatus: "待付款",
  },
  {
    id: "WCCF-2026-003",
    materialName: "扣件系统",
    quantity: 5000,
    unit: "套",
    storageLocation: "中铁建东莞虎门仓储基地C区",
    storageOwner: "中铁十四局集团广州分公司",
    storagePrice: 0.5,
    totalAmount: 15000,
    entryDate: "2026-03-10",
    status: "待入库",
    paymentStatus: "待付款",
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
  "已付款": { label: "已付款", variant: "default" },
  "待付款": { label: "待付款", variant: "destructive" },
  "部分付款": { label: "部分付款", variant: "secondary" },
}

export function PropertyOrderManagement({ subTab }: PropertyOrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState(subTab || "warehouse-lease")

  const isWarehouseView = activeTab === "warehouse-lease"
  const orders = isWarehouseView ? mockWarehouseLeaseOrders : mockMaterialStorageOrders

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
                <p className="text-sm text-muted-foreground">承租仓库</p>
                <p className="text-2xl font-bold">{mockWarehouseLeaseOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">存储订单</p>
                <p className="text-2xl font-bold">{mockMaterialStorageOrders.length}</p>
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
                <p className="text-2xl font-bold">
                  {mockWarehouseLeaseOrders.filter(o => o.status === "履约中").length +
                    mockMaterialStorageOrders.filter(o => o.status === "存放中").length}
                </p>
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
                <p className="text-sm text-muted-foreground">本月支出</p>
                <p className="text-2xl font-bold">18.6万</p>
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
              <CardDescription>管理仓储承租和物资存储订单</CardDescription>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="warehouse-lease" className="gap-2">
                <Warehouse className="h-4 w-4" />
                仓储承租状态列表
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
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isWarehouseView ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[130px]">订单编号</TableHead>
                    <TableHead>仓库名称</TableHead>
                    <TableHead>出租方</TableHead>
                    <TableHead className="text-right">面积(m²)</TableHead>
                    <TableHead className="text-right">单价(元/m²/月)</TableHead>
                    <TableHead>租赁期限</TableHead>
                    <TableHead>订单状态</TableHead>
                    <TableHead>付款状态</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWarehouseLeaseOrders.map((order) => {
                    const statusInfo = statusConfig[order.status]
                    const StatusIcon = statusInfo?.icon || Clock
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.warehouseName}</TableCell>
                        <TableCell className="text-muted-foreground">{order.warehouseOwner}</TableCell>
                        <TableCell className="text-right">{order.area}</TableCell>
                        <TableCell className="text-right">{order.unitPrice}</TableCell>
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
                    <TableHead className="w-[130px]">订单编号</TableHead>
                    <TableHead>物资名称</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead>存放位置</TableHead>
                    <TableHead>仓储方</TableHead>
                    <TableHead className="text-right">存放费(元/月)</TableHead>
                    <TableHead>入库日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>付款状态</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMaterialStorageOrders.map((order) => {
                    const statusInfo = statusConfig[order.status]
                    const StatusIcon = statusInfo?.icon || Clock
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.materialName}</TableCell>
                        <TableCell className="text-right">
                          {order.quantity} {order.unit}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{order.storageLocation}</TableCell>
                        <TableCell className="text-muted-foreground">{order.storageOwner}</TableCell>
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
