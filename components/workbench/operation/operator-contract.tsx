"use client"

import { useMemo, useState } from "react"
import {
  FileText,
  Files,
  Search,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Building2,
  Edit3,

  FilePlus,
  Archive,
  Power,


  TrendingUp,
  Layers,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

/* ----------------------------------------------------------------------------------------------
 * 1) 合同查询子页 —— 复刻用户工作台 contract-management，操作仅"查看"
 * -------------------------------------------------------------------------------------------- */

interface Contract {
  id: string
  name: string
  type: string
  partyA: string
  partyB: string
  warehouse: string
  amount: number
  startDate: string
  endDate: string
  status: "signed" | "pending" | "completed" | "expired" | "terminated"
  signDate: string | null
  progress: number
}

const contractData: Contract[] = [
  {
    id: "CON20260120001",
    name: "仓储租赁合同",
    type: "租赁合同",
    partyA: "中铁建物料华南仓储有限公司",
    partyB: "中铁十一局广深城际项目部",
    warehouse: "中铁建广州南沙综合仓储基地",
    amount: 420000,
    startDate: "2026-02-01",
    endDate: "2026-07-31",
    status: "signed",
    signDate: "2026-01-20",
    progress: 20,
  },
  {
    id: "CON20260118002",
    name: "物料托管协议",
    type: "托管合同",
    partyA: "中铁建物料华南仓储有限公司",
    partyB: "中铁十四局集团广州分公司",
    warehouse: "中铁建深圳前海智慧仓储基地",
    amount: 1890000,
    startDate: "2026-01-25",
    endDate: "2026-12-31",
    status: "pending",
    signDate: null,
    progress: 0,
  },
  {
    id: "CON20260115003",
    name: "仓储服务合同",
    type: "服务合同",
    partyA: "中铁建物料华南仓储有限公司",
    partyB: "中铁二十二局莞惠城际项目部",
    warehouse: "中铁二十二局惠州大亚湾仓储基地",
    amount: 960000,
    startDate: "2026-01-20",
    endDate: "2026-06-30",
    status: "signed",
    signDate: "2026-01-15",
    progress: 35,
  },
  {
    id: "CON20260110004",
    name: "物料存放合同",
    type: "存放合同",
    partyA: "中铁建物料华南仓储有限公司",
    partyB: "中铁电气化局集团广州分公司",
    warehouse: "中铁建佛山南海冷链仓储基地",
    amount: 156000,
    startDate: "2026-01-15",
    endDate: "2026-04-15",
    status: "completed",
    signDate: "2026-01-10",
    progress: 100,
  },
  {
    id: "CON20260105005",
    name: "委托运营合同",
    type: "委托合同",
    partyA: "中铁建物料华南仓储有限公司",
    partyB: "中铁大桥局集团广州分公司",
    warehouse: "中铁建东莞塘厦仓储站点",
    amount: 280000,
    startDate: "2026-01-10",
    endDate: "2026-03-10",
    status: "expired",
    signDate: "2026-01-05",
    progress: 100,
  },
  {
    id: "CON20251220006",
    name: "仓储租赁合同",
    type: "租赁合同",
    partyA: "中铁建物料华南仓储有限公司",
    partyB: "中铁城建集团华南分公司",
    warehouse: "中铁建广州南沙综合仓储基地",
    amount: 350000,
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    status: "signed",
    signDate: "2025-12-20",
    progress: 55,
  },
  {
    id: "CON20260513007",
    name: "HRB400 螺纹钢 1200 吨销售合同",
    type: "销售合同",
    partyA: "中铁建物料华南专业运营有限公司",
    partyB: "中铁二十三局深圳分公司",
    warehouse: "中铁建广州南沙综合仓储基地",
    amount: 5040000,
    startDate: "2026-05-13",
    endDate: "2026-05-25",
    status: "signed",
    signDate: "2026-05-13",
    progress: 75,
  },
  {
    id: "CON20260510008",
    name: "Φ32 螺纹钢余料销售合同",
    type: "销售合同",
    partyA: "中铁建物料华南专业运营有限公司",
    partyB: "广州市顺德建材贸易公司",
    warehouse: "中铁建广州黄埔恒温仓储基地",
    amount: 1896000,
    startDate: "2026-05-10",
    endDate: "2026-05-15",
    status: "completed",
    signDate: "2026-05-10",
    progress: 100,
  },
  {
    id: "CON20260420009",
    name: "物资销售代理协议(中铁十四局)",
    type: "销售代理协议",
    partyA: "中铁建物料华南专业运营有限公司",
    partyB: "中铁十四局集团广州分公司",
    warehouse: "南沙 / 东莞 / 黄埔仓储基地",
    amount: 0,
    startDate: "2026-04-20",
    endDate: "2027-04-19",
    status: "signed",
    signDate: "2026-04-20",
    progress: 30,
  },
  {
    id: "CON20260420010",
    name: "销售分成协议(25:75)",
    type: "分成协议",
    partyA: "中铁建物料华南专业运营有限公司",
    partyB: "中铁十四局集团广州分公司",
    warehouse: "—",
    amount: 0,
    startDate: "2026-04-20",
    endDate: "2027-04-19",
    status: "signed",
    signDate: "2026-04-20",
    progress: 30,
  },
  {
    id: "CON20260512011",
    name: "WJ-7 型扣件系统销售合同",
    type: "销售合同",
    partyA: "中铁建物料华南专业运营有限公司",
    partyB: "中铁十一局广深城际项目部",
    warehouse: "中铁建深圳前海智慧仓储基地",
    amount: 144000,
    startDate: "2026-05-12",
    endDate: "2026-06-30",
    status: "pending",
    signDate: null,
    progress: 0,
  },
]

function getStatusBadge(status: Contract["status"]) {
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

function getTypeBadge(type: string) {
  const colors: Record<string, string> = {
    租赁合同: "bg-primary/10 text-primary border-primary/20",
    托管合同: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    服务合同: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    存放合同: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    委托合同: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    销售合同: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    销售代理协议: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    分成协议: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  }
  return <Badge className={colors[type] || ""}>{type}</Badge>
}

function ContractQueryPage() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const stats = useMemo(() => {
    return {
      total: contractData.length,
      signed: contractData.filter((it) => it.status === "signed").length,
      pending: contractData.filter((it) => it.status === "pending").length,
      expiringSoon: contractData.filter((it) => {
        if (it.status !== "signed") return false
        const end = new Date(it.endDate).getTime()
        const now = new Date("2026-06-30").getTime()
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
        return diff <= 30 && diff > 0
      }).length,
      totalAmount: contractData.reduce((sum, it) => sum + it.amount, 0),
    }
  }, [])

  const filtered = useMemo(() => {
    return contractData.filter((it) => {
      if (activeTab !== "all" && it.status !== activeTab) return false
      if (typeFilter !== "all" && it.type !== typeFilter) return false
      if (
        searchKeyword &&
        !`${it.id}${it.name}${it.partyA}${it.partyB}`
        .toLowerCase()
        .includes(searchKeyword.toLowerCase())
      )
        return false
      return true
    })
  }, [activeTab, typeFilter, searchKeyword])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">合同查询</h1>
          <p className="text-sm text-muted-foreground mt-1">
            全平台合同档案 · 仅可查看，不可编辑
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

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
                <p className="text-2xl font-bold mt-1 text-orange-600">
                  {stats.expiringSoon}
                </p>
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

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">合同列表</CardTitle>
              <CardDescription>查看所有业务合同详细信息</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索合同编号、名称、发起方或确认方..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-[220px]"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="合同类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="租赁合同">租赁合同</SelectItem>
                  <SelectItem value="托管合同">托管合同</SelectItem>
                  <SelectItem value="服务合同">服务合同</SelectItem>
                  <SelectItem value="存放合同">存放合同</SelectItem>
                  <SelectItem value="委托合同">委托合同</SelectItem>
                  <SelectItem value="销售合同">销售合同</SelectItem>
                  <SelectItem value="销售代理协议">销售代理协议</SelectItem>
                  <SelectItem value="分成协议">分成协议</SelectItem>
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
                <Badge variant="secondary" className="ml-2">
                  {contractData.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="signed">
                履约中
                <Badge variant="secondary" className="ml-2">
                  {stats.signed}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                待签署
                <Badge variant="secondary" className="ml-2">
                  {stats.pending}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="expired">已到期</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">序号</TableHead>
                  <TableHead className="w-[150px]">合同编号</TableHead>
                  <TableHead>合同名称</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>发起方</TableHead>
                      <TableHead>确认方</TableHead>
                      <TableHead className="text-right">金额(元)</TableHead>
                  <TableHead>合同期限</TableHead>
                  <TableHead>履约进度</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-[100px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center text-xs tabular-nums text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                          {item.warehouse}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[160px]" title={item.partyA}>
                          {item.partyA}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[160px]" title={item.partyB}>
                          {item.partyB}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary tabular-nums">
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
                          <span className="font-medium tabular-nums">
                            {item.progress}%
                          </span>
                        </div>
                        <Progress value={item.progress} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        查看
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center text-sm text-muted-foreground py-12"
                    >
                      暂无符合条件的合同
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>共 {filtered.length} 条记录</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ----------------------------------------------------------------------------------------------
 * 2) 模版管理子页 —— 基于现有模板库优化
 * -------------------------------------------------------------------------------------------- */

interface Template {
  id: string
  name: string
  biz: "仓储租赁" | "物资存放" | "物资租赁" | "物资销售"
  version: string
  versionCount: number
  usedCount: number
  monthUsed: number
  owner: string
  updatedAt: string
  status: "已启用" | "已归档" | "草稿"
}

const templates: Template[] = [
  {
    id: "TPL-CK-001",
    name: "标准仓储租赁合同（月租）",
    biz: "仓储租赁",
    version: "v3.2",
    versionCount: 6,
    usedCount: 248,
    monthUsed: 28,
    owner: "李运营",
    updatedAt: "2026-05-12",
    status: "已启用",
  },
  {
    id: "TPL-CK-002",
    name: "仓储委托运营合同",
    biz: "仓储租赁",
    version: "v1.6",
    versionCount: 3,
    usedCount: 32,
    monthUsed: 4,
    owner: "李运营",
    updatedAt: "2026-03-22",
    status: "已启用",
  },
  {
    id: "TPL-CF-001",
    name: "物资存放服务合同",
    biz: "物资存放",
    version: "v2.4",
    versionCount: 5,
    usedCount: 96,
    monthUsed: 12,
    owner: "陈合规",
    updatedAt: "2026-04-28",
    status: "已启用",
  },
  {
    id: "TPL-WZ-001",
    name: "物资租赁合同（含押金条款）",
    biz: "物资租赁",
    version: "v3.0",
    versionCount: 7,
    usedCount: 132,
    monthUsed: 18,
    owner: "陈合规",
    updatedAt: "2026-06-08",
    status: "已启用",
  },
  {
    id: "TPL-WZ-002",
    name: "物资租赁合同（短租 ≤ 30 天）",
    biz: "物资租赁",
    version: "v1.2",
    versionCount: 2,
    usedCount: 0,
    monthUsed: 0,
    owner: "陈合规",
    updatedAt: "2026-06-26",
    status: "草稿",
  },
  {
    id: "TPL-XS-001",
    name: "物资销售合同（含分成条款）",
    biz: "物资销售",
    version: "v2.1",
    versionCount: 4,
    usedCount: 64,
    monthUsed: 11,
    owner: "李运营",
    updatedAt: "2026-06-15",
    status: "已启用",
  },
  {
    id: "TPL-XS-002",
    name: "物资销售代理协议",
    biz: "物资销售",
    version: "v1.4",
    versionCount: 3,
    usedCount: 22,
    monthUsed: 3,
    owner: "李运营",
    updatedAt: "2026-05-30",
    status: "已启用",
  },
  {
    id: "TPL-XS-003",
    name: "物资销售合同（旧版）",
    biz: "物资销售",
    version: "v1.8",
    versionCount: 8,
    usedCount: 18,
    monthUsed: 0,
    owner: "李运营",
    updatedAt: "2025-12-10",
    status: "已归档",
  },
]

const bizColor: Record<Template["biz"], string> = {
  仓储租赁: "bg-blue-50 text-blue-700 border-blue-200",
  物资存放: "bg-indigo-50 text-indigo-700 border-indigo-200",
  物资租赁: "bg-emerald-50 text-emerald-700 border-emerald-200",
  物资销售: "bg-amber-50 text-amber-700 border-amber-200",
}

const statusColor: Record<Template["status"], string> = {
  已启用: "bg-emerald-50 text-emerald-700 border-emerald-200",
  已归档: "bg-slate-50 text-slate-700 border-slate-200",
  草稿: "bg-yellow-50 text-yellow-700 border-yellow-200",
}

const BIZ_LIST: Template["biz"][] = [
  "仓储租赁",
  "物资存放",
  "物资租赁",
  "物资销售",
]

function TemplateManagePage() {
  const [bizFilter, setBizFilter] = useState<"all" | Template["biz"]>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | Template["status"]>("all")
  const [keyword, setKeyword] = useState("")

  const stats = useMemo(() => {
    return {
      total: templates.length,
      enabled: templates.filter((t) => t.status === "已启用").length,
      archived: templates.filter((t) => t.status === "已归档").length,
      draft: templates.filter((t) => t.status === "草稿").length,
      totalUsed: templates.reduce((s, t) => s + t.usedCount, 0),
      monthUsed: templates.reduce((s, t) => s + t.monthUsed, 0),
    }
  }, [])

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (bizFilter !== "all" && t.biz !== bizFilter) return false
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (
        keyword &&
        !`${t.id}${t.name}${t.owner}`.toLowerCase().includes(keyword.toLowerCase())
      )
        return false
      return true
    })
  }, [bizFilter, statusFilter, keyword])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">模版管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            平台标准化合同模板 · 版本控制 · 启用与归档
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button>
            <FilePlus className="w-4 h-4 mr-2" />
            新建模板
          </Button>
        </div>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Files className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">模板总数</div>
              <div className="text-2xl font-semibold tabular-nums leading-tight">
                {stats.total}
              </div>
              <div className="text-[11px] text-muted-foreground">覆盖四大业务</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Power className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">已启用</div>
              <div className="text-2xl font-semibold tabular-nums leading-tight">
                {stats.enabled}
              </div>
              <div className="text-[11px] text-muted-foreground">可被用户工作台调用</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">草稿</div>
              <div className="text-2xl font-semibold tabular-nums leading-tight">
                {stats.draft}
              </div>
              <div className="text-[11px] text-muted-foreground">编辑中未发布</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Archive className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">已归档</div>
              <div className="text-2xl font-semibold tabular-nums leading-tight">
                {stats.archived}
              </div>
              <div className="text-[11px] text-muted-foreground">不再开放使用</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">累计调用</div>
              <div className="text-2xl font-semibold tabular-nums leading-tight">
                {stats.totalUsed}
              </div>
              <div className="text-[11px] text-muted-foreground">
                本月新增 {stats.monthUsed}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 业务 chip 筛选 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">业务类型：</span>
              <button
                type="button"
                onClick={() => setBizFilter("all")}
                className={`h-7 px-3 rounded-md border text-xs transition-colors ${
                  bizFilter === "all"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                全部
              </button>
              {BIZ_LIST.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBizFilter(b)}
                  className={`h-7 px-3 rounded-md border text-xs transition-colors ${
                    bizFilter === b
                      ? `${bizColor[b]} ring-1 ring-current/30`
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索模板编号 / 名称 / 维护人..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-9 w-[260px]"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="已启用">已启用</SelectItem>
                  <SelectItem value="草稿">草稿</SelectItem>
                  <SelectItem value="已归档">已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">序号</TableHead>
                  <TableHead className="w-[110px]">编号</TableHead>
                  <TableHead>模板名称</TableHead>
                  <TableHead className="w-[100px]">业务类型</TableHead>
                  <TableHead className="w-[110px]">版本</TableHead>
                  <TableHead className="w-[120px] text-center">使用次数</TableHead>
                  <TableHead className="w-[110px]">维护人</TableHead>
                  <TableHead className="w-[110px]">更新日期</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
                  <TableHead className="w-[180px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t, idx) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-center text-xs tabular-nums text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] h-5 ${bizColor[t.biz]}`}
                      >
                        {t.biz}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs tabular-nums">
                          {t.version}
                        </span>
                        <Badge
                          variant="outline"
                          className="h-4 text-[10px] bg-slate-50 text-slate-600 border-slate-200"
                        >
                          <Layers className="w-2.5 h-2.5 mr-0.5" />
                          {t.versionCount}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm tabular-nums">{t.usedCount}</div>
                      <div className="text-[10px] text-muted-foreground">
                        本月 +{t.monthUsed}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{t.owner}</TableCell>
                    <TableCell className="text-xs tabular-nums text-muted-foreground">
                      {t.updatedAt}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] h-5 ${statusColor[t.status]}`}
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                          title="查看"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span className="text-xs">查看</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                          title="编辑"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          <span className="text-xs">编辑</span>
                        </Button>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">启用</span>
                          <Switch
                            checked={t.status === "已启用"}
                            aria-label="启用模板"
                            className="data-[state=checked]:bg-emerald-600"
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center text-sm text-muted-foreground py-12"
                    >
                      暂无符合条件的模板
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>共 {filtered.length} 条模板</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ----------------------------------------------------------------------------------------------
 * 3) 入口分发
 * -------------------------------------------------------------------------------------------- */

interface OperatorContractProps {
  subTab?: string
}

export function OperatorContract({ subTab }: OperatorContractProps) {
  if (subTab === "op-contract-template") return <TemplateManagePage />
  return <ContractQueryPage />
}
