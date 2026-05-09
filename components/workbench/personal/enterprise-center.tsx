"use client"

import { useState } from "react"
import {
  Building2,
  Warehouse,
  MapPin,
  Truck,
  Users,
  ChevronRight,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Shield,
  FileText,
  Phone,
  Mail,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// 角色类型定义
const roleTypes = [
  {
    id: "property-owner",
    label: "物权单位",
    icon: Building2,
    description: "拥有物资所有权的单位",
    color: "bg-blue-500/10 text-blue-600",
    badgeColor: "bg-blue-500",
  },
  {
    id: "warehouse-unit",
    label: "仓储单位",
    icon: Warehouse,
    description: "提供仓储服务的单位",
    color: "bg-green-500/10 text-green-600",
    badgeColor: "bg-green-500",
  },
  {
    id: "warehouse-site",
    label: "仓储站点",
    icon: MapPin,
    description: "具体的仓储场地",
    color: "bg-orange-500/10 text-orange-600",
    badgeColor: "bg-orange-500",
  },
  {
    id: "transport-unit",
    label: "专运单位",
    icon: Truck,
    description: "提供专业运营服务的单位",
    color: "bg-purple-500/10 text-purple-600",
    badgeColor: "bg-purple-500",
  },
  {
    id: "material-user",
    label: "物资使用方",
    icon: Users,
    description: "物资的最终使用单位",
    color: "bg-cyan-500/10 text-cyan-600",
    badgeColor: "bg-cyan-500",
  },
]

// 企业信息示例
const enterpriseInfo = {
  name: "中铁物资华南有限公司",
  code: "ZTWZ-HN-001",
  type: "国有企业",
  status: "已认证",
  creditScore: 98,
  registeredCapital: "5000万元",
  establishDate: "2010-05-18",
  legalPerson: "张三",
  contact: "李四",
  phone: "020-88888888",
  email: "contact@crmc-south.com",
  address: "广东省广州市天河区天河路100号",
  businessScope: "仓储服务、物流运输、物资贸易、供应链管理",
  certifications: ["ISO9001质量管理体系", "ISO14001环境管理体系", "AAA信用企业"],
}

// 角色认证状态
const roleStatus = [
  { roleId: "property-owner", status: "certified", date: "2023-01-15" },
  { roleId: "warehouse-unit", status: "certified", date: "2023-03-20" },
  { roleId: "warehouse-site", status: "pending", date: "2024-01-10" },
  { roleId: "transport-unit", status: "certified", date: "2023-06-08" },
  { roleId: "material-user", status: "uncertified", date: null },
]

export function EnterpriseCenter() {
  const [activeRole, setActiveRole] = useState("property-owner")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "certified":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            已认证
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            审核中
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            未认证
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">企业中心</h1>
          <p className="text-muted-foreground mt-1">管理企业信息和角色认证</p>
        </div>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          编辑企业信息
        </Button>
      </div>

      {/* 企业概览卡片 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 企业Logo和基本信息 */}
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-2xl font-bold">
                  中铁
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{enterpriseInfo.name}</h2>
                  <Badge className="bg-green-500 text-white">{enterpriseInfo.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  企业编码：{enterpriseInfo.code}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    信用评分：{enterpriseInfo.creditScore}分
                  </span>
                  <span>{enterpriseInfo.type}</span>
                </div>
              </div>
            </div>

            {/* 联系信息 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:border-l md:pl-6 border-border">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{enterpriseInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{enterpriseInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span>{enterpriseInfo.address}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 角色管理 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 角色列表 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">角色管理</CardTitle>
            <CardDescription>选择并管理企业的不同角色身份</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {roleTypes.map((role) => {
              const Icon = role.icon
              const status = roleStatus.find((s) => s.roleId === role.id)
              const isActive = activeRole === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{role.label}</span>
                      {getStatusBadge(status?.status || "uncertified")}
                    </div>
                    <span className="text-xs text-muted-foreground">{role.description}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground ${isActive ? "text-primary" : ""}`} />
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* 角色详情 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {roleTypes.find((r) => r.id === activeRole)?.label}角色详情
                </CardTitle>
                <CardDescription>查看和管理该角色的详细信息</CardDescription>
              </div>
              {roleStatus.find((s) => s.roleId === activeRole)?.status !== "certified" && (
                <Button>申请认证</Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">基本信息</TabsTrigger>
                <TabsTrigger value="qualification">资质文件</TabsTrigger>
                <TabsTrigger value="history">操作记录</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <label className="text-xs text-muted-foreground">角色状态</label>
                      <div className="mt-1">
                        {getStatusBadge(roleStatus.find((s) => s.roleId === activeRole)?.status || "uncertified")}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <label className="text-xs text-muted-foreground">认证时间</label>
                      <p className="mt-1 font-medium">
                        {roleStatus.find((s) => s.roleId === activeRole)?.date || "未认证"}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <label className="text-xs text-muted-foreground">关联站点数</label>
                      <p className="mt-1 font-medium">12 个</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <label className="text-xs text-muted-foreground">业务范围</label>
                      <p className="mt-1 text-sm">{enterpriseInfo.businessScope}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <label className="text-xs text-muted-foreground">已获资质</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {enterpriseInfo.certifications.map((cert) => (
                          <Badge key={cert} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="qualification" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["营业执照", "组织机构代码证", "税务登记证", "法人授权书"].map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc}</p>
                          <p className="text-xs text-muted-foreground">已上传 2024-01-15</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <div className="space-y-3">
                  {[
                    { action: "更新企业信息", time: "2024-01-20 14:30", user: "李四" },
                    { action: "上传资质文件", time: "2024-01-15 10:20", user: "李四" },
                    { action: "通过角色认证", time: "2023-06-08 16:45", user: "系统" },
                    { action: "提交认证申请", time: "2023-06-01 09:00", user: "李四" },
                  ].map((record, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">{record.action}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{record.user}</span>
                        <span>{record.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
