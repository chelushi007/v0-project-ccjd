"use client"

import { useState } from "react"
import { MapPin, Building2, Maximize2, Grid3X3, List, Search, ChevronRight } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface WarehouseMapPageProps {
  onNavigate?: (page: string) => void
}

// 省份数据
const provinces = [
  { id: "guangdong", name: "广东", warehouses: 23, totalArea: 23422, rentableArea: 20110, infoCount: 897, position: { x: 76, y: 78 } },
  { id: "guangxi", name: "广西", warehouses: 12, totalArea: 8500, rentableArea: 6200, infoCount: 234, position: { x: 68, y: 76 } },
  { id: "fujian", name: "福建", warehouses: 15, totalArea: 12000, rentableArea: 8500, infoCount: 356, position: { x: 82, y: 68 } },
  { id: "jiangxi", name: "江西", warehouses: 10, totalArea: 7800, rentableArea: 5600, infoCount: 198, position: { x: 78, y: 64 } },
  { id: "hunan", name: "湖南", warehouses: 14, totalArea: 10500, rentableArea: 7800, infoCount: 287, position: { x: 72, y: 62 } },
  { id: "hubei", name: "湖北", warehouses: 18, totalArea: 15000, rentableArea: 11200, infoCount: 423, position: { x: 72, y: 56 } },
  { id: "henan", name: "河南", warehouses: 20, totalArea: 18000, rentableArea: 14000, infoCount: 512, position: { x: 72, y: 48 } },
  { id: "shandong", name: "山东", warehouses: 25, totalArea: 22000, rentableArea: 17500, infoCount: 634, position: { x: 78, y: 44 } },
  { id: "jiangsu", name: "江苏", warehouses: 28, totalArea: 25000, rentableArea: 19800, infoCount: 756, position: { x: 80, y: 52 } },
  { id: "zhejiang", name: "浙江", warehouses: 22, totalArea: 19500, rentableArea: 15200, infoCount: 567, position: { x: 84, y: 58 } },
  { id: "anhui", name: "安徽", warehouses: 13, totalArea: 9800, rentableArea: 7200, infoCount: 276, position: { x: 78, y: 56 } },
  { id: "shanghai", name: "上海", warehouses: 30, totalArea: 28000, rentableArea: 21000, infoCount: 823, position: { x: 84, y: 54 } },
  { id: "beijing", name: "北京", warehouses: 35, totalArea: 32000, rentableArea: 24500, infoCount: 945, position: { x: 74, y: 36 } },
  { id: "tianjin", name: "天津", warehouses: 16, totalArea: 13500, rentableArea: 10200, infoCount: 389, position: { x: 76, y: 38 } },
  { id: "hebei", name: "河北", warehouses: 19, totalArea: 16000, rentableArea: 12500, infoCount: 456, position: { x: 74, y: 40 } },
  { id: "shanxi", name: "山西", warehouses: 11, totalArea: 8200, rentableArea: 6100, infoCount: 212, position: { x: 70, y: 42 } },
  { id: "shaanxi", name: "陕西", warehouses: 12, totalArea: 9500, rentableArea: 7000, infoCount: 267, position: { x: 66, y: 48 } },
  { id: "gansu", name: "甘肃", warehouses: 8, totalArea: 5800, rentableArea: 4200, infoCount: 145, position: { x: 54, y: 42 } },
  { id: "qinghai", name: "青海", warehouses: 4, totalArea: 2500, rentableArea: 1800, infoCount: 56, position: { x: 48, y: 44 } },
  { id: "ningxia", name: "宁夏", warehouses: 5, totalArea: 3200, rentableArea: 2400, infoCount: 78, position: { x: 62, y: 42 } },
  { id: "xinjiang", name: "新疆", warehouses: 6, totalArea: 4500, rentableArea: 3200, infoCount: 98, position: { x: 32, y: 36 } },
  { id: "xizang", name: "西藏", warehouses: 2, totalArea: 1200, rentableArea: 800, infoCount: 23, position: { x: 36, y: 54 } },
  { id: "sichuan", name: "四川", warehouses: 21, totalArea: 18500, rentableArea: 14200, infoCount: 534, position: { x: 58, y: 58 } },
  { id: "chongqing", name: "重庆", warehouses: 15, totalArea: 12500, rentableArea: 9500, infoCount: 367, position: { x: 64, y: 58 } },
  { id: "guizhou", name: "贵州", warehouses: 9, totalArea: 6800, rentableArea: 5000, infoCount: 178, position: { x: 64, y: 66 } },
  { id: "yunnan", name: "云南", warehouses: 11, totalArea: 8000, rentableArea: 5800, infoCount: 213, position: { x: 56, y: 70 } },
  { id: "heilongjiang", name: "黑龙江", warehouses: 14, totalArea: 11500, rentableArea: 8500, infoCount: 312, position: { x: 82, y: 18 } },
  { id: "jilin", name: "吉林", warehouses: 12, totalArea: 9800, rentableArea: 7200, infoCount: 267, position: { x: 84, y: 26 } },
  { id: "liaoning", name: "辽宁", warehouses: 18, totalArea: 15500, rentableArea: 11800, infoCount: 445, position: { x: 82, y: 32 } },
  { id: "neimenggu", name: "内蒙古", warehouses: 7, totalArea: 5200, rentableArea: 3800, infoCount: 134, position: { x: 68, y: 28 } },
  { id: "hainan", name: "海南", warehouses: 6, totalArea: 4200, rentableArea: 3100, infoCount: 112, position: { x: 72, y: 88 } },
]

// 仓储列表数据
const warehouseList = [
  {
    id: 1,
    name: "新出2字头 黄埔带16-32吨行吊钢构18000平可分租",
    type: "平面仓储",
    location: "广东省-广州市-黄埔香雪",
    rentType: "委托出租",
    price: "0.56",
    area: "800",
    priceStatus: "竞价中",
  },
  {
    id: 2,
    name: "深圳宝安立体库 自动化设备齐全",
    type: "立体库",
    location: "广东省-广州市-番禺万博",
    rentType: "自主出租",
    price: "0.52",
    area: "300",
    priceStatus: "竞价中",
  },
  {
    id: 3,
    name: "东莞虎门港 大型堆场近港口",
    type: "平面仓储",
    location: "广东省-广州市-黄埔香雪",
    rentType: "委托出租",
    price: "0.56",
    area: "800",
    priceStatus: "竞价中",
  },
]

export function WarehouseMapPage({ onNavigate }: WarehouseMapPageProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>("guangdong")
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [region, setRegion] = useState("")
  const [warehouseType, setWarehouseType] = useState("")
  const [areaRange, setAreaRange] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("")

  const selectedProvinceData = provinces.find(p => p.id === selectedProvince)

  // 计算总计数据
  const totalStats = {
    warehouses: provinces.reduce((sum, p) => sum + p.warehouses, 0),
    totalArea: provinces.reduce((sum, p) => sum + p.totalArea, 0),
    rentableArea: provinces.reduce((sum, p) => sum + p.rentableArea, 0),
    infoCount: provinces.reduce((sum, p) => sum + p.infoCount, 0),
  }

  const handleSearch = () => {
    // 搜索逻辑
  }

  const handleSwitchToList = () => {
    onNavigate?.("warehouse-list")
  }

  return (
    <div className="space-y-4">
      {/* 搜索筛选栏 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="选择区域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部区域</SelectItem>
                <SelectItem value="guangdong">广东省</SelectItem>
                <SelectItem value="guangzhou">广州市</SelectItem>
                <SelectItem value="shenzhen">深圳市</SelectItem>
                <SelectItem value="dongguan">东莞市</SelectItem>
                <SelectItem value="foshan">佛山市</SelectItem>
              </SelectContent>
            </Select>

            <Select value={warehouseType} onValueChange={setWarehouseType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="仓储类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="comprehensive">综合仓库</SelectItem>
                <SelectItem value="logistics">物流仓库</SelectItem>
                <SelectItem value="cold">冷链仓库</SelectItem>
                <SelectItem value="outdoor">露天堆场</SelectItem>
                <SelectItem value="stereo">立体仓库</SelectItem>
              </SelectContent>
            </Select>

            <Select value={areaRange} onValueChange={setAreaRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="面积范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">不限面积</SelectItem>
                <SelectItem value="0-500">500m²以下</SelectItem>
                <SelectItem value="500-1000">500-1000m²</SelectItem>
                <SelectItem value="1000-3000">1000-3000m²</SelectItem>
                <SelectItem value="3000-5000">3000-5000m²</SelectItem>
                <SelectItem value="5000+">5000m²以上</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1 flex items-center gap-2">
              <Input
                placeholder="请输入关键词搜索"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>
            </div>

            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "map" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                地图
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={handleSwitchToList}
              >
                <List className="w-4 h-4 mr-1" />
                列表
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 h-[600px]">
        {/* 左侧统计面板 */}
        <Card className="bg-sidebar text-sidebar-foreground w-52 shrink-0">
          <CardContent className="p-5 h-full flex flex-col">
            <h3 className="text-primary font-medium mb-6">全国仓库统计</h3>
            
            <div className="space-y-6 flex-1">
              <div>
                <div className="text-3xl font-bold text-primary">{totalStats.warehouses.toLocaleString()}</div>
                <div className="text-sm text-sidebar-foreground/70">总仓库数量</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{(totalStats.totalArea / 10000).toFixed(0)}万</div>
                <div className="text-sm text-sidebar-foreground/70">总面积(m²)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{(totalStats.rentableArea / 10000).toFixed(0)}万</div>
                <div className="text-sm text-sidebar-foreground/70">可出租面积(m²)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{totalStats.infoCount.toLocaleString()}</div>
                <div className="text-sm text-sidebar-foreground/70">发布信息数</div>
              </div>
            </div>

            <div className="pt-4 border-t border-sidebar-border">
              <h4 className="text-primary font-medium mb-2">选择省份查看详情</h4>
              <p className="text-xs text-sidebar-foreground/70">
                鼠标移至地图上的省份可查看该省份的仓库统计情况
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 中间地图区域 */}
        <Card className="flex-1">
          <CardContent className="p-4 relative h-full">
            {/* 中国地图SVG - 更真实的版本 */}
            <svg viewBox="0 0 600 500" className="w-full h-full">
              {/* 中国地图轮廓 */}
              <path
                d="M180,80 L220,60 L280,55 L340,50 L400,45 L450,55 L500,70 L530,90 L550,120 L560,160 L555,200 L540,230 L520,250 L530,280 L540,320 L530,360 L510,390 L480,410 L450,420 L420,430 L380,440 L340,445 L300,440 L260,430 L230,410 L200,380 L180,350 L160,310 L150,270 L145,230 L150,190 L160,150 L170,110 Z"
                fill="hsl(var(--primary) / 0.1)"
                stroke="hsl(var(--primary) / 0.3)"
                strokeWidth="1.5"
              />
              
              {/* 新疆 */}
              <path d="M100,120 L180,100 L200,140 L180,200 L140,220 L100,200 L80,160 Z" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 西藏 */}
              <path d="M100,220 L180,200 L200,260 L180,320 L120,340 L80,300 L70,260 Z" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 内蒙古 */}
              <path d="M200,80 L340,60 L400,80 L420,120 L380,140 L300,130 L240,140 L200,120 Z" fill="hsl(var(--primary) / 0.18)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 黑龙江 */}
              <path d="M450,50 L520,60 L540,100 L520,140 L480,150 L450,120 L440,80 Z" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 吉林 */}
              <path d="M480,150 L530,145 L540,180 L520,210 L490,200 L480,170 Z" fill="hsl(var(--primary) / 0.18)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 辽宁 */}
              <path d="M480,200 L530,195 L540,230 L520,260 L490,250 L480,220 Z" fill="hsl(var(--primary) / 0.22)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 河北/北京/天津 */}
              <path d="M420,160 L470,150 L480,190 L460,230 L420,240 L400,210 L410,180 Z" fill="hsl(var(--primary) / 0.25)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 山东 */}
              <path d="M460,240 L520,230 L540,270 L520,300 L480,300 L460,270 Z" fill="hsl(var(--primary) / 0.24)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 江苏 */}
              <path d="M480,300 L530,290 L540,330 L520,360 L490,350 L480,320 Z" fill="hsl(var(--primary) / 0.28)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 浙江 */}
              <path d="M500,360 L540,350 L550,390 L530,420 L500,410 L490,380 Z" fill="hsl(var(--primary) / 0.26)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 福建 */}
              <path d="M490,410 L530,400 L540,440 L520,470 L490,460 L480,430 Z" fill="hsl(var(--primary) / 0.22)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 广东 */}
              <path d="M380,420 L450,410 L480,450 L450,480 L400,490 L360,470 L360,440 Z" fill={selectedProvince === "guangdong" ? "hsl(var(--primary) / 0.4)" : "hsl(var(--primary) / 0.3)"} stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" />
              {/* 广西 */}
              <path d="M300,420 L360,410 L380,450 L350,480 L300,480 L280,450 Z" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 云南 */}
              <path d="M220,380 L280,360 L300,420 L280,460 L230,470 L200,440 L200,400 Z" fill="hsl(var(--primary) / 0.18)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 四川 */}
              <path d="M240,280 L320,260 L360,300 L340,360 L280,380 L240,360 L220,320 Z" fill="hsl(var(--primary) / 0.24)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 湖南 */}
              <path d="M360,360 L420,350 L440,400 L420,440 L370,450 L350,410 Z" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 湖北 */}
              <path d="M340,300 L420,280 L440,320 L420,360 L360,370 L340,340 Z" fill="hsl(var(--primary) / 0.22)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 河南 */}
              <path d="M380,240 L450,220 L470,260 L450,300 L400,310 L380,280 Z" fill="hsl(var(--primary) / 0.23)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              {/* 海南 */}
              <circle cx="420" cy="500" r="15" fill="hsl(var(--primary) / 0.18)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
              
              {/* 省份标注点 */}
              {provinces.map((province) => {
                const x = province.position.x * 5.5 + 20
                const y = province.position.y * 4.5 + 30
                return (
                  <g
                    key={province.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedProvince(province.id)}
                    onClick={() => setSelectedProvince(province.id)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={selectedProvince === province.id ? 8 : 5}
                      className={cn(
                        "transition-all",
                        selectedProvince === province.id
                          ? "fill-orange-500"
                          : province.warehouses > 20
                          ? "fill-orange-400"
                          : province.warehouses > 10
                          ? "fill-orange-300"
                          : "fill-orange-200"
                      )}
                    />
                    {selectedProvince === province.id && (
                      <circle
                        cx={x}
                        cy={y}
                        r={12}
                        className="fill-none stroke-orange-500 stroke-2 animate-ping"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* 省份信息卡片 */}
            {selectedProvinceData && (
              <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[240px]">
                <h4 className="text-lg font-semibold mb-3">{selectedProvinceData.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">共享仓数量：</span>
                    <span className="font-medium">{selectedProvinceData.warehouses}座</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总面积：</span>
                    <span className="font-medium">{selectedProvinceData.totalArea.toLocaleString()}m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">可出租面积：</span>
                    <span className="font-medium">{selectedProvinceData.rentableArea.toLocaleString()}m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">发布信息数：</span>
                    <span className="font-medium">{selectedProvinceData.infoCount}</span>
                  </div>
                </div>
                <Button className="w-full mt-3" size="sm" onClick={handleSwitchToList}>
                  查看该省份仓储
                </Button>
              </div>
            )}

            {/* 南海诸岛小图 */}
            <div className="absolute bottom-4 right-4 w-20 h-24 border border-border rounded bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
              南海诸岛
            </div>
          </CardContent>
        </Card>

        {/* 右侧仓储列表 */}
        <div className="w-72 shrink-0 space-y-3">
          {warehouseList.map((warehouse) => (
            <Card key={warehouse.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="flex">
                  {/* 图片 */}
                  <div className="w-24 h-24 bg-muted relative flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                    <Badge className="absolute top-1 left-1 text-xs bg-accent">
                      出租
                    </Badge>
                  </div>
                  {/* 信息 */}
                  <div className="flex-1 p-2">
                    <Badge variant="outline" className="text-xs mb-1">
                      {warehouse.rentType}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm mb-1">
                      <span className="text-primary font-medium">{warehouse.price}</span>
                      <span className="text-xs text-muted-foreground">元/m²/天</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" />
                        {warehouse.area}m²
                      </span>
                      <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                        {warehouse.priceStatus}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {warehouse.name}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* 分页 */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">1</span>
            <span className="text-xs text-muted-foreground">2</span>
            <span className="text-xs text-muted-foreground">3</span>
          </div>
          <Button variant="link" className="w-full text-primary text-sm" onClick={handleSwitchToList}>
            更多 &gt;&gt;
          </Button>
        </div>
      </div>
    </div>
  )
}
