"use client"

import { useState, useMemo } from "react"
import { Package, ArrowRight, MapPin, Eye, Clock, Recycle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const materials = [
  {
    id: 1,
    name: "二手钢管扣件 约500吨",
    category: "拼装类",
    location: "广东省广州市黄埔区",
    dealType: "出售" as const,
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
    dealType: "出租" as const,
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
    id: 3,
    name: "塔吊标准节 10节",
    category: "其他材料",
    location: "广东省东莞市虎门镇",
    dealType: "出租" as const,
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
    id: 4,
    name: "建筑模板 约1000张",
    category: "模板类",
    location: "广东省佛山市顺德区",
    dealType: "出售" as const,
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
    id: 5,
    name: "盘扣式脚手架 约300套",
    category: "拼装类",
    location: "广东省珠海市金湾区",
    dealType: "出租" as const,
    price: "0.8",
    unit: "元/kg/月",
    condition: "九成新",
    supplier: "中铁建物资华南仓储有限公司",
    views: 374,
    publishTime: "2小时前",
    features: ["量大优惠", "整租优先"],
    isHot: true,
  },
  {
    id: 6,
    name: "二手集装箱 40HQ 8 个",
    category: "其他材料",
    location: "广东省深圳市盐田区",
    dealType: "出售" as const,
    price: "9800",
    unit: "元/个",
    condition: "八成新",
    supplier: "中铁建物资华南专业运营有限公司",
    views: 226,
    publishTime: "6小时前",
    features: ["可改办公", "海运可用"],
    isHot: false,
  },
  {
    id: 7,
    name: "工字钢 H300 约 80 吨",
    category: "钢材类",
    location: "广东省东莞市常平镇",
    dealType: "出租" as const,
    price: "0.6",
    unit: "元/kg/月",
    condition: "七成新",
    supplier: "中铁二十二局集团华南分公司",
    views: 158,
    publishTime: "8小时前",
    features: ["可分租", "出场检测"],
    isHot: false,
  },
  {
    id: 8,
    name: "建筑施工电梯 SC200/200 4 台",
    category: "其他材料",
    location: "广东省广州市番禺区",
    dealType: "出售" as const,
    price: "120000",
    unit: "元/台",
    condition: "八成新",
    supplier: "中铁二十四局集团华南分公司",
    views: 142,
    publishTime: "1天前",
    features: ["原厂配件", "可议价"],
    isHot: false,
  },
]

interface MaterialRecommendProps {
  onNavigate?: (page: string) => void
}

type DealTab = "rent" | "sale"

export function MaterialRecommend({ onNavigate }: MaterialRecommendProps = {}) {
  const goDetail = () => onNavigate?.("material-detail")
  const [tab, setTab] = useState<DealTab>("rent")

  const tabCounts = useMemo(
    () => ({
      rent: materials.filter((m) => m.dealType === "出租").length,
      sale: materials.filter((m) => m.dealType === "出售").length,
    }),
    [],
  )

  const list = useMemo(
    () =>
      materials.filter((m) =>
        tab === "rent" ? m.dealType === "出租" : m.dealType === "出售",
      ),
    [tab],
  )

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Recycle className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">闲置物资</h2>
          <Badge variant="secondary" className="ml-2 bg-accent/10 text-accent">
            周转盘活
          </Badge>
        </div>
        <Button variant="link" className="text-primary" onClick={goDetail}>
          查看更多
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* 两个 Tab */}
      <div className="mb-3 flex items-center gap-1 border-b border-border">
        {(
          [
            { key: "rent" as const, label: "物资出租" },
            { key: "sale" as const, label: "物资出售" },
          ]
        ).map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors -mb-px border-b-2",
                active
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground",
              )}
              aria-pressed={active}
            >
              {t.label}
              <span
                className={cn(
                  "ml-1 text-[11px]",
                  active ? "text-primary/80" : "text-muted-foreground/80",
                )}
              >
                ({tabCounts[t.key]})
              </span>
            </button>
          )
        })}
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
