"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  QrCode,
  MapPin,
  Archive,
} from "lucide-react"

interface MaterialManagementProps {
  roleType?: "property" | "warehouse-unit" | "warehouse-site" | "transport"
}

const mockMaterials = [
  {
    id: "WZ-2026-001",
    name: "钢轨 60kg/m",
    category: "轨道类",
    spec: "60kg/m × 12.5m",
    quantity: 500,
    unit: "根",
    status: "在库",
    location: "中铁建广州南沙仓储基地-A区",
    entryDate: "2026-01-15",
    value: 1250000,
  },
  {
    id: "WZ-2026-002",
    name: "道岔",
    category: "轨道类",
    spec: "60kg/m-1/12",
    quantity: 20,
    unit: "组",
    status: "托管中",
    location: "中铁建深圳前海仓储基地-B区",
    entryDate: "2026-02-20",
    value: 800000,
  },
  {
    id: "WZ-2026-003",
    name: "扣件系统",
    category: "拼装类",
    spec: "WJ-7型",
    quantity: 10000,
    unit: "套",
    status: "出租中",
    location: "中铁建东莞虎门仓储基地-C区",
    entryDate: "2026-03-10",
    value: 500000,
  },
  {
    id: "WZ-2026-004",
    name: "轨枕",
    category: "轨道类",
    spec: "III型混凝土轨枕",
    quantity: 2000,
    unit: "根",
    status: "在库",
    location: "中铁建广州南沙仓储基地-D区",
    entryDate: "2026-03-25",
    value: 600000,
  },
  {
    id: "WZ-2026-005",
    name: "钢轨 50kg/m",
    category: "型材类",
    spec: "50kg/m × 12.5m",
    quantity: 300,
    unit: "根",
    status: "待出库",
    location: "中铁十六局佛山顺德仓储基地-A区",
    entryDate: "2026-04-05",
    value: 600000,
  },
]

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  "在库": { label: "在库", variant: "default" },
  "托管中": { label: "托管中", variant: "secondary" },
  "出租中": { label: "出租中", variant: "outline" },
  "待出库": { label: "待出库", variant: "destructive" },
}

export function MaterialManagement({ roleType = "warehouse-unit" }: MaterialManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredMaterials = mockMaterials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || material.status === statusFilter
    const matchesCategory = categoryFilter === "all" || material.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalValue = mockMaterials.reduce((sum, m) => sum + m.value, 0)
  const totalQuantity = mockMaterials.length

  const getRoleTitle = () => {
    switch (roleType) {
      case "property":
        return "我的物资"
      case "warehouse-unit":
      case "warehouse-site":
        return "存放物资"
      case "transport":
        return "托管物资"
      default:
        return "物资管理"
    }
  }

  const getRoleActions = () => {
    switch (roleType) {
      case "property":
        return ["存放", "托管", "调拨"]
      case "warehouse-unit":
      case "warehouse-site":
        return ["入库", "出库", "盘点"]
      case "transport":
        return ["出租", "出售", "调剂"]
      default:
        return []
    }
  }

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
                <p className="text-sm text-muted-foreground">物资总数</p>
                <p className="text-2xl font-bold">{totalQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Archive className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">在库物资</p>
                <p className="text-2xl font-bold">{mockMaterials.filter(m => m.status === "在库").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">存放站点</p>
                <p className="text-2xl font-bold">4</p>
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
                <p className="text-sm text-muted-foreground">物资总价值</p>
                <p className="text-2xl font-bold">{(totalValue / 10000).toFixed(0)}万</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 操作栏 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{getRoleTitle()}</CardTitle>
            <div className="flex items-center gap-2">
              {getRoleActions().map((action) => (
                <Button key={action} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  {action}
                </Button>
              ))}
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                新增物资
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 筛选条件 */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索物资名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="物资状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="在库">在库</SelectItem>
                <SelectItem value="托管中">托管中</SelectItem>
                <SelectItem value="出租中">出租中</SelectItem>
                <SelectItem value="待出库">待出库</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="物资类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类别</SelectItem>
                <SelectItem value="模板类">模板类</SelectItem>
                <SelectItem value="支护类">支护类</SelectItem>
                <SelectItem value="脚手架类">脚手架类</SelectItem>
                <SelectItem value="拼装类">拼装类</SelectItem>
                <SelectItem value="轨道类">轨道类</SelectItem>
                <SelectItem value="型材类">型材类</SelectItem>
                <SelectItem value="电线电缆">电线电缆</SelectItem>
                <SelectItem value="房屋建筑类">房屋建筑类</SelectItem>
                <SelectItem value="其他材料">其他材料</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              更多筛选
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
          </div>

          {/* 物资列表 */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">序号</TableHead>
                  <TableHead className="w-[120px]">物资编号</TableHead>
                  <TableHead>物资名称</TableHead>
                  <TableHead>规格型号</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead className="text-right">数量</TableHead>
                  <TableHead>存放位置</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">价值(元)</TableHead>
                  <TableHead className="w-[150px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material, idx) => (
                  <TableRow key={material.id}>
                    <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{material.id}</TableCell>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell className="text-muted-foreground">{material.spec}</TableCell>
                    <TableCell>{material.category}</TableCell>
                    <TableCell className="text-right">
                      {material.quantity} {material.unit}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{material.location}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[material.status]?.variant || "default"}>
                        {material.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {material.value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
