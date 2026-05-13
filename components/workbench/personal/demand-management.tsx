"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Warehouse,
  Package,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  ClipboardList,
  Boxes,
  Handshake,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { DetailPublishPage } from "@/components/frontend/detail-publish-page"
import { MaterialPickerDialog, type MaterialItem } from "./material-picker-dialog"
import { MaterialRentPublishPage } from "./material-rent-publish-page"

// ============ 数据 ============

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

const materialRentDemands = [
  {
    id: "WZ20260512001",
    title: "Q235B 热轧 H 型钢出租 500 吨",
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
    title: "建筑钢管脚手架出租 2000 套",
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
    title: "塔吊设备出租 5 台",
    materialType: "机械设备",
    quantity: "5台",
    location: "广东省佛山市顺德区",
    price: "28000元/台/月",
    publishDate: "2026-05-09",
    status: "草稿",
    views: 0,
  },
]

// ============ 工具 ============

const getStatusBadge = (status: string) => {
  switch (status) {
    case "已发布":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          已发布
        </Badge>
      )
    case "草稿":
      return <Badge variant="secondary">草稿</Badge>
    case "受理中":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">受理中</Badge>
      )
    case "已成交":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          已成交
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

interface StatItem {
  label: string
  value: number | string
  icon: React.ElementType
  tone: "primary" | "accent" | "emerald" | "amber" | "blue" | "purple"
}

const toneClass: Record<StatItem["tone"], string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
}

function StatsRow({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <Card key={it.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${toneClass[it.tone]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    {it.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {it.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function Toolbar({
  placeholder,
  statusOptions,
}: {
  placeholder: string
  statusOptions: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder={placeholder} className="pl-9 w-72" />
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          {statusOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// 操作列：文字按钮
function RowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={onView}
        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        查看
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="h-7 px-2 text-xs text-primary hover:text-primary"
      >
        编辑
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        删除
      </Button>
    </div>
  )
}

// ============ 主组件 ============

type DemandSubTab = "self-rent" | "entrust-rent" | "material-rent"
type DemandMode = "list" | "publish-warehouse" | "publish-material"

interface DemandManagementProps {
  subTab?: DemandSubTab
}

export function DemandManagement({ subTab = "self-rent" }: DemandManagementProps) {
  const [mode, setMode] = useState<DemandMode>("list")
  const [materialPickerOpen, setMaterialPickerOpen] = useState(false)
  const [pickedMaterials, setPickedMaterials] = useState<MaterialItem[]>([])

  // ============ 发布模式 ============
  if (mode === "publish-warehouse") {
    return (
      <DetailPublishPage defaultTab="detail" onNavigate={() => setMode("list")} />
    )
  }

  if (mode === "publish-material") {
    return (
      <MaterialRentPublishPage
        onBack={() => {
          setMode("list")
          setPickedMaterials([])
        }}
        initialMaterials={pickedMaterials}
      />
    )
  }

  // ============ 列表模式 ============
  const renderPage = () => {
    if (subTab === "self-rent") {
      const total = selfRentDemands.length
      const published = selfRentDemands.filter((d) => d.status === "已发布").length
      const draft = selfRentDemands.filter((d) => d.status === "草稿").length
      const totalViews = selfRentDemands.reduce((s, d) => s + d.views, 0)
      return (
        <>
          <PageHeader
            icon={Warehouse}
            iconTone="primary"
            title="仓储自主出租"
            desc="管理由本企业直接发布、面向市场出租的仓储资源需求单"
            actionLabel="新建仓储自主出租"
            onAction={() => setMode("publish-warehouse")}
          />

          <StatsRow
            items={[
              { label: "总需求单数", value: total, icon: ClipboardList, tone: "primary" },
              { label: "已发布", value: published, icon: CheckCircle2, tone: "emerald" },
              { label: "草稿", value: draft, icon: Clock, tone: "amber" },
              { label: "累计浏览量", value: totalViews, icon: TrendingUp, tone: "blue" },
            ]}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-base font-semibold">仓储自主出租需求单</h2>
                <Toolbar
                  placeholder="搜索需求单号或标题"
                  statusOptions={[
                    { value: "published", label: "已发布" },
                    { value: "draft", label: "草稿" },
                  ]}
                />
              </div>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[130px]">需求单号</TableHead>
                      <TableHead>标题</TableHead>
                      <TableHead className="w-[160px]">所在区域</TableHead>
                      <TableHead className="w-[88px]">面积</TableHead>
                      <TableHead className="w-[100px]">仓储类型</TableHead>
                      <TableHead className="w-[120px]">租金单价</TableHead>
                      <TableHead className="w-[110px]">发布时间</TableHead>
                      <TableHead className="w-[72px] text-right">浏览量</TableHead>
                      <TableHead className="w-[88px]">状态</TableHead>
                      <TableHead className="w-[160px] text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selfRentDemands.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                        <TableCell className="max-w-xs truncate" title={d.title}>
                          {d.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {d.location}
                        </TableCell>
                        <TableCell>{d.area}</TableCell>
                        <TableCell>{d.type}</TableCell>
                        <TableCell className="text-primary font-medium">
                          {d.price}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {d.publishDate}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {d.views}
                        </TableCell>
                        <TableCell>{getStatusBadge(d.status)}</TableCell>
                        <TableCell>
                          <RowActions />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )
    }

    if (subTab === "entrust-rent") {
      const total = entrustRentDemands.length
      const processing = entrustRentDemands.filter((d) => d.status === "受理中").length
      const dealt = entrustRentDemands.filter((d) => d.status === "已成交").length
      const delegates = new Set(entrustRentDemands.map((d) => d.delegate)).size
      return (
        <>
          <PageHeader
            icon={Handshake}
            iconTone="accent"
            title="仓储委托出租"
            desc="由委托方授权平台代理发布与撮合的仓储租赁需求单"
            actionLabel="新建仓储委托出租"
            onAction={() => setMode("publish-warehouse")}
          />

          <StatsRow
            items={[
              { label: "总需求单数", value: total, icon: FileText, tone: "accent" },
              { label: "受理中", value: processing, icon: Clock, tone: "blue" },
              { label: "已成交", value: dealt, icon: CheckCircle2, tone: "purple" },
              { label: "合作委托方", value: delegates, icon: Handshake, tone: "amber" },
            ]}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-base font-semibold">仓储委托出租需求单</h2>
                <Toolbar
                  placeholder="搜索需求单号、标题或委托方"
                  statusOptions={[
                    { value: "processing", label: "受理中" },
                    { value: "completed", label: "已成交" },
                  ]}
                />
              </div>
              {/* 本板块内水平滚动，不溢出 */}
              <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[1180px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">需求单号</TableHead>
                      <TableHead className="min-w-[260px]">标题</TableHead>
                      <TableHead className="w-[170px]">所在区域</TableHead>
                      <TableHead className="w-[90px]">面积</TableHead>
                      <TableHead className="w-[110px]">仓储类型</TableHead>
                      <TableHead className="min-w-[220px]">委托方</TableHead>
                      <TableHead className="w-[110px]">发布时间</TableHead>
                      <TableHead className="w-[100px]">进度</TableHead>
                      <TableHead className="w-[88px]">状态</TableHead>
                      <TableHead className="w-[160px] text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entrustRentDemands.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                        <TableCell className="truncate" title={d.title}>
                          {d.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {d.location}
                        </TableCell>
                        <TableCell>{d.area}</TableCell>
                        <TableCell>{d.type}</TableCell>
                        <TableCell className="text-sm" title={d.delegate}>
                          {d.delegate}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {d.publishDate}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {d.progress}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(d.status)}</TableCell>
                        <TableCell>
                          <RowActions />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )
    }

    // material-rent
    const total = materialRentDemands.length
    const published = materialRentDemands.filter((d) => d.status === "已发布").length
    const draft = materialRentDemands.filter((d) => d.status === "草稿").length
    const categories = new Set(materialRentDemands.map((d) => d.materialType)).size
    return (
      <>
        <PageHeader
          icon={Package}
          iconTone="emerald"
          title="物资出租"
          desc="基于循环物资库的出租需求单，支持按物料分类批量发布"
          actionLabel="新建物资出租"
          onAction={() => setMaterialPickerOpen(true)}
        />

        <StatsRow
          items={[
            { label: "总需求单数", value: total, icon: Package, tone: "emerald" },
            { label: "已发布", value: published, icon: CheckCircle2, tone: "blue" },
            { label: "草稿", value: draft, icon: Clock, tone: "amber" },
            { label: "覆盖物料分类", value: categories, icon: Boxes, tone: "purple" },
          ]}
        />

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-base font-semibold">物资出租需求单</h2>
              <Toolbar
                placeholder="搜索需求单号或标题"
                statusOptions={[
                  { value: "published", label: "已发布" },
                  { value: "draft", label: "草稿" },
                ]}
              />
            </div>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[130px]">需求单号</TableHead>
                    <TableHead>标题</TableHead>
                    <TableHead className="w-[100px]">物资类型</TableHead>
                    <TableHead className="w-[90px]">数量</TableHead>
                    <TableHead className="w-[160px]">所在区域</TableHead>
                    <TableHead className="w-[140px]">租金单价</TableHead>
                    <TableHead className="w-[110px]">发布时间</TableHead>
                    <TableHead className="w-[72px] text-right">浏览量</TableHead>
                    <TableHead className="w-[88px]">状态</TableHead>
                    <TableHead className="w-[160px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialRentDemands.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-mono text-xs">{d.id}</TableCell>
                      <TableCell className="max-w-xs truncate" title={d.title}>
                        {d.title}
                      </TableCell>
                      <TableCell>{d.materialType}</TableCell>
                      <TableCell>{d.quantity}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {d.location}
                      </TableCell>
                      <TableCell className="text-primary font-medium">
                        {d.price}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {d.publishDate}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {d.views}
                      </TableCell>
                      <TableCell>{getStatusBadge(d.status)}</TableCell>
                      <TableCell>
                        <RowActions />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <div className="space-y-5 min-w-0">
      {renderPage()}

      {/* 物资分类选择弹窗（只在物资出租入口使用） */}
      <MaterialPickerDialog
        open={materialPickerOpen}
        onOpenChange={setMaterialPickerOpen}
        onConfirm={(items) => {
          setPickedMaterials(items)
          setMode("publish-material")
        }}
        initialSelected={pickedMaterials}
      />
    </div>
  )
}

// ============ 子组件：页面头部 ============

function PageHeader({
  icon: Icon,
  iconTone,
  title,
  desc,
  actionLabel,
  onAction,
}: {
  icon: React.ElementType
  iconTone: StatItem["tone"]
  title: string
  desc: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${toneClass[iconTone]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
      <Button onClick={onAction}>
        <Plus className="w-4 h-4 mr-1.5" />
        {actionLabel}
      </Button>
    </div>
  )
}
