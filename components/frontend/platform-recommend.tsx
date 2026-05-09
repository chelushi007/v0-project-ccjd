"use client"

import { Star, ArrowRight, Building2, MapPin, Award, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recommendedWarehouses = [
  {
    id: 1,
    name: "中铁物资广州综合仓储中心",
    location: "广东省广州市番禺区",
    type: "综合仓储",
    totalArea: "50000㎡",
    availableArea: "15000㎡",
    rating: 4.9,
    reviews: 128,
    features: ["铁路专用线", "大型装卸设备", "24小时安保"],
    certifications: ["ISO9001", "安全生产标准化"],
    isRecommended: true,
    image: "bg-gradient-to-br from-primary/20 to-primary/5",
  },
  {
    id: 2,
    name: "深圳前海智慧物流园",
    location: "广东省深圳市南山区",
    type: "智慧仓储",
    totalArea: "30000㎡",
    availableArea: "8000㎡",
    rating: 4.8,
    reviews: 96,
    features: ["自动化设备", "WMS系统", "恒温区"],
    certifications: ["ISO14001", "AAAA物流企业"],
    isRecommended: true,
    image: "bg-gradient-to-br from-accent/20 to-accent/5",
  },
  {
    id: 3,
    name: "东莞虎门港务仓储基地",
    location: "广东省东莞市虎门镇",
    type: "港口仓储",
    totalArea: "80000㎡",
    availableArea: "25000㎡",
    rating: 4.7,
    reviews: 156,
    features: ["近虎门港", "海关监管", "大型堆场"],
    certifications: ["保税仓资质", "危化品资质"],
    isRecommended: false,
    image: "bg-gradient-to-br from-chart-4/20 to-chart-4/5",
  },
  {
    id: 4,
    name: "佛山顺德钢材专用仓库",
    location: "广东省佛山市顺德区",
    type: "专业仓储",
    totalArea: "20000㎡",
    availableArea: "6000㎡",
    rating: 4.6,
    reviews: 78,
    features: ["钢材专用", "天车设备", "防锈处理"],
    certifications: ["钢材仓储资质"],
    isRecommended: false,
    image: "bg-gradient-to-br from-chart-3/20 to-chart-3/5",
  },
]

export function PlatformRecommend() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">平台推荐</h2>
          <Badge variant="secondary" className="ml-2">精选站点</Badge>
        </div>
        <Button variant="link" className="text-primary">
          查看全部
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedWarehouses.map((warehouse) => (
          <Card
            key={warehouse.id}
            className="group overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
          >
            {/* 头部图片区域 */}
            <div className={`h-32 ${warehouse.image} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-foreground/20" />
              </div>
              {warehouse.isRecommended && (
                <Badge className="absolute top-2 left-2 bg-primary">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  推荐
                </Badge>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{warehouse.rating}</span>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {warehouse.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{warehouse.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-muted-foreground">总面积：</span>
                  <span className="text-card-foreground font-medium">{warehouse.totalArea}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">可租：</span>
                  <span className="text-primary font-medium">{warehouse.availableArea}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {warehouse.features.slice(0, 2).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {warehouse.features.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{warehouse.features.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">{warehouse.reviews}条评价</span>
                <Button size="sm" variant="outline">
                  查看详情
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
