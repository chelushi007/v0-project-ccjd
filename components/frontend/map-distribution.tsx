"use client"

import { useState } from "react"
import { MapPin, Boxes } from "lucide-react"
import { cn } from "@/lib/utils"
import { WarehouseMap } from "./warehouse-map"
import { MaterialMap } from "./material-map"

interface MapDistributionProps {
  onNavigate?: (page: string) => void
}

type DistributionTab = "warehouse" | "material"

export function MapDistribution({ onNavigate }: MapDistributionProps) {
  const [tab, setTab] = useState<DistributionTab>("warehouse")

  return (
    <section className="w-full">
      {/* 标题区：Tab 与「仓储地图分布 / 物资地图分布」同行 */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="inline-flex items-center bg-muted rounded-lg p-1">
          <TabButton
            active={tab === "warehouse"}
            onClick={() => setTab("warehouse")}
            icon={MapPin}
            label="仓储地图分布"
          />
          <TabButton
            active={tab === "material"}
            onClick={() => setTab("material")}
            icon={Boxes}
            label="物资地图分布"
          />
        </div>
      </div>

      {/* 切换内容（保持高度风格一致） */}
      {tab === "warehouse" ? (
        <WarehouseMap onNavigate={onNavigate} />
      ) : (
        <MaterialMap onNavigate={onNavigate} />
      )}
    </section>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 h-9 rounded-md text-sm font-medium transition-all",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className={cn("w-4 h-4", active ? "text-primary" : "")} />
      {label}
    </button>
  )
}
