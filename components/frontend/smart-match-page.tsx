"use client"

import { useState } from "react"
import { Sparkles, ChevronRight, Building2, MapPin, Maximize2, CheckCircle, Star, ArrowRight, Package, Weight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SmartMatchPageProps {
  onNavigate?: (page: string) => void
  initialType?: "material" | "rent"
}

// 仓储匹配结果
const warehouseResults = [
  {
    id: 1,
    name: "中铁建广州南沙综合仓储基地",
    location: "广东省广州市南沙区",
    type: "综合仓储",
    area: "15000m²可租",
    matchScore: 98,
    features: ["铁路专用线", "大型装卸设备", "24小时安保"],
    price: "0.56元/m²/天",
    rating: 4.9,
    reviews: 128,
  },
  {
    id: 2,
    name: "中铁建深圳前海智慧仓储基地",
    location: "广东省深圳市南山区",
    type: "智慧仓储",
    area: "8000m²可租",
    matchScore: 95,
    features: ["自动化设备", "WMS系统", "恒温区"],
    price: "0.52元/m²/天",
    rating: 4.8,
    reviews: 96,
  },
  {
    id: 3,
    name: "中铁建东莞虎门港务仓储基地",
    location: "广东省东莞市虎门镇",
    type: "港口仓储",
    area: "25000m²可租",
    matchScore: 92,
    features: ["近虎门港", "海关监管", "大型堆场"],
    price: "0.38元/m²/天",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "中铁十六局佛山顺德钢构仓储基地",
    location: "广东省佛山市顺德区",
    type: "专业仓储",
    area: "6000m²可租",
    matchScore: 88,
    features: ["钢材专用", "天车设备", "防锈处理"],
    price: "0.45元/m²/天",
    rating: 4.6,
    reviews: 78,
  },
]

// 物料匹配结果
const materialResults = [
  {
    id: 1,
    name: "Q235B热轧H型钢",
    provider: "中铁十四局集团广州分公司",
    location: "广东省广州市黄埔区",
    materialType: "型材类",
    quantity: "500吨可租",
    matchScore: 97,
    specs: ["规格齐全", "质量检测报告", "可分批提货"],
    price: "1800元/吨/月",
    condition: "95成新",
  },
  {
    id: 2,
    name: "建筑钢管脚手架",
    provider: "中铁建物料华南专业运营有限公司",
    location: "广东省深圳市宝安区",
    materialType: "脚手架类",
    quantity: "2000套可租",
    matchScore: 94,
    specs: ["48*3.5规格", "带扣件", "现场可验货"],
    price: "15元/套/天",
    condition: "90成新",
  },
  {
    id: 3,
    name: "工字钢梁",
    provider: "中铁十六局集团华南分公司",
    location: "广东省东莞市虎门镇",
    materialType: "型材类",
    quantity: "300吨可租",
    matchScore: 91,
    specs: ["20#工字钢", "12米定尺", "防锈处理"],
    price: "1500元/吨/月",
    condition: "85成新",
  },
  {
    id: 4,
    name: "塔吊设备",
    provider: "中铁二十局集团华南分公司",
    location: "广东省佛山市顺德区",
    materialType: "其他材料",
    quantity: "5台可租",
    matchScore: 88,
    specs: ["QTZ63型", "臂长50m", "含安拆服务"],
    price: "28000元/台/月",
    condition: "良好",
  },
]

export function SmartMatchPage({ onNavigate, initialType = "rent" }: SmartMatchPageProps) {
  const [demandType, setDemandType] = useState<"material" | "rent">(initialType)
  const [textDescription, setTextDescription] = useState("")
  const [hasResults, setHasResults] = useState(false)
  const [isMatching, setIsMatching] = useState(false)

  const handleMatch = () => {
    setIsMatching(true)
    setTimeout(() => {
      setIsMatching(false)
      setHasResults(true)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="link"
          className="p-0 h-auto text-muted-foreground hover:text-primary"
          onClick={() => onNavigate?.("frontend")}
        >
          首页
        </Button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">智能匹配</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧需求输入 */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">智能匹配</h2>
                <Badge variant="secondary">AI匹配</Badge>
              </div>

              {/* 需求类型选择 */}
              <div className="space-y-4 mb-6">
                <Label>需求类型</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={demandType === "material" ? "default" : "outline"}
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setDemandType("material")}
                  >
                    <span className="text-xl">🔍</span>
                    <span>物料寻找</span>
                  </Button>
                  <Button
                    variant={demandType === "rent" ? "default" : "outline"}
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setDemandType("rent")}
                  >
                    <span className="text-xl">🏭</span>
                    <span>仓储承租</span>
                  </Button>
                </div>
              </div>

              {/* 快捷输入表单 - 根据需求类型显示不同字段 */}
              {demandType === "material" ? (
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <Label>期望区域</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择区域" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guangzhou">广州市</SelectItem>
                        <SelectItem value="shenzhen">深圳市</SelectItem>
                        <SelectItem value="dongguan">东莞市</SelectItem>
                        <SelectItem value="foshan">佛山市</SelectItem>
                        <SelectItem value="huizhou">惠州市</SelectItem>
                        <SelectItem value="zhongshan">中山市</SelectItem>
                        <SelectItem value="zhuhai">珠海市</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>物料类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择物料类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="template">模板类</SelectItem>
                        <SelectItem value="support">支护类</SelectItem>
                        <SelectItem value="scaffold">脚手架类</SelectItem>
                        <SelectItem value="assembly">拼装类</SelectItem>
                        <SelectItem value="rail">轨道类</SelectItem>
                        <SelectItem value="profile">型材类</SelectItem>
                        <SelectItem value="cable">电线电缆</SelectItem>
                        <SelectItem value="building">房屋建筑类</SelectItem>
                        <SelectItem value="other">其他材料</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>承租数量</Label>
                    <Input placeholder="如：100吨 或 500件" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <Label>期望区域</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择区域" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guangzhou">广州市</SelectItem>
                        <SelectItem value="shenzhen">深圳市</SelectItem>
                        <SelectItem value="dongguan">东莞市</SelectItem>
                        <SelectItem value="foshan">佛山市</SelectItem>
                        <SelectItem value="huizhou">惠州市</SelectItem>
                        <SelectItem value="zhongshan">中山市</SelectItem>
                        <SelectItem value="zhuhai">珠海市</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>仓储类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">综合仓储</SelectItem>
                        <SelectItem value="cold">冷链仓储</SelectItem>
                        <SelectItem value="danger">危化品仓储</SelectItem>
                        <SelectItem value="outdoor">露天堆场</SelectItem>
                        <SelectItem value="stereo">立体仓库</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>需求面积</Label>
                    <Input placeholder="如：3000m²" />
                  </div>
                </div>
              )}

              {/* 文本描述 */}
              <div className="space-y-2 mb-6">
                <Label>需求描述（支持自然语言）</Label>
                <Textarea
                  placeholder="例如：我需要在广州番禺区找一个3000平方米左右的仓库，最好有铁路专用线，用于存放建材物料..."
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  您可以用自然语言描述需求，AI将智能分析并匹配最合适的仓储资源
                </p>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleMatch}
                disabled={isMatching}
              >
                {isMatching ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    智能匹配中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    智能匹配
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧匹配结果 */}
        <div className="lg:col-span-2">
          {!hasResults ? (
            <Card className="h-full">
              <CardContent className="h-full flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  输入您的需求，AI将为您智能匹配
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {demandType === "material" 
                    ? "支持自然语言描述，系统将根据区域、物料类型、数量等维度进行智能分析，为您推荐最合适的循环物料"
                    : "支持自然语言描述，系统将根据区域、类型、面积、配套设施等维度进行智能分析，为您推荐最合适的仓储资源"
                  }
                </p>
              </CardContent>
            </Card>
          ) : demandType === "material" ? (
            // 物料匹配结果
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">物料匹配结果</h3>
                  <Badge variant="secondary">
                    找到 {materialResults.length} 个匹配
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setHasResults(false)}>
                  重新匹配
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materialResults.map((result, index) => (
                  <Card 
                    key={result.id} 
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <CardContent className="p-0">
                      {/* 匹配度头部 */}
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <Badge className="bg-accent">
                              最佳匹配
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-accent/20 text-accent px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">{result.matchScore}%</span>
                          <span className="text-xs">匹配</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                              {result.name}
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              {result.provider}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">类型：</span>
                            <span className="font-medium">{result.materialType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Weight className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">{result.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="line-clamp-1">{result.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">成色：</span>
                            <span className="font-medium text-accent">{result.condition}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {result.specs.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div>
                            <span className="text-lg font-bold text-primary">{result.price}</span>
                          </div>
                          <Button size="sm">
                            立即下单
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // 仓储匹配结果
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">仓储匹配结果</h3>
                  <Badge variant="secondary">
                    找到 {warehouseResults.length} 个匹配
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setHasResults(false)}>
                  重新匹配
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warehouseResults.map((result, index) => (
                  <Card 
                    key={result.id} 
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <CardContent className="p-0">
                      {/* 匹配度头部 */}
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <Badge className="bg-accent">
                              最佳匹配
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-accent/20 text-accent px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">{result.matchScore}%</span>
                          <span className="text-xs">匹配</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                              {result.name}
                            </h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span className="line-clamp-1">{result.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">类型：</span>
                            <span className="font-medium">{result.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">{result.area}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {result.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div>
                            <span className="text-lg font-bold text-primary">{result.price}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{result.rating}</span>
                              <span className="text-muted-foreground">({result.reviews})</span>
                            </div>
                            <Button size="sm">
                              查看详情
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
