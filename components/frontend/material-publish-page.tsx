"use client"

import { useState } from "react"
import { ArrowLeft, Search, Package, MapPin, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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

interface MaterialPublishPageProps {
  onNavigate: (page: string) => void
}

// 循环物资库模拟数据
const materialLibrary = [
  {
    id: "M001",
    name: "Q235B热轧H型钢 200×200×8×12",
    category: "型材类",
    spec: "200×200×8×12，12m定尺",
    quantity: "850吨",
    unit: "吨",
    location: "广东省广州市黄埔区",
    condition: "95成新",
    owner: "中铁十一局集团广州分公司",
  },
  {
    id: "M002",
    name: "碗扣式脚手架套装",
    category: "脚手架类",
    spec: "48×3.5钢管，含扣件",
    quantity: "3200套",
    unit: "套",
    location: "广东省深圳市宝安区",
    condition: "90成新",
    owner: "中铁十四局深圳地铁13号线项目部",
  },
  {
    id: "M003",
    name: "20#工字钢",
    category: "型材类",
    spec: "20#，12m定尺，防锈处理",
    quantity: "420吨",
    unit: "吨",
    location: "广东省东莞市虎门镇",
    condition: "88成新",
    owner: "中铁十六局集团华南分公司",
  },
  {
    id: "M004",
    name: "QTZ63塔吊",
    category: "其他材料",
    spec: "QTZ63型，臂长50m",
    quantity: "8台",
    unit: "台",
    location: "广东省佛山市顺德区",
    condition: "良好",
    owner: "中铁建工集团广州分公司",
  },
  {
    id: "M005",
    name: "预制混凝土管片",
    category: "拼装类",
    spec: "外径6.2m，厚0.35m，标准环",
    quantity: "1200环",
    unit: "环",
    location: "广东省广州市番禺区",
    condition: "95成新",
    owner: "中铁隧道局集团广州分公司",
  },
  {
    id: "M006",
    name: "钢模板",
    category: "模板类",
    spec: "1.5m×0.3m，厚6mm",
    quantity: "5000张",
    unit: "张",
    location: "广东省惠州市惠城区",
    condition: "85成新",
    owner: "中铁十四局集团广州分公司",
  },
]

const categoryOptions = [
  "全部",
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

export function MaterialPublishPage({ onNavigate }: MaterialPublishPageProps) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [step, setStep] = useState<"select" | "form">("select")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [agreed, setAgreed] = useState(false)

  // 每条物资出租的价格和说明状态
  const [rentPrices, setRentPrices] = useState<Record<string, string>>({})
  const [rentUnits, setRentUnits] = useState<Record<string, string>>({})
  const [rentRemarks, setRentRemarks] = useState<Record<string, string>>({})

  const filteredMaterials = materialLibrary.filter(m => {
    const matchCategory = selectedCategory === "全部" || m.category === selectedCategory
    const matchKeyword = !searchKeyword || 
      m.name.includes(searchKeyword) || 
      m.spec.includes(searchKeyword) ||
      m.owner.includes(searchKeyword)
    return matchCategory && matchKeyword
  })

  const toggleSelect = (id: string) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectedItems = materialLibrary.filter(m => selectedMaterials.includes(m.id))

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 bg-primary rounded-full" />
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 顶部返回栏 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => step === "form" ? setStep("select") : onNavigate("home")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === "form" ? "返回选择物资" : "返回"}
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className={step === "select" ? "text-primary font-medium" : ""}>
            1. 选择物资
          </span>
          <span className="text-border">›</span>
          <span className={step === "form" ? "text-primary font-medium" : ""}>
            2. 填写发布信息
          </span>
        </div>
      </div>

      {step === "select" ? (
        <>
          {/* 步骤一：从循环物资库选择物资 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle title="从循环物资库选择物资" />
              <p className="text-sm text-muted-foreground mb-4">
                请选择您要发布出租的物资，可多选
              </p>

              {/* 搜索和筛选 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索物资名称、规格..."
                    className="pl-9"
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categoryOptions.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 物资列表 */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="w-[56px] text-center">序号</TableHead>
                      <TableHead>物资名称</TableHead>
                      <TableHead>类别</TableHead>
                      <TableHead>规格</TableHead>
                      <TableHead>可租数量</TableHead>
                      <TableHead>成色</TableHead>
                      <TableHead>存放位置</TableHead>
                      <TableHead>物权单位</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material, idx) => (
                      <TableRow
                        key={material.id}
                        className={`cursor-pointer transition-colors ${selectedMaterials.includes(material.id) ? "bg-primary/5" : "hover:bg-muted/30"}`}
                        onClick={() => toggleSelect(material.id)}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedMaterials.includes(material.id)}
                            onCheckedChange={() => toggleSelect(material.id)}
                          />
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-accent" />
                            </div>
                            <span className="font-medium text-sm">{material.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{material.category}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{material.spec}</TableCell>
                        <TableCell className="text-sm font-medium">{material.quantity}</TableCell>
                        <TableCell>
                          <span className="text-sm text-accent font-medium">{material.condition}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {material.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{material.owner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 已选数量 + 下一步 */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  {selectedMaterials.length > 0 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-foreground">
                        已选择 <span className="font-semibold text-primary">{selectedMaterials.length}</span> 条物资
                      </span>
                      <div className="flex gap-1 flex-wrap ml-2">
                        {selectedItems.map(m => (
                          <Badge key={m.id} variant="secondary" className="text-xs gap-1">
                            {m.name.slice(0, 10)}{m.name.length > 10 ? "..." : ""}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={e => { e.stopPropagation(); toggleSelect(m.id) }}
                            />
                          </Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">请至少选择一条物资</span>
                  )}
                </div>
                <Button
                  disabled={selectedMaterials.length === 0}
                  onClick={() => setStep("form")}
                >
                  下一步：填写发布信息
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* 步骤二：填写发布信息 */}

          {/* 已选物资及出租信息 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle title="出租物资信息" />
              <div className="space-y-4">
                {selectedItems.map(material => (
                  <div key={material.id} className="border border-border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-card-foreground">{material.name}</span>
                          <Badge variant="outline" className="text-xs">{material.category}</Badge>
                          <span className="text-xs text-accent font-medium">{material.condition}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          规格：{material.spec} | 可租数量：{material.quantity} | {material.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-3 items-center pl-12">
                      <div className="flex items-center gap-2">
                        <Label className="whitespace-nowrap shrink-0 text-sm">租赁单价<span className="text-destructive">*</span></Label>
                        <Input
                          className="w-24 h-8 text-sm"
                          placeholder="请输入"
                          value={rentPrices[material.id] || ""}
                          onChange={e => setRentPrices(prev => ({ ...prev, [material.id]: e.target.value }))}
                        />
                        <Select
                          value={rentUnits[material.id] || ""}
                          onValueChange={val => setRentUnits(prev => ({ ...prev, [material.id]: val }))}
                        >
                          <SelectTrigger className="w-28 h-8 text-sm">
                            <SelectValue placeholder="计价单位" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ton-month">元/吨/月</SelectItem>
                            <SelectItem value="set-day">元/套/天</SelectItem>
                            <SelectItem value="piece-month">元/件/月</SelectItem>
                            <SelectItem value="unit-month">元/台/月</SelectItem>
                            <SelectItem value="ring-month">元/环/月</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Label className="whitespace-nowrap shrink-0 text-sm">补充说明</Label>
                        <Input
                          className="h-8 text-sm"
                          placeholder="如最短租期、取货方式等（选填）"
                          value={rentRemarks[material.id] || ""}
                          onChange={e => setRentRemarks(prev => ({ ...prev, [material.id]: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 联系信息 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle title="联系信息" />
              <div className="flex flex-wrap gap-x-12 gap-y-4">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap shrink-0">联系人<span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="请输入联系人名称"
                    className="w-48"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap shrink-0">联系方式<span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="请输入联系人电话"
                    className="w-48"
                    maxLength={11}
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{contactPhone.length}/11</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 平台服务费说明 */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle title="平台服务费说明" />
              <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed mb-4">
                <p>
                  服务说明：订单成交后，平台将收取最终成交金额的
                  <span className="text-foreground font-medium"> 0.5% </span>
                  作为服务费用。
                </p>
                <p className="mt-2">
                  物资出租发布后，平台将在信息审核通过后对外展示。承租方提交申请后，双方可在线沟通确认，平台提供合同签署及结算服务。
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={agreed}
                  onCheckedChange={v => setAgreed(v as boolean)}
                />
                <span className="text-sm">
                  我已阅读并同意
                  <Button variant="link" className="p-0 h-auto text-sm text-primary">
                    《物资租赁条例》
                  </Button>
                </span>
              </label>
            </CardContent>
          </Card>

          {/* 底部操作按钮 */}
          <div className="flex justify-center gap-4 pb-6">
            <Button variant="outline" onClick={() => setStep("select")}>
              上一步
            </Button>
            <Button variant="outline">暂存</Button>
            <Button disabled={!agreed || !contactName || !contactPhone}>
              提交发布
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
