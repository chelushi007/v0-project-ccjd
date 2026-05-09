"use client"

import { useState } from "react"
import {
  ShoppingCart,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Building2,
  Package,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 订单数据
const orderData = [
  {
    id: "ORD20240120001",
    type: "租赁订单",
    warehouse: "广州番禺仓储中心",
    customer: "中铁建工集团有限公司",
    area: 2000,
    amount: 70000,
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    status: "active",
    createTime: "2024-01-20 10:30:25",
  },
  {
    id: "ORD20240118002",
    type: "托管订单",
    warehouse: "深圳龙岗物流基地",
    customer: "中铁物资北京有限公司",
    area: 3500,
    amount: 157500,
    startDate: "2024-01-25",
    endDate: "2024-12-31",
    status: "pending",
    createTime: "2024-01-18 14:20:15",
  },
  {
    id: "ORD20240115003",
    type: "租赁订单",
    warehouse: "惠州大亚湾仓储中心",
    customer: "中铁隧道集团有限公司",
    area: 5000,
    amount: 160000,
    startDate: "2024-01-20",
    endDate: "2024-06-30",
    status: "active",
    createTime: "2024-01-15 09:15:30",
  },
  {
    id: "ORD20240110004",
    type: "存放订单",
    warehouse: "佛山南海冷链仓库",
    customer: "中铁电气化局集团",
    area: 800,
    amount: 52000,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    status: "completed",
    createTime: "2024-01-10 16:45:00",
  },
  {
    id: "ORD20240105005",
    type: "租赁订单",
    warehouse: "东莞塘厦仓储站",
    customer: "中铁大桥局集团",
    area: 1500,
    amount: 42000,
    startDate: "2024-01-10",
    endDate: "2024-03-10",
    status: "cancelled",
    createTime: "2024-01-05 11:00:00",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          履约中
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" />
          待生效
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          已完成
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          已取消
        </Badge>
      )
    default:
      return <Badge variant="outline">未知</Badge>
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case "租赁订单":
      return <Badge className="bg-primary/10 text-primary border-primary/20">{type}</Badge>
    case "托管订单":
      return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">{type}</Badge>
    case "存放订单":
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">{type}</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

export function OrderManagement() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const stats = {
    total: orderData.length,
    active: orderData.filter((item) => item.status === "active").length,
    pending: orderData.filter((item) => item.status === "pending").length,
    totalAmount: orderData.filter((item) => item.status !== "cancelled").reduce((sum, item) => sum + item.amount, 0),
  }

  const filteredData = activeTab === "all" 
    ? orderData 
    : orderData.filter(item => item.status === activeTab)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">订单管理</h1>
          <p className="text-muted-foreground mt-1">管理租赁、托管、存放等各类订单</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          导出订单
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">订单总数</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">履约中</p>
                <p className="text-2xl font-bold mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待生效</p>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">合同金额</p>
                <p className="text-2xl font-bold mt-1">
                  {(stats.totalAmount / 10000).toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">万元</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 订单列表 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">订单列表</CardTitle>
              <CardDescription>查看和管理所有业务订单</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索订单号或客户..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="订单类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="rental">租赁订单</SelectItem>
                  <SelectItem value="custody">托管订单</SelectItem>
                  <SelectItem value="storage">存放订单</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">
                全部
                <Badge variant="secondary" className="ml-2">{orderData.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active">
                履约中
                <Badge variant="secondary" className="ml-2">{stats.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                待生效
                <Badge variant="secondary" className="ml-2">{stats.pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="cancelled">已取消</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">订单编号</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>仓储站点</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead className="text-right">面积(m²)</TableHead>
                  <TableHead className="text-right">金额(元)</TableHead>
                  <TableHead>租期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-mono text-sm">{item.id}</p>
                        <p className="text-xs text-muted-foreground">{item.createTime}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{item.warehouse}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[150px]">{item.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.area.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      {item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {item.startDate} ~ {item.endDate}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            查看合同
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="w-4 h-4 mr-2" />
                            取消订单
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              共 {filteredData.length} 条记录
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
