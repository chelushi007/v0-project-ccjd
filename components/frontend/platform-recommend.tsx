"use client"

import { Star, ArrowRight, Building2, MapPin, Award, ThumbsUp, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recommendedWarehouses = [
  {
    id: 1,
    name: "中铁建广州南沙综合仓储基地",
    location: "广东省广州市南沙区",
    type: "综合仓储",
    totalArea: "50000m²",
    availableArea: "15000m²",
    rating: 4.9,
    reviews: 128,
    features: ["铁路专用线", "大型装卸设备", "24小时安保"],
    certifications: ["ISO9001", "安全生产标准化"],
    tier: "一级" as const,
    isRecommended: true,
    image: "bg-gradient-to-br from-primary/20 to-primary/5",
  },
  {
    id: 2,
    name: "中铁建深圳前海智慧仓储基地",
    location: "广东省深圳市南山区",
    type: "智慧仓储",
    totalArea: "30000m²",
    availableArea: "8000m²",
    rating: 4.8,
    reviews: 96,
    features: ["自动化设备", "WMS系统", "恒温区"],
    certifications: ["ISO14001", "AAAA物流企业"],
    tier: "一级" as const,
    isRecommended: true,
    image: "bg-gradient-to-br from-accent/20 to-accent/5",
  },
  {
    id: 3,
    name: "中铁建东莞虎门港务仓储基地",
    location: "广东省东莞市虎门镇",
    type: "港口仓储",
    totalArea: "80000m²",
    availableArea: "25000m²",
    rating: 4.7,
    reviews: 156,
    features: ["近虎门港", "海关监管", "大型堆场"],
    certifications: ["保税仓资质", "危化品资质"],
    tier: "二级" as const,
    isRecommended: false,
    image: "bg-gradient-to-br from-chart-4/20 to-chart-4/5",
  },
  {
    id: 4,
    name: "中铁十六局佛山顺德钢构仓储基地",
    location: "广东省佛山市顺德区",
    type: "专业仓储",
    totalArea: "20000m²",
    availableArea: "6000m²",
    rating: 4.6,
    reviews: 78,
    features: ["钢材专用", "天车设备", "防锈处理"],
    certifications: ["钢材仓储资质"],
    tier: "二级" as const,
    isRecommended: false,
    image: "bg-gradient-to-br from-chart-3/20 to-chart-3/5",
  },
]

interface PlatformRecommendProps {
  onNavigate?: (page: string) => void
}

export function PlatformRecommend({ onNavigate }: PlatformRecommendProps = {}) {
  const goDetail = () => onNavigate?.("warehouse-detail")
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
            onClick={goDetail}
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
              <div className="mb-1.5">
                <Badge
                  variant={warehouse.tier === "一级" ? "default" : "outline"}
                  className={
                    warehouse.tier === "一级"
                      ? "bg-amber-500 hover:bg-amber-500 text-white text-[10px] gap-0.5 px-1.5 py-0"
                      : "text-[10px] gap-0.5 px-1.5 py-0 text-slate-600 border-slate-300"
                  }
                >
                  {warehouse.tier === "一级" && <Crown className="w-2.5 h-2.5" />}
                  {warehouse.tier}站点
                </Badge>
              </div>
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    goDetail()
                  }}
                >
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
