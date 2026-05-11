"use client"

import { useState } from "react"
import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchEngineProps {
  onNavigate?: (page: string) => void
}

export function SearchEngine({ onNavigate }: SearchEngineProps) {
  const [keyword, setKeyword] = useState("")

  const handleSearch = () => {
    if (onNavigate) {
      onNavigate("warehouse-list")
    }
  }

  const handleMapClick = () => {
    if (onNavigate) {
      onNavigate("warehouse-map-page")
    }
  }

  return (
    <section className="w-full">
      <div className="relative bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex items-center">
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

      {/* 过滤条件 */}
      <div className="flex items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">区域：</span>
          <div className="flex items-center gap-1">
            {["全部", "华南", "华东", "华北", "华中", "西南"].map((region) => (
              <Button
                key={region}
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">类型：</span>
          <div className="flex items-center gap-1">
            {["全部", "普通仓储", "恒温仓储", "冷链仓储", "露天堆场"].map((type) => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">面积：</span>
          <div className="flex items-center gap-1">
            {["不限", "500㎡以下", "500-2000㎡", "2000㎡以上"].map((area) => (
              <Button
                key={area}
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {area}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
