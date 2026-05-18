"use client"

import { useState } from "react"
import { Package, ArrowRight, MapPin, Eye, Clock, Recycle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type DealType = "出租" | "出售"

interface MaterialItem {
  id: number
  name: string
  category: string
  location: string
  dealType: DealType
  price: string
  unit: string
  condition: string
  supplier: string
  views: number
  publishTime: string
  features: string[]
  isHot: boolean
}

const rentMaterials: MaterialItem[] = [
  {
    id: 101,
    name: "工地周转木方 约200方",
    category: "房屋建筑类",
    location: "广东省深圳市龙岗区",
    dealType: "出租",
    price: "12",
    unit: "元/方/月",
    condition: "七成新",
    supplier: "中铁建物资华南专业运营有限公司",
    views: 312,
    publishTime: "3小时前",
    features: ["现货供应", "可配送"],
    isHot: true,
  },
  {
    id: 102,
    name: "塔吊标准节 10节",
    category: "其他材料",
    location: "广东省东莞市虎门镇",
    dealType: "出租",
    price: "1800",
    unit: "元/节/月",
    condition: "九成新",
    supplier: "中铁十六局集团华南分公司",
    views: 256,
    publishTime: "5小时前",
    features: ["原厂配件", "带检测报告"],
    isHot: false,
  },
  {
    id: 103,
    name: "盘扣式脚手架 约8000套",
    category: "拼装类",
    location: "广东省广州市番禺区",
    dealType: "出租",
    price: "0.8",
    unit: "元/套/天",
    condition: "九成新",
    supplier: "中铁十一局广州分公司",
    views: 198,
    publishTime: "8小时前",
    features: ["国标认证", "支持长租"],
    isHot: true,
  },
  {
    id: 104,
    name: "施工电梯 SC200/200 双笼",
    category: "机械设备",
    location: "广东省珠海市横琴新区",
    dealType: "出租",
    price: "2.6",
    unit: "万元/月",
    condition: "八成新",
    supplier: "中铁二十二局集团华南分公司",
    views: 174,
    publishTime: "1天前",
    features: ["含安拆", "持证操作"],
    isHot: false,
  },
]

const saleMaterials: MaterialItem[] = [
  {
    id: 201,
    name: "二手钢管扣件 约500吨",
    category: "拼装类",
    location: "广东省广州市黄埔区",
    dealType: "出售",
    price: "3500",
    unit: "元/吨",
    condition: "八成新",
    supplier: "中铁十四局集团广州分公司",
    views: 428,
    publishTime: "1小时前",
    features: ["品质保证", "可检测", "量大优惠"],
    isHot: true,
  },
  {
    id: 202,
    name: "建筑模板 约1000张",
    category: "模板类",
    location: "广东省佛山市顺德区",
    dealType: "出售",
    price: "45",
    unit: "元/张",
    condition: "六成新",
    supplier: "中铁二十局集团华南分公司",
    views: 189,
    publishTime: "1天前",
    features: ["批量优惠", "可自提"],
    isHot: false,
  },
  {
    id: 203,
    name: "二手挖掘机 PC200-8 一台",
    category: "机械设备",
    location: "广东省东莞市厚街镇",
    dealType: "出售",
    price: "26",
    unit: "万元/台",
    condition: "七成新",
    supplier: "中铁十八局华南分公司",
    views: 612,
    publishTime: "6小时前",
    features: ["手续齐全", "包过户"],
    isHot: true,
  },
  {
    id: 204,
    name: "废旧钢筋头 约80吨",
    category: "再生材料",
    location: "广东省惠州市仲恺区",
    dealType: "出售",
    price: "2800",
    unit: "元/吨",
    condition: "废料",
    supplier: "中铁二十四局华南分公司",
    views: 136,
    publishTime: "2天前",
    features: ["现货", "支持过磅"],
    isHot: false,
  },
]

interface MaterialRecommendProps {
  onNavigate?: (page: string) => void
}

export function MaterialRecommend({ onNavigate }: MaterialRecommendProps = {}) {
  const [tab, setTab] = useState<DealType>("出租")
  const list = tab === "出租" ? rentMaterials : saleMaterials
  const goDetail = () => onNavigate?.("material-detail")
  const goList = () => onNavigate?.("material-list")

  return (
    <section className="w-full">
      <div className="grid grid-cols-3 items-center mb-4">
        <div className="flex items-center gap-2 justify-self-start">
          <Recycle className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">闲置物资</h2>
          <Badge variant="secondary" className="ml-2 bg-accent/10 text-accent">
            周转盘活
          </Badge>
        </div>

        <div className="justify-self-center inline-flex items-center gap-1 rounded-md bg-muted p-1">
          {(["出租", "出售"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "px-4 py-1.5 text-sm rounded transition-colors font-medium",
                tab === key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              物资{key}
            </button>
          ))}
        </div>

        <div className="justify-self-end">
          <Button variant="link" className="text-primary" onClick={goList}>
            查看更多
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map((item) => (
          <Card
            key={item.id}
            onClick={goDetail}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* 头部图片 */}
            <div className="h-32 bg-gradient-to-br from-accent/10 to-accent/5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-12 h-12 text-accent/20" />
              </div>
              <Badge
                className={`absolute top-2 left-2 ${
                  item.dealType === "出租" ? "bg-primary" : "bg-accent"
                }`}
              >
                {item.dealType}
              </Badge>
              <Badge variant="outline" className="absolute top-2 right-2 bg-card/90 text-xs">
                {item.category}
              </Badge>
              <Badge variant="outline" className="absolute bottom-2 right-2 bg-card/90 text-xs">
                {item.condition}
              </Badge>
              {item.isHot && (
                <Badge className="absolute bottom-2 left-2 bg-destructive text-xs">
                  热门
                </Badge>
              )}
            </div>

            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-lg font-bold ${
                    item.dealType === "出租" ? "text-primary" : "text-accent"
                  }`}
                >
                  {item.price}
                </span>
                <span className="text-xs text-muted-foreground">{item.unit}</span>
              </div>

              <h3 className="font-medium text-card-foreground mb-2 line-clamp-1 text-sm group-hover:text-primary transition-colors">
                {item.name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{item.location}</span>
              </div>

              <div className="text-xs text-muted-foreground mb-2">
                供应商：{item.supplier}
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {item.features.slice(0, 2).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {item.views}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.publishTime}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
