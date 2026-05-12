"use client"

import { useState } from "react"
import {
  Building2,
  Warehouse,
  MapPin,
  Truck,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// 五种企业角色对应的实际企业数据
const enterpriseRoles = [
  {
    id: "property-owner",
    role: "物权单位",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    accent: "bg-blue-500",
    needCertify: false,
    enterprise: {
      shortName: "中铁",
      name: "中铁物资华南有限公司",
      code: "ZTWZ-HN-001",
      type: "国有企业",
      status: "已激活",
      creditScore: 98,
      registeredCapital: "5,000 万元",
      establishDate: "2010-05-18",
      legalPerson: "张志强",
      contact: "李建国",
      phone: "020-8888 8888",
      email: "contact@crmc-south.com",
      address: "广东省广州市天河区天河路100号",
      businessScope: "物资采购、物资管理、物资调配、供应链管理",
      certifications: ["AAA信用企业", "国资委直属", "ISO9001质量体系"],
      stats: [
        { label: "管理物资种类", value: "286", unit: "类" },
        { label: "物资总价值", value: "12.6", unit: "亿元" },
        { label: "合作单位", value: "48", unit: "家" },
      ],
      relatedRoles: [],
    },
  },
  {
    id: "warehouse-unit",
    role: "仓储单位",
    icon: Warehouse,
    color: "text-green-600",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    accent: "bg-green-500",
    needCertify: false,
    enterprise: {
      shortName: "天河仓储",
      name: "广州天河仓储服务有限公司",
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
      relatedRoles: ["申请为站点单位"],
    },
  },
  {
    id: "warehouse-site",
    role: "仓储站点",
    icon: MapPin,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    accent: "bg-orange-500",
    needCertify: true,
    enterprise: {
      shortName: "番禺基地",
      name: "番禺综合仓储基地",
      code: "PY-SITE-2022-003",
      type: "仓储站点",
      status: "已认证",
      creditScore: 92,
      registeredCapital: "—",
      establishDate: "2018-11-12",
      legalPerson: "刘大鹏",
      contact: "赵丽华",
      phone: "020-3456 7890",
      email: "py-site@th-warehouse.com",
      address: "广东省广州市番禺区南村镇创业大道88号",
      businessScope: "综合仓储、危化品仓储、冷链仓储、装卸搬运",
      certifications: ["危化品仓储许可证", "消防安全合格证", "海关监管资质"],
      stats: [
        { label: "可用仓储面积", value: "3.2", unit: "万㎡" },
        { label: "入库物资", value: "1,286", unit: "批" },
        { label: "出租率", value: "86", unit: "%" },
      ],
      relatedRoles: ["申请为专运单位"],
    },
  },
  {
    id: "transport-unit",
    role: "专运单位",
    icon: Truck,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    accent: "bg-purple-500",
    needCertify: true,
    enterprise: {
      shortName: "前海专运",
      name: "深圳前海专运物流有限公司",
      code: "QH-TR-2021-004",
      type: "有限责任公司",
      status: "已认证",
      creditScore: 94,
      registeredCapital: "1,500 万元",
      establishDate: "2020-03-15",
      legalPerson: "周明辉",
      contact: "孙倩",
      phone: "0755-8866 1234",
      email: "operation@qh-transport.com",
      address: "广东省深圳市南山区前海路168号",
      businessScope: "专业运输、物流配送、运营托管、装卸服务",
      certifications: ["道路运输经营许可", "危化品运输资质", "ISO45001认证"],
      stats: [
        { label: "运营车辆", value: "126", unit: "辆" },
        { label: "服务站点", value: "32", unit: "个" },
        { label: "年运输量", value: "8.6", unit: "万吨" },
      ],
      relatedRoles: [],
    },
  },
  {
    id: "material-user",
    role: "物资使用方",
    icon: Users,
    color: "text-cyan-600",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    accent: "bg-cyan-500",
    needCertify: true,
    enterprise: {
      shortName: "地铁建设",
      name: "广州地铁建设有限公司",
      code: "GZM-USE-2020-005",
      type: "国有企业",
      status: "已认证",
      creditScore: 96,
      registeredCapital: "3,800 万元",
      establishDate: "2012-09-08",
      legalPerson: "黄志伟",
      contact: "林雅琴",
      phone: "020-8666 2222",
      email: "purchase@gz-metro.com",
      address: "广东省广州市越秀区中山五路123号",
      businessScope: "城市轨道交通建设、地铁工程施工、市政基础设施",
      certifications: ["特级建造资质", "市政公用工程一级", "安全生产许可证"],
      stats: [
        { label: "在建项目", value: "16", unit: "个" },
        { label: "年采购量", value: "5.8", unit: "亿元" },
        { label: "合作年限", value: "12", unit: "年" },
      ],
      relatedRoles: [],
    },
  },
]

export function EnterpriseCenter() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = enterpriseRoles[activeIndex]
  const Icon = active.icon

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? enterpriseRoles.length - 1 : prev - 1))
  }
  const handleNext = () => {
    setActiveIndex((prev) => (prev === enterpriseRoles.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-6">
      {/* 企业信息卡片 */}
      <Card className="overflow-hidden">
        <div className={`h-1 ${active.accent}`} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                企业信息
              </CardTitle>
              <Badge variant="outline" className={`${active.color} ${active.border}`}>
                <Icon className="w-3 h-3 mr-1" />
                {active.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="h-8 w-8"
                aria-label="切换上一个企业角色"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {activeIndex + 1} / {enterpriseRoles.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                aria-label="切换下一个企业角色"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 企业 Logo 与基本信息 */}
            <div className="flex items-start gap-4 lg:w-1/3">
              <Avatar className={`w-16 h-16 rounded-lg ${active.bg}`}>
                <AvatarFallback
                  className={`rounded-lg ${active.bg} ${active.color} text-base font-bold`}
                >
                  {active.enterprise.shortName}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-balance">{active.enterprise.name}</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  企业编码：{active.enterprise.code}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                  <span>{active.enterprise.type}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    信用评分 {active.enterprise.creditScore}
                  </span>
                </div>
                <div className="mt-3">
                  {active.needCertify ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {active.enterprise.status}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      无需认证 · 默认开通
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* 联系与地址 */}
            <div className="flex-1 lg:border-l border-border lg:pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem icon={Phone} label="联系���话" value={active.enterprise.phone} />
                <InfoItem icon={Mail} label="联系邮箱" value={active.enterprise.email} />
                <InfoItem icon={Users} label="法定代表人" value={active.enterprise.legalPerson} />
                <InfoItem icon={Briefcase} label="对接联系人" value={active.enterprise.contact} />
                <InfoItem icon={CreditCard} label="注册资本" value={active.enterprise.registeredCapital} />
                <InfoItem icon={Calendar} label="成立日期" value={active.enterprise.establishDate} />
              </div>
              <div className="mt-3 flex items-start gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">注册地址</p>
                  <p className="text-foreground">{active.enterprise.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 核心数据 */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
            {active.enterprise.stats.map((stat) => (
              <div key={stat.label} className={`p-3 rounded-lg ${active.bg}`}>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className={`text-xl font-bold ${active.color}`}>{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 企业详情卡片 */}
      <Card className="overflow-hidden">
        <div className={`h-1 ${active.accent}`} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                企业详情
              </CardTitle>
              <Badge variant="outline" className={`${active.color} ${active.border}`}>
                <Icon className="w-3 h-3 mr-1" />
                {active.enterprise.shortName}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="h-8 w-8"
                aria-label="切换上一个企业角色"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {activeIndex + 1} / {enterpriseRoles.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                aria-label="切换下一个企业角色"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            查看与管理「{active.role}」身份下的资质文件、业务范围与认证状态
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 认证状态横幅 */}
          {!active.needCertify ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/40 border border-border">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">无需企业资质认证</p>
                <p className="text-xs text-muted-foreground mt-1">
                  「{active.role}」属于基础企业角色，系统已默认开通，可直接发布与管理对应业务。
                </p>
              </div>
            </div>
          ) : (
            <div className={`flex items-start gap-3 p-4 rounded-lg ${active.bg} border ${active.border}`}>
              <CheckCircle2 className={`w-5 h-5 ${active.color} shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className="font-medium text-sm">已通过企业资质认证</p>
                <p className="text-xs text-muted-foreground mt-1">
                  「{active.role}」需经平台审核认证，请确保企业资质有效并及时更新。
                </p>
              </div>
              <Button variant="outline" size="sm">
                查看认证记录
              </Button>
            </div>
          )}

          {/* 业务范围与资质 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">业务范围</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {active.enterprise.businessScope}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">已获资质</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {active.enterprise.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="font-normal">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 资质文件 */}
          {active.needCertify && (
            <div>
              <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                资质文件
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {["营业执照", "组织机构代码证", "税务登记证", "法人授权书"].map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate">{doc}</p>
                        <p className="text-[11px] text-muted-foreground">2024-01-15</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 角色升级入口 */}
          {active.enterprise.relatedRoles.length > 0 && (
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">角色升级</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {active.role === "仓储单位"
                      ? "作为仓储单位，您可申请将旗下仓库登记为「站点单位」，获取更精细化的站点运营能力。"
                      : "作为仓储站点，您可进一步申请成为「专运单位」，承接平台的专业运营托管业务。"}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {active.enterprise.relatedRoles.map((label) => (
                    <Button key={label} size="sm" className="whitespace-nowrap">
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}
