"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"
import {
  X,
  Wallet,
  Send,
  Recycle,
  Building2,
  TrendingUp,
  Maximize2,
  Minimize2,
  ChevronRight,
} from "lucide-react"

const CHINA_GEO_URL =
  "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"

// ───────── 数据 ─────────
const provinceData: Record<
  string,
  { warehouses: number; gmv: number; demands: number }
> = {
  广东省: { warehouses: 23, gmv: 1842.6, demands: 897 },
  福建省: { warehouses: 15, gmv: 642.8, demands: 342 },
  江西省: { warehouses: 10, gmv: 312.5, demands: 186 },
  湖南省: { warehouses: 14, gmv: 488.2, demands: 298 },
  湖北省: { warehouses: 18, gmv: 712.4, demands: 412 },
  河南省: { warehouses: 20, gmv: 924.6, demands: 523 },
  山东省: { warehouses: 25, gmv: 1124.3, demands: 645 },
  江苏省: { warehouses: 28, gmv: 1342.8, demands: 712 },
  浙江省: { warehouses: 22, gmv: 1024.6, demands: 534 },
  上海市: { warehouses: 30, gmv: 1546.2, demands: 823 },
  北京市: { warehouses: 35, gmv: 1782.4, demands: 956 },
  四川省: { warehouses: 21, gmv: 856.4, demands: 478 },
  辽宁省: { warehouses: 18, gmv: 624.8, demands: 367 },
  新疆维吾尔自治区: { warehouses: 6, gmv: 142.6, demands: 89 },
  西藏自治区: { warehouses: 2, gmv: 38.5, demands: 23 },
  内蒙古自治区: { warehouses: 7, gmv: 186.4, demands: 112 },
  黑龙江省: { warehouses: 14, gmv: 482.6, demands: 278 },
  云南省: { warehouses: 11, gmv: 346.2, demands: 198 },
  广西壮族自治区: { warehouses: 12, gmv: 412.4, demands: 234 },
  海南省: { warehouses: 6, gmv: 148.6, demands: 87 },
  天津市: { warehouses: 16, gmv: 542.8, demands: 312 },
  重庆市: { warehouses: 19, gmv: 698.4, demands: 398 },
  河北省: { warehouses: 22, gmv: 824.6, demands: 487 },
  山西省: { warehouses: 12, gmv: 378.4, demands: 212 },
  陕西省: { warehouses: 15, gmv: 512.8, demands: 298 },
  甘肃省: { warehouses: 8, gmv: 228.4, demands: 134 },
  青海省: { warehouses: 4, gmv: 96.2, demands: 56 },
  宁夏回族自治区: { warehouses: 5, gmv: 132.6, demands: 78 },
  吉林省: { warehouses: 13, gmv: 412.6, demands: 234 },
  安徽省: { warehouses: 17, gmv: 624.8, demands: 356 },
  贵州省: { warehouses: 9, gmv: 268.4, demands: 156 },
  香港特别行政区: { warehouses: 8, gmv: 312.6, demands: 145 },
  澳门特别行政区: { warehouses: 2, gmv: 64.2, demands: 32 },
}

const gmvTrend = Array.from({ length: 12 }, (_, i) => {
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  const v = [620, 712, 856, 924, 1042, 1188, 1326, 1264, 1402, 1496, 1612, 1742]
  return { m: months[i], gmv: v[i], demand: Math.round(v[i] * 0.78) }
})

const incomeMix = [
  { name: "仓储委托", value: 612.32, fill: "#22d3ee" },
  { name: "增值服务", value: 248.16, fill: "#a78bfa" },
  { name: "物资交易", value: 466.0, fill: "#fbbf24" },
]

const businessBars = [
  { name: "仓储租赁", v: 6480 },
  { name: "物资租赁", v: 4216 },
  { name: "物资销售", v: 2842 },
  { name: "物资存放", v: 1820 },
  { name: "委托代运", v: 1264 },
]

const realtimeMessages = [
  "中铁十六局-番禺南沙临港基地（5,200㎡）通过入驻审核",
  "订单 CCJY20260513001 已完成签署 · 合同金额 ¥3.78M",
  "广东省 今日新增需求挂牌 12 单 · 已撮合 9 单",
  "服务费 ¥58,200 已到账 · 中铁十四局 6 月分成",
  "北京区域成交率提升至 81.6% · 较上月 +4.2pp",
  "盘扣式脚手架配件包 · 新 SKU 已通过平台审核",
  "粤运通物流危化品专运资质审核中 · 12 辆车待入库",
]

function heat(v: number, max: number) {
  if (v <= 0) return "#0b1e3f"
  const r = Math.min(1, v / max)
  if (r > 0.85) return "#fde047"
  if (r > 0.65) return "#fb923c"
  if (r > 0.45) return "#ef4444"
  if (r > 0.3) return "#a855f7"
  if (r > 0.15) return "#3b82f6"
  return "#1e3a8a"
}

// ───────── 组件 ─────────
export function OperatorVisualScreen({ onClose }: { onClose: () => void }) {
  const [now, setNow] = useState(new Date())
  const [isFull, setIsFull] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const maxGmv = useMemo(
    () => Math.max(...Object.values(provinceData).map((p) => p.gmv)),
    [],
  )

  const totals = useMemo(() => {
    const vals = Object.values(provinceData)
    return {
      warehouses: vals.reduce((s, p) => s + p.warehouses, 0),
      gmv: vals.reduce((s, p) => s + p.gmv, 0),
      demands: vals.reduce((s, p) => s + p.demands, 0),
    }
  }, [])

  const toggleFull = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.()
      setIsFull(true)
    } else {
      await document.exitFullscreen?.()
      setIsFull(false)
    }
  }

  const fmtDate = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  })
  const fmtTime = now.toLocaleTimeString("zh-CN", { hour12: false })

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#020817]">
      {/* 背景层：网格 + 星辰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(59,130,246,0.18) 0%, rgba(2,8,23,0) 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at bottom, rgba(34,211,238,0.10) 0%, rgba(2,8,23,0) 55%)",
          }}
        />
      </div>

      {/* 内容容器 */}
      <div className="relative h-full flex flex-col text-slate-100">
        {/* 顶部标题栏 */}
        <header className="flex items-center justify-between px-6 py-3">
          <div className="text-cyan-300 text-xs font-mono tabular-nums tracking-wider">
            {fmtDate}
            <span className="ml-3 text-cyan-100">{fmtTime}</span>
          </div>
          <div className="relative flex-1 text-center">
            <div className="absolute inset-x-0 -bottom-1 mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            <h1
              className="inline-block text-2xl md:text-3xl font-bold tracking-[0.4em] bg-gradient-to-r from-cyan-300 via-sky-100 to-cyan-300 bg-clip-text text-transparent"
              style={{ textShadow: "0 0 24px rgba(34,211,238,0.45)" }}
            >
              供应链平台运营驾驶舱
            </h1>
            <div className="text-[10px] text-cyan-200/70 tracking-[0.3em] mt-1">
              OPERATION COMMAND CENTER · LIVE
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFull}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-xs text-cyan-200 hover:text-white border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/15 transition-colors"
              aria-label="切换全屏"
            >
              {isFull ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              {isFull ? "退出全屏" : "全屏"}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-xs text-red-200 hover:text-white border border-red-500/30 bg-red-500/5 hover:bg-red-500/15 transition-colors"
              aria-label="关闭大屏"
            >
              <X className="w-3.5 h-3.5" />
              关闭
            </button>
          </div>
        </header>

        {/* 顶部 KPI 横条 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 mb-3">
          <KpiBar
            label="总交易额(GMV)"
            value="12,486.32"
            unit="万元"
            delta="+18.2%"
            icon={Wallet}
            tone="from-cyan-500/30 via-cyan-400/10 to-transparent"
            accent="text-cyan-300"
          />
          <KpiBar
            label="平台发单量"
            value="8,432"
            unit="单"
            delta="+9.6%"
            icon={Send}
            tone="from-sky-500/30 via-sky-400/10 to-transparent"
            accent="text-sky-300"
          />
          <KpiBar
            label="物资盘活金额"
            value="3,128.45"
            unit="万元"
            delta="+34.1%"
            icon={Recycle}
            tone="from-amber-500/30 via-amber-400/10 to-transparent"
            accent="text-amber-300"
          />
          <KpiBar
            label="入驻企业总数"
            value="1,298"
            unit="家"
            delta="+89"
            icon={Building2}
            tone="from-indigo-500/30 via-indigo-400/10 to-transparent"
            accent="text-indigo-300"
          />
        </div>

        {/* 中间主体三栏 */}
        <div className="flex-1 grid grid-cols-12 gap-3 px-6 pb-3 min-h-0">
          {/* 左列 */}
          <div className="col-span-3 flex flex-col gap-3 min-h-0">
            <Panel title="GMV 12 月趋势" subtitle="MONTHLY GMV TREND">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gmvTrend} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gmvFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(2,8,23,0.92)",
                      border: "1px solid rgba(34,211,238,0.3)",
                      borderRadius: 6,
                      fontSize: 11,
                      color: "#e2e8f0",
                    }}
                    formatter={(v: number) => `${v} 万元`}
                  />
                  <Area type="monotone" dataKey="gmv" stroke="#22d3ee" strokeWidth={2} fill="url(#gmvFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="平台收入构成" subtitle="REVENUE BREAKDOWN">
              <div className="grid grid-cols-2 h-full items-center gap-2">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={incomeMix}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={36}
                      outerRadius={62}
                      paddingAngle={3}
                      stroke="rgba(2,8,23,0.6)"
                    >
                      {incomeMix.map((it, i) => (
                        <Cell key={i} fill={it.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,8,23,0.92)",
                        border: "1px solid rgba(34,211,238,0.3)",
                        borderRadius: 6,
                        fontSize: 11,
                        color: "#e2e8f0",
                      }}
                      formatter={(v: number) => `${v.toFixed(2)} 万元`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 text-xs">
                  {incomeMix.map((it) => (
                    <div key={it.name} className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-slate-300">
                        <span className="w-2 h-2 rounded-sm" style={{ background: it.fill }} />
                        {it.name}
                      </span>
                      <span className="tabular-nums font-medium" style={{ color: it.fill }}>
                        {it.value.toFixed(0)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-cyan-500/15 text-[10px] text-slate-400">
                    合计 <span className="text-cyan-300 font-semibold tabular-nums">1,326.48</span> 万元
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="业务线分布" subtitle="BUSINESS LINES (GMV · 万元)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={businessBars} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(34,211,238,0.08)" }}
                    contentStyle={{
                      background: "rgba(2,8,23,0.92)",
                      border: "1px solid rgba(34,211,238,0.3)",
                      borderRadius: 6,
                      fontSize: 11,
                      color: "#e2e8f0",
                    }}
                    formatter={(v: number) => `${v.toLocaleString()} 万元`}
                  />
                  <defs>
                    <linearGradient id="barFill" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="v" fill="url(#barFill)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>

          {/* 中央地图 */}
          <div className="col-span-6 flex flex-col gap-3 min-h-0">
            <div className="relative flex-1 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-[#0b1e3f]/80 to-[#020817]/90 overflow-hidden">
              <CornerDeco />
              <div className="absolute top-3 left-4 z-10">
                <div className="text-xs text-cyan-200/80 tracking-widest">全国仓储 · 交易热力分布</div>
                <div className="text-[10px] text-cyan-300/40 tracking-[0.2em] mt-0.5">CHINA WAREHOUSE HEATMAP</div>
              </div>
              <div className="absolute top-3 right-4 z-10 flex items-center gap-3 text-[10px] text-cyan-200/80">
                <Legend color="#fde047" label="≥1500" />
                <Legend color="#fb923c" label="800-1500" />
                <Legend color="#ef4444" label="400-800" />
                <Legend color="#a855f7" label="100-400" />
                <Legend color="#3b82f6" label="≤100" />
              </div>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 700, center: [105, 36] }}
                style={{ width: "100%", height: "100%" }}
              >
                <ZoomableGroup center={[105, 36]} zoom={1}>
                  <Geographies geography={CHINA_GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const name = geo.properties.name as string
                        const stat = provinceData[name]
                        const v = stat?.gmv ?? 0
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={heat(v, maxGmv)}
                            stroke="#22d3ee"
                            strokeOpacity={0.35}
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none", transition: "fill 0.3s" },
                              hover: {
                                outline: "none",
                                fill: "#22d3ee",
                                cursor: "pointer",
                              },
                              pressed: { outline: "none" },
                            }}
                          />
                        )
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>

              {/* 底部三个全国汇总数字 */}
              <div className="absolute left-4 right-4 bottom-3 grid grid-cols-3 gap-2 z-10">
                <BigStat label="覆盖仓储" value={totals.warehouses.toLocaleString()} unit="座" tone="text-cyan-300" />
                <BigStat
                  label="累计 GMV"
                  value={totals.gmv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  unit="万元"
                  tone="text-amber-300"
                />
                <BigStat label="累计需求单" value={totals.demands.toLocaleString()} unit="单" tone="text-emerald-300" />
              </div>
            </div>

            {/* 实时滚动条 */}
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.04] px-4 py-2 overflow-hidden">
              <div className="flex items-center gap-3">
                <span className="shrink-0 inline-flex items-center gap-1.5 text-[10px] text-cyan-300 tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                  </span>
                  实时动态
                </span>
                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-12 animate-[marquee_45s_linear_infinite] whitespace-nowrap text-xs text-cyan-100/90">
                    {[...realtimeMessages, ...realtimeMessages].map((m, i) => (
                      <span key={i} className="inline-flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-cyan-400" />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右列 */}
          <div className="col-span-3 flex flex-col gap-3 min-h-0">
            <Panel title="省份 GMV TOP 10" subtitle="PROVINCE RANKING">
              <div className="space-y-1.5 overflow-y-auto pr-1 h-full">
                {Object.entries(provinceData)
                  .sort((a, b) => b[1].gmv - a[1].gmv)
                  .slice(0, 10)
                  .map(([name, s], idx) => {
                    const ratio = s.gmv / maxGmv
                    return (
                      <div key={name}>
                        <div className="flex items-center justify-between text-[11px] mb-0.5">
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center justify-center w-4 h-4 rounded text-[9px] font-bold ${
                                idx === 0
                                  ? "bg-amber-400/90 text-amber-950"
                                  : idx === 1
                                    ? "bg-slate-300 text-slate-800"
                                    : idx === 2
                                      ? "bg-orange-400/90 text-orange-950"
                                      : "bg-cyan-500/20 text-cyan-200"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-slate-200">{name}</span>
                          </span>
                          <span className="tabular-nums text-cyan-200 font-medium">
                            {s.gmv.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-cyan-500/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"
                            style={{ width: `${ratio * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Panel>

            <Panel title="平台发单趋势" subtitle="DEMAND ORDERS">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gmvTrend} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(2,8,23,0.92)",
                      border: "1px solid rgba(34,211,238,0.3)",
                      borderRadius: 6,
                      fontSize: 11,
                      color: "#e2e8f0",
                    }}
                    formatter={(v: number) => `${v} 单`}
                  />
                  <Line
                    type="monotone"
                    dataKey="demand"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={{ fill: "#a78bfa", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="用户结构" subtitle="USER COMPOSITION">
              <div className="space-y-3 px-2 pt-2">
                <UserBar label="物资使用单位" value={712} max={712} color="from-amber-400 to-amber-600" />
                <UserBar label="站点单位" value={386} max={712} color="from-emerald-400 to-emerald-600" />
                <UserBar label="入驻仓储单位" value={142} max={712} color="from-cyan-400 to-blue-500" />
                <UserBar label="专业运营单位" value={58} max={712} color="from-indigo-400 to-purple-500" />
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* marquee 动画样式 */}
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

// ───────── 子组件 ─────────

function KpiBar({
  label,
  value,
  unit,
  delta,
  icon: Icon,
  tone,
  accent,
}: {
  label: string
  value: string
  unit: string
  delta: string
  icon: typeof Wallet
  tone: string
  accent: string
}) {
  return (
    <div
      className={`relative rounded-lg border border-cyan-500/20 bg-gradient-to-br ${tone} px-4 py-3 overflow-hidden`}
    >
      <CornerDeco />
      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center gap-1.5 text-[11px] ${accent}`}>
          <Icon className="w-3.5 h-3.5" />
          {label}
        </div>
        <span className="text-[10px] text-emerald-300 tabular-nums inline-flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" />
          {delta}
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span
          className={`text-3xl font-bold tabular-nums ${accent}`}
          style={{ textShadow: "0 0 12px currentColor" }}
        >
          {value}
        </span>
        <span className="text-[11px] text-slate-400">{unit}</span>
      </div>
    </div>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="relative flex-1 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.04] to-transparent flex flex-col overflow-hidden min-h-0">
      <CornerDeco />
      <div className="px-4 pt-3 pb-1 flex items-center justify-between shrink-0">
        <div>
          <div className="text-xs text-cyan-200 tracking-wider">{title}</div>
          <div className="text-[9px] text-cyan-400/50 tracking-[0.2em] mt-0.5">{subtitle}</div>
        </div>
        <span className="h-px flex-1 ml-3 bg-gradient-to-r from-cyan-500/40 to-transparent" />
      </div>
      <div className="flex-1 px-2 pb-2 min-h-0">{children}</div>
    </div>
  )
}

function CornerDeco() {
  return (
    <>
      <span className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400/60" />
      <span className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400/60" />
      <span className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400/60" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400/60" />
    </>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
      <span>{label}</span>
    </div>
  )
}

function BigStat({
  label,
  value,
  unit,
  tone,
}: {
  label: string
  value: string
  unit: string
  tone: string
}) {
  return (
    <div className="relative rounded border border-cyan-500/30 bg-[#020817]/70 backdrop-blur px-3 py-2">
      <div className="text-[10px] text-slate-400 tracking-wider">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span
          className={`text-xl font-bold tabular-nums ${tone}`}
          style={{ textShadow: "0 0 10px currentColor" }}
        >
          {value}
        </span>
        <span className="text-[10px] text-slate-500">{unit}</span>
      </div>
    </div>
  )
}

function UserBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const ratio = value / max
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="tabular-nums text-cyan-200 font-semibold">
          {value}
          <span className="ml-0.5 text-[9px] text-slate-500">家</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-cyan-500/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}
