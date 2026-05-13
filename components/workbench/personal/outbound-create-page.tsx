"use client"

import { useState } from "react"
import {
  ChevronLeft,
  PackageMinus,
  Plus,
  Trash2,
  FileText,
  Truck,
  Save,
  Send,
  CircleDollarSign,
  Boxes,
  Search,
  AlertTriangle,
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

const OUTBOUND_TYPES = [
  { value: "出租出库", color: "bg-primary/10 text-primary" },
  { value: "销售出库", color: "bg-orange-100 text-orange-700" },
  { value: "调拨出库", color: "bg-indigo-100 text-indigo-700" },
  { value: "盘亏出库", color: "bg-rose-100 text-rose-700" },
]

const WAREHOUSES = [
  "中铁建广州南沙基地·A区",
  "中铁建广州南沙基地·E区",
  "中铁建深圳前海基地·B区",
  "中铁建东莞虎门基地·C区",
  "中铁建中山翠亨基地·D区",
  "中铁建佛山顺德基地·F区",
]

// 可用库存（用于出库选择，会校验库存量）
interface StockCandidate {
  id: string
  name: string
  category: string
  spec: string
  unit: string
  available: number
  warehouse: string
  refPrice: number
}

const STOCK_LIBRARY: StockCandidate[] = [
  {
    id: "WL-2026-0001",
    name: "Q235B 热轧 H 型钢",
    category: "型材类",
    spec: "HW200×200×8×12",
    unit: "吨",
    available: 320,
    warehouse: "中铁建广州南沙基地·A区",
    refPrice: 4200,
  },
  {
    id: "WL-2026-0002",
    name: "建筑钢管脚手架套装",
    category: "脚手架类",
    spec: "Φ48×3.0 含扣件",
    unit: "套",
    available: 860,
    warehouse: "中铁建深圳前海基地·B区",
    refPrice: 380,
  },
  {
    id: "WL-2026-0003",
    name: "钢轨 60kg/m",
    category: "轨道类",
    spec: "60kg/m × 12.5m",
    unit: "根",
    available: 64,
    warehouse: "中铁建广州南沙基地·A区",
    refPrice: 2500,
  },
  {
    id: "WL-2026-0004",
    name: "WJ-7 型扣件系统",
    category: "拼装类",
    spec: "标准成套",
    unit: "套",
    available: 4800,
    warehouse: "中铁建东莞虎门基地·C区",
    refPrice: 56,
  },
  {
    id: "WL-2026-0006",
    name: "组合钢模板",
    category: "模板类",
    spec: "1500×300×55",
    unit: "块",
    available: 6800,
    warehouse: "中铁建广州南沙基地·E区",
    refPrice: 88,
  },
  {
    id: "WL-2026-0007",
    name: "VV 型橡套电缆 3×95+1",
    category: "电线电缆",
    spec: "0.6/1kV",
    unit: "米",
    available: 12600,
    warehouse: "中铁建佛山顺德基地·F区",
    refPrice: 78,
  },
  {
    id: "WL-2026-0008",
    name: "QTZ63 塔吊标准节",
    category: "其他材料",
    spec: "标准节 1.5m",
    unit: "节",
    available: 18,
    warehouse: "中铁建广州南沙基地·G区",
    refPrice: 18000,
  },
]

interface OutboundItem {
  key: number
  materialId: string
  name: string
  category: string
  spec: string
  unit: string
  available: number // 可用库存，用于校验
  qty: string
  unitPrice: string
  batch: string
}

let nextKey = 1
function makeRow(c?: StockCandidate): OutboundItem {
  return {
    key: nextKey++,
    materialId: c?.id ?? "",
    name: c?.name ?? "",
    category: c?.category ?? "",
    spec: c?.spec ?? "",
    unit: c?.unit ?? "",
    available: c?.available ?? 0,
    qty: "",
    unitPrice: c ? String(c.refPrice) : "",
    batch: "",
  }
}

export function OutboundCreatePage({ onBack }: { onBack: () => void }) {
  const [outboundType, setOutboundType] = useState("出租出库")
  const [customer, setCustomer] = useState("")
  const [warehouse, setWarehouse] = useState("")
  const [planDate, setPlanDate] = useState("")
  const [operator, setOperator] = useState("")
  const [contractNo, setContractNo] = useState("")
  const [carrier, setCarrier] = useState("")
  const [plate, setPlate] = useState("")
  const [deliveryAddr, setDeliveryAddr] = useState("")
  const [note, setNote] = useState("")
  const [items, setItems] = useState<OutboundItem[]>([makeRow()])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")

  const updateItem = <K extends keyof OutboundItem>(
    key: number,
    field: K,
    value: OutboundItem[K],
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, [field]: value } : it)),
    )
  }
  const removeItem = (key: number) =>
    setItems((prev) => prev.filter((it) => it.key !== key))
  const addEmpty = () => setItems((prev) => [...prev, makeRow()])

  const addFromStock = (c: StockCandidate) => {
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
  const totalAmount = items.reduce(
    (s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0),
    0,
  )
  const filledRows = items.filter((it) => it.name).length
  const hasOverstock = items.some(
    (it) =>
      it.available > 0 && Number(it.qty) > 0 && Number(it.qty) > it.available,
  )

  const filteredStock = STOCK_LIBRARY.filter(
    (m) =>
      !pickerSearch ||
      m.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.spec.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(pickerSearch.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ChevronLeft className="w-4 h-4 mr-1" />
        返回出库管理
      </Button>

      {/* 页头 */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
          <PackageMinus className="w-5 h-5 text-orange-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">新建出库单</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            为一次发运登记出库单，支持一次添加多种物料并校验可用库存
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 主区 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 单据信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                单据信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 出库类型 */}
              <div className="space-y-2">
                <Label>
                  出库类型<span className="text-destructive ml-0.5">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {OUTBOUND_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setOutboundType(t.value)}
                      className={`rounded-lg border p-3 text-sm font-medium transition-all text-left ${
                        outboundType === t.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <Badge
                        variant="outline"
                        className={`${t.color} border-0 font-normal mb-1.5`}
                      >
                        {t.value}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {t.value === "出租出库" && "出租发运给承租方"}
                        {t.value === "销售出库" && "销售发运给客户"}
                        {t.value === "调拨出库" && "调出至其他仓库"}
                        {t.value === "盘亏出库" && "盘点核销登记"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="customer">
                    {outboundType === "调拨出库"
                      ? "调入仓库"
                      : outboundType === "盘亏出库"
                        ? "盘点单据/说明"
                        : "收货单位 / 承租方"}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    id="customer"
                    placeholder="如：中铁十四局集团广州分公司"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    出库仓库<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Select value={warehouse} onValueChange={setWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择出库仓库" />
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
                  <Label htmlFor="planDate">
                    计划出库日期
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    id="planDate"
                    type="date"
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
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
                <div className="space-y-1.5">
                  <Label htmlFor="contract">关联合同/订单号</Label>
                  <Input
                    id="contract"
                    placeholder="选填，如：HT2026050112"
                    value={contractNo}
                    onChange={(e) => setContractNo(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 物料明细 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-orange-700" />
                  物料明细
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
                <Table className="min-w-[1150px]">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead className="min-w-[200px]">物料</TableHead>
                      <TableHead className="min-w-[140px]">规格型号</TableHead>
                      <TableHead className="w-[80px]">单位</TableHead>
                      <TableHead className="w-[100px] text-right">
                        可用库存
                      </TableHead>
                      <TableHead className="w-[110px] text-right">
                        出库数量
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        单价(元)
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        金额(元)
                      </TableHead>
                      <TableHead className="min-w-[120px]">批次</TableHead>
                      <TableHead className="w-[60px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => {
                      const qty = Number(it.qty) || 0
                      const amount = qty * (Number(it.unitPrice) || 0)
                      const over = it.available > 0 && qty > it.available
                      return (
                        <TableRow key={it.key} className="align-top">
                          <TableCell className="text-muted-foreground pt-3">
                            {idx + 1}
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="物料名称"
                              value={it.name}
                              onChange={(e) =>
                                updateItem(it.key, "name", e.target.value)
                              }
                              className="h-9"
                            />
                            {it.category && (
                              <div className="text-[11px] text-muted-foreground mt-1">
                                {it.category}
                                {it.materialId && (
                                  <span className="font-mono ml-2">
                                    {it.materialId}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="如 HW200×200"
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
                          <TableCell className="text-right tabular-nums text-sm pt-3 text-muted-foreground">
                            {it.available > 0
                              ? it.available.toLocaleString("zh-CN")
                              : "—"}
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
                                over ? "border-destructive text-destructive" : ""
                              }`}
                            />
                            {over && (
                              <div className="text-[11px] text-destructive mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
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
                                updateItem(it.key, "unitPrice", e.target.value)
                              }
                              className="h-9 text-right tabular-nums"
                            />
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-medium text-sm pt-3">
                            {amount > 0 ? amount.toLocaleString("zh-CN") : "—"}
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="批次号"
                              value={it.batch}
                              onChange={(e) =>
                                updateItem(it.key, "batch", e.target.value)
                              }
                              className="h-9"
                            />
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
              <div className="px-4 py-3 border-t bg-muted/20 flex items-center justify-between text-sm">
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
                <div className="text-base font-bold text-primary tabular-nums">
                  {totalAmount.toLocaleString("zh-CN")} 元
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 物流与说明 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-700" />
                物流与说明
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="carrier">承运单位</Label>
                  <Input
                    id="carrier"
                    placeholder="选填，如：粤运物流"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="plate">车牌号</Label>
                  <Input
                    id="plate"
                    placeholder="选填，如：粤A 7K2Z9"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="addr">收货地址</Label>
                  <Input
                    id="addr"
                    placeholder="如：广州市黄埔区科学城开创大道 XXX 号"
                    value={deliveryAddr}
                    onChange={(e) => setDeliveryAddr(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="note">备注</Label>
                  <Textarea
                    id="note"
                    rows={3}
                    placeholder="可记录发运要求、签收说明等"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧汇总 */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-primary" />
                单据汇总
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">出库类型</span>
                  <Badge
                    variant="outline"
                    className={`${
                      OUTBOUND_TYPES.find((t) => t.value === outboundType)?.color
                    } border-0 font-normal`}
                  >
                    {outboundType}
                  </Badge>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">收货方</span>
                  <span className="font-medium text-right truncate">
                    {customer || "—"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">仓库</span>
                  <span className="font-medium text-right truncate">
                    {warehouse || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">计划日期</span>
                  <span className="font-medium">{planDate || "—"}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">品种数</span>
                  <span className="font-semibold tabular-nums">
                    {filledRows}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">合计数量</span>
                  <span className="font-semibold tabular-nums">
                    {totalQty.toLocaleString("zh-CN")}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <div className="text-xs text-primary/80 mb-1">单据合计金额</div>
                <div className="text-2xl font-bold text-primary tabular-nums">
                  {totalAmount.toLocaleString("zh-CN")}
                  <span className="text-sm font-medium ml-1">元</span>
                </div>
              </div>

              {hasOverstock && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <div className="text-xs text-destructive">
                    存在出库数量超过可用库存的物料，请调整后再提交。
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <Button className="w-full" disabled={hasOverstock}>
                  <Send className="w-4 h-4 mr-2" />
                  提交单据
                </Button>
                <Button variant="outline" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  保存草稿
                </Button>
                <Button variant="ghost" className="w-full" onClick={onBack}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 库存选择弹窗 */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>从可用库存选择</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索物料名称、规格或分类"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-[420px] overflow-y-auto space-y-2">
              {filteredStock.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => addFromStock(m)}
                  className="w-full text-left rounded-lg border p-3 hover:bg-muted/50 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {m.spec} · {m.unit}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {m.warehouse}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant="secondary"
                        className="font-normal text-[11px]"
                      >
                        {m.category}
                      </Badge>
                      <div className="text-xs font-medium text-emerald-700 mt-1 tabular-nums">
                        可用 {m.available.toLocaleString("zh-CN")} {m.unit}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        参考 {m.refPrice.toLocaleString("zh-CN")} 元
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {filteredStock.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  未找到匹配的库存
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
