"use client"

import { useState } from "react"
import {
  Package,
  Plus,
  Search,
  MapPin,
  Ruler,
  Building2,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Phone,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Briefcase,
  Handshake,
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
import { WarehouseSiteAdd } from "./warehouse-site-add"

interface WarehouseRow {
  id: string
  name: string
  type: string
  structure: "钢结构" | "混凝土结构" | "砖混结构" | "混合结构" | "露天"
  operation: "自主" | "委托"
  buildArea: number
  rentableArea: number
  publicArea: number
  fireRecord: "有" | "无" | "办理中"
  location: string
  fullAddress: string
  status: "active" | "maintenance" | "inactive"
  publishStatus: "published" | "reviewing" | "unpublished"
  createTime: string
  contact: string
  phone: string
  facilityCount: number
  facilityHighlights: string[]
}

const warehouseData: WarehouseRow[] = [
  {
    id: "WH001",
    name: "中铁建广州南沙综合仓储基地",
    type: "综合仓库",
    structure: "钢结构",
    operation: "自主",
    buildArea: 15000,
    rentableArea: 12800,
    publicArea: 2200,
    fireRecord: "有",
    location: "广东省广州市南沙区",
    fullAddress: "广州市南沙区进港大道15号铁建仓储园",
    status: "active",
    publishStatus: "published",
    createTime: "2023-06-15",
    contact: "张志远",
    phone: "138****8821",
    facilityCount: 12,
    facilityHighlights: ["龙门吊", "叉车", "监控全覆盖"],
  },
  {
    id: "WH002",
    name: "中铁建深圳龙岗物流基地",
    type: "物流仓库",
    structure: "钢结构",
    operation: "自主",
    buildArea: 25000,
    rentableArea: 21500,
    publicArea: 3500,
    fireRecord: "有",
    location: "广东省深圳市龙岗区",
    fullAddress: "深圳市龙岗区平湖街道华南国际物流中心",
    status: "active",
    publishStatus: "published",
    createTime: "2023-08-20",
    contact: "李文涛",
    phone: "139****9302",
    facilityCount: 16,
    facilityHighlights: ["重型货架", "登高车", "人脸识别"],
  },
  {
    id: "WH003",
    name: "中铁建东莞塘厦仓储站点",
    type: "普通仓库",
    structure: "砖混结构",
    operation: "委托",
    buildArea: 8000,
    rentableArea: 6800,
    publicArea: 1200,
    fireRecord: "办理中",
    location: "广东省东莞市塘厦镇",
    fullAddress: "东莞市塘厦镇林村社区铁建物资园",
    status: "maintenance",
    publishStatus: "unpublished",
    createTime: "2023-10-05",
    contact: "王广志",
    phone: "137****7563",
    facilityCount: 8,
    facilityHighlights: ["货架", "监控", "消防"],
  },
  {
    id: "WH004",
    name: "中铁建佛山南海冷链仓储基地",
    type: "冷链仓库",
    structure: "混凝土结构",
    operation: "自主",
    buildArea: 6000,
    rentableArea: 4800,
    publicArea: 1200,
    fireRecord: "有",
    location: "广东省佛山市南海区",
    fullAddress: "佛山市南海区狮山镇官窑工业区铁建冷链园",
    status: "active",
    publishStatus: "reviewing",
    createTime: "2023-12-10",
    contact: "赵敏",
    phone: "136****6024",
    facilityCount: 14,
    facilityHighlights: ["冷藏", "叉车", "粉尘抑制"],
  },
  {
    id: "WH005",
    name: "中铁二十二局惠州大亚湾仓储基地",
    type: "综合仓库",
    structure: "钢结构",
    operation: "自主",
    buildArea: 20000,
    rentableArea: 17800,
    publicArea: 2200,
    fireRecord: "有",
    location: "广东省惠州市大亚湾区",
    fullAddress: "惠州市大亚湾区西区龙海二路铁建仓储基地",
    status: "active",
    publishStatus: "published",
    createTime: "2026-01-08",
    contact: "周建国",
    phone: "135****5187",
    facilityCount: 10,
    facilityHighlights: ["叉车", "监控全覆盖", "封闭围墙"],
  },
]

const getStatusBadge = (status: WarehouseRow["status"]) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          正常运营
        </Badge>
      )
    case "maintenance":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" />
          维护中
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          已停用
        </Badge>
      )
  }
}

const getPublishStatusBadge = (status: WarehouseRow["publishStatus"]) => {
  switch (status) {
    case "published":
      return <Badge className="bg-primary/10 text-primary border-primary/20">已发布</Badge>
    case "reviewing":
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">审核中</Badge>
    default:
      return <Badge variant="outline">未发布</Badge>
  }
}

const getOperationBadge = (op: WarehouseRow["operation"]) => {
  return op === "自主" ? (
    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1">
      <Briefcase className="w-3 h-3" />
      自主
    </Badge>
  ) : (
    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 gap-1">
      <Handshake className="w-3 h-3" />
      委托
    </Badge>
  )
}

const getFireBadge = (record: WarehouseRow["fireRecord"]) => {
  if (record === "有") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600">
        <ShieldCheck className="w-3.5 h-3.5" />
        已备案
      </span>
    )
  }
  if (record === "办理中") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
        <ShieldAlert className="w-3.5 h-3.5" />
        办理中
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <ShieldAlert className="w-3.5 h-3.5" />
      未备案
    </span>
  )
}

interface WarehouseInfoProps {
  roleType?: "warehouse-unit" | "warehouse-site"
}

export function WarehouseInfo({ roleType = "warehouse-unit" }: WarehouseInfoProps) {
  void roleType
  const [searchKeyword, setSearchKeyword] = useState("")
  const [mode, setMode] = useState<"list" | "create">("list")

  if (mode === "create") {
    return (
      <WarehouseSiteAdd onBack={() => setMode("list")} onSubmit={() => setMode("list")} />
    )
  }

  const stats = {
    total: warehouseData.length,
    buildArea: warehouseData.reduce((sum, item) => sum + item.buildArea, 0),
    rentableArea: warehouseData.reduce((sum, item) => sum + item.rentableArea, 0),
    published: warehouseData.filter((item) => item.publishStatus === "published").length,
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">仓储信息管理</h1>
          <p className="text-muted-foreground mt-1">管理仓储站点和资源信息</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setMode("create")}>
            <Plus className="w-4 h-4 mr-2" />
            新增站点
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">站点总数</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">建筑面积</p>
                <p className="text-2xl font-bold mt-1">
                  {(stats.buildArea / 10000).toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">万㎡</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Ruler className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">可租面积</p>
                <p className="text-2xl font-bold mt-1">
                  {(stats.rentableArea / 10000).toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">万㎡</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已发布</p>
                <p className="text-2xl font-bold mt-1">{stats.published}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 仓储列表 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">仓储站点列表</CardTitle>
              <CardDescription>管理所有仓储站点信息</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索站点名称..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="运营方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部方式</SelectItem>
                  <SelectItem value="self">自主</SelectItem>
                  <SelectItem value="entrust">委托</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="仓库类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="comprehensive">综合仓库</SelectItem>
                  <SelectItem value="logistics">物流仓库</SelectItem>
                  <SelectItem value="cold">冷链仓库</SelectItem>
                  <SelectItem value="normal">普通仓库</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">正常运营</SelectItem>
                  <SelectItem value="maintenance">维护中</SelectItem>
                  <SelectItem value="inactive">已停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1540px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">站点名称 / 类型</TableHead>
                  <TableHead className="w-[100px]">运营方式</TableHead>
                  <TableHead className="w-[110px]">仓储架构</TableHead>
                  <TableHead className="text-right w-[200px]">面积(㎡)</TableHead>
                  <TableHead className="w-[100px]">消防备案</TableHead>
                  <TableHead className="w-[200px]">配套亮点</TableHead>
                  <TableHead className="w-[180px]">位置</TableHead>
                  <TableHead className="w-[150px]">联系人</TableHead>
                  <TableHead className="w-[110px]">状态</TableHead>
                  <TableHead className="w-[110px]">发布状态</TableHead>
                  <TableHead className="w-[220px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouseData
                  .filter((item) =>
                    searchKeyword
                      ? item.name.toLowerCase().includes(searchKeyword.toLowerCase())
                      : true,
                  )
                  .map((item) => (
                    <TableRow key={item.id}>
                      {/* 名称 / 类型 */}
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium leading-tight">{item.name}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {item.id}
                            </span>
                            <Badge variant="outline" className="text-[11px] py-0 px-1.5">
                              {item.type}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      {/* 运营方式 */}
                      <TableCell>{getOperationBadge(item.operation)}</TableCell>

                      {/* 仓储架构 */}
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-sm text-foreground">
                          <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                          {item.structure}
                        </span>
                      </TableCell>

                      {/* 建筑/可租面积 */}
                      <TableCell className="text-right">
                        <div className="space-y-0.5 leading-tight">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[11px] text-muted-foreground">
                              建筑
                            </span>
                            <span className="font-medium tabular-nums">
                              {item.buildArea.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[11px] text-muted-foreground">
                              可租
                            </span>
                            <span className="text-green-600 font-medium tabular-nums">
                              {item.rentableArea.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* 消防备案 */}
                      <TableCell>{getFireBadge(item.fireRecord)}</TableCell>

                      {/* 配套亮点 */}
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          {item.facilityHighlights.slice(0, 2).map((f) => (
                            <Badge
                              key={f}
                              variant="secondary"
                              className="text-[11px] py-0 px-1.5 font-normal"
                            >
                              {f}
                            </Badge>
                          ))}
                          {item.facilityCount > 2 && (
                            <Badge
                              variant="outline"
                              className="text-[11px] py-0 px-1.5 font-normal text-muted-foreground"
                            >
                              +{item.facilityCount - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* 位置 */}
                      <TableCell>
                        <div
                          className="flex items-start gap-1 text-sm max-w-[180px]"
                          title={item.fullAddress}
                        >
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <span className="line-clamp-2 leading-snug">
                            {item.location}
                          </span>
                        </div>
                      </TableCell>

                      {/* 联系人 */}
                      <TableCell>
                        <div className="space-y-0.5 leading-tight">
                          <p className="text-sm">{item.contact}</p>
                          <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {item.phone}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{getPublishStatusBadge(item.publishStatus)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            查看
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-primary"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1" />
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              共 {warehouseData.length} 条记录
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
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
