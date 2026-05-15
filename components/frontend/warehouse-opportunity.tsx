"use client"

import { TrendingUp, ArrowRight, Building2, MapPin, Maximize2, Eye, Clock, FileSignature } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const opportunities = [
  {
    id: 1,
    name: "中铁十四局深圳龙岗标准仓储基地",
    location: "广东省深圳市龙岗区",
    type: "综合仓储",
    area: "5000",
    price: "0.56",
    priceStatus: "竞价中",
    rentType: "自主出租",
    views: 328,
    publishTime: "2小时前",
    features: ["近地铁", "24小时监控", "消防达标"],
    isHot: true,
  },
  {
    id: 2,
    name: "中铁建广州黄埔恒温仓储中心",
    location: "广东省广州市黄埔区",
    type: "恒温仓储",
    area: "3000",
    price: "0.85",
    priceStatus: "固定价",
    rentType: "委托出租",
    views: 256,
    publishTime: "5小时前",
    features: ["恒温恒湿", "近港口", "可分租"],
    isHot: true,
  },
  {
    id: 3,
    name: "中铁建东莞虎门大型物资堆场",
    location: "广东省东莞市虎门镇",
    type: "露天堆场",
    area: "15000",
    price: "0.25",
    priceStatus: "竞价中",
    rentType: "自主出租",
    views: 412,
    publishTime: "1天前",
    features: ["大面积", "近虎门港", "天车设备"],
    isHot: false,
  },
  {
    id: 4,
    name: "中铁十六局佛山顺德钢构仓储基地",
    location: "广东省佛山市顺德区",
    type: "专业仓储",
    area: "8000",
    price: "0.45",
    priceStatus: "固定价",
    rentType: "委托出租",
    views: 189,
    publishTime: "2天前",
    features: ["钢材专用", "防锈处理", "重载地面"],
    isHot: false,
  },
]

export function WarehouseOpportunity() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">仓储商机</h2>
          <Badge variant="secondary" className="ml-2">出租信息</Badge>
        </div>
        <Button variant="link" className="text-primary">
          更多商机
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {opportunities.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
            {/* 头部图片 */}
            <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-primary/20" />
              </div>
              <Badge className="absolute top-2 left-2 bg-accent">
                出租
              </Badge>
              {item.isHot && (
                <Badge className="absolute top-2 right-2 bg-destructive text-xs">
                  热门
                </Badge>
              )}
            </div>

            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-primary">{item.price}</span>
                <span className="text-xs text-muted-foreground">元/m²/天</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.priceStatus}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Maximize2 className="w-3 h-3" />
                <span>{item.area}m²</span>
              </div>

              <h3 className="font-medium text-card-foreground mb-2 line-clamp-1 text-sm group-hover:text-primary transition-colors">
                {item.name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <Building2 className="w-3 h-3" />
                <span>{item.type}</span>
                <MapPin className="w-3 h-3 ml-1" />
                <span className="line-clamp-1">{item.location}</span>
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

              <Button
                size="sm"
                className="w-full mt-2 h-8 gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <FileSignature className="w-3.5 h-3.5" />
                下单对接
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
