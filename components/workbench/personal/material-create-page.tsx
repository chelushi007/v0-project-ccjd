"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Boxes,
  Info,
  Package,
  MapPin,
  AlertTriangle,
  CircleDollarSign,
  Save,
  Send,
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

const CATEGORIES = [
  "模板类",
  "支护类",
  "脚手架类",
  "拼装类",
  "轨道类",
  "型材类",
  "电线电缆",
  "房屋建筑类",
  "其他材料",
]

const UNITS = ["吨", "套", "根", "块", "节", "件", "米", "个", "台"]

const WAREHOUSES = [
  "中铁建广州南沙基地·A区",
  "中铁建广州南沙基地·E区",
  "中铁建广州南沙基地·G区",
  "中铁建深圳前海基地·B区",
  "中铁建东莞虎门基地·C区",
  "中铁建中山翠亨基地·D区",
  "中铁建佛山顺德基地·F区",
]

export function MaterialCreatePage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [spec, setSpec] = useState("")
  const [unit, setUnit] = useState("")
  const [brand, setBrand] = useState("")
  const [warehouse, setWarehouse] = useState("")
  const [initialQty, setInitialQty] = useState("")
  const [unitValue, setUnitValue] = useState("")
  const [threshold, setThreshold] = useState("")
  const [tag, setTag] = useState("自有资产")
  const [description, setDescription] = useState("")

  const totalValue =
    initialQty && unitValue
      ? (Number(initialQty) * Number(unitValue)).toLocaleString("zh-CN")
      : "0"

  return (
    <div className="space-y-4">
      {/* 返回栏 */}
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ChevronLeft className="w-4 h-4 mr-1" />
        返回库存管理
      </Button>

      {/* 页头 */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Boxes className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">新增物料单</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            登记一类新的循环物料到资产库，包含规格、单价、初始库存与存放仓库
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 主表单 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 基本信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="name">
                  物料名称<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="如：Q235B 热轧 H 型钢"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  物料分类<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="spec">
                  规格型号<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="spec"
                  placeholder="如：HW200×200×8×12"
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  计量单位<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择单位" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brand">品牌 / 厂家</Label>
                <Input
                  id="brand"
                  placeholder="如：本钢板材 / 宝武"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>资产属性</Label>
                <div className="flex flex-wrap gap-2">
                  {["自有资产", "租赁资产", "代管资产"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(t)}
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                        tag === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 存储与库存 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                存储与初始库存
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label>
                  存放仓库<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Select value={warehouse} onValueChange={setWarehouse}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择存放仓库" />
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
                <Label htmlFor="qty">初始库存数量</Label>
                <Input
                  id="qty"
                  type="number"
                  placeholder="0"
                  value={initialQty}
                  onChange={(e) => setInitialQty(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="threshold" className="flex items-center gap-1">
                  低库存预警阈值
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  placeholder="可用数量低于此值时预警"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="unitValue">
                  参考单价（元 / {unit || "单位"}）
                </Label>
                <Input
                  id="unitValue"
                  type="number"
                  placeholder="用于库存价值核算"
                  value={unitValue}
                  onChange={(e) => setUnitValue(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 说明 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                备注说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="可记录采购批次、出厂日期、技术参数、使用注意事项等"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* 右侧汇总卡 */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-primary" />
                登记预览
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="text-xs text-muted-foreground">物料名称</div>
                <div className="text-sm font-semibold text-foreground min-h-[20px]">
                  {name || <span className="text-muted-foreground">未填写</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg border p-2.5">
                  <div className="text-[11px] text-muted-foreground mb-1">分类</div>
                  <div className="font-medium truncate">
                    {category || "—"}
                  </div>
                </div>
                <div className="rounded-lg border p-2.5">
                  <div className="text-[11px] text-muted-foreground mb-1">规格</div>
                  <div className="font-medium truncate">{spec || "—"}</div>
                </div>
                <div className="rounded-lg border p-2.5">
                  <div className="text-[11px] text-muted-foreground mb-1">
                    单位
                  </div>
                  <div className="font-medium">{unit || "—"}</div>
                </div>
                <div className="rounded-lg border p-2.5">
                  <div className="text-[11px] text-muted-foreground mb-1">
                    资产属性
                  </div>
                  <Badge variant="secondary" className="font-normal">
                    {tag}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">初始库存</span>
                  <span className="font-medium tabular-nums">
                    {initialQty ? `${Number(initialQty).toLocaleString("zh-CN")} ${unit || ""}` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">参考单价</span>
                  <span className="font-medium tabular-nums">
                    {unitValue ? `${Number(unitValue).toLocaleString("zh-CN")} 元` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">预警阈值</span>
                  <span className="font-medium tabular-nums">
                    {threshold ? `${Number(threshold).toLocaleString("zh-CN")} ${unit || ""}` : "—"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <div className="text-xs text-primary/80 mb-1">预计库存总值</div>
                <div className="text-2xl font-bold text-primary tabular-nums">
                  {totalValue}
                  <span className="text-sm font-medium ml-1">元</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  提交登记
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
    </div>
  )
}
