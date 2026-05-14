"use client"

import { useState } from "react"
import {
  ClipboardList,
  CheckSquare,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  Calendar,
  User,
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Bell,
  MessageSquare,
  Info,
  ArrowUpRight,
  FilePen,
  Handshake,
  ShieldCheck,
  MapPin,
  LogOut,
  Truck,
  FileCheck,
  Package,
  Warehouse,
  Star,
  Repeat,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ── 数据 ────────────────────────────────────────────────────────────────────

const todoItems = {
  entrust: [
    {
      id: "E001",
      title: "仓储委托运营申请",
      applicant: "中铁十四局集团广州分公司",
      type: "委托运营",
      createTime: "2026-01-20 10:30",
      deadline: "2026-01-25",
      status: "pending",
      priority: "high",
      description: "申请将中铁建广州南沙综合仓储基地的5000平方米仓储空间委托运营",
    },
    {
      id: "E002",
      title: "物料托管申请",
      applicant: "中铁十一局广深城际项目部",
      type: "物料托管",
      createTime: "2026-01-19 14:20",
      deadline: "2026-01-24",
      status: "pending",
      priority: "medium",
      description: "申请托管钢材物料3000吨",
    },
    {
      id: "E003",
      title: "仓储出租委托",
      applicant: "中铁十八局集团华南分公司",
      type: "委托出租",
      createTime: "2026-01-18 09:15",
      deadline: "2026-01-23",
      status: "processing",
      priority: "low",
      description: "中铁建深圳龙岗仓储基地整体委托出租",
    },
  ],
  approval: [
    {
      id: "A001",
      title: "站点申请 - 东莞塘厦新站点",
      applicant: "本企业",
      type: "站点申请",
      createTime: "2026-01-20 15:00",
      submitTime: "2026-01-20 15:00",
      progress: "运营审核中",
      progressStep: 2,
      totalStep: 3,
      status: "processing",
      priority: "high",
      description: "申请在东莞塘厦新增仓储站点，由运营工作台审核中",
    },
    {
      id: "A002",
      title: "站点退出申请 - 深圳坪山站点",
      applicant: "本企业",
      type: "站点退出申请",
      createTime: "2026-01-19 11:30",
      submitTime: "2026-01-19 11:30",
      progress: "材料初审通过",
      progressStep: 1,
      totalStep: 3,
      status: "processing",
      priority: "medium",
      description: "申请退出中铁建深圳坪山仓储站点，运营工作台正在复核",
    },
    {
      id: "A003",
      title: "专运单位申请 - 中铁建物料华南",
      applicant: "本企业",
      type: "专运单位申请",
      createTime: "2026-01-17 16:45",
      submitTime: "2026-01-17 16:45",
      progress: "已提交待审核",
      progressStep: 1,
      totalStep: 3,
      status: "pending",
      priority: "medium",
      description: "申请成为物料专运单位，等待运营工作台受理",
    },
    {
      id: "A004",
      title: "专运单位退出申请 - 广州南沙",
      applicant: "本企业",
      type: "专运单位退出申请",
      createTime: "2026-01-16 10:00",
      submitTime: "2026-01-16 10:00",
      progress: "审核通过",
      progressStep: 3,
      totalStep: 3,
      status: "completed",
      priority: "low",
      description: "申请退出广州南沙专运单位资质，已审核通过",
    },
    {
      id: "A005",
      title: "过户申请 - HRB400 钢筋 3,000 吨",
      applicant: "本企业",
      type: "过户申请",
      createTime: "2026-01-20 09:30",
      submitTime: "2026-01-20 09:30",
      progress: "受让方确认中",
      progressStep: 2,
      totalStep: 3,
      status: "processing",
      priority: "high",
      description: "将广州南沙综合仓 HRB400 螺纹钢 3,000 吨过户至中铁二十三局深圳分公司",
    },
  ],
}

const messages = [
  {
    id: "M000",
    type: "review",
    title: "您收到了一条新评价",
    rating: 5,
    content:
      "中铁二十三局深圳分公司对「南沙综合仓储基地」给出 5 星评价：「响应迅速、出入库高效，单据清晰」。",
    time: "5分钟前",
    read: false,
  },
  {
    id: "M001",
    type: "system",
    title: "合同即将到期提醒",
    content: "您与中铁十四局集团广州分公司签订的仓储租赁合同将于7天后到期，请及时跟进续签事宜。",
    time: "10分钟前",
    read: false,
  },
  {
    id: "M002",
    type: "business",
    title: "新的委托运营申请",
    content: "中铁十一局广深城际项目部提交了一笔物料托管申请，请尽快处理。",
    time: "1小时前",
    read: false,
  },
  {
    id: "M003",
    type: "notice",
    title: "平台公告：服务费调整通知",
    content: "根据平台最新规定，自2026年2月1日起，仓储出租服务费率调整为0.5%，请知悉。",
    time: "昨天 14:30",
    read: true,
  },
  {
    id: "M004",
    type: "business",
    title: "订单支付成功",
    content: "中铁建深圳前海仓储基地租赁订单（ORD-2026-0118）已收到租金 ¥28,000.00，请查收。",
    time: "昨天 09:15",
    read: true,
  },
  {
    id: "M005",
    type: "system",
    title: "账号安全提醒",
    content: "您的账号于昨日18:32在广州登录，如非本人操作请及时修改密码。",
    time: "2天前",
    read: true,
  },
]

// ── 辅助组件 ─────────────────────────────────────────────────────────────────

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
          <Clock className="w-3 h-3 mr-1" />待处理
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <AlertCircle className="w-3 h-3 mr-1" />处理中
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckSquare className="w-3 h-3 mr-1" />已完成
        </Badge>
      )
  }
}

const getApprovalTypeIcon = (type: string) => {
  switch (type) {
    case "站点申请":
      return <MapPin className="w-3.5 h-3.5 text-blue-600" />
    case "站点退出申请":
      return <LogOut className="w-3.5 h-3.5 text-orange-600" />
    case "专运单位申请":
      return <Truck className="w-3.5 h-3.5 text-purple-600" />
    case "专运单位退出申请":
      return <LogOut className="w-3.5 h-3.5 text-red-600" />
    case "过户申请":
      return <Repeat className="w-3.5 h-3.5 text-emerald-600" />
    default:
      return <FileText className="w-3.5 h-3.5 text-muted-foreground" />
  }
}

const getMsgIcon = (type: string) => {
  switch (type) {
    case "review":
      return <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    case "business":
      return <MessageSquare className="w-4 h-4 text-primary" />
    case "notice":
      return <Info className="w-4 h-4 text-yellow-500" />
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />
  }
}

// ── 快捷入口配置 ─────────────────────���────────────────────────────────────────

const quickApprovalEntries = [
  { label: "合同审批", icon: FilePen, count: 2, color: "text-blue-600", bg: "bg-blue-500/10" },
  { label: "站点申请", icon: MapPin, count: 1, color: "text-green-600", bg: "bg-green-500/10" },
  { label: "资质审核", icon: ShieldCheck, count: 1, color: "text-purple-600", bg: "bg-purple-500/10" },
  { label: "入库申请", icon: Package, count: 3, color: "text-orange-600", bg: "bg-orange-500/10" },
]

const quickBizEntries = [
  { label: "委托受理", icon: Handshake, count: 3, color: "text-primary", bg: "bg-primary/10" },
  { label: "对账确认", icon: FileCheck, count: 5, color: "text-accent", bg: "bg-accent/10" },
  { label: "合同签署", icon: FileText, count: 2, color: "text-blue-600", bg: "bg-blue-500/10" },
  { label: "订单确认", icon: ClipboardList, count: 4, color: "text-orange-600", bg: "bg-orange-500/10" },
]

// 交易统计配置
const tradeStats = [
  { label: "仓储成交订单", value: "18", unit: "笔", trend: "+15%", up: true, icon: Warehouse, color: "text-blue-600", bg: "bg-blue-500/10" },
  { label: "物料成交订单", value: "10", unit: "笔", trend: "+8%", up: true, icon: Package, color: "text-green-600", bg: "bg-green-500/10" },
  { label: "仓储成交金额", value: "98.6", unit: "万元", trend: "+12.3%", up: true, icon: Warehouse, color: "text-purple-600", bg: "bg-purple-500/10" },
  { label: "物料成交金额", value: "57.8", unit: "万元", trend: "-3.5%", up: false, icon: Package, color: "text-orange-600", bg: "bg-orange-500/10" },
]

// ── 主组件 ──────────────────────────────────────────────────────────────────

interface TodoListProps {
  activeTab?: string
  roleType?: "property" | "warehouse-unit" | "warehouse-site" | "transport" | "user"
}

export function TodoList({ roleType = "property" }: TodoListProps) {
  const [todoTab, setTodoTab] = useState<"entrust" | "approval">("entrust")
  const [msgTab, setMsgTab] = useState<"all" | "unread">("all")

  const totalTodo = todoItems.entrust.length + todoItems.approval.length
  const urgentCount = [...todoItems.entrust, ...todoItems.approval].filter(i => i.priority === "high").length
  const unreadCount = messages.filter(m => !m.read).length

  const displayMessages = msgTab === "unread" ? messages.filter(m => !m.read) : messages

  return (
    <div className="space-y-6">

      {/* ── 第一行：快捷入口 ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        {/* 申请审批快捷入口 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                申请审批
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-primary px-2">
                全部 <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-4 gap-2">
              {quickApprovalEntries.map((entry) => (
                <button
                  key={entry.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <div className={`relative w-10 h-10 rounded-xl ${entry.bg} flex items-center justify-center`}>
                    <entry.icon className={`w-5 h-5 ${entry.color}`} />
                    {entry.count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {entry.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-foreground whitespace-nowrap">{entry.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 业务处理快捷入口 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-primary" />
                业务处理
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-primary px-2">
                全部 <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-4 gap-2">
              {quickBizEntries.map((entry) => (
                <button
                  key={entry.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <div className={`relative w-10 h-10 rounded-xl ${entry.bg} flex items-center justify-center`}>
                    <entry.icon className={`w-5 h-5 ${entry.color}`} />
                    {entry.count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {entry.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-foreground whitespace-nowrap">{entry.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 第二行：交易统计 + 站内消息 ──────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-4">

        {/* 交易统计（占3列） */}
        <div className="col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  交易统计
                </span>
                <span className="text-xs text-muted-foreground font-normal">本月</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {tradeStats.map((item) => (
                  <div key={item.label} className="p-3 bg-muted/40 rounded-lg flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-foreground">{item.value}</span>
                        <span className="text-xs text-muted-foreground">{item.unit}</span>
                        <span className={`flex items-center gap-0.5 ml-auto text-xs ${item.up ? "text-green-600" : "text-red-500"}`}>
                          {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{item.trend}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 近6个月成交金额趋势变化图 */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">近6个月成交金额趋势(万元)</p>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                      <span className="text-muted-foreground">仓储</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-accent" />
                      <span className="text-muted-foreground">物料</span>
                    </span>
                  </div>
                </div>
                {(() => {
                  const data = [
                    { month: "8月", warehouse: 58, material: 40 },
                    { month: "9月", warehouse: 68, material: 44 },
                    { month: "10月", warehouse: 82, material: 52 },
                    { month: "11月", warehouse: 88, material: 57 },
                    { month: "12月", warehouse: 84, material: 54 },
                    { month: "1月", warehouse: 98.6, material: 57.8 },
                  ]
                  const W = 600
                  const H = 180
                  const PAD_L = 38
                  const PAD_R = 16
                  const PAD_T = 22
                  const PAD_B = 22
                  const max = 120
                  const innerW = W - PAD_L - PAD_R
                  const innerH = H - PAD_T - PAD_B
                  const yTicks = [0, 30, 60, 90, 120]
                  const xAt = (i: number) =>
                    PAD_L + (innerW * i) / (data.length - 1)
                  const yAt = (v: number) =>
                    PAD_T + innerH - (innerH * v) / max
                  // Catmull-Rom → Cubic Bezier 平滑曲线
                  const buildSmoothPath = (key: "warehouse" | "material") => {
                    const pts = data.map((d, i) => [xAt(i), yAt(d[key])] as const)
                    if (pts.length < 2) return ""
                    let path = `M ${pts[0][0]} ${pts[0][1]}`
                    for (let i = 0; i < pts.length - 1; i++) {
                      const p0 = pts[i - 1] ?? pts[i]
                      const p1 = pts[i]
                      const p2 = pts[i + 1]
                      const p3 = pts[i + 2] ?? p2
                      const cp1x = p1[0] + (p2[0] - p0[0]) / 6
                      const cp1y = p1[1] + (p2[1] - p0[1]) / 6
                      const cp2x = p2[0] - (p3[0] - p1[0]) / 6
                      const cp2y = p2[1] - (p3[1] - p1[1]) / 6
                      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`
                    }
                    return path
                  }
                  const buildArea = (key: "warehouse" | "material") =>
                    `${buildSmoothPath(key)} L ${xAt(data.length - 1)} ${
                      PAD_T + innerH
                    } L ${xAt(0)} ${PAD_T + innerH} Z`
                  const lastIdx = data.length - 1

                  return (
                    <div className="flex-1 w-full min-h-[180px]">
                      <svg
                        viewBox={`0 0 ${W} ${H}`}
                        className="w-full h-full"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="gradWarehouse" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="gradMaterial" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                          </linearGradient>
                          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow
                              dx="0"
                              dy="1.5"
                              stdDeviation="1.2"
                              floodOpacity="0.18"
                            />
                          </filter>
                        </defs>

                        {/* Y 轴刻度网格 + 数值 */}
                        {yTicks.map((tick) => {
                          const y = yAt(tick)
                          return (
                            <g key={tick}>
                              <line
                                x1={PAD_L}
                                y1={y}
                                x2={W - PAD_R}
                                y2={y}
                                stroke="currentColor"
                                className="text-border"
                                strokeDasharray="3 4"
                                strokeWidth="1"
                                opacity="0.55"
                              />
                              <text
                                x={PAD_L - 8}
                                y={y + 3}
                                textAnchor="end"
                                className="fill-muted-foreground"
                                style={{ fontSize: "10px" }}
                              >
                                {tick}
                              </text>
                            </g>
                          )
                        })}

                        {/* 最新月份竖向高亮 */}
                        <line
                          x1={xAt(lastIdx)}
                          y1={PAD_T}
                          x2={xAt(lastIdx)}
                          y2={PAD_T + innerH}
                          stroke="hsl(var(--primary))"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                          opacity="0.35"
                        />

                        {/* 面积 */}
                        <path d={buildArea("warehouse")} fill="url(#gradWarehouse)" />
                        <path d={buildArea("material")} fill="url(#gradMaterial)" />

                        {/* 折线 */}
                        <path
                          d={buildSmoothPath("warehouse")}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#softShadow)"
                        />
                        <path
                          d={buildSmoothPath("material")}
                          fill="none"
                          stroke="hsl(var(--accent))"
                          strokeWidth="2.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#softShadow)"
                        />

                        {/* 数据点：白边 + 内填色，最新月份放大 */}
                        {data.map((d, i) => {
                          const latest = i === lastIdx
                          const wR = latest ? 5 : 3.5
                          const mR = latest ? 5 : 3.5
                          return (
                            <g key={d.month}>
                              <circle
                                cx={xAt(i)}
                                cy={yAt(d.warehouse)}
                                r={wR}
                                fill="hsl(var(--card))"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                              />
                              <circle
                                cx={xAt(i)}
                                cy={yAt(d.material)}
                                r={mR}
                                fill="hsl(var(--card))"
                                stroke="hsl(var(--accent))"
                                strokeWidth="2"
                              />
                            </g>
                          )
                        })}

                        {/* 最新月份数值气泡 */}
                        {(() => {
                          const i = lastIdx
                          const wx = xAt(i)
                          const wy = yAt(data[i].warehouse)
                          const my = yAt(data[i].material)
                          return (
                            <g>
                              {/* 仓储气泡 */}
                              <rect
                                x={wx - 28}
                                y={wy - 22}
                                width="40"
                                height="16"
                                rx="8"
                                fill="hsl(var(--primary))"
                              />
                              <text
                                x={wx - 8}
                                y={wy - 11}
                                textAnchor="middle"
                                fill="hsl(var(--primary-foreground))"
                                style={{ fontSize: "10px", fontWeight: 600 }}
                              >
                                {data[i].warehouse}
                              </text>
                              {/* 物料气泡 */}
                              <rect
                                x={wx - 28}
                                y={my + 8}
                                width="40"
                                height="16"
                                rx="8"
                                fill="hsl(var(--accent))"
                              />
                              <text
                                x={wx - 8}
                                y={my + 19}
                                textAnchor="middle"
                                fill="hsl(var(--accent-foreground))"
                                style={{ fontSize: "10px", fontWeight: 600 }}
                              >
                                {data[i].material}
                              </text>
                            </g>
                          )
                        })()}

                        {/* X 轴标签 */}
                        {data.map((d, i) => (
                          <text
                            key={d.month}
                            x={xAt(i)}
                            y={H - 4}
                            textAnchor="middle"
                            className={
                              i === lastIdx
                                ? "fill-foreground"
                                : "fill-muted-foreground"
                            }
                            style={{
                              fontSize: "10px",
                              fontWeight: i === lastIdx ? 600 : 400,
                            }}
                          >
                            {d.month}
                          </text>
                        ))}
                      </svg>
                    </div>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 站内消息（占2列） */}
        <div className="col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-primary" />
                  站内消息
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-[10px] h-4 px-1.5">{unreadCount}</Badge>
                  )}
                </span>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-primary px-2">
                  全部 <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </Button>
              </CardTitle>
              <Tabs value={msgTab} onValueChange={(v) => setMsgTab(v as "all" | "unread")}>
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="all" className="h-6 text-xs px-3">全部</TabsTrigger>
                  <TabsTrigger value="unread" className="h-6 text-xs px-3">
                    未读
                    {unreadCount > 0 && <span className="ml-1 text-red-500">({unreadCount})</span>}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-0 flex-1 overflow-auto">
              <div className="space-y-1">
                {displayMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${!msg.read ? "bg-primary/5" : ""}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getMsgIcon(msg.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-xs font-medium truncate ${!msg.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {msg.title}
                        </span>
                        {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                      </div>
                      {msg.type === "review" && typeof msg.rating === "number" && (
                        <div className="flex items-center gap-0.5 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < msg.rating!
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-transparent text-muted-foreground/40"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-[10px] text-yellow-600 font-medium tabular-nums">
                            {msg.rating}.0
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {msg.content}
                      </p>
                      <span className="text-[10px] text-muted-foreground/60 mt-1 block">{msg.time}</span>
                    </div>
                  </div>
                ))}
                {displayMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mb-2 opacity-30" />
                    <span className="text-xs">暂无未读消息</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── 第三行：待办列表 ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              待办列表
              <Badge variant="secondary" className="ml-1">{totalTodo}</Badge>
              {urgentCount > 0 && (
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 ml-1">
                  {urgentCount} 紧急
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={todoTab} onValueChange={(v) => setTodoTab(v as "entrust" | "approval")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="entrust" className="flex items-center gap-2">
                <Handshake className="w-4 h-4" />
                委托受理
                <Badge variant="secondary" className="ml-1">{todoItems.entrust.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approval" className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                审批事项
                <Badge variant="secondary" className="ml-1">{todoItems.approval.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entrust" className="mt-0 space-y-3">
              {todoItems.entrust.map((item) => (
                <div key={item.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {getPriorityBadge(item.priority)}
                        {getStatusBadge(item.status)}
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </div>
                      <h3 className="font-medium text-foreground text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{item.applicant}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />截止：{item.deadline}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      处理<ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="approval" className="mt-0 space-y-3">
              {todoItems.approval.map((item) => (
                <div key={item.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {getStatusBadge(item.status)}
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          {getApprovalTypeIcon(item.type)}
                          {item.type}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>

                      {/* 进度条 */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            当前进度：<span className="font-medium text-foreground">{item.progress}</span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.progressStep}/{item.totalStep}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: item.totalStep }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 flex-1 rounded-full ${
                                idx < item.progressStep
                                  ? item.status === "completed"
                                    ? "bg-green-500"
                                    : "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />申请人：{item.applicant}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />提交时间：{item.submitTime}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">
                      查看详情<ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </div>
  )
}
