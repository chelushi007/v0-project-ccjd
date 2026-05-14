"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  FilePlus,
  ShieldCheck,
  AlertTriangle,
  Edit3,
  Copy,
  FileWarning,
} from "lucide-react"

const overview = [
  {
    label: "合同模板",
    value: 12,
    sub: "覆盖四大业务",
    icon: FileText,
    tone: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    label: "在管合同",
    value: 486,
    sub: "履行中 412",
    icon: ShieldCheck,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    label: "待合规审核",
    value: 8,
    sub: "其中加急 2",
    icon: AlertTriangle,
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    label: "本月新签",
    value: 36,
    sub: "金额 ¥24.6M",
    icon: FilePlus,
    tone: "text-indigo-700",
    bg: "bg-indigo-50",
  },
]

const bizColor: Record<string, string> = {
  仓储租赁: "bg-blue-50 text-blue-700 border-blue-200",
  物资存放: "bg-indigo-50 text-indigo-700 border-indigo-200",
  物资租赁: "bg-emerald-50 text-emerald-700 border-emerald-200",
  物资销售: "bg-amber-50 text-amber-700 border-amber-200",
}

const templates = [
  {
    id: "TPL-001",
    name: "标准仓储租赁合同（月租）",
    biz: "仓储租赁",
    version: "v3.2",
    usedCount: 248,
    updatedAt: "2026-05-12",
    status: "已启用",
  },
  {
    id: "TPL-002",
    name: "物资存放服务合同",
    biz: "物资存放",
    version: "v2.4",
    usedCount: 96,
    updatedAt: "2026-04-28",
    status: "已启用",
  },
  {
    id: "TPL-003",
    name: "物资租赁合同（含押金条款）",
    biz: "物资租赁",
    version: "v3.0",
    usedCount: 132,
    updatedAt: "2026-06-08",
    status: "已启用",
  },
  {
    id: "TPL-004",
    name: "物资销售合同（含分成条款）",
    biz: "物资销售",
    version: "v2.1",
    usedCount: 64,
    updatedAt: "2026-06-15",
    status: "已启用",
  },
  {
    id: "TPL-005",
    name: "仓储委托运营合同",
    biz: "仓储租赁",
    version: "v1.6",
    usedCount: 32,
    updatedAt: "2026-03-22",
    status: "已启用",
  },
  {
    id: "TPL-006",
    name: "物资销售合同（旧版）",
    biz: "物资销售",
    version: "v1.8",
    usedCount: 18,
    updatedAt: "2025-12-10",
    status: "已归档",
  },
]

const pendingContracts = [
  {
    id: "HT-2026-0628-001",
    title: "中铁建工 · 销售合同（金额 ¥3.78M）",
    biz: "物资销售",
    parties: "甲方 中铁建工集团 / 乙方 中铁十四局",
    amount: 3780000,
    risk: "high",
    issues: ["分成比例与平台标准存在偏差（25:75 vs 30:70）", "缺少违约责任条款"],
    submitDate: "2026-06-28",
  },
  {
    id: "HT-2026-0627-006",
    title: "中铁十六局 · 仓储租赁合同（南沙临港）",
    biz: "仓储租赁",
    parties: "甲方 中铁十六局 / 乙方 番禺南沙基地",
    amount: 624000,
    risk: "mid",
    issues: ["押金比例 5%，低于平台建议 10%"],
    submitDate: "2026-06-27",
  },
  {
    id: "HT-2026-0626-012",
    title: "中铁建东莞 · 物资存放服务合同",
    biz: "物资存放",
    parties: "甲方 中铁十一局 / 乙方 东莞虎门基地",
    amount: 218400,
    risk: "low",
    issues: ["合同模板与最新版有差异，建议升级到 v2.4"],
    submitDate: "2026-06-26",
  },
]

const riskColor: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "高风险" },
  mid: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    label: "中风险",
  },
  low: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    label: "低风险",
  },
}

export function OperatorContract() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">合同管理中心</h1>
        <p className="text-sm text-muted-foreground mt-1">
          合同模板库维护 · 合同合规审查 · 全平台合同档案
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {overview.map((o) => {
          const Icon = o.icon
          return (
            <Card key={o.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${o.bg}`}
                >
                  <Icon className={`w-5 h-5 ${o.tone}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{o.label}</div>
                  <div className="text-xl font-semibold tabular-nums leading-tight">
                    {o.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {o.sub}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="template">
        <TabsList>
          <TabsTrigger value="template">合同模板库</TabsTrigger>
          <TabsTrigger value="review">
            合规审核
            <Badge
              variant="outline"
              className="ml-2 h-4 text-[10px] bg-amber-50 text-amber-700 border-amber-200"
            >
              {pendingContracts.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">合同模板</CardTitle>
                <Button size="sm">
                  <FilePlus className="w-4 h-4 mr-1" />
                  新建模板
                </Button>
              </div>
              <CardDescription className="text-xs">
                平台标准化模板，覆盖四大业务，可被用户工作台直接调用
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[90px]">编号</TableHead>
                    <TableHead>模板名称</TableHead>
                    <TableHead className="w-[110px]">业务类型</TableHead>
                    <TableHead className="w-[70px] text-center">版本</TableHead>
                    <TableHead className="w-[100px] text-center">使用次数</TableHead>
                    <TableHead className="w-[110px]">更新日期</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[140px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${bizColor[t.biz]}`}
                        >
                          {t.biz}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono tabular-nums">
                        {t.version}
                      </TableCell>
                      <TableCell className="text-center text-sm tabular-nums">
                        {t.usedCount}
                      </TableCell>
                      <TableCell className="text-xs tabular-nums text-muted-foreground">
                        {t.updatedAt}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 ${
                            t.status === "已启用"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-0.5">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-4 space-y-3">
          {pendingContracts.map((c) => {
            const risk = riskColor[c.risk]
            return (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border ${risk.bg}`}
                    >
                      <FileWarning className={`w-5 h-5 ${risk.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{c.title}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-4 ${bizColor[c.biz]}`}
                        >
                          {c.biz}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-4 ${risk.bg} ${risk.text}`}
                        >
                          {risk.label}
                        </Badge>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {c.id}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {c.parties} · 金额 ¥{c.amount.toLocaleString()} · 提交于{" "}
                        {c.submitDate}
                      </div>
                      <ul className="mt-2 space-y-1">
                        {c.issues.map((iss, idx) => (
                          <li
                            key={idx}
                            className={`text-xs ${risk.text} flex items-start gap-1.5`}
                          >
                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                            <span>{iss}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        查看合同
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-700 hover:text-red-800 border-red-200 bg-red-50/40"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        驳回
                      </Button>
                      <Button size="sm">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        审核通过
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
