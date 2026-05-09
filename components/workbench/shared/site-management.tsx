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
  MapPinned,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Warehouse,
  Package,
  Users,
} from "lucide-react"

const mockSites = [
  {
    id: "ZD-001",
    name: "广州南站仓储站点",
    address: "广州市番禺区南站北路168号",
    area: 15000,
    usedArea: 12500,
    warehouseCount: 8,
    materialCount: 156,
    status: "运营中",
    manager: "张经理",
    phone: "138****8888",
    createDate: "2023-01-15",
  },
  {
    id: "ZD-002",
    name: "深圳北站仓储站点",
    address: "深圳市龙华区民治街道北站社区",
    area: 12000,
    usedArea: 9800,
    warehouseCount: 6,
    materialCount: 98,
    status: "运营中",
    manager: "李经理",
    phone: "139****9999",
    createDate: "2023-03-20",
  },
  {
    id: "ZD-003",
    name: "东莞虎门仓储站点",
    address: "东莞市虎门镇铁路货运中心",
    area: 8000,
    usedArea: 5200,
    warehouseCount: 4,
    materialCount: 67,
    status: "运营中",
    manager: "王经理",
    phone: "137****7777",
    createDate: "2023-06-10",
  },
  {
    id: "ZD-004",
    name: "佛山西站仓储站点",
    address: "佛山市南海区狮山镇西站大道",
    area: 10000,
    usedArea: 3500,
    warehouseCount: 5,
    materialCount: 45,
    status: "筹建中",
    manager: "赵经理",
    phone: "136****6666",
    createDate: "2024-01-05",
  },
]

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  "运营中": { label: "运营中", variant: "default" },
  "筹建中": { label: "筹建中", variant: "secondary" },
  "维护中": { label: "维护中", variant: "outline" },
  "已停用": { label: "已停用", variant: "destructive" },
}

export function SiteManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSites = mockSites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || site.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalArea = mockSites.reduce((sum, s) => sum + s.area, 0)
  const totalUsedArea = mockSites.reduce((sum, s) => sum + s.usedArea, 0)
  const totalWarehouses = mockSites.reduce((sum, s) => sum + s.warehouseCount, 0)
  const totalMaterials = mockSites.reduce((sum, s) => sum + s.materialCount, 0)

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MapPinned className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">站点总数</p>
                <p className="text-2xl font-bold">{mockSites.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总面积</p>
                <p className="text-2xl font-bold">{(totalArea / 10000).toFixed(1)}万m²</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Warehouse className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">仓库总数</p>
                <p className="text-2xl font-bold">{totalWarehouses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Package className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">托管物资</p>
                <p className="text-2xl font-bold">{totalMaterials}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 站点列表 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">站点列表</CardTitle>
              <CardDescription>管理专运单位下属仓储站点</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                导出
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                新增站点
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索站点名称或地址..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="站点状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="运营中">运营中</SelectItem>
                <SelectItem value="筹建中">筹建中</SelectItem>
                <SelectItem value="维护中">维护中</SelectItem>
                <SelectItem value="已停用">已停用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">站点编号</TableHead>
                  <TableHead>站点名称</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead className="text-right">总面积(m²)</TableHead>
                  <TableHead className="text-right">使用率</TableHead>
                  <TableHead className="text-center">仓库数</TableHead>
                  <TableHead className="text-center">物资数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => {
                  const usageRate = ((site.usedArea / site.area) * 100).toFixed(0)
                  return (
                    <TableRow key={site.id}>
                      <TableCell className="font-mono text-sm">{site.id}</TableCell>
                      <TableCell className="font-medium">{site.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {site.address}
                      </TableCell>
                      <TableCell className="text-right">{site.area.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${usageRate}%` }}
                            />
                          </div>
                          <span className="text-sm">{usageRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{site.warehouseCount}</TableCell>
                      <TableCell className="text-center">{site.materialCount}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[site.status]?.variant || "default"}>
                          {site.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{site.manager}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
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
