"use client"

import { useState } from "react"
import { Plus, FileText, Send, Upload, MapPin, X, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface DemandPublishProps {
  onNavigate?: (page: string) => void
}

const demandTypes = [
  { id: "storage", label: "物资存放", icon: "📦", description: "将物资存入仓储站点" },
  { id: "rent", label: "仓储承租", icon: "🏭", description: "寻找合适的仓储空间" },
  { id: "lease", label: "我要出租", icon: "🏢", description: "发布仓储出租信息" },
]

const warehouseTypes = [
  "普通仓储", "恒温仓储", "冷链仓储", "危化品仓储", "露天堆场", "立体仓库"
]

const features = {
  loadingEquipment: ["龙门吊", "叉车", "行车", "托盘", "其他"],
  transportEquipment: ["散货车", "重型货架", "储物货架", "托盘", "其他"],
  basicFacilities: ["办公室", "水电", "燃气", "员工食宿", "停车场", "其他"],
  securityFacilities: ["消火栓", "灭火器", "自动喷淋系统", "污水处理系统", "粉尘削减设备", "消除噪音装置", "防污染设备", "应急物资"],
  securityServices: ["围栏或围墙", "独立围网封闭", "车辆出入车牌识别", "人员进出出入凭证", "人员进出人工登记", "监控覆盖分区视频", "值班全覆盖", "无监控"],
}

export function DemandPublish({ onNavigate }: DemandPublishProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("")
  const [publishMode, setPublishMode] = useState<"quick" | "detail">("quick")

  const handleQuickPublish = (type: string) => {
    if (type === "storage" || type === "rent") {
      // 跳转到智能匹配页面
      onNavigate?.("smart-match")
    } else if (type === "lease") {
      setSelectedType(type)
      setIsOpen(true)
    }
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">需求发布</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demandTypes.map((type) => (
          <Card
            key={type.id}
            className="group cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 overflow-hidden"
            onClick={() => handleQuickPublish(type.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              {(type.id === "storage" || type.id === "rent") && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <Sparkles className="w-4 h-4" />
                    <span>支持智能推荐</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 我要出租弹窗 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>发布出租需求单</span>
              <Badge variant="outline">租赁需求管理</Badge>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={publishMode} onValueChange={(v) => setPublishMode(v as "quick" | "detail")} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="quick">快捷发布</TabsTrigger>
              <TabsTrigger value="detail">详细发布</TabsTrigger>
            </TabsList>

            {/* 快捷发布 */}
            <TabsContent value="quick">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>需求标题</Label>
                  <Input placeholder="请输入8至25个字符以内的描述" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>期望区域</Label>
                    <Input placeholder="如：广东省广州市" />
                  </div>
                  <div className="space-y-2">
                    <Label>需求面积（㎡）</Label>
                    <Input placeholder="如：3000" type="number" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>联系人</Label>
                    <Input placeholder="请输入联系人姓名" />
                  </div>
                  <div className="space-y-2">
                    <Label>联系电话</Label>
                    <Input placeholder="请输入联系电话" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>详细描述</Label>
                  <Textarea placeholder="请详细描述您的仓储出租需求..." className="min-h-[100px]" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>取消</Button>
                  <Button variant="outline">暂存</Button>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    提交
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* 详细发布 */}
            <TabsContent value="detail">
              <div className="space-y-8">
                {/* 需求标题 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">需求标题</Label>
                  </div>
                  <Input placeholder="请输入8至25个字符以内的描述" />
                </div>

                {/* 运营类型 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">运营类型</Label>
                  </div>
                  <RadioGroup defaultValue="self" className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self" id="self" />
                      <Label htmlFor="self">自主</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="entrust" id="entrust" />
                      <Label htmlFor="entrust">委托</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 基础信息 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">基础信息</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>仓储名称 <span className="text-destructive">*</span></Label>
                      <div className="flex gap-2">
                        <Input placeholder="选择仓储" className="flex-1" />
                        <Button variant="outline" className="text-primary">选择仓储</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>起租期 <span className="text-destructive">*</span></Label>
                      <Input placeholder="6个月起" />
                    </div>
                    <div className="space-y-2">
                      <Label>天起</Label>
                      <Input />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>建筑面积 <span className="text-destructive">*</span></Label>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="10,000" />
                        <span className="text-muted-foreground">㎡</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>可租面积 <span className="text-destructive">*</span></Label>
                      <Input />
                    </div>
                    <div className="space-y-2">
                      <Label>起租面积 <span className="text-destructive">*</span></Label>
                      <Input />
                    </div>
                    <div className="space-y-2">
                      <Label>公摊面积</Label>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="100" />
                        <span className="text-muted-foreground">㎡</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>租金单价 <span className="text-destructive">*</span></Label>
                      <Input />
                    </div>
                    <div className="space-y-2">
                      <Label>元/㎡/天</Label>
                      <Input />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>出租方式 <span className="text-destructive">*</span></Label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox id="whole" />
                          <Label htmlFor="whole">整租</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="partial" />
                          <Label htmlFor="partial">分租</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>税费</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="included">含税</SelectItem>
                          <SelectItem value="excluded">不含税</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>押金</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one">押一</SelectItem>
                          <SelectItem value="two">押二</SelectItem>
                          <SelectItem value="three">押三</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">详细信息</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>仓储类型</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouseTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>地面</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="单楼" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">单楼</SelectItem>
                          <SelectItem value="multi">多楼</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>消防等级</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="丙" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">甲</SelectItem>
                          <SelectItem value="b">乙</SelectItem>
                          <SelectItem value="c">丙</SelectItem>
                          <SelectItem value="d">丁</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>楼层数量</Label>
                      <Input />
                    </div>
                    <div className="space-y-2">
                      <Label>堆垛层数 *</Label>
                      <Input placeholder="不限制" />
                    </div>
                    <div className="space-y-2">
                      <Label>堆垛限重 *</Label>
                      <Input placeholder="吨" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>仓储特色</Label>
                    <div className="flex flex-wrap gap-2">
                      {["围栏闭管理", "独立网闭管", "设备齐全", "铁路专线"].map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                          {tag}
                        </Badge>
                      ))}
                      <Button variant="link" className="text-primary h-auto p-0">
                        +特色定义
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 配套信息 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">配套信息</Label>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <Label className="w-20 pt-2">装卸设备</Label>
                      <div className="flex-1 flex flex-wrap gap-3">
                        {features.loadingEquipment.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <Checkbox id={`load-${item}`} />
                            <Label htmlFor={`load-${item}`} className="text-sm">{item}</Label>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">其他</span>
                          <Input placeholder="型号/型" className="w-32 h-8" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="w-20 pt-2">货架设备</Label>
                      <div className="flex-1 flex flex-wrap gap-3">
                        {features.transportEquipment.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <Checkbox id={`trans-${item}`} />
                            <Label htmlFor={`trans-${item}`} className="text-sm">{item}</Label>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">其他</span>
                          <Input placeholder="型号/型" className="w-32 h-8" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="w-20 pt-2">基础设施</Label>
                      <div className="flex-1 flex flex-wrap gap-3">
                        {features.basicFacilities.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <Checkbox id={`basic-${item}`} />
                            <Label htmlFor={`basic-${item}`} className="text-sm">{item}</Label>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">其他</span>
                          <Input placeholder="型号/型" className="w-32 h-8" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="w-20 pt-2">安全环保</Label>
                      <div className="flex-1 flex flex-wrap gap-3">
                        {features.securityFacilities.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <Checkbox id={`safety-${item}`} />
                            <Label htmlFor={`safety-${item}`} className="text-sm">{item}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="w-20 pt-2">安全配套</Label>
                      <div className="flex-1 flex flex-wrap gap-3">
                        {features.securityServices.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <Checkbox id={`sec-${item}`} />
                            <Label htmlFor={`sec-${item}`} className="text-sm">{item}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="w-20 pt-2">改装加工</Label>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox id="process" />
                          <Label htmlFor="process" className="text-sm">加工</Label>
                        </div>
                        <Input placeholder="请输入改装/加工能力描述" className="flex-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 仓储描述 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">仓储描述</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>详细介绍</Label>
                    <Textarea 
                      placeholder="默认填充仓储简述，支持修改" 
                      className="min-h-[150px]"
                    />
                    <div className="text-right text-xs text-muted-foreground">0/1000</div>
                  </div>
                </div>

                {/* 仓储图片 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">仓储图片</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>上传图片 <span className="text-destructive">*</span></Label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 relative group cursor-pointer hover:border-primary">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ))}
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/30 cursor-pointer hover:border-primary">
                        <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">上传电脑中的图片</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      请随上传仓储照片，上传图片大于2张可直接打广告，JPG、PNG、JPEG格式，删除的不能超过30天。最多上传10张，每张最大2M
                    </p>
                  </div>
                </div>

                {/* 所在位置 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">所在位置</Label>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label className="w-20">具体位置 <span className="text-destructive">*</span></Label>
                      <Select>
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="广东省" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gd">广东省</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="广州市" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gz">广州市</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="南沙区" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ns">南沙区</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="输入具体位置信息" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <MapPin className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="h-[250px] bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <p>地图位置选择</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 联系信息 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">联系信息</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>联系人 <span className="text-destructive">*</span></Label>
                      <Input placeholder="请输入联系人姓名" />
                    </div>
                    <div className="space-y-2">
                      <Label>联系方式 <span className="text-destructive">*</span></Label>
                      <Input placeholder="请输入联系人电话" />
                      <span className="text-xs text-muted-foreground">0/11</span>
                    </div>
                  </div>
                </div>

                {/* 平台服务费说明 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded" />
                    <Label className="text-base font-semibold">平台服务费说明</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    服务费说明：订单成交后，平台向收取最终成交金额的0.5%作为服务费用。
                  </p>
                </div>

                {/* 协议确认 */}
                <div className="flex items-center gap-2">
                  <Checkbox id="agreement" />
                  <Label htmlFor="agreement" className="text-sm">
                    我已阅读并同意
                    <Button variant="link" className="p-0 h-auto text-primary">《仓储租赁条例》</Button>
                  </Label>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-center gap-4 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>取消</Button>
                  <Button variant="outline">暂存</Button>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    提交
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </section>
  )
}
