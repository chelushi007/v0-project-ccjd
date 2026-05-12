"use client"

import { useState } from "react"
import { Search, Plus, Eye, Edit, Trash2, Warehouse, Package, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// 仓储自主出租需求单
const selfRentDemands = [
  {
    id: "ZZ20260512001",
    title: "中铁建广州南沙综合仓储基地 15000m²",
    location: "广东省广州市南沙区",
    area: "15000m²",
    type: "综合仓储",
    price: "0.56元/m²/天",
    publishDate: "2026-05-10",
    status: "已发布",
    views: 128,
  },
  {
    id: "ZZ20260511002",
    title: "中铁建深圳前海智慧仓储基地 8000m²",
    location: "广东省深圳市南山区",
    area: "8000m²",
    type: "智慧仓储",
    price: "0.52元/m²/天",
    publishDate: "2026-05-09",
    status: "已发布",
    views: 96,
  },
  {
    id: "ZZ20260510003",
    title: "中铁建东莞虎门港务仓储基地 25000m²",
    location: "广东省东莞市虎门镇",
    area: "25000m²",
    type: "港口仓储",
    price: "0.38元/m²/天",
    publishDate: "2026-05-08",
    status: "草稿",
    views: 0,
  },
]

// 仓储委托出租需求单
const entrustRentDemands = [
  {
    id: "WT20260512001",
    title: "中铁十六局佛山顺德钢构仓储基地 6000m²",
    location: "广东省佛山市顺德区",
    area: "6000m²",
    type: "专业仓储",
    delegate: "中铁十六局集团华南分公司",
    publishDate: "2026-05-11",
    status: "受理中",
    progress: "审核通过",
  },
  {
    id: "WT20260511002",
    title: "中铁二十二局惠州大亚湾危化品仓库 4000m²",
    location: "广东省惠州市大亚湾区",
    area: "4000m²",
    type: "危化品仓储",
    delegate: "中铁二十二局集团华南分公司",
    publishDate: "2026-05-10",
    status: "受理中",
    progress: "等待匹配",
  },
  {
    id: "WT20260509003",
    title: "中铁二十四局中山火炬冷链仓库 3500m²",
    location: "广东省中山市火炬开发区",
    area: "3500m²",
    type: "冷链仓储",
    delegate: "中铁二十四局集团华南分公司",
    publishDate: "2026-05-08",
    status: "已成交",
    progress: "已签约",
  },
]

// 物资出租需求单
const materialRentDemands = [
  {
    id: "WZ20260512001",
    title: "Q235B热轧H型钢出租 500吨",
    materialType: "钢材",
    quantity: "500吨",
    location: "广东省广州市黄埔区",
    price: "1800元/吨/月",
    publishDate: "2026-05-11",
    status: "已发布",
    views: 84,
  },
  {
    id: "WZ20260511002",
    title: "建筑钢管脚手架出租 2000套",
    materialType: "钢材",
    quantity: "2000套",
    location: "广东省深圳市宝安区",
    price: "15元/套/天",
    publishDate: "2026-05-10",
    status: "已发布",
    views: 62,
  },
  {
    id: "WZ20260510003",
    title: "塔吊设备出租 5台",
    materialType: "机械设备",
    quantity: "5台",
    location: "广东省佛山市顺德区",
    price: "28000元/台/月",
    publishDate: "2026-05-09",
    status: "草稿",
    views: 0,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "已发布":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">已发布</Badge>
    case "草稿":
      return <Badge variant="secondary">草稿</Badge>
    case "受理中":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">受理中</Badge>
    case "已成交":
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">已成交</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function DemandManagement() {
  const [activeTab, setActiveTab] = useState("self-rent")

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">需求管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理未形成订单之前的仓储自主出租、委托出租和物资出租需求单
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新建需求
        </Button>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Warehouse className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{selfRentDemands.length}</div>
                <div className="text-xs text-muted-foreground mt-1">仓储自主出租</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{entrustRentDemands.length}</div>
                <div className="text-xs text-muted-foreground mt-1">仓储委托出租</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{materialRentDemands.length}</div>
                <div className="text-xs text-muted-foreground mt-1">物资出租</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 需求列表 */}
      <Card>
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <TabsList>
                <TabsTrigger value="self-rent">
                  <Warehouse className="w-4 h-4 mr-2" />
                  仓储自主出租
                </TabsTrigger>
                <TabsTrigger value="entrust-rent">
                  <FileText className="w-4 h-4 mr-2" />
                  仓储委托出租
                </TabsTrigger>
                <TabsTrigger value="material-rent">
                  <Package className="w-4 h-4 mr-2" />
                  物资出租
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="搜索需求单号或标题" className="pl-9 w-64" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="processing">受理中</SelectItem>
                    <SelectItem value="completed">已成交</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 仓储自主出租 */}
            <TabsContent value="self-rent" className="mt-4">
              <CardTitle className="text-base mb-3">仓储自主出租需求单</CardTitle>
              <CardContent className="px-0 py-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>需求单号</TableHead>
                      <TableHead>标题</TableHead>
                      <TableHead>所在区域</TableHead>
                      <TableHead>面积</TableHead>
                      <TableHead>仓储类型</TableHead>
                      <TableHead>租金单价</TableHead>
                      <TableHead>发布时间</TableHead>
                      <TableHead>浏览量</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selfRentDemands.map((demand) => (
                      <TableRow key={demand.id}>
                        <TableCell className="font-mono text-xs">{demand.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{demand.title}</TableCell>
                        <TableCell className="text-muted-foreground">{demand.location}</TableCell>
                        <TableCell>{demand.area}</TableCell>
                        <TableCell>{demand.type}</TableCell>
                        <TableCell className="text-primary font-medium">{demand.price}</TableCell>
                        <TableCell className="text-muted-foreground">{demand.publishDate}</TableCell>
                        <TableCell>{demand.views}</TableCell>
                        <TableCell>{getStatusBadge(demand.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </TabsContent>

            {/* 仓储委托出租 */}
            <TabsContent value="entrust-rent" className="mt-4">
              <CardTitle className="text-base mb-3">仓储委托出租需求单</CardTitle>
              <CardContent className="px-0 py-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>需求单号</TableHead>
                      <TableHead>标题</TableHead>
                      <TableHead>所在区域</TableHead>
                      <TableHead>面积</TableHead>
                      <TableHead>仓储类型</TableHead>
                      <TableHead>委托方</TableHead>
                      <TableHead>发布时间</TableHead>
                      <TableHead>进度</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entrustRentDemands.map((demand) => (
                      <TableRow key={demand.id}>
                        <TableCell className="font-mono text-xs">{demand.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{demand.title}</TableCell>
                        <TableCell className="text-muted-foreground">{demand.location}</TableCell>
                        <TableCell>{demand.area}</TableCell>
                        <TableCell>{demand.type}</TableCell>
                        <TableCell>{demand.delegate}</TableCell>
                        <TableCell className="text-muted-foreground">{demand.publishDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {demand.progress}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(demand.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </TabsContent>

            {/* 物资出租 */}
            <TabsContent value="material-rent" className="mt-4">
              <CardTitle className="text-base mb-3">物资出租需求单</CardTitle>
              <CardContent className="px-0 py-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>需求单号</TableHead>
                      <TableHead>标题</TableHead>
                      <TableHead>物资类型</TableHead>
                      <TableHead>数量</TableHead>
                      <TableHead>所在区域</TableHead>
                      <TableHead>租金单价</TableHead>
                      <TableHead>发布时间</TableHead>
                      <TableHead>浏览量</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialRentDemands.map((demand) => (
                      <TableRow key={demand.id}>
                        <TableCell className="font-mono text-xs">{demand.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{demand.title}</TableCell>
                        <TableCell>{demand.materialType}</TableCell>
                        <TableCell>{demand.quantity}</TableCell>
                        <TableCell className="text-muted-foreground">{demand.location}</TableCell>
                        <TableCell className="text-primary font-medium">{demand.price}</TableCell>
                        <TableCell className="text-muted-foreground">{demand.publishDate}</TableCell>
                        <TableCell>{demand.views}</TableCell>
                        <TableCell>{getStatusBadge(demand.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  )
}
