"use client"

import { useEffect, useRef, useState } from "react"
import {
  Warehouse,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  Radio,
} from "lucide-react"
import { cn } from "@/lib/utils"

type TickerCategory = "rent-warehouse" | "sale-material" | "rent-material"

interface TickerItem {
  id: string
  category: TickerCategory
  title: string
  location: string
  price: string
  unit: string
  amount: string
  trend: "up" | "down"
  time: string
}

const categoryMeta: Record<
  TickerCategory,
  { label: string; icon: typeof Warehouse; chipClass: string }
> = {
  "rent-warehouse": {
    label: "仓储出租",
    icon: Warehouse,
    chipClass: "bg-blue-100 text-blue-700 border-blue-200",
  },
  "sale-material": {
    label: "物资出售",
    icon: ShoppingCart,
    chipClass: "bg-amber-100 text-amber-700 border-amber-200",
  },
  "rent-material": {
    label: "物资出租",
    icon: Package,
    chipClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
}

const tickerData: TickerItem[] = [
  {
    id: "t1",
    category: "rent-warehouse",
    title: "广州黄埔标准仓 2.4万㎡",
    location: "广东 · 广州",
    price: "1.8",
    unit: "元/㎡/天",
    amount: "129.6万",
    trend: "up",
    time: "刚刚",
  },
  {
    id: "t2",
    category: "sale-material",
    title: "二手钢管扣件 约500吨",
    location: "广东 · 深圳",
    price: "3500",
    unit: "元/吨",
    amount: "175万",
    trend: "up",
    time: "2 分钟前",
  },
  {
    id: "t3",
    category: "rent-material",
    title: "塔吊标准节 10 节",
    location: "广东 · 东莞",
    price: "1800",
    unit: "元/节/月",
    amount: "18万/月",
    trend: "up",
    time: "5 分钟前",
  },
  {
    id: "t4",
    category: "rent-warehouse",
    title: "佛山顺德高架仓 1.2万㎡",
    location: "广东 · 佛山",
    price: "2.1",
    unit: "元/㎡/天",
    amount: "75.6万",
    trend: "down",
    time: "8 分钟前",
  },
  {
    id: "t5",
    category: "sale-material",
    title: "建筑模板 约 1000 张",
    location: "广东 · 中山",
    price: "45",
    unit: "元/张",
    amount: "4.5万",
    trend: "down",
    time: "12 分钟前",
  },
  {
    id: "t6",
    category: "rent-material",
    title: "工地周转木方 约 200 方",
    location: "广东 · 珠海",
    price: "12",
    unit: "元/方/月",
    amount: "2.4万/月",
    trend: "up",
    time: "18 分钟前",
  },
  {
    id: "t7",
    category: "rent-warehouse",
    title: "东莞虎门智能仓 8500㎡",
    location: "广东 · 东莞",
    price: "1.9",
    unit: "元/㎡/天",
    amount: "48.5万",
    trend: "up",
    time: "26 分钟前",
  },
  {
    id: "t8",
    category: "sale-material",
    title: "盘扣脚手架 约 300 吨",
    location: "广东 · 惠州",
    price: "4200",
    unit: "元/吨",
    amount: "126万",
    trend: "up",
    time: "32 分钟前",
  },
  {
    id: "t9",
    category: "rent-material",
    title: "钢制围挡 约 2000 米",
    location: "广东 · 江门",
    price: "0.8",
    unit: "元/米/天",
    amount: "4.8万/月",
    trend: "down",
    time: "45 分钟前",
  },
]

function TickerCard({ item }: { item: TickerItem }) {
  const meta = categoryMeta[item.category]
  const Icon = meta.icon
  const TrendIcon = item.trend === "up" ? TrendingUp : TrendingDown
  const trendColor =
    item.trend === "up" ? "text-emerald-600" : "text-rose-500"

  return (
    <div className="flex items-center gap-4 px-5 py-3 mx-3 rounded-lg bg-card border border-border shadow-sm shrink-0 min-w-[420px]">
      <div
        className={cn(
          "flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-xs font-medium shrink-0",
          meta.chipClass,
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        {meta.label}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-medium text-foreground truncate">
          {item.title}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">
          {item.location} · {item.time}
        </span>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <div className="flex items-baseline gap-1">
          <span className="text-base font-semibold text-foreground tabular-nums">
            {item.price}
          </span>
          <span className="text-xs text-muted-foreground">{item.unit}</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium mt-0.5 tabular-nums",
            trendColor,
          )}
        >
          <TrendIcon className="w-3 h-3" />
          成交 {item.amount}
        </div>
      </div>
    </div>
  )
}

export function TransactionTicker() {
  const [paused, setPaused] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // 计算 marquee 时长（按内容长度成比例延展）
  const [duration, setDuration] = useState(60)
  useEffect(() => {
    if (!scrollerRef.current) return
    const width = scrollerRef.current.scrollWidth / 2
    // 约 80px/s
    setDuration(Math.max(40, Math.round(width / 80)))
  }, [])

  // 双倍数据以实现无缝循环
  const loop = [...tickerData, ...tickerData]

  return (
    <section
      aria-label="实时成交滚动信息"
      className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-slate-50 via-white to-slate-50"
    >
      {/* 左侧标签 */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 pl-4 pr-6 bg-gradient-to-r from-primary via-primary to-primary/0 text-primary-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <Radio className="w-4 h-4" />
        <span className="text-sm font-semibold whitespace-nowrap">实时成交</span>
      </div>

      {/* 右侧渐隐遮罩 */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

      {/* 滚动跑道 */}
      <div
        className="flex items-center py-3 pl-36"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={scrollerRef}
          className="flex items-center"
          style={{
            animation: `ticker-marquee ${duration}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loop.map((item, idx) => (
            <TickerCard key={`${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
