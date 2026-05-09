"use client"

import { useState } from "react"
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Ruler,
  Building2,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
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

// 仓储信息数据
const warehouseData = [
  {
    id: "WH001",
    name: "广州番禺仓储中心",
    type: "综合仓库",
    area: 15000,
    availableArea: 8000,
    location: "广东省广州市番禺区",
    status: "active",
    publishStatus: "published",
    createTime: "2023-06-15",
    unitPrice: 35,
    facilities: ["叉车", "货架", "监控", "消防"],
  },
  {
    id: "WH002",
    name: "深圳龙岗物流基地",
    type: "物流仓库",
    area: 25000,
    availableArea: 12000,
    location: "广东省深圳市龙岗区",
    status: "active",
    publishStatus: "published",
    createTime: "2023-08-20",
    unitPrice: 45,
    facilities: ["叉车", "货架", "监控", "消防", "恒温"],
  },
  {
    id: "WH003",
    name: "东莞塘厦仓储站",
    type: "普通仓库",
    area: 8000,
    availableArea: 3000,
    location: "广东省东莞市塘厦镇",
    status: "maintenance",
    publishStatus: "unpublished",
    createTime: "2023-10-05",
    unitPrice: 28,
    facilities: ["货架", "监控", "消防"],
  },
  {
    id: "WH004",
    name: "佛山南海冷链仓库",
    type: "冷链仓库",
    area: 6000,
    availableArea: 2500,
    location: "广东省佛山市南海区",
    status: "active",
    publishStatus: "reviewing",
    createTime: "2023-12-10",
    unitPrice: 65,
    facilities: ["叉车", "货架", "监控", "消防", "冷藏"],
  },
  {
    id: "WH005",
    name: "惠州大亚湾仓储中心",
    type: "综合仓库",
    area: 20000,
    availableArea: 15000,
    location: "广东省惠州市大亚湾区",
    status: "active",
    publishStatus: "published",
    createTime: "2024-01-08",
    unitPrice: 32,
    facilities: ["叉车", "货架", "监控", "消防"],
  },
]

const getStatusBadge = (status: string) => {
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

const getPublishStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-primary/10 text-primary border-primary/20">已发布</Badge>
    case "reviewing":
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">审核中</Badge>
    default:
      return <Badge variant="outline">未发布</Badge>
  }
}

interface WarehouseInfoProps {
  roleType?: "warehouse-unit" | "warehouse-site"
}

export function WarehouseInfo({ roleType = "warehouse-unit" }: WarehouseInfoProps) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const stats = {
    total: warehouseData.length,
    totalArea: warehouseData.reduce((sum, item) => sum + item.area, 0),
    availableArea: warehouseData.reduce((sum, item) => sum + item.availableArea, 0),
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
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            批量导入
          </Button>
          <Button>
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
                <p className="text-sm text-muted-foreground">总面积</p>
                <p className="text-2xl font-bold mt-1">
                  {(stats.totalArea / 10000).toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">万m²</span>
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
                <p className="text-sm text-muted-foreground">可用面积</p>
                <p className="text-2xl font-bold mt-1">
                  {(stats.availableArea / 10000).toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">万m²</span>
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
            <div className="flex items-center gap-2">
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">站点名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>位置</TableHead>
                  <TableHead className="text-right">总面积(m²)</TableHead>
                  <TableHead className="text-right">可用面积(m²)</TableHead>
                  <TableHead className="text-right">单价(元/m²/月)</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouseData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {item.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.area.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium">
                        {item.availableArea.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{item.unitPrice}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{getPublishStatusBadge(item.publishStatus)}</TableCell>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            删除
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
