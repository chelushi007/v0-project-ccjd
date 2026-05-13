"use client"

import { useState } from "react"
import {
  ChevronLeft,
  PackagePlus,
  Plus,
  Trash2,
  FileText,
  Truck,
  Save,
  Send,
  CircleDollarSign,
  Boxes,
  Search,
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

const INBOUND_TYPES = [
  { value: "采购入库", color: "bg-primary/10 text-primary" },
  { value: "调拨入库", color: "bg-indigo-100 text-indigo-700" },
  { value: "归还入库", color: "bg-emerald-100 text-emerald-700" },
  { value: "盘盈入库", color: "bg-amber-100 text-amber-700" },
]

const WAREHOUSES = [
  "中铁建广州南沙基地·A区",
  "中铁建广州南沙基地·E区",
  "中铁建深圳前海基地·B区",
  "中铁建东莞虎门基地·C区",
  "中铁建中山翠亨基地·D区",
  "中铁建佛山顺德基地·F区",
]

// 备选物料库
interface MaterialCandidate {
  id: string
  name: string
  category: string
  spec: string
  unit: string
  refPrice: number
}

const MATERIAL_LIBRARY: MaterialCandidate[] = [
  {
    id: "WL-2026-0001",
    name: "Q235B 热轧 H 型钢",
    category: "型材类",
    spec: "HW200×200×8×12",
    unit: "吨",
    refPrice: 4200,
  },
  {
    id: "WL-2026-0002",
    name: "建筑钢管脚手架套装",
    category: "脚手架类",
    spec: "Φ48×3.0 含扣件",
    unit: "套",
    refPrice: 380,
  },
  {
    id: "WL-2026-0003",
    name: "钢轨 60kg/m",
    category: "轨道类",
    spec: "60kg/m × 12.5m",
    unit: "根",
    refPrice: 2500,
  },
  {
    id: "WL-2026-0004",
    name: "WJ-7 型扣件系统",
    category: "拼装类",
    spec: "标准成套",
    unit: "套",
    refPrice: 56,
  },
  {
    id: "WL-2026-0005",
    name: "钢板桩 IV 型",
    category: "支护类",
    spec: "L=12m / IV",
    unit: "吨",
    refPrice: 5800,
  },
  {
    id: "WL-2026-0006",
    name: "组合钢模板",
    category: "模板类",
    spec: "1500×300×55",
    unit: "块",
    refPrice: 88,
  },
  {
    id: "WL-2026-0007",
    name: "VV 型橡套电缆 3×95+1",
    category: "电线电缆",
    spec: "0.6/1kV",
    unit: "米",
    refPrice: 78,
  },
  {
    id: "WL-2026-0008",
    name: "QTZ63 塔吊标准节",
    category: "其他材料",
    spec: "标准节 1.5m",
    unit: "节",
    refPrice: 18000,
  },
]

interface InboundItem {
  key: number
  materialId: string
  name: string
  category: string
  spec: string
  unit: string
  qty: string
  unitPrice: string
  batch: string
  remark: string
}

let nextKey = 1
function makeRow(c?: MaterialCandidate): InboundItem {
  return {
    key: nextKey++,
    materialId: c?.id ?? "",
    name: c?.name ?? "",
    category: c?.category ?? "",
    spec: c?.spec ?? "",
    unit: c?.unit ?? "",
    qty: "",
    unitPrice: c ? String(c.refPrice) : "",
    batch: "",
    remark: "",
  }
}

export function InboundCreatePage({ onBack }: { onBack: () => void }) {
  const [inboundType, setInboundType] = useState("采购入库")
  const [source, setSource] = useState("")
  const [warehouse, setWarehouse] = useState("")
  const [planDate, setPlanDate] = useState("")
  const [operator, setOperator] = useState("")
  const [contractNo, setContractNo] = useState("")
  const [carrier, setCarrier] = useState("")
  const [plate, setPlate] = useState("")
  const [note, setNote] = useState("")
  const [items, setItems] = useState<InboundItem[]>([makeRow()])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")

  const updateItem = (key: number, field: keyof InboundItem, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, [field]: value } : it)),
    )
  }
  const removeItem = (key: number) =>
    setItems((prev) => prev.filter((it) => it.key !== key))
  const addEmpty = () => setItems((prev) => [...prev, makeRow()])

  const addFromLibrary = (c: MaterialCandidate) => {
    setItems((prev) => {
      // 替换第一个空行，否则追加
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

  const filteredLib = MATERIAL_LIBRARY.filter(
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
        返回入库管理
      </Button>

      {/* 页头 */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <PackagePlus className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">新建入库单</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            为一次到货登记入库单，可一次添加多种物料并核对数量、单价与批次
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 主区域 */}
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
              {/* 入库类型 tile 选择 */}
              <div className="space-y-2">
                <Label>
                  入库类型<span className="text-destructive ml-0.5">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {INBOUND_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setInboundType(t.value)}
                      className={`rounded-lg border p-3 text-sm font-medium transition-all text-left ${
                        inboundType === t.value
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
                        {t.value === "采购入库" && "对外采购到货登记"}
                        {t.value === "调拨入库" && "兄弟仓库间调入"}
                        {t.value === "归还入库" && "出租物料回库登记"}
                        {t.value === "盘盈入库" && "盘点新增登记"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="source">
                    {inboundType === "采购入库"
                      ? "供应商单位"
                      : inboundType === "调拨入库"
                        ? "调出仓库"
                        : inboundType === "归还入库"
                          ? "归还方/承租方"
                          : "盘点单据/说明"}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    id="source"
                    placeholder="如：广州联钢实业有限公司"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    入库仓库<span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Select value={warehouse} onValueChange={setWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择目标仓库" />
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
                    计划入库日期
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
                  <Label htmlFor="contract">关联合同号</Label>
                  <Input
                    id="contract"
                    placeholder="选填，如：HT2026050108"
                    value={contractNo}
                    onChange={(e) => setContractNo(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 物料明细（多物料表格） */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-700" />
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
                    从物料库选择
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
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead className="min-w-[200px]">物料</TableHead>
                      <TableHead className="min-w-[140px]">规格型号</TableHead>
                      <TableHead className="w-[80px]">单位</TableHead>
                      <TableHead className="w-[110px] text-right">
                        入库数量
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        单价(元)
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        金额(元)
                      </TableHead>
                      <TableHead className="min-w-[120px]">批次/备注</TableHead>
                      <TableHead className="w-[60px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => {
                      const amount =
                        (Number(it.qty) || 0) * (Number(it.unitPrice) || 0)
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
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              value={it.qty}
                              onChange={(e) =>
                                updateItem(it.key, "qty", e.target.value)
                              }
                              className="h-9 text-right tabular-nums"
                            />
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
                              placeholder="批次号 / 备注"
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

          {/* 运输与说明 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-700" />
                运输与说明
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
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="note">备注</Label>
                <Textarea
                  id="note"
                  rows={3}
                  placeholder="可记录验收要求、特殊作业说明等"
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
                <CircleDollarSign className="w-4 h-4 text-primary" />
                单据汇总
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">入库类型</span>
                  <Badge
                    variant="outline"
                    className={`${
                      INBOUND_TYPES.find((t) => t.value === inboundType)?.color
                    } border-0 font-normal`}
                  >
                    {inboundType}
                  </Badge>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">来源</span>
                  <span className="font-medium text-right truncate">
                    {source || "—"}
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

              <div className="flex flex-col gap-2 pt-1">
                <Button className="w-full">
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

      {/* 物料库选择弹窗 */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>从物料库选择</DialogTitle>
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
              {filteredLib.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => addFromLibrary(m)}
                  className="w-full text-left rounded-lg border p-3 hover:bg-muted/50 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {m.spec} · {m.unit}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant="secondary"
                        className="font-normal text-[11px]"
                      >
                        {m.category}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        参考 {m.refPrice.toLocaleString("zh-CN")} 元
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {filteredLib.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  未找到匹配的物料
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
