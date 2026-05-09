"use client"

import { useState } from "react"
import {
  ClipboardList,
  CheckSquare,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
  Filter,
  Search,
  ChevronRight,
  Calendar,
  User,
  Building2,
  Package,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 待办事项数据
const todoItems = {
  entrust: [
    {
      id: "E001",
      title: "仓储委托运营申请",
      applicant: "中铁建工集团",
      type: "委托运营",
      createTime: "2024-01-20 10:30",
      deadline: "2024-01-25",
      status: "pending",
      priority: "high",
      description: "申请将广州番禺仓储站点的5000平方米仓储空间委托运营",
    },
    {
      id: "E002",
      title: "物资托管申请",
      applicant: "中铁物资北京公司",
      type: "物资托管",
      createTime: "2024-01-19 14:20",
      deadline: "2024-01-24",
      status: "pending",
      priority: "medium",
      description: "申请托管钢材物资3000吨",
    },
    {
      id: "E003",
      title: "仓储出租委托",
      applicant: "中铁隧道局",
      type: "委托出租",
      createTime: "2024-01-18 09:15",
      deadline: "2024-01-23",
      status: "processing",
      priority: "low",
      description: "深圳龙岗仓储基地整体委托出租",
    },
  ],
  approval: [
    {
      id: "A001",
      title: "合同审批 - 仓储租赁协议",
      applicant: "张三",
      type: "合同审批",
      createTime: "2024-01-20 15:00",
      deadline: "2024-01-22",
      status: "pending",
      priority: "high",
      description: "广州站点与中铁建工的租赁合同审批",
    },
    {
      id: "A002",
      title: "费用审批 - 仓储服务费",
      applicant: "李四",
      type: "费用审批",
      createTime: "2024-01-19 11:30",
      deadline: "2024-01-21",
      status: "pending",
      priority: "high",
      description: "12月份仓储服务费结算审批",
    },
    {
      id: "A003",
      title: "资质审核 - 新增站点",
      applicant: "王五",
      type: "资质审核",
      createTime: "2024-01-17 16:45",
      deadline: "2024-01-27",
      status: "processing",
      priority: "medium",
      description: "东莞塘厦新站点资质材料审核",
    },
    {
      id: "A004",
      title: "入库审批 - 物资入库申请",
      applicant: "赵六",
      type: "入库审批",
      createTime: "2024-01-16 10:00",
      deadline: "2024-01-26",
      status: "pending",
      priority: "low",
      description: "钢材物资入库申请审批",
    },
  ],
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">紧急</Badge>
    case "medium":
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">一般</Badge>
    default:
      return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">低</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          <Clock className="w-3 h-3 mr-1" />
          待处理
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          处理中
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckSquare className="w-3 h-3 mr-1" />
          已完成
        </Badge>
      )
  }
}

export function TodoList() {
  const [activeTab, setActiveTab] = useState("entrust")
  const [searchKeyword, setSearchKeyword] = useState("")

  const stats = {
    total: todoItems.entrust.length + todoItems.approval.length,
    entrust: todoItems.entrust.length,
    approval: todoItems.approval.length,
    urgent: [...todoItems.entrust, ...todoItems.approval].filter((item) => item.priority === "high").length,
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">待办事项</h1>
          <p className="text-muted-foreground mt-1">处理委托受理和审批事项</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">全部待办</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">委托受理</p>
                <p className="text-2xl font-bold mt-1">{stats.entrust}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">审批事项</p>
                <p className="text-2xl font-bold mt-1">{stats.approval}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">紧急事项</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{stats.urgent}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 待办列表 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">待办列表</CardTitle>
              <CardDescription>查看和处理各类待办事项</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索待办事项..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="high">紧急</SelectItem>
                  <SelectItem value="medium">一般</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="entrust" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                委托受理
                <Badge variant="secondary" className="ml-1">
                  {stats.entrust}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approval" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                审批事项
                <Badge variant="secondary" className="ml-1">
                  {stats.approval}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entrust" className="mt-0">
              <div className="space-y-3">
                {todoItems.entrust.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {item.applicant}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            截止：{item.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.createTime}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        处理
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approval" className="mt-0">
              <div className="space-y-3">
                {todoItems.approval.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.applicant}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            截止：{item.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.createTime}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          驳回
                        </Button>
                        <Button size="sm">
                          通过
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
