"use client"

import { Truck, ArrowRight, MapPin, Star, Award, ShieldCheck, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const transportUnits = [
  {
    id: 1,
    name: "中铁建物资华南专业运营有限公司",
    location: "广东省广州市",
    rating: 4.9,
    completedOrders: 1256,
    totalValue: "2.5亿",
    services: ["物资托管", "租赁运营", "调剂服务", "仓储管理"],
    certifications: ["央企资质", "AAAA物流"],
    isRecommended: true,
  },
  {
    id: 2,
    name: "中铁建物资深圳前海运营中心",
    location: "广东省深圳市",
    rating: 4.8,
    completedOrders: 856,
    totalValue: "1.8亿",
    services: ["物资托管", "专业运营", "代销服务"],
    certifications: ["专业资质", "信用AAA"],
    isRecommended: true,
  },
  {
    id: 3,
    name: "中铁十四局东莞物资专运公司",
    location: "广东省东莞市",
    rating: 4.7,
    completedOrders: 623,
    totalValue: "1.2亿",
    services: ["物资托管", "港口联运", "仓储服务"],
    certifications: ["专业资质", "安全生产"],
    isRecommended: false,
  },
  {
    id: 4,
    name: "中铁十六局佛山物资管理中心",
    location: "广东省佛山市",
    rating: 4.6,
    completedOrders: 412,
    totalValue: "8000万",
    services: ["物资托管", "钢材运营", "设备管理"],
    certifications: ["专业资质"],
    isRecommended: false,
  },
]

export function FeaturedTransport() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">精选专运单位</h2>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            <Award className="w-3 h-3 mr-1" />
            优质服务
          </Badge>
        </div>
        <Button variant="link" className="text-primary">
          查看全部
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {transportUnits.map((unit) => (
          <Card
            key={unit.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* 头部图片 */}
            <div className="h-32 bg-gradient-to-br from-accent/15 to-accent/5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Truck className="w-12 h-12 text-accent/20" />
              </div>
              {unit.isRecommended && (
                <Badge className="absolute top-2 left-2 bg-accent">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  推荐
                </Badge>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{unit.rating}</span>
              </div>
              <div className="absolute bottom-2 left-2 flex gap-1">
                {unit.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="text-xs bg-card/90">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {unit.name}
              </h3>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3 h-3" />
                <span>{unit.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">完成订单：</span>
                  <span className="font-medium text-primary">{unit.completedOrders}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">累计：</span>
                  <span className="font-medium">{unit.totalValue}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {unit.services.slice(0, 3).map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {unit.services.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{unit.services.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>专业运营</span>
                </div>
                <Button size="sm">
                  委托运营
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
