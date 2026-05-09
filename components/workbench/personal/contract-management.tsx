"use client"

import { useState } from "react"
import {
  FileText,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Building2,
  Package,
  ChevronLeft,
  ChevronRight,
  Edit,
  Printer,
  Send,
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
import { Progress } from "@/components/ui/progress"

// 合同数据
const contractData = [
  {
    id: "CON20240120001",
    name: "仓储租赁合同",
    type: "租赁合同",
    partyA: "中铁物资华南有限公司",
    partyB: "中铁建工集团有限公司",
    warehouse: "广州番禺仓储中心",
    amount: 420000,
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    status: "signed",
    signDate: "2024-01-20",
    progress: 20,
  },
  {
    id: "CON20240118002",
    name: "物资托管协议",
    type: "托管合同",
    partyA: "中铁物资华南有限公司",
    partyB: "中铁物资北京有限公司",
    warehouse: "深圳龙岗物流基地",
    amount: 1890000,
    startDate: "2024-01-25",
    endDate: "2024-12-31",
    status: "pending",
    signDate: null,
    progress: 0,
  },
  {
    id: "CON20240115003",
    name: "仓储服务合同",
    type: "服务合同",
    partyA: "中铁物资华南有限公司",
    partyB: "中铁隧道集团有限公司",
    warehouse: "惠州大亚湾仓储中心",
    amount: 960000,
    startDate: "2024-01-20",
    endDate: "2024-06-30",
    status: "signed",
    signDate: "2024-01-15",
    progress: 35,
  },
  {
    id: "CON20240110004",
    name: "物资存放合同",
    type: "存放合同",
    partyA: "中铁物资华南有限公司",
    partyB: "中铁电气化局集团",
    warehouse: "佛山南海冷链仓库",
    amount: 156000,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    status: "completed",
    signDate: "2024-01-10",
    progress: 100,
  },
  {
    id: "CON20240105005",
    name: "委托运营合同",
    type: "委托合同",
    partyA: "中铁物资华南有限公司",
    partyB: "中铁大桥局集团",
    warehouse: "东莞塘厦仓储站",
    amount: 280000,
    startDate: "2024-01-10",
    endDate: "2024-03-10",
    status: "expired",
    signDate: "2024-01-05",
    progress: 100,
  },
  {
    id: "CON20231220006",
    name: "仓储租赁合同",
    type: "租赁合同",
    partyA: "中铁物资华南有限公司",
    partyB: "中铁城建集团",
    warehouse: "广州番禺仓储中心",
    amount: 350000,
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    status: "signed",
    signDate: "2023-12-20",
    progress: 55,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "signed":
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
          待签署
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          已完成
        </Badge>
      )
    case "expired":
      return (
        <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          已到期
        </Badge>
      )
    case "terminated":
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
          <AlertTriangle className="w-3 h-3 mr-1" />
          已终止
        </Badge>
      )
    default:
      return <Badge variant="outline">未知</Badge>
  }
}

const getTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    租赁合同: "bg-primary/10 text-primary border-primary/20",
    托管合同: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    服务合同: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    存放合同: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    委托合同: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  }
  return <Badge className={colors[type] || ""}>{type}</Badge>
}

export function ContractManagement() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const stats = {
    total: contractData.length,
    signed: contractData.filter((item) => item.status === "signed").length,
    pending: contractData.filter((item) => item.status === "pending").length,
    expiringSoon: contractData.filter((item) => {
      if (item.status !== "signed") return false
      const endDate = new Date(item.endDate)
      const now = new Date()
      const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays > 0
    }).length,
    totalAmount: contractData.reduce((sum, item) => sum + item.amount, 0),
  }

  const filteredData = activeTab === "all" 
    ? contractData 
    : contractData.filter(item => item.status === activeTab)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">合同管理</h1>
          <p className="text-muted-foreground mt-1">管理租赁、托管、委托等各类合同</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新建合同
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">合同总数</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">履约中</p>
                <p className="text-2xl font-bold mt-1">{stats.signed}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待签署</p>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">即将到期</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{stats.expiringSoon}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">合同总额</p>
                <p className="text-xl font-bold mt-1">
                  {(stats.totalAmount / 10000).toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">万</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 合同列表 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">合同列表</CardTitle>
              <CardDescription>查看和管理所有业务合同</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索合同编号或名称..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="合同类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="rental">租赁合同</SelectItem>
                  <SelectItem value="custody">托管合同</SelectItem>
                  <SelectItem value="service">服务合同</SelectItem>
                  <SelectItem value="storage">存放合同</SelectItem>
                  <SelectItem value="entrust">委托合同</SelectItem>
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
                <Badge variant="secondary" className="ml-2">{contractData.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="signed">
                履约中
                <Badge variant="secondary" className="ml-2">{stats.signed}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                待签署
                <Badge variant="secondary" className="ml-2">{stats.pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="expired">已到期</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">合同编号</TableHead>
                  <TableHead>合同名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>乙方</TableHead>
                  <TableHead className="text-right">金额(元)</TableHead>
                  <TableHead>合同期限</TableHead>
                  <TableHead>履约进度</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <p className="font-mono text-sm">{item.id}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.warehouse}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[120px]">{item.partyB}</span>
                      </div>
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
                    <TableCell>
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">进度</span>
                          <span className="font-medium">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-1.5" />
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
                            <Edit className="w-4 h-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="w-4 h-4 mr-2" />
                            打印
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            下载
                          </DropdownMenuItem>
                          {item.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Send className="w-4 h-4 mr-2" />
                                发起签署
                              </DropdownMenuItem>
                            </>
                          )}
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
