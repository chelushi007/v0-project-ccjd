"use client"

import {
  Building2,
  Warehouse,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Shield,
  FileText,
  Phone,
  Mail,
  Globe,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Briefcase,
  CreditCard,
  Award,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// 当前登录用户所属的企业（仓储单位角色）
const enterprise = {
  shortName: "天河仓储",
  name: "广州天河仓储服务有限公司",
  role: "仓储单位",
  roleIcon: Warehouse,
  code: "TH-WH-2023-002",
  type: "有限责任公司",
  status: "已激活",
  creditScore: 95,
  registeredCapital: "2,000 万元",
  establishDate: "2015-08-23",
  legalPerson: "陈宏伟",
  contact: "王秀英",
  phone: "020-3838 6666",
  email: "service@th-warehouse.com",
  address: "广东省广州市天河区科韵路38号",
  businessScope: "仓储服务、货物存放、物流配送、库存管理",
  certifications: ["仓储服务一级资质", "ISO9001质量体系", "AA级信用企业"],
  stats: [
    { label: "运营仓储面积", value: "12.5", unit: "万㎡" },
    { label: "下辖站点", value: "8", unit: "个" },
    { label: "服务客户", value: "126", unit: "家" },
  ],
  // 仓储单位 - 无需认证；仓储单位可申请为站点单位
  needCertify: false,
  upgradeTarget: "站点单位",
  upgradeDescription: "升级为站点单位后，可独立接收仓储委托与开展专业仓储运营",
}

// 资质文件
const certFiles = [
  { name: "营业执照", status: "已上传", date: "2024-01-15", expiry: "长期有效" },
  { name: "组织机构代码证", status: "已上传", date: "2024-01-15", expiry: "长期有效" },
  { name: "税务登记证", status: "已上传", date: "2024-01-15", expiry: "长期有效" },
  { name: "ISO9001质量体系认证", status: "已上传", date: "2024-03-20", expiry: "2027-03-19" },
]

export function EnterpriseCenter() {
  const RoleIcon = enterprise.roleIcon

  return (
    <div className="space-y-6">
      {/* 企业信息卡片 */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-green-500" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                企业信息
              </CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-500/20">
                <RoleIcon className="w-3 h-3 mr-1" />
                {enterprise.role}
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              编辑信息
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 企业主体信息 */}
          <div className="flex items-start gap-5">
            <Avatar className="w-20 h-20 rounded-2xl shrink-0 bg-green-500/10 border border-green-500/20">
              <AvatarFallback className="rounded-2xl bg-transparent text-green-600 text-2xl font-bold">
                {enterprise.shortName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h2 className="text-xl font-bold text-foreground">{enterprise.name}</h2>
                <Badge className="bg-green-500/10 text-green-600 border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {enterprise.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {enterprise.type}
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  企业编码：{enterprise.code}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  信用分：<span className="text-green-600 font-medium">{enterprise.creditScore}</span>
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {enterprise.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {enterprise.email}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {enterprise.address}
                </span>
              </div>
            </div>
          </div>

          {/* 基础注册信息 */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">注册资本</p>
              <p className="text-sm font-medium">{enterprise.registeredCapital}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">成立日期</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                {enterprise.establishDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">法定代表人</p>
              <p className="text-sm font-medium">{enterprise.legalPerson}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">主要联系人</p>
              <p className="text-sm font-medium">{enterprise.contact}</p>
            </div>
          </div>

          {/* 核心数据 */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {enterprise.stats.map((s) => (
              <div key={s.label} className="bg-green-500/5 border border-green-500/10 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-green-600">
                  {s.value}
                  <span className="text-sm font-medium ml-1 text-muted-foreground">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 企业详情卡片 */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-green-500" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                企业详情
              </CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-500/20">
                {enterprise.role}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* 认证状态 - 仓储单位无需认证 */}
          {!enterprise.needCertify ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/40 border border-border">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">无需企业资质认证</p>
                <p className="text-xs text-muted-foreground mt-1">
                  「{enterprise.role}」属于基础企业角色，系统已默认开通，可直接发布与管理对应业务。
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">企业认证已通过</p>
                  <Badge className="bg-green-500/10 text-green-600 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    已认证
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  企业已完成身份与资质审核，可开展该角色对应的全部业务。
                </p>
              </div>
            </div>
          )}

          {/* 业务范围 */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              业务范围
            </h4>
            <p className="text-sm text-foreground leading-relaxed bg-muted/30 rounded-lg p-3">
              {enterprise.businessScope}
            </p>
          </div>

          {/* 资质荣誉 */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              资质荣誉
            </h4>
            <div className="flex flex-wrap gap-2">
              {enterprise.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs py-1">
                  <Award className="w-3 h-3 mr-1 text-amber-500" />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          {/* 资质文件 - 需要认证时才显示 */}
          {enterprise.needCertify && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                资质文件
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {certFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {file.expiry}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 角色升级入口 */}
          {enterprise.upgradeTarget && (
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">角色升级</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {enterprise.upgradeDescription}
                  </p>
                </div>
                <Button size="sm">
                  申请为{enterprise.upgradeTarget}
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
