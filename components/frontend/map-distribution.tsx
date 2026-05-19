"use client"

import { useState } from "react"
import { MapPin, Boxes } from "lucide-react"
import { cn } from "@/lib/utils"
import { WarehouseMap } from "./warehouse-map"
import { MaterialMap } from "./material-map"

interface MapDistributionProps {
  onNavigate?: (page: string) => void
}

type MapTab = "warehouse" | "material"

export function MapDistribution({ onNavigate }: MapDistributionProps) {
  const [tab, setTab] = useState<MapTab>("warehouse")

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="inline-flex items-center bg-muted/60 border border-border rounded-lg p-1">
          <TabBtn
            active={tab === "warehouse"}
            icon={<MapPin className="w-4 h-4" />}
            label="仓储地图分布"
            onClick={() => setTab("warehouse")}
          />
          <TabBtn
            active={tab === "material"}
            icon={<Boxes className="w-4 h-4" />}
            label="物资地图分布"
            onClick={() => setTab("material")}
          />
        </div>
      </div>

      {tab === "warehouse" ? (
        <WarehouseMap onNavigate={onNavigate} />
      ) : (
        <MaterialMap onNavigate={onNavigate} />
      )}
    </section>
  )
}

function TabBtn({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-md transition-colors",
        active
          ? "bg-background text-foreground shadow-sm font-medium"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
