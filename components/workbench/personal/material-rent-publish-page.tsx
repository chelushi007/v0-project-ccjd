"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Upload,
  MapPin,
  Plus,
  X,
  Package,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
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
  MaterialPickerDialog,
  type MaterialItem,
} from "./material-picker-dialog"

interface MaterialRentPublishPageProps {
  onBack: () => void
  initialMaterials: MaterialItem[]
}

interface RentMaterial extends MaterialItem {
  quantity: string
  unitPrice: string
}

export function MaterialRentPublishPage({
  onBack,
  initialMaterials,
}: MaterialRentPublishPageProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [materials, setMaterials] = useState<RentMaterial[]>(
    initialMaterials.map((m) => ({ ...m, quantity: "", unitPrice: "" })),
  )

  const [rentType, setRentType] = useState("self")
  const [rentMethod, setRentMethod] = useState<string[]>(["整租"])
  const [packageOptions, setPackageOptions] = useState<string[]>([])
  const [transportOptions, setTransportOptions] = useState<string[]>([])
  const [maintenance, setMaintenance] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "/placeholder.svg?height=80&width=100",
    "/placeholder.svg?height=80&width=100",
  ])
  const [agreed, setAgreed] = useState(false)

  const toggleArrayItem = (
    arr: string[],
    setArr: (v: string[]) => void,
    item: string,
  ) => {
    if (arr.includes(item)) setArr(arr.filter((i) => i !== item))
    else setArr([...arr, item])
  }

  const handlePickerConfirm = (items: MaterialItem[]) => {
    // 合并：保留已存在物料的填写内容
    setMaterials((prev) => {
      const prevMap = new Map(prev.map((m) => [m.id, m]))
      return items.map((it) => prevMap.get(it.id) ?? { ...it, quantity: "", unitPrice: "" })
    })
  }

  const removeMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const updateMaterial = (id: string, field: "quantity" | "unitPrice", value: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    )
  }

  const SectionTitle = ({
    title,
    extra,
  }: {
    title: string
    extra?: React.ReactNode
  }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {extra}
    </div>
  )

  const CheckboxGroup = ({
    items,
    selected,
    onChange,
    hasOther = false,
  }: {
    items: string[]
    selected: string[]
    onChange: (item: string) => void
    hasOther?: boolean
  }) => (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <label key={item} className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={selected.includes(item)}
            onCheckedChange={() => onChange(item)}
          />
          <span className="text-sm whitespace-nowrap">{item}</span>
        </label>
      ))}
      {hasOther && (
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={selected.includes("其他")}
            onCheckedChange={() => onChange("其他")}
          />
          <span className="text-sm whitespace-nowrap">其他</span>
          <Input placeholder="请填写" className="w-28 h-7 text-sm" />
        </label>
      )}
    </div>
  )

  // 估算总租金（仅展示用）
  const estimatedTotal = materials.reduce((sum, m) => {
    const q = parseFloat(m.quantity) || 0
    const p = parseFloat(m.unitPrice) || 0
    return sum + q * p
  }, 0)

  return (
    <div className="space-y-4">
      {/* 顶部返回 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回需求列表
        </Button>
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
          <Package className="w-3.5 h-3.5" />
          物资出租
        </Badge>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-bold">发布物资出租需求单</h2>
              <p className="text-xs text-muted-foreground mt-1">
                关联循环物资库的物料，发布物资出租需求并完成对外展示
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              估算总租金{" "}
              <span className="text-primary font-semibold text-base mx-1 tabular-nums">
                ¥ {estimatedTotal.toLocaleString("zh-CN")}
              </span>
              元 / 月
            </div>
          </div>

          {/* 需求标题 */}
          <div>
            <SectionTitle title="需求标题" />
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">
                标题<span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="请输入 50 个字符以内的描述，如：铁路箱梁模板批量出租"
                className="flex-1"
                maxLength={50}
              />
            </div>
          </div>

          {/* 业务类型 */}
          <div>
            <SectionTitle title="业务类型" />
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">
                租赁类型<span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={rentType}
                onValueChange={setRentType}
                className="flex gap-6"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="self" />
                  <span className="whitespace-nowrap">自主</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="entrust" />
                  <span className="whitespace-nowrap">委托</span>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* 物资清单 */}
          <div>
            <SectionTitle
              title="物资清单"
              extra={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPickerOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  从循环物资库添加
                </Button>
              }
            />
            {materials.length === 0 ? (
              <div
                onClick={() => setPickerOpen(true)}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                <Package className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  暂未添加物料，点击选择物资分类并添加循环物资
                </p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-[180px]">分类-物料编号</TableHead>
                      <TableHead>物料名称</TableHead>
                      <TableHead className="w-[140px]">规格型号</TableHead>
                      <TableHead className="w-[80px]">单位</TableHead>
                      <TableHead className="w-[140px]">
                        出租数量<span className="text-destructive">*</span>
                      </TableHead>
                      <TableHead className="w-[160px]">
                        单价<span className="text-destructive">*</span>
                      </TableHead>
                      <TableHead className="w-[60px] text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-mono text-xs">
                          {m.id}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {m.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {m.spec}
                        </TableCell>
                        <TableCell className="text-sm">{m.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Input
                              value={m.quantity}
                              onChange={(e) =>
                                updateMaterial(m.id, "quantity", e.target.value)
                              }
                              placeholder="0"
                              className="h-8 text-sm"
                            />
                            <span className="text-xs text-muted-foreground">
                              {m.unit}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Input
                              value={m.unitPrice}
                              onChange={(e) =>
                                updateMaterial(m.id, "unitPrice", e.target.value)
                              }
                              placeholder="0.00"
                              className="h-8 text-sm"
                            />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              元/{m.unit}/月
                            </span>
                          </div>
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* 租赁条款 */}
          <div>
            <SectionTitle title="租赁条款" />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap shrink-0">
                    起租期<span className="text-destructive">*</span>
                  </Label>
                  <Input defaultValue="30" className="w-16" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    天起
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap shrink-0">
                    最长租期
                  </Label>
                  <Input placeholder="" className="w-20" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    天
                  </span>
                  <label className="flex items-center gap-1 ml-2">
                    <Checkbox defaultChecked />
                    <span className="text-sm whitespace-nowrap">不限制</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap shrink-0">
                    押金<span className="text-destructive">*</span>
                  </Label>
                  <Input placeholder="" className="w-28" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    元
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap shrink-0">
                    出租方式<span className="text-destructive">*</span>
                  </Label>
                  <label className="flex items-center gap-1">
                    <Checkbox
                      checked={rentMethod.includes("整租")}
                      onCheckedChange={() =>
                        toggleArrayItem(rentMethod, setRentMethod, "整租")
                      }
                    />
                    <span className="text-sm whitespace-nowrap">整租</span>
                  </label>
                  <label className="flex items-center gap-1 ml-2">
                    <Checkbox
                      checked={rentMethod.includes("分租")}
                      onCheckedChange={() =>
                        toggleArrayItem(rentMethod, setRentMethod, "分租")
                      }
                    />
                    <span className="text-sm whitespace-nowrap">分租</span>
                  </label>
                  <label className="flex items-center gap-1 ml-2">
                    <Checkbox
                      checked={rentMethod.includes("按需出租")}
                      onCheckedChange={() =>
                        toggleArrayItem(rentMethod, setRentMethod, "按需出租")
                      }
                    />
                    <span className="text-sm whitespace-nowrap">按需出租</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap shrink-0">
                    税率<span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="3">3%</SelectItem>
                      <SelectItem value="6">6%</SelectItem>
                      <SelectItem value="9">9%</SelectItem>
                      <SelectItem value="13">13%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap shrink-0">付款方式</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">月结</SelectItem>
                      <SelectItem value="quarterly">季结</SelectItem>
                      <SelectItem value="prepay">预付</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* 服务配套 */}
          <div>
            <SectionTitle title="服务配套" />
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Label className="whitespace-nowrap shrink-0 mt-1.5">
                  包装方式
                </Label>
                <CheckboxGroup
                  items={["原厂包装", "木箱包装", "塑料膜防潮", "钢带捆扎", "无需包装"]}
                  selected={packageOptions}
                  onChange={(item) =>
                    toggleArrayItem(packageOptions, setPackageOptions, item)
                  }
                  hasOther
                />
              </div>
              <div className="flex items-start gap-2">
                <Label className="whitespace-nowrap shrink-0 mt-1.5">
                  运输服务
                </Label>
                <CheckboxGroup
                  items={[
                    "自提",
                    "送货上门",
                    "代办物流",
                    "公路运输",
                    "铁路运输",
                  ]}
                  selected={transportOptions}
                  onChange={(item) =>
                    toggleArrayItem(transportOptions, setTransportOptions, item)
                  }
                />
              </div>
              <div className="flex items-start gap-2">
                <Label className="whitespace-nowrap shrink-0 mt-1.5">
                  维保支持
                </Label>
                <CheckboxGroup
                  items={[
                    "免费技术指导",
                    "现场安装",
                    "现场调试",
                    "驻场维护",
                    "定期巡检",
                  ]}
                  selected={maintenance}
                  onChange={(item) =>
                    toggleArrayItem(maintenance, setMaintenance, item)
                  }
                />
              </div>
            </div>
          </div>

          {/* 物资描述 */}
          <div>
            <SectionTitle title="物资描述" />
            <div className="flex items-start gap-2">
              <Label className="whitespace-nowrap shrink-0 mt-2">
                详细介绍
              </Label>
              <div className="flex-1">
                <Textarea
                  placeholder="请输入物资的详细描述信息，包括来源、新旧程度、使用历史、出租条件等"
                  className="min-h-[120px]"
                  maxLength={1000}
                />
                <div className="text-right text-xs text-muted-foreground mt-1">
                  0 / 1000
                </div>
              </div>
            </div>
          </div>

          {/* 物资图片 */}
          <div>
            <SectionTitle title="物资图片" />
            <div className="flex items-start gap-2">
              <Label className="whitespace-nowrap shrink-0 mt-2">
                上传图片<span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <div className="flex gap-4 mb-4 flex-wrap">
                  {uploadedImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-20 rounded-lg border border-border overflow-hidden group"
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`物资图片${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <button
                        type="button"
                        className="absolute top-1 left-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full items-center justify-center text-xs hidden group-hover:flex"
                        onClick={() =>
                          setUploadedImages(
                            uploadedImages.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    选择电脑图片上传（单个 / 批量）
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  支持上传物资实物图片，JPG / PNG / JPEG 格式，最多 20 张，每张最大
                  2M
                </p>
              </div>
            </div>
          </div>

          {/* 物资所在位置 */}
          <div>
            <SectionTitle title="物资所在位置" />
            <div className="flex items-start gap-2">
              <Label className="whitespace-nowrap shrink-0 mt-2">
                具体位置<span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Select>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="广东省" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guangdong">广东省</SelectItem>
                      <SelectItem value="beijing">北京市</SelectItem>
                      <SelectItem value="shanghai">上海市</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="广州市" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guangzhou">广州市</SelectItem>
                      <SelectItem value="shenzhen">深圳市</SelectItem>
                      <SelectItem value="dongguan">东莞市</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="黄埔区" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nansha">南沙区</SelectItem>
                      <SelectItem value="huangpu">黄埔区</SelectItem>
                      <SelectItem value="tianhe">天河区</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="输入仓储基地名称或具体地址"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
                <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center relative">
                  <MapPin className="w-8 h-8 text-destructive" />
                  <span className="text-sm text-muted-foreground ml-2">
                    地图定位区域
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 联系信息 */}
          <div>
            <SectionTitle title="联系信息" />
            <div className="flex flex-wrap gap-x-12 gap-y-4">
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap shrink-0">
                  联系人<span className="text-destructive">*</span>
                </Label>
                <Input placeholder="请输入联系人名称" className="w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap shrink-0">
                  联系方式<span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="请输入联系人电话"
                  className="w-48"
                  maxLength={11}
                />
              </div>
            </div>
          </div>

          {/* 平台服务费说明 */}
          <div>
            <SectionTitle title="平台服务费说明" />
            <p className="text-sm text-muted-foreground ml-6">
              服务费说明：物资出租订单成交后，平台将收取最终成交金额的 0.5%
              作为服务费用。
            </p>
          </div>

          {/* 提交按钮 */}
          <div className="flex flex-col items-center gap-4 pt-6 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v as boolean)}
              />
              <span className="text-sm">我已阅读并同意</span>
              <Button variant="link" className="p-0 h-auto text-primary">
                《物资出租条例》
              </Button>
            </label>
            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack}>
                取消
              </Button>
              <Button variant="secondary">暂存</Button>
              <Button
                disabled={!agreed || materials.length === 0}
                onClick={onBack}
              >
                提交
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 续选物资弹窗 */}
      <MaterialPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onConfirm={handlePickerConfirm}
        initialSelected={materials}
      />
    </div>
  )
}
