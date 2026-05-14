"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Coins,
  HandCoins,
  Info,
  Plus,
  Save,
  Send,
  Tags,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MaterialPickerDialog,
  type MaterialItem,
} from "./material-picker-dialog"

interface MaterialSalePublishPageProps {
  onBack: () => void
  initialMaterials?: MaterialItem[]
}

interface SaleMaterial extends MaterialItem {
  quantity: string
  unitPrice: string
}

// 物权单位（模拟数据：由专运单位托管销售）
const propertyOwners = [
  {
    id: "PO-001",
    name: "中铁十四局集团广州分公司",
    contact: "周振华",
    phone: "138-7621-9930",
  },
  {
    id: "PO-002",
    name: "中铁建工集团第二建设有限公司",
    contact: "李文涛",
    phone: "138-2814-5520",
  },
  {
    id: "PO-003",
    name: "中铁二十二局集团第一工程有限公司",
    contact: "王建国",
    phone: "139-2017-8801",
  },
  {
    id: "PO-004",
    name: "中铁电气化局集团广州分公司",
    contact: "刘建华",
    phone: "138-6712-3309",
  },
]

export function MaterialSalePublishPage({
  onBack,
  initialMaterials = [],
}: MaterialSalePublishPageProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [materials, setMaterials] = useState<SaleMaterial[]>(
    initialMaterials.map((m) => ({ ...m, quantity: "", unitPrice: "" })),
  )

  // 表单字段
  const [title, setTitle] = useState("")
  const [propertyOwnerId, setPropertyOwnerId] = useState("")
  const [saleMode, setSaleMode] = useState<"整批" | "分批">("整批")
  const [transportShare, setTransportShare] = useState<number>(25) // 专运单位分成%
  const [taxRate, setTaxRate] = useState<string>("13")
  const [payment, setPayment] = useState<string>("货到付款")
  const [saleStart, setSaleStart] = useState<string>("")
  const [saleEnd, setSaleEnd] = useState<string>("")
  const [region, setRegion] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "/placeholder.svg?height=80&width=100",
    "/placeholder.svg?height=80&width=100",
  ])

  const propertyShare = 100 - transportShare
  const propertyOwner = propertyOwners.find((p) => p.id === propertyOwnerId)

  const handlePickerConfirm = (items: MaterialItem[]) => {
    setMaterials((prev) => {
      const prevMap = new Map(prev.map((m) => [m.id, m]))
      return items.map(
        (it) => prevMap.get(it.id) ?? { ...it, quantity: "", unitPrice: "" },
      )
    })
  }

  const removeMaterial = (id: string) =>
    setMaterials((prev) => prev.filter((m) => m.id !== id))

  const updateMaterial = (
    id: string,
    field: "quantity" | "unitPrice",
    value: string,
  ) =>
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    )

  // 估算合计：sum(quantity * unitPrice)
  const totals = useMemo(() => {
    const gross = materials.reduce((sum, m) => {
      const q = parseFloat(m.quantity) || 0
      const p = parseFloat(m.unitPrice) || 0
      return sum + q * p
    }, 0)
    return {
      gross,
      transport: Math.round((gross * transportShare) / 100),
      property: Math.round((gross * propertyShare) / 100),
    }
  }, [materials, transportShare, propertyShare])

  // 必填进度
  const requiredChecks = [
    { key: "title", label: "需求标题", done: title.trim().length > 0 },
    { key: "owner", label: "物权单位", done: !!propertyOwnerId },
    { key: "materials", label: "物料清单 (≥1 项)", done: materials.length > 0 },
    {
      key: "priced",
      label: "数量与售价已填",
      done:
        materials.length > 0 &&
        materials.every(
          (m) => parseFloat(m.quantity) > 0 && parseFloat(m.unitPrice) > 0,
        ),
    },
    { key: "saleStart", label: "起售日期", done: !!saleStart },
    { key: "region", label: "交付地点", done: region.trim().length > 0 },
  ]
  const doneCount = requiredChecks.filter((r) => r.done).length
  const completion = Math.round((doneCount / requiredChecks.length) * 100)
  const canSubmit = doneCount === requiredChecks.length

  // 分区标题
  const SectionTitle = ({
    no,
    icon: Icon,
    title,
    desc,
    extra,
  }: {
    no: number
    icon: React.ElementType
    title: string
    desc?: string
    extra?: React.ReactNode
  }) => (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-primary tabular-nums">
            {no.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary shrink-0" />
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          {desc && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {desc}
            </p>
          )}
        </div>
      </div>
      {extra}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="sticky top-0 z-10 -mx-6 px-6 py-3 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              返回需求列表
            </Button>
            <div className="h-5 w-px bg-border" />
            <div>
              <h1 className="text-base font-semibold text-foreground leading-tight">
                新增物资销售需求
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                由物资专运单位代物权单位发布托管物资销售，按约定比例分成
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
              <Tags className="w-3.5 h-3.5" />
              物资销售
            </Badge>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1.5" />
              保存草稿
            </Button>
            <Button size="sm" disabled={!canSubmit}>
              <Send className="w-4 h-4 mr-1.5" />
              提交审核
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        {/* 主内容区 */}
        <div className="space-y-4 min-w-0">
          {/* 1. 基础信息 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle
                no={1}
                icon={Info}
                title="基础信息"
                desc="填写销售需求的标题、模式与交付区域"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className="mb-1.5 block text-sm">
                    需求标题<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="如：HRB400 螺纹钢 1200 吨整批销售 · 广州南沙"
                    maxLength={60}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    建议突出物料类别 / 数量 / 销售模式 / 区域
                  </p>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm">
                    销售模式<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <RadioGroup
                    value={saleMode}
                    onValueChange={(v) => setSaleMode(v as "整批" | "分批")}
                    className="flex gap-4"
                  >
                    <label className="flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 flex-1 hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <RadioGroupItem value="整批" />
                      <div>
                        <div className="text-sm font-medium">整批销售</div>
                        <div className="text-[11px] text-muted-foreground">
                          按物料清单一次性出售
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 flex-1 hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <RadioGroupItem value="分批" />
                      <div>
                        <div className="text-sm font-medium">分批销售</div>
                        <div className="text-[11px] text-muted-foreground">
                          支持按数量逐批成交
                        </div>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm">
                    交付地点<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="广东省-广州市-南沙区 · 南沙综合仓储基地"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm">
                    起售日期<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={saleStart}
                    onChange={(e) => setSaleStart(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm">截止日期</Label>
                  <Input
                    type="date"
                    value={saleEnd}
                    onChange={(e) => setSaleEnd(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. 物权单位与分成 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle
                no={2}
                icon={HandCoins}
                title="物权单位与分成方案"
                desc="物权单位委托本专运单位代销，所得按约定比例分成"
              />
              <div className="space-y-5">
                {/* 物权单位 */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
                  <div>
                    <Label className="mb-1.5 block text-sm">
                      物权单位<span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <Select
                      value={propertyOwnerId}
                      onValueChange={setPropertyOwnerId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择委托方（物资所有方）" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyOwners.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">销售执行方</Label>
                    <div className="flex items-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
                      <Building2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        中铁建物料华南专业运营有限公司
                      </span>
                      <Badge className="ml-auto bg-primary text-primary-foreground text-[10px] h-5">
                        本企业
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      物资专运单位 · 自动填充
                    </p>
                  </div>
                </div>

                {propertyOwner && (
                  <div className="grid grid-cols-3 gap-3 rounded-md border bg-muted/30 p-3">
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        委托联系人
                      </div>
                      <div className="text-sm font-medium mt-0.5">
                        {propertyOwner.contact}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        联系电话
                      </div>
                      <div className="text-sm font-medium mt-0.5 tabular-nums">
                        {propertyOwner.phone}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        委托编号
                      </div>
                      <div className="text-sm font-medium mt-0.5 font-mono text-primary">
                        {propertyOwner.id}
                      </div>
                    </div>
                  </div>
                )}

                {/* 分成比例 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">
                      分成比例
                      <span className="text-destructive ml-0.5">*</span>
                    </Label>
                    <div className="flex items-center gap-3 text-xs tabular-nums">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        专运单位 {transportShare}%
                      </span>
                      <span className="text-muted-foreground">:</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        物权单位 {propertyShare}%
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[transportShare]}
                    onValueChange={(v) => setTransportShare(v[0])}
                    min={5}
                    max={50}
                    step={5}
                    className="my-3"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border bg-primary/5 p-3">
                      <div className="text-[11px] text-muted-foreground">
                        专运单位预估收益
                      </div>
                      <div className="text-lg font-bold text-primary tabular-nums mt-0.5">
                        ¥ {totals.transport.toLocaleString("zh-CN")}
                      </div>
                    </div>
                    <div className="rounded-md border bg-orange-50 p-3">
                      <div className="text-[11px] text-muted-foreground">
                        物权单位预估收益
                      </div>
                      <div className="text-lg font-bold text-orange-600 tabular-nums mt-0.5">
                        ¥ {totals.property.toLocaleString("zh-CN")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. 物料清单 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle
                no={3}
                icon={Tags}
                title="物料清单与定价"
                desc="选择物权单位托管在仓的物料，设置数量与单价"
                extra={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    选择物料
                  </Button>
                }
              />
              {materials.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-muted/30 transition-colors"
                >
                  <Tags className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-foreground">
                    点击从循环物料库选择待销售物料
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    支持多分类批量添加，仅显示托管在本企业仓储的物料
                  </p>
                </button>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-[170px]">分类-物料编号</TableHead>
                        <TableHead>物料名称</TableHead>
                        <TableHead className="w-[140px]">规格</TableHead>
                        <TableHead className="w-[70px]">单位</TableHead>
                        <TableHead className="w-[140px]">
                          销售数量<span className="text-destructive">*</span>
                        </TableHead>
                        <TableHead className="w-[170px]">
                          销售单价<span className="text-destructive">*</span>
                        </TableHead>
                        <TableHead className="w-[120px] text-right">
                          小计
                        </TableHead>
                        <TableHead className="w-[60px] text-center">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((m) => {
                        const q = parseFloat(m.quantity) || 0
                        const p = parseFloat(m.unitPrice) || 0
                        const sub = q * p
                        return (
                          <TableRow key={m.id}>
                            <TableCell className="font-mono text-xs">
                              {m.id}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {m.name}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {m.spec}
                            </TableCell>
                            <TableCell className="text-sm">{m.unit}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Input
                                  value={m.quantity}
                                  onChange={(e) =>
                                    updateMaterial(
                                      m.id,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="0"
                                  className="h-8 text-sm"
                                />
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {m.unit}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Input
                                  value={m.unitPrice}
                                  onChange={(e) =>
                                    updateMaterial(
                                      m.id,
                                      "unitPrice",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="0.00"
                                  className="h-8 text-sm"
                                />
                                <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                                  元/{m.unit}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-sm font-medium text-primary">
                              {sub > 0
                                ? `¥ ${sub.toLocaleString("zh-CN")}`
                                : "—"}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => removeMaterial(m.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. 交易与结算 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle
                no={4}
                icon={Coins}
                title="交易与结算条款"
                desc="约定开票税率、付款方式等"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1.5 block text-sm">
                    增值税税率<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Select value={taxRate} onValueChange={setTaxRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%（免税）</SelectItem>
                      <SelectItem value="3">3%</SelectItem>
                      <SelectItem value="6">6%</SelectItem>
                      <SelectItem value="9">9%</SelectItem>
                      <SelectItem value="13">13%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm">付款方式</Label>
                  <Select value={payment} onValueChange={setPayment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="货到付款">货到付款</SelectItem>
                      <SelectItem value="预付定金">预付定金 30%</SelectItem>
                      <SelectItem value="月结30天">月结 30 天</SelectItem>
                      <SelectItem value="款到发货">款到发货</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm">结算分成周期</Label>
                  <Select defaultValue="per-order">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per-order">按单结算</SelectItem>
                      <SelectItem value="monthly">月度结算</SelectItem>
                      <SelectItem value="quarterly">季度结算</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. 物料描述与图片 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle
                no={5}
                icon={Upload}
                title="物料描述与图片"
                desc="补充物料新旧程度、品质、检验报告等细节"
              />
              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block text-sm">详细介绍</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="请描述物料的产地、批次、使用历史、检测报告等"
                    className="min-h-[110px]"
                    maxLength={1000}
                  />
                  <div className="text-right text-xs text-muted-foreground mt-1 tabular-nums">
                    {description.length} / 1000
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm">
                    实物图片<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-20 rounded-lg border overflow-hidden group"
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`图片${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setUploadedImages((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedImages((prev) => [
                          ...prev,
                          "/placeholder.svg?height=80&width=100",
                        ])
                      }
                      className="w-24 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors"
                    >
                      <Upload className="w-4 h-4 mb-1" />
                      <span className="text-[11px]">上传</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    最多上传 8 张，建议 1280×960 以上 JPG/PNG
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧粘性侧栏 */}
        <aside className="space-y-4 xl:sticky xl:top-20 self-start">
          {/* 完成度 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">
                  必填项完成度
                </h4>
                <span
                  className={`text-sm font-bold tabular-nums ${
                    completion === 100 ? "text-emerald-600" : "text-primary"
                  }`}
                >
                  {completion}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    completion === 100 ? "bg-emerald-500" : "bg-primary"
                  }`}
                  style={{ width: `${completion}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2">
                {requiredChecks.map((r) => (
                  <li
                    key={r.key}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        r.done
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r.done ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      )}
                    </span>
                    <span
                      className={
                        r.done
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {r.label}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 销售摘要 */}
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card">
            <CardContent className="p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <HandCoins className="w-4 h-4 text-primary" />
                销售摘要
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">物料数量</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {materials.length} 项
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">销售模式</span>
                  <Badge variant="outline" className="text-[10px] h-5">
                    {saleMode}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">分成比例</span>
                  <span className="font-medium tabular-nums">
                    {transportShare} : {propertyShare}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">税率</span>
                  <span className="font-medium tabular-nums">
                    {taxRate}%
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="text-[11px] text-muted-foreground">
                    预估销售总额
                  </div>
                  <div className="text-2xl font-bold text-primary tabular-nums mt-0.5">
                    ¥ {totals.gross.toLocaleString("zh-CN")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 风险提示 */}
          <Card className="bg-amber-50/60 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-amber-900">
                  发布前请确认所选物料已托管在本企业仓储站点，且与物权单位已签署
                  <span className="font-semibold"> 销售代理协议 </span>
                  与
                  <span className="font-semibold"> 分成协议 </span>。
                  审核通过后将自动生成销售合同模板。
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <MaterialPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onConfirm={handlePickerConfirm}
        initialSelected={materials}
      />
    </div>
  )
}
