"use client"

import { useState } from "react"
import { Search, MapPin, Layers, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const regions = [
  "全部区域",
  "华南地区",
  "华东地区",
  "华北地区",
  "华中地区",
  "西南地区",
  "西北地区",
  "东北地区",
]

const warehouseTypes = [
  "全部类型",
  "普通仓储",
  "恒温仓储",
  "冷链仓储",
  "危化品仓储",
  "露天堆场",
  "立体仓库",
]

const areaRanges = [
  "不限面积",
  "100㎡以下",
  "100-500㎡",
  "500-1000㎡",
  "1000-5000㎡",
  "5000㎡以上",
]

export function SearchEngine() {
  const [keyword, setKeyword] = useState("")
  const [region, setRegion] = useState("")
  const [warehouseType, setWarehouseType] = useState("")
  const [areaRange, setAreaRange] = useState("")

  const handleSearch = () => {
    console.log("[v0] Search params:", { keyword, region, warehouseType, areaRange })
  }

  return (
    <section className="w-full bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-card-foreground">仓储资源搜索</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 关键词搜索 */}
        <div className="lg:col-span-2">
          <Input
            placeholder="搜索仓储站点名称、地址..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-11"
          />
        </div>

        {/* 区域选择 */}
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="h-11">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="选择区域" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 仓储类型 */}
        <Select value={warehouseType} onValueChange={setWarehouseType}>
          <SelectTrigger className="h-11">
            <Layers className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="仓储类型" />
          </SelectTrigger>
          <SelectContent>
            {warehouseTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 面积范围 */}
        <Select value={areaRange} onValueChange={setAreaRange}>
          <SelectTrigger className="h-11">
            <Maximize2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="面积范围" />
          </SelectTrigger>
          <SelectContent>
            {areaRanges.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end mt-4 gap-3">
        <Button variant="outline" onClick={() => {
          setKeyword("")
          setRegion("")
          setWarehouseType("")
          setAreaRange("")
        }}>
          重置条件
        </Button>
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          搜索仓储
        </Button>
      </div>
    </section>
  )
}
