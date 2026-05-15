"use client"

import { Package, ArrowRight, MapPin, Eye, Clock, Recycle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const materials = [
  {
    id: 1,
    name: "二手钢管扣件 约500吨",
    category: "拼装类",
    location: "广东省广州市黄埔区",
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
    id: 2,
    name: "工地周转木方 约200方",
    category: "房屋建筑类",
    location: "广东省深圳市龙岗区",
    price: "800",
    unit: "元/方",
    condition: "七成新",
    supplier: "中铁建物资华南专业运营有限公司",
    views: 312,
    publishTime: "3小时前",
    features: ["现货供应", "可配送"],
    isHot: true,
  },
  {
    id: 3,
    name: "塔吊标准节 10节",
    category: "其他材料",
    location: "广东省东莞市虎门镇",
    price: "面议",
    unit: "",
    condition: "九成新",
    supplier: "中铁十六局集团华南分公司",
    views: 256,
    publishTime: "5小时前",
    features: ["原厂配件", "带检测报告"],
    isHot: false,
  },
  {
    id: 4,
    name: "建筑模板 约1000张",
    category: "模板类",
    location: "广东省佛山市顺德区",
    price: "45",
    unit: "元/张",
    condition: "六成新",
    supplier: "中铁二十局集团华南分公司",
    views: 189,
    publishTime: "1天前",
    features: ["批量优惠", "可自提"],
    isHot: false,
  },
]

export function MaterialRecommend() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Recycle className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">闲置物资</h2>
          <Badge variant="secondary" className="ml-2 bg-accent/10 text-accent">循环复用</Badge>
        </div>
        <Button variant="link" className="text-primary">
          查看更多
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {materials.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
            {/* 头部图片 */}
            <div className="h-32 bg-gradient-to-br from-accent/10 to-accent/5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-12 h-12 text-accent/20" />
              </div>
              <Badge className="absolute top-2 left-2 bg-accent">
                {item.category}
              </Badge>
              <Badge variant="outline" className="absolute top-2 right-2 bg-card/90 text-xs">
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
                <span className="text-lg font-bold text-accent">{item.price}</span>
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
