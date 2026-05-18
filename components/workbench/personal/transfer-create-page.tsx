"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ArrowLeftRight,
  ArrowRight,
  Plus,
  Trash2,
  FileText,
  Save,
  Send,
  CircleDollarSign,
  Boxes,
  Search,
  Building2,
  Warehouse,
  MapPin,
  Truck,
  ShieldCheck,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 4 类接收方
type ReceiverType = "物权单位" | "仓储单位" | "仓储站点" | "专运单位"

const RECEIVER_TYPES: {
  value: ReceiverType
  desc: string
  icon: typeof Building2
  color: string
  bg: string
  ring: string
}[] = [
  {
    value: "物权单位",
    desc: "转给其他施工/采购单位",
    icon: Building2,
    color: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary",
  },
  {
    value: "仓储单位",
    desc: "转入仓储集中托管",
    icon: Warehouse,
    color: "text-indigo-700",
    bg: "bg-indigo-100",
    ring: "ring-indigo-500",
  },
  {
    value: "仓储站点",
    desc: "划拨到指定基地/站点",
    icon: MapPin,
    color: "text-purple-700",
    bg: "bg-purple-100",
    ring: "ring-purple-500",
  },
  {
    value: "专运单位",
    desc: "交由专运公司运营",
    icon: Truck,
    color: "text-orange-700",
    bg: "bg-orange-100",
    ring: "ring-orange-500",
  },
]

// 4 类接收方主体候选库
const RECEIVERS: Record<ReceiverType, string[]> = {
  物权单位: [
    "中铁十四局集团广州分公司",
    "中铁二十局集团第六工程有限公司",
    "广东能建第二建设有限公司",
    "深圳市鸿信钢材贸易有限公司",
    "中铁建工集团第二建设有限公司",
  ],
  仓储单位: [
    "中铁建仓储华南运营有限公司",
    "中铁物贸广东仓储有限公司",
    "中铁四局仓储管理中心",
  ],
  仓储站点: [
    "中铁建广州南沙基地·A区",
    "中铁建广州南沙基地·E区",
    "中铁建深圳前海基地·B区",
    "中铁建东莞虎门基地·C区",
    "中铁建中山翠亨基地·D区",
    "中铁建佛山顺德基地·F区",
  ],
  专运单位: [
    "中铁建华南物流运输有限公司",
    "粤运物流股份有限公司",
    "中铁特货华南分公司",
  ],
}

const CURRENT_OWNERS = [
  "中铁建工集团第二建设有限公司",
  "中铁十四局集团广州分公司",
  "中铁二十局集团第六工程有限公司",
  "广东能建第二建设有限公司",
]

const WAREHOUSES = [
  "中铁建广州南沙基地·A区",
  "中铁建广州南沙基地·E区",
  "中铁建深圳前海基地·B区",
  "中铁建东莞虎门基地·C区",
  "中铁建中山翠亨基地·D区",
  "中铁建佛山顺德基地·F区",
]

const TRANSFER_REASONS = [
  "项目划拨",
  "出售过户",
  "归还原物权方",
  "集团内部调配",
  "委托运营",
  "司法过户",
  "其他",
]

// 库存中的物资快照（可被过户的物资）
interface InventoryCandidate {
  id: string
  name: string
  category: string
  spec: string
  unit: string
  available: number // 可用库存
  warehouse: string
  bookValue: number // 账面单价
}

const INVENTORY_LIBRARY: InventoryCandidate[] = [
  {
    id: "WL-2026-0001",
    name: "Q235B 热轧 H 型钢",
    category: "型材类",
    spec: "HW200×200×8×12",
    unit: "吨",
    available: 520,
    warehouse: "中铁建广州南沙基地·A区",
    bookValue: 4200,
  },
  {
    id: "WL-2026-0002",
    name: "建筑钢管脚手架套装",
    category: "脚手架类",
    spec: "Φ48×3.0 含扣件",
    unit: "套",
    available: 1860,
    warehouse: "中铁建深圳前海基地·B区",
    bookValue: 380,
  },
  {
    id: "WL-2026-0003",
    name: "钢轨 60kg/m",
    category: "轨道类",
    spec: "60kg/m × 12.5m",
    unit: "根",
    available: 240,
    warehouse: "中铁建中山翠亨基地·D区",
    bookValue: 2500,
  },
  {
    id: "WL-2026-0004",
    name: "WJ-7 型扣件系统",
    category: "拼装类",
    spec: "标准成套",
    unit: "套",
    available: 4200,
    warehouse: "中铁建广州南沙基地·E区",
    bookValue: 56,
  },
  {
    id: "WL-2026-0005",
    name: "钢板桩 IV 型",
    category: "支护类",
    spec: "L=12m / IV",
    unit: "吨",
    available: 180,
    warehouse: "中铁建广州南沙基地·A区",
    bookValue: 5800,
  },
  {
    id: "WL-2026-0006",
    name: "20# 工字钢梁",
    category: "型材类",
    spec: "20a 6m",
    unit: "吨",
    available: 320,
    warehouse: "中铁建广州南沙基地·A区",
    bookValue: 4080,
  },
  {
    id: "WL-2026-0007",
    name: "VV 型橡套电缆 3×95+1",
    category: "电线电缆",
    spec: "0.6/1kV",
    unit: "米",
    available: 8600,
    warehouse: "中铁建佛山顺德基地·F区",
    bookValue: 78,
  },
  {
    id: "WL-2026-0008",
    name: "QTZ63 塔吊标准节",
    category: "其他材料",
    spec: "标准节 1.5m",
    unit: "节",
    available: 36,
    warehouse: "中铁建广州南沙基地·A区",
    bookValue: 18000,
  },
]

interface TransferItem {
  key: number
  materialId: string
  name: string
  category: string
  spec: string
  unit: string
  available: number
  warehouse: string
  qty: string
  unitPrice: string
  remark: string
}

let nextKey = 1
function makeRow(c?: InventoryCandidate): TransferItem {
  return {
    key: nextKey++,
    materialId: c?.id ?? "",
    name: c?.name ?? "",
    category: c?.category ?? "",
    spec: c?.spec ?? "",
    unit: c?.unit ?? "",
    available: c?.available ?? 0,
    warehouse: c?.warehouse ?? "",
    qty: "",
    unitPrice: c ? String(c.bookValue) : "",
    remark: "",
  }
}

export function TransferCreatePage({ onBack }: { onBack: () => void }) {
  const [receiverType, setReceiverType] = useState<ReceiverType>("物权单位")
  const [fromOwner, setFromOwner] = useState(
    "中铁建工集团第二建设有限公司",
  )
  const [toReceiver, setToReceiver] = useState("")
  const [warehouse, setWarehouse] = useState("")
  const [applyDate, setApplyDate] = useState("")
  const [operator, setOperator] = useState("")
  const [reason, setReason] = useState("项目划拨")
  const [agreementNo, setAgreementNo] = useState("")
  const [attachment, setAttachment] = useState("")
  const [note, setNote] = useState("")
  const [items, setItems] = useState<TransferItem[]>([makeRow()])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")

  const meta = RECEIVER_TYPES.find((t) => t.value === receiverType)!
  const ReceiverIcon = meta.icon
  const receiverOptions = RECEIVERS[receiverType]

  const updateItem = (
    key: number,
    field: keyof TransferItem,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, [field]: value } : it)),
    )
  }
  const removeItem = (key: number) =>
    setItems((prev) => prev.filter((it) => it.key !== key))
  const addEmpty = () => setItems((prev) => [...prev, makeRow()])

  const addFromLibrary = (c: InventoryCandidate) => {
    setItems((prev) => {
      const emptyIdx = prev.findIndex((it) => !it.name)
      if (emptyIdx >= 0) {
        const next = [...prev]
        next[emptyIdx] = { ...makeRow(c), key: prev[emptyIdx].key }
        return next
      }
      return [...prev, makeRow(c)]
    })
    setPickerOpen(false)
    setPickerSearch("")
  }

  const totalQty = items.reduce((s, it) => s + (Number(it.qty) || 0), 0)
  const totalValue = items.reduce(
    (s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0),
    0,
  )
  const filledRows = items.filter((it) => it.name).length
  const hasOver = items.some(
    (it) => Number(it.qty || 0) > 0 && Number(it.qty) > it.available && it.available > 0,
  )

  const canSubmit =
    fromOwner &&
    toReceiver &&
    filledRows > 0 &&
    items
      .filter((it) => it.name)
      .every((it) => Number(it.qty) > 0) &&
    !hasOver

  const filteredLib = INVENTORY_LIBRARY.filter(
    (m) =>
      !pickerSearch ||
      m.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.spec.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.warehouse.toLowerCase().includes(pickerSearch.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ChevronLeft className="w-4 h-4 mr-1" />
        返回过户管理
      </Button>

      {/* 页头 */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
          <ArrowLeftRight className="w-5 h-5 text-indigo-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">新建过户单</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            将存储于仓储的物资过户给其他物权单位、仓储单位、仓储站点或专运单位，支持一次过户多种物资
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 主区域 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 接收方类型选择 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-indigo-700" />
                过户去向
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  接收方类型<span className="text-destructive ml-0.5">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {RECEIVER_TYPES.map((t) => {
                    const Icon = t.icon
                    const active = receiverType === t.value
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => {
                          setReceiverType(t.value)
                          setToReceiver("")
                        }}
                        className={`rounded-lg border p-3 text-left transition-all ${
                          active
                            ? `border-transparent bg-card ring-1 ${t.ring}`
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`w-7 h-7 rounded ${t.bg} ${t.color} flex items-center justify-center`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-sm font-medium">{t.value}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t.desc}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>
                    当前物权方
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Select value={fromOwner} onValueChange={setFromOwner}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择物权方" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENT_OWNERS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>
                    接收方（{receiverType}）
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Select value={toReceiver} onValueChange={setToReceiver}>
                    <SelectTrigger>
                      <SelectValue placeholder={`选择${receiverType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {receiverOptions.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>
                    物资存放仓储
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Select value={warehouse} onValueChange={setWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择当前仓储" />
                    </SelectTrigger>
                    <SelectContent>
                      {WAREHOUSES.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>过户原因</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSFER_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="applyDate">
                    申请日期<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    id="applyDate"
                    type="date"
                    value={applyDate}
                    onChange={(e) => setApplyDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="operator">经办人</Label>
                  <Input
                    id="operator"
                    placeholder="如：李文涛"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 物资明细 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-indigo-700" />
                  过户物资明细
                  <span className="text-xs font-normal text-muted-foreground">
                    共 {filledRows} 种
                  </span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    从库存选择
                  </Button>
                  <Button size="sm" variant="default" onClick={addEmpty}>
                    <Plus className="w-4 h-4 mr-2" />
                    添加一行
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[1180px]">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead className="min-w-[220px]">物资</TableHead>
                      <TableHead className="min-w-[140px]">规格型号</TableHead>
                      <TableHead className="w-[80px]">单位</TableHead>
                      <TableHead className="w-[110px] text-right">
                        可用库存
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        过户数量
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        账面单价(元)
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        估值(元)
                      </TableHead>
                      <TableHead className="w-[60px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => {
                      const qtyNum = Number(it.qty) || 0
                      const value = qtyNum * (Number(it.unitPrice) || 0)
                      const over =
                        qtyNum > 0 && it.available > 0 && qtyNum > it.available
                      return (
                        <TableRow key={it.key} className="align-top">
                          <TableCell className="text-muted-foreground pt-3">
                            {idx + 1}
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="物资名称"
                              value={it.name}
                              onChange={(e) =>
                                updateItem(it.key, "name", e.target.value)
                              }
                              className="h-9"
                            />
                            {(it.category || it.warehouse) && (
                              <div className="flex items-center flex-wrap gap-x-2 text-[11px] text-muted-foreground mt-1">
                                {it.category && <span>{it.category}</span>}
                                {it.materialId && (
                                  <span className="font-mono">
                                    {it.materialId}
                                  </span>
                                )}
                                {it.warehouse && (
                                  <span className="inline-flex items-center gap-0.5">
                                    <MapPin className="w-3 h-3" />
                                    {it.warehouse}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="规格"
                              value={it.spec}
                              onChange={(e) =>
                                updateItem(it.key, "spec", e.target.value)
                              }
                              className="h-9"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="单位"
                              value={it.unit}
                              onChange={(e) =>
                                updateItem(it.key, "unit", e.target.value)
                              }
                              className="h-9"
                            />
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm pt-3">
                            {it.available > 0 ? (
                              <span className="text-muted-foreground">
                                {it.available.toLocaleString("zh-CN")}
                                {it.unit && (
                                  <span className="ml-0.5">{it.unit}</span>
                                )}
                              </span>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              value={it.qty}
                              onChange={(e) =>
                                updateItem(it.key, "qty", e.target.value)
                              }
                              className={`h-9 text-right tabular-nums ${
                                over
                                  ? "border-destructive focus-visible:ring-destructive"
                                  : ""
                              }`}
                            />
                            {over && (
                              <div className="text-[11px] text-destructive mt-1">
                                超出可用库存
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              value={it.unitPrice}
                              onChange={(e) =>
                                updateItem(
                                  it.key,
                                  "unitPrice",
                                  e.target.value,
                                )
                              }
                              className="h-9 text-right tabular-nums"
                            />
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-medium text-sm pt-3">
                            {value > 0
                              ? value.toLocaleString("zh-CN")
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeItem(it.key)}
                              disabled={items.length === 1}
                              title="移除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="px-4 py-3 border-t bg-muted/20 flex items-center justify-between text-sm flex-wrap gap-2">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>
                    合计品种：
                    <span className="font-semibold text-foreground tabular-nums ml-1">
                      {filledRows}
                    </span>
                  </span>
                  <span>
                    合计数量：
                    <span className="font-semibold text-foreground tabular-nums ml-1">
                      {totalQty.toLocaleString("zh-CN")}
                    </span>
                  </span>
                </div>
                <div className="text-base font-bold text-indigo-700 tabular-nums">
                  估值合计 {totalValue.toLocaleString("zh-CN")} 元
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 法务与说明 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                法务与凭证
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="agreement">过户协议编号</Label>
                  <Input
                    id="agreement"
                    placeholder="选填，如：XY2026050813"
                    value={agreementNo}
                    onChange={(e) => setAgreementNo(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="attachment" className="flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5" />
                    附件凭证
                  </Label>
                  <Input
                    id="attachment"
                    placeholder="协议扫描件 / 决议 / 评估报告"
                    value={attachment}
                    onChange={(e) => setAttachment(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="note">备注说明</Label>
                <Textarea
                  id="note"
                  rows={3}
                  placeholder="可记录过户事由、特殊约定、移交节点等"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧汇总 */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-700" />
                过户单预览
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 流转可视化 */}
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-3">
                <div className="text-xs text-muted-foreground mb-2">
                  物权流转
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground">
                        当前物权方
                      </div>
                      <div className="text-sm font-medium truncate">
                        {fromOwner || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-4 h-4 text-indigo-700 rotate-90" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}
                    >
                      <ReceiverIcon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground">
                        接收方 · {receiverType}
                      </div>
                      <div className="text-sm font-medium truncate">
                        {toReceiver || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 数据汇总 */}
              <div className="space-y-3 text-sm">
                <SummaryRow label="过户原因" value={reason || "—"} />
                <SummaryRow label="存放仓储" value={warehouse || "—"} />
                <SummaryRow label="申请日期" value={applyDate || "—"} />
                <SummaryRow
                  label="物资种数"
                  value={
                    filledRows > 0 ? (
                      <span className="tabular-nums">{filledRows}</span>
                    ) : (
                      "—"
                    )
                  }
                />
                <SummaryRow
                  label="合计数量"
                  value={
                    totalQty > 0 ? (
                      <span className="tabular-nums">
                        {totalQty.toLocaleString("zh-CN")}
                      </span>
                    ) : (
                      "—"
                    )
                  }
                />
              </div>

              <Separator />

              <div className="rounded-lg bg-indigo-50 px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-indigo-700">
                  <CircleDollarSign className="w-4 h-4" />
                  估值合计
                </div>
                <div className="text-lg font-bold text-indigo-700 tabular-nums">
                  {totalValue.toLocaleString("zh-CN")}
                </div>
              </div>

              {hasOver && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  存在数量超过可用库存的行，请先调整
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button variant="outline" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  保存草稿
                </Button>
                <Button className="w-full" disabled={!canSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  提交审批
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                提交后将进入接收方确认与多级审批流程，审批完成后系统自动生成过户凭证并同步更新物权信息。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 从库存选择 - 弹窗 */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              从库存中选择物资
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="搜索物资名称 / 规格 / 分类 / 仓库"
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
            />
            <div className="max-h-[420px] overflow-y-auto rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>物资</TableHead>
                    <TableHead>规格 / 仓库</TableHead>
                    <TableHead className="text-right">可用库存</TableHead>
                    <TableHead className="text-right">账面单价</TableHead>
                    <TableHead className="w-[80px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLib.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{m.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          <Badge
                            variant="secondary"
                            className="font-normal text-[10px] mr-1"
                          >
                            {m.category}
                          </Badge>
                          <span className="font-mono">{m.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{m.spec}</div>
                        <div className="text-[11px] text-muted-foreground inline-flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {m.warehouse}
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {m.available.toLocaleString("zh-CN")}
                        <span className="text-muted-foreground ml-0.5">
                          {m.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {m.bookValue.toLocaleString("zh-CN")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addFromLibrary(m)}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          添加
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLib.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-sm text-muted-foreground py-8"
                      >
                        未找到匹配的物资
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-right break-all">{value}</span>
    </div>
  )
}
