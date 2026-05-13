"use client"

import { Flame, ArrowRight, MapPin, Building2, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const hotSites = [
  {
    id: 1,
    name: "中铁建广州南沙综合仓储基地",
    company: "中铁建物料华南仓储有限公司",
    location: "广东省广州市南沙区",
    warehouseCount: 12,
    totalArea: "150000",
    rating: 4.9,
    customers: 256,
    features: ["铁路专用线", "港口联运", "综合服务"],
    isTop: true,
  },
  {
    id: 2,
    name: "中铁建深圳前海智慧仓储基地",
    company: "中铁建物料华南专业运营有限公司",
    location: "广东省深圳市南山区",
    warehouseCount: 8,
    totalArea: "80000",
    rating: 4.8,
    customers: 189,
    features: ["智慧物流", "自贸区", "跨境服务"],
    isTop: true,
  },
  {
    id: 3,
    name: "中铁建东莞虎门港务仓储基地",
    company: "中铁十四局集团广州分公司",
    location: "广东省东莞市虎门镇",
    warehouseCount: 15,
    totalArea: "200000",
    rating: 4.7,
    customers: 312,
    features: ["港口仓储", "大型堆场", "海关监管"],
    isTop: false,
  },
  {
    id: 4,
    name: "中铁十六局佛山顺德钢构仓储基地",
    company: "中铁十六局集团华南分公司",
    location: "广东省佛山市顺德区",
    warehouseCount: 6,
    totalArea: "45000",
    rating: 4.6,
    customers: 145,
    features: ["制造配套", "快速响应", "专业服务"],
    isTop: false,
  },
]

export function HotSites() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">热门站点</h2>
          <Badge variant="secondary" className="bg-destructive/10 text-destructive">
            TOP站点
          </Badge>
        </div>
        <Button variant="link" className="text-primary">
          查看全部
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hotSites.map((site, index) => (
          <Card
            key={site.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* 头部图片 */}
            <div className="h-32 bg-gradient-to-br from-destructive/10 to-destructive/5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-destructive/20" />
              </div>
              {site.isTop && (
                <Badge className="absolute top-2 left-2 bg-destructive">
                  TOP{index + 1}
                </Badge>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{site.rating}</span>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {site.name}
              </h3>

              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {site.company}
              </p>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{site.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">仓库数：</span>
                  <span className="font-medium">{site.warehouseCount}个</span>
                </div>
                <div>
                  <span className="text-muted-foreground">总面积：</span>
                  <span className="font-medium">{(parseInt(site.totalArea) / 10000).toFixed(1)}万m²</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {site.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{site.customers}家客户</span>
                </div>
                <Button size="sm" variant="outline">
                  了解详情
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
