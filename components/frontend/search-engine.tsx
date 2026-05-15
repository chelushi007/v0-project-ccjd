"use client"

import { useMemo, useState } from "react"
import { MapPin, ChevronDown, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CHINA_REGIONS, REGION_TYPE_LABEL } from "@/lib/china-regions"

interface SearchEngineProps {
  onNavigate?: (page: string) => void
}

interface RegionSelection {
  province?: string
  city?: string
  district?: string
}

export function SearchEngine({ onNavigate }: SearchEngineProps) {
  const [keyword, setKeyword] = useState("")
  const [region, setRegion] = useState<RegionSelection>({})
  const [warehouseType, setWarehouseType] = useState("")
  const [area, setArea] = useState("")
  const [open, setOpen] = useState(false)

  // 当前在 Popover 内浏览到的省/市（用于驱动右侧的城市/区列表，未必等于已选中值）
  const [activeProvince, setActiveProvince] = useState<string | undefined>(
    region.province,
  )
  const [activeCity, setActiveCity] = useState<string | undefined>(region.city)

  const provinceNode = useMemo(
    () => CHINA_REGIONS.find((p) => p.name === activeProvince),
    [activeProvince],
  )
  const cityNode = useMemo(
    () => provinceNode?.cities.find((c) => c.name === activeCity),
    [provinceNode, activeCity],
  )

  const regionLabel = useMemo(() => {
    if (!region.province) return ""
    const parts = [region.province]
    if (region.city) parts.push(region.city)
    if (region.district) parts.push(region.district)
    return parts.join(" / ")
  }, [region])

  const handleSelectProvince = (name: string) => {
    setActiveProvince(name)
    setActiveCity(undefined)
    // 仅选省时不闭合，等待用户继续向下选；同时立即写入选择，便于"只想筛省"的场景
    setRegion({ province: name })
  }
  const handleSelectCity = (name: string) => {
    setActiveCity(name)
    setRegion((prev) => ({ province: prev.province, city: name }))
  }
  const handleSelectDistrict = (name: string) => {
    setRegion((prev) => ({
      province: prev.province,
      city: prev.city,
      district: name,
    }))
    setOpen(false)
  }
  const handleClearRegion = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setRegion({})
    setActiveProvince(undefined)
    setActiveCity(undefined)
  }

  const handleSearch = () => {
    onNavigate?.("warehouse-list")
  }

  const handleMapClick = () => {
    onNavigate?.("warehouse-map")
  }

  return (
    <section className="w-full">
      <div className="relative bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex items-center">
          {/* 三级联动 区域选择 */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "group h-14 px-4 flex items-center gap-2 border-r border-border min-w-32 max-w-72 text-left",
                  "hover:bg-muted/40 transition-colors",
                )}
              >
                <span
                  className={cn(
                    "text-sm truncate flex-1",
                    region.province
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {regionLabel || "区域"}
                </span>
                {region.province ? (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={handleClearRegion}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleClearRegion()
                    }}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                    aria-label="清除区域"
                  >
                    <X className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-0 w-[680px] max-w-[92vw] shadow-xl"
            >
              <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">已选：</span>
                  {region.province ? (
                    <span className="font-medium text-foreground">
                      {regionLabel}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">请选择省 / 市 / 区</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => handleClearRegion()}
                  >
                    清除
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setOpen(false)}
                  >
                    确定
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-border">
                {/* 省级 */}
                <div className="flex flex-col">
                  <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground bg-muted/40">
                    省 / 直辖市 / 自治区
                  </div>
                  <ScrollArea className="h-80">
                    <div className="py-1">
                      {CHINA_REGIONS.map((p) => {
                        const active = activeProvince === p.name
                        const selected = region.province === p.name
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => handleSelectProvince(p.name)}
                            className={cn(
                              "w-full px-3 py-2 text-sm text-left flex items-center justify-between gap-2 transition-colors",
                              active
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted/50",
                            )}
                          >
                            <span className="truncate flex items-center gap-1.5">
                              {selected && (
                                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                              )}
                              {p.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {REGION_TYPE_LABEL[p.type]}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* 市级 */}
                <div className="flex flex-col">
                  <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground bg-muted/40">
                    市
                  </div>
                  <ScrollArea className="h-80">
                    <div className="py-1">
                      {provinceNode ? (
                        provinceNode.cities.map((c) => {
                          const active = activeCity === c.name
                          const selected = region.city === c.name
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => handleSelectCity(c.name)}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left flex items-center justify-between gap-2 transition-colors",
                                active
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted/50",
                              )}
                            >
                              <span className="truncate flex items-center gap-1.5">
                                {selected && (
                                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                )}
                                {c.name}
                              </span>
                              <ChevronDown className="w-3 h-3 -rotate-90 text-muted-foreground shrink-0" />
                            </button>
                          )
                        })
                      ) : (
                        <div className="px-3 py-6 text-xs text-muted-foreground text-center">
                          请先选择左侧的省 / 直辖市
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* 区（县）级 */}
                <div className="flex flex-col">
                  <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground bg-muted/40">
                    区 / 县
                  </div>
                  <ScrollArea className="h-80">
                    <div className="py-1">
                      {cityNode ? (
                        cityNode.districts.map((dt) => {
                          const selected = region.district === dt.name
                          return (
                            <button
                              key={dt.name}
                              type="button"
                              onClick={() => handleSelectDistrict(dt.name)}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left flex items-center gap-1.5 transition-colors",
                                selected
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted/50",
                              )}
                            >
                              {selected && (
                                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                              )}
                              <span className="truncate">{dt.name}</span>
                            </button>
                          )
                        })
                      ) : (
                        <div className="px-3 py-6 text-xs text-muted-foreground text-center">
                          请先选择中间的市
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* 类型 */}
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

          {/* 面积 */}
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
