"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Upload, MapPin, Plus, X } from "lucide-react"

interface DetailPublishPageProps {
  onNavigate: (page: string) => void
  defaultTab?: "quick" | "detail"
}

export function DetailPublishPage({ onNavigate, defaultTab = "detail" }: DetailPublishPageProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [rentType, setRentType] = useState("self")
  const [businessTypes, setBusinessTypes] = useState<string[]>(["仓储出租"])
  const [rentMethod, setRentMethod] = useState<string[]>([])
  const [warehouseFeatures, setWarehouseFeatures] = useState<string[]>([])
  const [loadingEquipment, setLoadingEquipment] = useState<string[]>([])
  const [rackEquipment, setRackEquipment] = useState<string[]>([])
  const [facilities, setFacilities] = useState<string[]>([])
  const [safetyEnv, setSafetyEnv] = useState<string[]>([])
  const [securityConfig, setSecurityConfig] = useState<string[]>([])
  const [processing, setProcessing] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "/placeholder.svg?height=80&width=100",
    "/placeholder.svg?height=80&width=100",
    "/placeholder.svg?height=80&width=100",
  ])
  const [agreed, setAgreed] = useState(false)

  const toggleArrayItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item))
    } else {
      setArr([...arr, item])
    }
  }

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 bg-primary rounded-full" />
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
  )

  const CheckboxGroup = ({ 
    items, 
    selected, 
    onChange,
    hasOther = false,
    otherPlaceholder = "请填写"
  }: { 
    items: string[]
    selected: string[]
    onChange: (item: string) => void
    hasOther?: boolean
    otherPlaceholder?: string
  }) => (
    <div className="flex flex-wrap gap-4">
      {items.map(item => (
        <label key={item} className="flex items-center gap-2 cursor-pointer">
          <Checkbox 
            checked={selected.includes(item)}
            onCheckedChange={() => onChange(item)}
          />
          <span className="text-sm">{item}</span>
        </label>
      ))}
      {hasOther && (
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox 
            checked={selected.includes("其他")}
            onCheckedChange={() => onChange("其他")}
          />
          <span className="text-sm">其他</span>
          <Input placeholder={otherPlaceholder} className="w-24 h-7 text-sm" />
        </label>
      )}
    </div>
  )

  // 快捷发布表单
  const QuickPublishForm = () => (
    <div className="space-y-6">
      {/* 标题名称 */}
      <div>
        <SectionTitle title="需求标题" />
        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap shrink-0">标题<span className="text-destructive">*</span></Label>
          <Input placeholder="请输入50个字符以内的描述" className="flex-1" maxLength={50} />
        </div>
      </div>

      {/* 运营模式 */}
      <div>
        <SectionTitle title="运营模式" />
        <div className="flex flex-wrap items-center gap-x-12 gap-y-3">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">运营模式<span className="text-destructive">*</span></Label>
            <RadioGroup value={rentType} onValueChange={setRentType} className="flex gap-6">
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
          <div className="flex items-center gap-3">
            <Label className="whitespace-nowrap shrink-0">业务类型<span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-4">
              {["物资存放", "仓储出租"].map((biz) => (
                <label key={biz} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={businessTypes.includes(biz)}
                    onCheckedChange={() => toggleArrayItem(businessTypes, setBusinessTypes, biz)}
                  />
                  <span className="text-sm whitespace-nowrap">{biz}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 仓储描述 */}
      <div>
        <SectionTitle title="仓储描述" />
        <div className="flex items-start gap-2">
          <Label className="whitespace-nowrap shrink-0 mt-2">详细介绍<span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <Textarea 
              placeholder="请输入仓储的详细描述信息，包括仓储类型、面积、配套设施等" 
              className="min-h-[120px]"
              maxLength={1000}
            />
            <div className="text-right text-xs text-muted-foreground mt-1">0/1000</div>
          </div>
        </div>
      </div>

      {/* 联系信息 */}
      <div>
        <SectionTitle title="联系信息" />
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">联系人<span className="text-destructive">*</span></Label>
            <Input placeholder="请输入联系人名称" className="w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">联系方式<span className="text-destructive">*</span></Label>
            <Input placeholder="请输入联系人电话" className="w-48" maxLength={11} />
          </div>
        </div>
      </div>

      {/* 平台服务费说明 */}
      <div>
        <SectionTitle title="平台服务费说明" />
        <p className="text-sm text-muted-foreground ml-6">
          服务费说明：订单成交后，平台将收取最终成交金额的0.5%作为服务费用。
        </p>
      </div>

      {/* 提交按钮 */}
      <div className="flex flex-col items-center gap-4 pt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v as boolean)} />
          <span className="text-sm">我已阅读并同意</span>
          <Button variant="link" className="p-0 h-auto text-primary">《仓储租赁条例》</Button>
        </label>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => onNavigate("home")}>取消</Button>
          <Button variant="secondary">暂存</Button>
          <Button disabled={!agreed}>提交</Button>
        </div>
      </div>
    </div>
  )

  // 详细发布表单
  const DetailPublishForm = () => (
    <div className="space-y-6">
      {/* 需求标题 */}
      <div>
        <SectionTitle title="需求标题" />
        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap shrink-0">标题<span className="text-destructive">*</span></Label>
          <Input placeholder="请输入50个字符以内的描述" className="flex-1" maxLength={50} />
        </div>
      </div>

      {/* 运营模式 */}
      <div>
        <SectionTitle title="运营模式" />
        <div className="flex flex-wrap items-center gap-x-12 gap-y-3">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">运营模式<span className="text-destructive">*</span></Label>
            <RadioGroup value={rentType} onValueChange={setRentType} className="flex gap-6">
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
          <div className="flex items-center gap-3">
            <Label className="whitespace-nowrap shrink-0">业务类型<span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-4">
              {["物资存放", "仓储出租"].map((biz) => (
                <label key={biz} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={businessTypes.includes(biz)}
                    onCheckedChange={() => toggleArrayItem(businessTypes, setBusinessTypes, biz)}
                  />
                  <span className="text-sm whitespace-nowrap">{biz}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 基础信息 */}
      <div>
        <SectionTitle title="基础信息" />
        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">仓储名称<span className="text-destructive">*</span></Label>
              <Button variant="link" className="text-primary p-0 h-auto whitespace-nowrap">选择仓储</Button>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">起租期<span className="text-destructive">*</span></Label>
              <Input defaultValue="60" className="w-16" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">天起</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">公摊面积</Label>
              <Input placeholder="100" className="w-20" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">m²</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">建筑面积<span className="text-destructive">*</span></Label>
              <Input placeholder="10,000" className="w-20" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">m²</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">可租面积<span className="text-destructive">*</span></Label>
              <Input className="w-20" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">m²</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">起租面积<span className="text-destructive">*</span></Label>
              <Input className="w-20" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">m²</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={rentMethod.includes("整租")} onCheckedChange={() => toggleArrayItem(rentMethod, setRentMethod, "整租")} />
              <span className="text-sm whitespace-nowrap">整租</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">租金单价<span className="text-destructive">*</span></Label>
              <Input className="w-20" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">元/m²/天</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">押金<span className="text-destructive">*</span></Label>
              <Input className="w-20" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">元</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">出租方式<span className="text-destructive">*</span></Label>
              <label className="flex items-center gap-1">
                <Checkbox checked={rentMethod.includes("整租")} onCheckedChange={() => toggleArrayItem(rentMethod, setRentMethod, "整租")} />
                <span className="text-sm whitespace-nowrap">整租</span>
              </label>
              <label className="flex items-center gap-1 ml-2">
                <Checkbox checked={rentMethod.includes("分租")} onCheckedChange={() => toggleArrayItem(rentMethod, setRentMethod, "分租")} />
                <span className="text-sm whitespace-nowrap">分租</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap shrink-0">税率<span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger className="w-32">
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
            <span className="text-sm text-muted-foreground whitespace-nowrap">%</span>
          </div>
        </div>
      </div>

      {/* 详细信息 */}
      <div>
        <SectionTitle title="详细信息" />
        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">仓储类型</Label>
              <Select>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">综合仓库</SelectItem>
                  <SelectItem value="logistics">物流仓库</SelectItem>
                  <SelectItem value="cold">冷链仓库</SelectItem>
                  <SelectItem value="hazardous">危险品仓库</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">楼层</Label>
              <Select>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="其他" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1层</SelectItem>
                  <SelectItem value="2">2层</SelectItem>
                  <SelectItem value="3">3层及以上</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">堆高限高</Label>
              <Input className="w-16" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">米</span>
              <label className="flex items-center gap-1 ml-2">
                <Checkbox />
                <span className="text-sm whitespace-nowrap">不限制</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">仓储结构</Label>
              <Select>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="钢结构" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="steel">��结构</SelectItem>
                  <SelectItem value="concrete">混凝土结构</SelectItem>
                  <SelectItem value="brick">砖混结构</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">消防等级</Label>
              <Select>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="有" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">甲级</SelectItem>
                  <SelectItem value="b">乙级</SelectItem>
                  <SelectItem value="c">丙级</SelectItem>
                  <SelectItem value="d">丁级</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap shrink-0">楼板承重</Label>
              <Input className="w-16" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">吨</span>
              <label className="flex items-center gap-1 ml-2">
                <Checkbox />
                <span className="text-sm whitespace-nowrap">不限制</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">仓储特色</Label>
            <div className="flex flex-wrap gap-4">
              {["随时看仓", "靠近高速", "设施齐全"].map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox 
                    checked={warehouseFeatures.includes(item)}
                    onCheckedChange={() => toggleArrayItem(warehouseFeatures, setWarehouseFeatures, item)}
                  />
                  <span className="text-sm whitespace-nowrap">{item}</span>
                </label>
              ))}
              <Button variant="link" className="text-primary p-0 h-auto text-sm whitespace-nowrap">
                <Plus className="w-3 h-3 mr-1" />
                自定义
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 配套信息 */}
      <div>
        <SectionTitle title="配套信息" />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">装卸设备</Label>
            <CheckboxGroup 
              items={["龙门吊", "叉车", "行车", "地磅"]}
              selected={loadingEquipment}
              onChange={(item) => toggleArrayItem(loadingEquipment, setLoadingEquipment, item)}
              hasOther
              otherPlaceholder="请填写"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">货架设备</Label>
            <CheckboxGroup 
              items={["登高车", "重型货架", "悬臂货架", "托盘"]}
              selected={rackEquipment}
              onChange={(item) => toggleArrayItem(rackEquipment, setRackEquipment, item)}
              hasOther
              otherPlaceholder="请填写"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">基础设施</Label>
            <CheckboxGroup 
              items={["办公室", "水电", "暖气", "员工宿舍", "停车场"]}
              selected={facilities}
              onChange={(item) => toggleArrayItem(facilities, setFacilities, item)}
              hasOther
              otherPlaceholder="请填写"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">安全环保</Label>
            <CheckboxGroup 
              items={["消火栓", "灭火器", "消防沙池", "自动喷淋系统", "污水处理系统", "粉尘抑制设备", "固废收集点", "防坠物网", "应急照明"]}
              selected={safetyEnv}
              onChange={(item) => toggleArrayItem(safetyEnv, setSafetyEnv, item)}
              hasOther
              otherPlaceholder="请填写"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">安全配套</Label>
            <CheckboxGroup 
              items={["封闭式围墙", "铁丝网围栏", "车辆进出车牌识别", "人员进出人脸识别", "人员进出人工登记", "监控重点区域覆盖", "监控全覆盖", "无监控"]}
              selected={securityConfig}
              onChange={(item) => toggleArrayItem(securityConfig, setSecurityConfig, item)}
              hasOther
              otherPlaceholder="请填写"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">改制/加工</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={processing.includes("改制")}
                  onCheckedChange={() => toggleArrayItem(processing, setProcessing, "改制")}
                />
                <span className="text-sm whitespace-nowrap">改制</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={processing.includes("加工")}
                  onCheckedChange={() => toggleArrayItem(processing, setProcessing, "加工")}
                />
                <span className="text-sm whitespace-nowrap">加工</span>
              </label>
              <Input placeholder="请输入改制/加工能力描述" className="w-64" />
            </div>
          </div>
        </div>
      </div>

      {/* 仓储描述 */}
      <div>
        <SectionTitle title="仓储描述" />
        <div className="flex items-start gap-2">
          <Label className="whitespace-nowrap shrink-0 mt-2">详细介绍</Label>
          <div className="flex-1">
            <Textarea 
              placeholder="默认填充仓储数据，支持修改" 
              className="min-h-[120px]"
              maxLength={1000}
            />
            <div className="text-right text-xs text-muted-foreground mt-1">0/1000</div>
          </div>
        </div>
      </div>

      {/* 仓储图片 */}
      <div>
        <SectionTitle title="仓储图片" />
        <div className="flex items-start gap-2">
          <Label className="whitespace-nowrap shrink-0 mt-2">上传图片<span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <div className="flex gap-4 mb-4">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative w-24 h-20 rounded-lg border border-border overflow-hidden group">
                  <img src={img} alt={`仓储图片${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <button 
                    className="absolute top-1 left-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full items-center justify-center text-xs hidden group-hover:flex"
                    onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">选择电脑图片上传（单个/批量）</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              支持上传仓储图片，上传后第一张图片将作为仓储代表图片门户展示，JPG、PNG、JPEG格式，图片中不能包含有文字、数字、网址、名片等，最多上传20张，每张最大2M
            </p>
          </div>
        </div>
      </div>

      {/* 所在位置 */}
      <div>
        <SectionTitle title="所在位置" />
        <div className="flex items-start gap-2">
          <Label className="whitespace-nowrap shrink-0 mt-2">具体位置<span className="text-destructive">*</span></Label>
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
                  <SelectValue placeholder="南沙区" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nansha">南沙区</SelectItem>
                  <SelectItem value="huangpu">黄埔区</SelectItem>
                  <SelectItem value="tianhe">天河区</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="输入具体位置信息" className="flex-1" />
              <Button variant="ghost" size="icon" className="text-destructive">
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center relative">
              <MapPin className="w-8 h-8 text-destructive" />
              <span className="text-sm text-muted-foreground ml-2">地图定位区域</span>
            </div>
          </div>
        </div>
      </div>

      {/* 联系信息 */}
      <div>
        <SectionTitle title="联系信息" />
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">联系人<span className="text-destructive">*</span></Label>
            <Input placeholder="请输入联系人名称" className="w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap shrink-0">联系方式<span className="text-destructive">*</span></Label>
            <Input placeholder="请输入联系人电话" className="w-48" maxLength={11} />
            <span className="text-xs text-muted-foreground whitespace-nowrap">0/11</span>
          </div>
        </div>
      </div>

      {/* 平台服务费说明 */}
      <div>
        <SectionTitle title="平台服务费说明" />
        <p className="text-sm text-muted-foreground ml-6">
          服务费说明：订单成交后，平台将收取最终成交金额的0.5%作为服务费用。
        </p>
      </div>

      {/* 提交按钮 */}
      <div className="flex flex-col items-center gap-4 pt-6 border-t">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v as boolean)} />
          <span className="text-sm">我已阅读并同意</span>
          <Button variant="link" className="p-0 h-auto text-primary">《仓储租赁条例》</Button>
        </label>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => onNavigate("home")}>取消</Button>
          <Button variant="secondary">暂存</Button>
          <Button disabled={!agreed}>提交</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate("home")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
      </div>

      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-bold mb-6">发布出租需求单</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="quick">快捷发布</TabsTrigger>
              <TabsTrigger value="detail">详细发布</TabsTrigger>
            </TabsList>

            <TabsContent value="quick">
              <QuickPublishForm />
            </TabsContent>

            <TabsContent value="detail">
              <DetailPublishForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
