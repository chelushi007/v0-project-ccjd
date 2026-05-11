"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchEngineProps {
  onNavigate?: (page: string) => void
}

export function SearchEngine({ onNavigate }: SearchEngineProps) {
  const [keyword, setKeyword] = useState("")
  const [region, setRegion] = useState("")
  const [warehouseType, setWarehouseType] = useState("")
  const [area, setArea] = useState("")

  const handleSearch = () => {
    if (onNavigate) {
      onNavigate("warehouse-list")
    }
  }

  const handleMapClick = () => {
    if (onNavigate) {
      onNavigate("warehouse-map")
    }
  }

  return (
    <section className="w-full">
      <div className="relative bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex items-center">
          {/* 下拉选择区域 */}
          <div className="flex items-center border-r border-border">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-28 h-14 border-0 rounded-none focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="区域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部区域</SelectItem>
                <SelectItem value="huanan">华南</SelectItem>
                <SelectItem value="huadong">华东</SelectItem>
                <SelectItem value="huabei">华北</SelectItem>
                <SelectItem value="huazhong">华中</SelectItem>
                <SelectItem value="xinan">西南</SelectItem>
                <SelectItem value="xibei">西北</SelectItem>
                <SelectItem value="dongbei">东北</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center border-r border-border">
            <Select value={warehouseType} onValueChange={setWarehouseType}>
              <SelectTrigger className="w-28 h-14 border-0 rounded-none focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="normal">普通仓储</SelectItem>
                <SelectItem value="constant">恒温仓储</SelectItem>
                <SelectItem value="cold">冷链仓储</SelectItem>
                <SelectItem value="dangerous">危化品仓储</SelectItem>
                <SelectItem value="open">露天堆场</SelectItem>
                <SelectItem value="stereo">立体仓库</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center border-r border-border">
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="w-32 h-14 border-0 rounded-none focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="出租面积" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">不限面积</SelectItem>
                <SelectItem value="small">500m²以下</SelectItem>
                <SelectItem value="medium">500-2000m²</SelectItem>
                <SelectItem value="large">2000-5000m²</SelectItem>
                <SelectItem value="xlarge">5000m²以上</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 搜索输入框 */}
          <div className="flex-1 relative">
            <Input
              placeholder="请输入区域、商圈或小区名开始找仓"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-14 pl-5 pr-4 border-0 text-base bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2 px-4 border-l border-border">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleMapClick}
            >
              <MapPin className="w-5 h-5" />
              <span>地图</span>
            </Button>
            <Button 
              className="h-10 px-6 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleSearch}
            >
              开始找仓
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
