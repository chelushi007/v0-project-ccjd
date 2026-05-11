"use client"

import { Building, ArrowRight, MapPin, Maximize2, Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tiejianWarehouses = [
  {
    id: 1,
    name: "中铁物资广州南沙综合仓储基地",
    location: "广东省广州市南沙区",
    type: "综合仓储",
    totalArea: "80000",
    availableArea: "25000",
    price: "0.48",
    rating: 4.9,
    features: ["铁路专用线", "大型装卸设备", "24小时安保", "ISO认证"],
    certifications: ["央企资质", "安全生产标准化"],
  },
  {
    id: 2,
    name: "中铁物资深圳前海物流园区",
    location: "广东省深圳市南山区",
    type: "智慧仓储",
    totalArea: "50000",
    availableArea: "15000",
    price: "0.65",
    rating: 4.8,
    features: ["自动化设备", "WMS系统", "恒温区", "消防达标"],
    certifications: ["央企资质", "AAAA物流企业"],
  },
  {
    id: 3,
    name: "中铁物资东莞虎门港务基地",
    location: "广东省东莞市虎门镇",
    type: "港口仓储",
    totalArea: "100000",
    availableArea: "35000",
    price: "0.35",
    rating: 4.7,
    features: ["近虎门港", "海关监管", "大型堆场", "重载地面"],
    certifications: ["央企资质", "保税仓资质"],
  },
  {
    id: 4,
    name: "中铁物资佛山顺德钢材基地",
    location: "广东省佛山市顺德区",
    type: "专业仓储",
    totalArea: "30000",
    availableArea: "12000",
    price: "0.42",
    rating: 4.8,
    features: ["钢材专用", "天车设备", "防锈处理", "质检服务"],
    certifications: ["央企资质", "钢材仓储资质"],
  },
]

export function TiejianWarehouse() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">铁建仓储</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Shield className="w-3 h-3 mr-1" />
            央企品质
          </Badge>
        </div>
        <Button variant="link" className="text-primary">
          查看全部
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiejianWarehouses.map((warehouse) => (
          <Card
            key={warehouse.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group border-primary/20"
          >
            {/* 头部图片 */}
            <div className="h-36 bg-gradient-to-br from-primary/15 to-primary/5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building className="w-14 h-14 text-primary/20" />
              </div>
              <Badge className="absolute top-2 left-2 bg-primary">
                铁建
              </Badge>
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{warehouse.rating}</span>
              </div>
              <div className="absolute bottom-2 left-2 flex gap-1">
                {warehouse.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="text-xs bg-card/90">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {warehouse.name}
              </h3>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{warehouse.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">总面积：</span>
                  <span className="font-medium">{parseInt(warehouse.totalArea).toLocaleString()}㎡</span>
                </div>
                <div>
                  <span className="text-muted-foreground">可租：</span>
                  <span className="text-primary font-medium">{parseInt(warehouse.availableArea).toLocaleString()}㎡</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {warehouse.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {warehouse.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{warehouse.features.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <span className="text-lg font-bold text-primary">{warehouse.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">元/㎡/天</span>
                </div>
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
