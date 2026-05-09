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
  CreditCard,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Wallet,
  TrendingUp,
  TrendingDown,
  FileText,
  Send,
} from "lucide-react"

interface SettlementManagementProps {
  subTab: string
  roleType: "property" | "warehouse-unit" | "warehouse-site" | "transport" | "user"
}

// 对账数据
const mockReconciliations = [
  {
    id: "DZ-2024-001",
    partner: "广州物资仓储有限公司",
    type: "仓储租赁",
    period: "2024年3月",
    amount: 125000,
    confirmedAmount: 125000,
    status: "已确认",
    createDate: "2024-04-01",
    confirmDate: "2024-04-03",
  },
  {
    id: "DZ-2024-002",
    partner: "深圳铁路物资公司",
    type: "物资存放",
    period: "2024年3月",
    amount: 45000,
    confirmedAmount: 0,
    status: "待确认",
    createDate: "2024-04-01",
    confirmDate: "",
  },
  {
    id: "DZ-2024-003",
    partner: "东莞仓储站点",
    type: "托管分成",
    period: "2024年3月",
    amount: 85000,
    confirmedAmount: 82000,
    status: "有差异",
    createDate: "2024-04-01",
    confirmDate: "",
  },
  {
    id: "DZ-2024-004",
    partner: "佛山物资公司",
    type: "仓储租赁",
    period: "2024年2月",
    amount: 98000,
    confirmedAmount: 98000,
    status: "已结算",
    createDate: "2024-03-01",
    confirmDate: "2024-03-05",
  },
]

// 支付结算数据
const mockPayments = [
  {
    id: "JS-2024-001",
    billNo: "FP-2024-0315",
    partner: "广州物资仓储有限公司",
    type: "应付",
    category: "仓储租金",
    amount: 125000,
    status: "待支付",
    dueDate: "2024-04-15",
    createDate: "2024-04-01",
  },
  {
    id: "JS-2024-002",
    billNo: "FP-2024-0316",
    partner: "深圳铁路物资公司",
    type: "应收",
    category: "物资存放费",
    amount: 45000,
    status: "已收款",
    dueDate: "2024-04-10",
    createDate: "2024-04-01",
  },
  {
    id: "JS-2024-003",
    billNo: "FP-2024-0317",
    partner: "东莞仓储站点",
    type: "应收",
    category: "托管收益分成",
    amount: 85000,
    status: "待收款",
    dueDate: "2024-04-20",
    createDate: "2024-04-01",
  },
  {
    id: "JS-2024-004",
    billNo: "FP-2024-0318",
    partner: "佛山物资公司",
    type: "应付",
    category: "运输费用",
    amount: 12000,
    status: "已支付",
    dueDate: "2024-03-31",
    createDate: "2024-03-25",
  },
]

const reconciliationStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof CheckCircle }> = {
  "已确认": { label: "已确认", variant: "default", icon: CheckCircle },
  "待确认": { label: "待确认", variant: "secondary", icon: Clock },
  "有差异": { label: "有差异", variant: "destructive", icon: AlertCircle },
  "已结算": { label: "已结算", variant: "outline", icon: CheckCircle },
}

const paymentStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  "待支付": { label: "待支付", variant: "destructive" },
  "已支付": { label: "已支付", variant: "default" },
  "待收款": { label: "待收款", variant: "secondary" },
  "已收款": { label: "已收款", variant: "outline" },
}

export function SettlementManagement({ subTab, roleType }: SettlementManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // 统计数据
  const totalReceivable = mockPayments
    .filter(p => p.type === "应收" && (p.status === "待收款"))
    .reduce((sum, p) => sum + p.amount, 0)
  const totalPayable = mockPayments
    .filter(p => p.type === "应付" && (p.status === "待支付"))
    .reduce((sum, p) => sum + p.amount, 0)
  const pendingReconciliation = mockReconciliations.filter(r => r.status === "待确认").length

  // 对账管理视图
  const renderReconciliation = () => {
    const filtered = mockReconciliations.filter((item) => {
      const matchesSearch =
        item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return (
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">本月对账单</p>
                  <p className="text-2xl font-bold">{mockReconciliations.length}</p>
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
                  <p className="text-sm text-muted-foreground">待确认</p>
                  <p className="text-2xl font-bold">{pendingReconciliation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-500/10">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">有差异</p>
                  <p className="text-2xl font-bold">{mockReconciliations.filter(r => r.status === "有差异").length}</p>
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
                  <p className="text-sm text-muted-foreground">已确认</p>
                  <p className="text-2xl font-bold">{mockReconciliations.filter(r => r.status === "已确认" || r.status === "已结算").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 对账列表 */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">对账单列表</CardTitle>
                <CardDescription>管理与合作伙伴的对账记录</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  导出
                </Button>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  生成对账单
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索合作方或对账单号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="对账状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="待确认">待确认</SelectItem>
                  <SelectItem value="已确认">已确认</SelectItem>
                  <SelectItem value="有差异">有差异</SelectItem>
                  <SelectItem value="已结算">已结算</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">对账单号</TableHead>
                    <TableHead>合作方</TableHead>
                    <TableHead>业务类型</TableHead>
                    <TableHead>账期</TableHead>
                    <TableHead className="text-right">对账金额</TableHead>
                    <TableHead className="text-right">确认金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="w-[120px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => {
                    const statusInfo = reconciliationStatusConfig[item.status]
                    const StatusIcon = statusInfo?.icon || Clock
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.id}</TableCell>
                        <TableCell className="font-medium">{item.partner}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.period}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.confirmedAmount > 0 ? item.confirmedAmount.toLocaleString() : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo?.variant || "default"} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {item.status === "待确认" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
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

  // 支付结算视图
  const renderPayment = () => {
    const filtered = mockPayments.filter((item) => {
      const matchesSearch =
        item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.billNo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return (
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">待收款</p>
                  <p className="text-2xl font-bold">{(totalReceivable / 10000).toFixed(1)}万</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-500/10">
                  <TrendingDown className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">待支付</p>
                  <p className="text-2xl font-bold">{(totalPayable / 10000).toFixed(1)}万</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">本月已收</p>
                  <p className="text-2xl font-bold">4.5万</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">本月已付</p>
                  <p className="text-2xl font-bold">1.2万</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 结算列表 */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">结算单列表</CardTitle>
                <CardDescription>管理应收应付款项</CardDescription>
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
            <Tabs defaultValue="all" className="mb-4">
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="receivable">应收款</TabsTrigger>
                <TabsTrigger value="payable">应付款</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索合作方或账单号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="结算状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="待支付">待支付</SelectItem>
                  <SelectItem value="已支付">已支付</SelectItem>
                  <SelectItem value="待收款">待收款</SelectItem>
                  <SelectItem value="已收款">已收款</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">账单号</TableHead>
                    <TableHead>合作方</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>费用类别</TableHead>
                    <TableHead className="text-right">金额(元)</TableHead>
                    <TableHead>到期日</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="w-[120px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.billNo}</TableCell>
                      <TableCell className="font-medium">{item.partner}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === "应收" ? "default" : "secondary"}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={item.type === "应收" ? "text-green-600" : "text-red-600"}>
                          {item.type === "应收" ? "+" : "-"}{item.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={paymentStatusConfig[item.status]?.variant || "default"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(item.status === "待支付" || item.status === "待收款") && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 根据subTab决定显示哪个视图
  if (subTab.includes("reconciliation")) {
    return renderReconciliation()
  } else if (subTab.includes("payment")) {
    return renderPayment()
  }

  // 默认显示对账管理
  return renderReconciliation()
}
