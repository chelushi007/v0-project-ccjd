"use client"

import { useState } from "react"
import { MapPin, Building2, Maximize2, Grid3X3, List, ChevronRight, Filter, SortAsc, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WarehouseListPageProps {
  onNavigate?: (page: string) => void
}

const warehouseData = [
  {
    id: 1,
    name: "中铁建广州南沙综合仓储基地",
    type: "综合仓储",
    location: "广东省广州市南沙区",
    rentType: "委托出租",
    totalArea: "50000",
    rentableArea: "15000",
    price: "0.56",
    priceStatus: "竞价中",
    views: 328,
    publishTime: "2小时前",
    features: ["铁路专用线", "大型装卸设备", "24小时安保"],
    isHot: true,
  },
  {
    id: 2,
    name: "中铁建深圳前海智慧仓储基地",
    type: "智慧仓储",
    location: "广东省深圳市南山区",
    rentType: "自主出租",
    totalArea: "30000",
    rentableArea: "8000",
    price: "0.52",
    priceStatus: "固定价",
    views: 256,
    publishTime: "5小时前",
    features: ["自动化设备", "WMS系统", "恒温区"],
    isHot: true,
  },
  {
    id: 3,
    name: "中铁建东莞虎门港务仓储基地",
    type: "港口仓储",
    location: "广东省东莞市虎门镇",
    rentType: "委托出租",
    totalArea: "80000",
    rentableArea: "25000",
    price: "0.38",
    priceStatus: "竞价中",
    views: 412,
    publishTime: "1天前",
    features: ["近虎门港", "海关监管", "大型堆场"],
    isHot: false,
  },
  {
    id: 4,
    name: "中铁十六局佛山顺德钢构仓储基地",
    type: "专业仓储",
    location: "广东省佛山市顺德区",
    rentType: "自主出租",
    totalArea: "20000",
    rentableArea: "6000",
    price: "0.45",
    priceStatus: "固定价",
    views: 189,
    publishTime: "2天前",
    features: ["钢材专用", "天车设备", "防锈处理"],
    isHot: false,
  },
  {
    id: 5,
    name: "中铁二十二局惠州大亚湾石化仓储基地",
    type: "危化品仓储",
    location: "广东省惠州市大亚湾区",
    rentType: "委托出租",
    totalArea: "15000",
    rentableArea: "4500",
    price: "0.85",
    priceStatus: "竞价中",
    views: 156,
    publishTime: "3天前",
    features: ["危化品资质", "消防达标", "24小时监控"],
    isHot: false,
  },
  {
    id: 6,
    name: "中铁二十四局中山火炬物资仓储基地",
    type: "综合仓储",
    location: "广东省中山市火炬开发区",
    rentType: "自主出租",
    totalArea: "35000",
    rentableArea: "12000",
    price: "0.42",
    priceStatus: "固定价",
    views: 234,
    publishTime: "4天前",
    features: ["近高速", "充足车位", "办公配套"],
    isHot: false,
  },
]

export function WarehouseListPage({ onNavigate }: WarehouseListPageProps) {
  const [viewMode, setViewMode] = useState<"map" | "list">("list")
  const [searchKeyword, setSearchKeyword] = useState("")

  return (
    <div className="space-y-4">
      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="link"
          className="p-0 h-auto text-muted-foreground hover:text-primary"
          onClick={() => onNavigate?.("frontend")}
        >
          首页
        </Button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">仓储列表</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "map" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setViewMode("map")
                onNavigate?.("warehouse-map-page")
              }}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              地图
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4 mr-1" />
              列表
            </Button>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索仓储名称、地址..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="h-10"
              />
            </div>
            <Select defaultValue="all-region">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="区域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-region">全部区域</SelectItem>
                <SelectItem value="guangzhou">广州</SelectItem>
                <SelectItem value="shenzhen">深圳</SelectItem>
                <SelectItem value="dongguan">东莞</SelectItem>
                <SelectItem value="foshan">佛山</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-type">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-type">全部类型</SelectItem>
                <SelectItem value="general">综合仓储</SelectItem>
                <SelectItem value="cold">冷链仓储</SelectItem>
                <SelectItem value="danger">危化品仓储</SelectItem>
                <SelectItem value="outdoor">露天堆场</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-area">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="面积" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-area">不限面积</SelectItem>
                <SelectItem value="small">1000m²以下</SelectItem>
                <SelectItem value="medium">1000-5000m²</SelectItem>
                <SelectItem value="large">5000m²以上</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">排序：</span>
            <Button variant="ghost" size="sm" className="h-7">
              默认排序
            </Button>
            <Button variant="ghost" size="sm" className="h-7">
              价格从低到高
            </Button>
            <Button variant="ghost" size="sm" className="h-7">
              面积从大到小
            </Button>
            <Button variant="ghost" size="sm" className="h-7">
              最新发布
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 列表结果 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>共找到 <span className="text-primary font-medium">{warehouseData.length}</span> 条仓储信息</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouseData.map((warehouse) => (
          <Card key={warehouse.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
            {/* 头部图片 */}
            <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-primary/20" />
              </div>
              <Badge className="absolute top-3 left-3 bg-accent">
                出租
              </Badge>
              <Badge variant="outline" className="absolute top-3 right-3 bg-card/90">
                {warehouse.rentType}
              </Badge>
              {warehouse.isHot && (
                <Badge className="absolute bottom-3 left-3 bg-destructive">
                  热门
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-primary">{warehouse.price}</span>
                <span className="text-sm text-muted-foreground">元/m²/天</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {warehouse.priceStatus}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  {warehouse.rentableArea}m²可租
                </span>
              </div>

              <h3 className="font-medium text-card-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {warehouse.name}
              </h3>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <Building2 className="w-3 h-3" />
                <span>{warehouse.type}</span>
                <MapPin className="w-3 h-3 ml-2" />
                <span className="line-clamp-1">{warehouse.location}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {warehouse.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {warehouse.views}次浏览
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {warehouse.publishTime}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled>上一页</Button>
        <Button variant="default" size="sm">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <span className="text-muted-foreground">...</span>
        <Button variant="outline" size="sm">10</Button>
        <Button variant="outline" size="sm">下一页</Button>
      </div>
    </div>
  )
}
