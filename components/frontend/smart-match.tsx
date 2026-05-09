"use client"

import { Sparkles, ArrowRight, Building2, MapPin, Ruler, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const matchResults = [
  {
    id: 1,
    name: "广州南沙综合仓储中心",
    location: "广东省广州市南沙区",
    type: "普通仓储",
    area: "5000㎡",
    matchScore: 98,
    features: ["24小时监控", "叉车服务", "装卸平台"],
    price: "35元/㎡/月",
  },
  {
    id: 2,
    name: "深圳宝安物流园区",
    location: "广东省深圳市宝安区",
    type: "恒温仓储",
    area: "3000㎡",
    matchScore: 92,
    features: ["恒温恒湿", "消防达标", "货梯"],
    price: "45元/㎡/月",
  },
  {
    id: 3,
    name: "东莞虎门港仓储基地",
    location: "广东省东莞市虎门镇",
    type: "露天堆场",
    area: "10000㎡",
    matchScore: 85,
    features: ["近港口", "大型设备", "场地开阔"],
    price: "18元/㎡/月",
  },
]

export function SmartMatch() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">智能匹配</h2>
          <Badge variant="secondary" className="ml-2">AI推荐</Badge>
        </div>
        <Button variant="link" className="text-primary">
          查看全部匹配
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <p className="text-sm text-muted-foreground">
          基于您的搜索记录和需求偏好，系统已为您智能匹配以下仓储资源
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matchResults.map((item) => (
          <Card key={item.id} className="group hover:shadow-md transition-all hover:border-primary/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground text-sm">{item.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">{item.matchScore}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>类型：</span>
                  <span className="text-card-foreground">{item.type}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Ruler className="w-3 h-3" />
                  <span className="text-card-foreground">{item.area}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {item.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-lg font-semibold text-primary">{item.price}</span>
                <Button size="sm">查看详情</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
