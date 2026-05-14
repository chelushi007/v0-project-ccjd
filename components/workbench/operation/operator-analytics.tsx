"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  Monitor,
  Maximize2,
  Building2,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Wallet,
  MapPin,
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"

const yearTrend = [
  { m: "1月", gmv: 1248, fee: 62, orders: 286 },
  { m: "2月", gmv: 1386, fee: 69, orders: 312 },
  { m: "3月", gmv: 1524, fee: 76, orders: 340 },
  { m: "4月", gmv: 1682, fee: 84, orders: 358 },
  { m: "5月", gmv: 1798, fee: 90, orders: 376 },
  { m: "6月", gmv: 1846, fee: 93, orders: 342 },
]

const bizStructure = [
  { name: "仓储租赁", value: 38, color: "#3b82f6" },
  { name: "物资存放", value: 16, color: "#6366f1" },
  { name: "物资租赁", value: 22, color: "#10b981" },
  { name: "物资销售", value: 24, color: "#f59e0b" },
]

const topUsers = [
  { name: "中铁十四局集团广州分公司", gmv: 4824000, orders: 38 },
  { name: "中铁建工集团第二建设有限公司", gmv: 3960000, orders: 24 },
  { name: "中铁十六局集团华南分公司", gmv: 2680000, orders: 32 },
  { name: "中铁十一局广深城际项目部", gmv: 2160000, orders: 28 },
  { name: "中铁十二局物料分公司", gmv: 1840000, orders: 26 },
]

const regionData = [
  { region: "广州", gmv: 686, orders: 124 },
  { region: "深圳", gmv: 482, orders: 78 },
  { region: "东莞", gmv: 386, orders: 62 },
  { region: "佛山", gmv: 168, orders: 38 },
  { region: "中山", gmv: 84, orders: 22 },
  { region: "珠海", gmv: 40, orders: 18 },
]

const reports = [
  {
    title: "月度运营报告",
    desc: "全平台 GMV、订单、服务费、用户活跃度等核心指标月度汇总",
    icon: BarChart3,
    tone: "text-blue-700",
    bg: "bg-blue-50",
    badge: "每月 1 日",
  },
  {
    title: "服务费收入报表",
    desc: "按业务类型 / 区域 / 用户单位 拆分的服务费收入明细与同比环比",
    icon: Wallet,
    tone: "text-amber-700",
    bg: "bg-amber-50",
    badge: "实时",
  },
  {
    title: "基地运营报告",
    desc: "各基地容量利用率、订单量、营收贡献、用户评分等运营评估",
    icon: Building2,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
    badge: "周报",
  },
  {
    title: "物料价格走势报告",
    desc: "全平台 SKU 价格指数、热门品类、价格波动预警",
    icon: Package,
    tone: "text-indigo-700",
    bg: "bg-indigo-50",
    badge: "日报",
  },
  {
    title: "用户行为分析",
    desc: "用户单位活跃度、订单频次、消费偏好、流失预警",
    icon: Users,
    tone: "text-sky-700",
    bg: "bg-sky-50",
    badge: "月报",
  },
  {
    title: "撮合转化分析",
    desc: "需求池规模、撮合成功率、平均成交周期、推荐策略效果",
    icon: TrendingUp,
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
    badge: "周报",
  },
]

export function OperatorAnalytics() {
  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">统计分析</h1>
          <p className="text-sm text-muted-foreground mt-1">
            多维度业务报表 · 可视化大屏 · 决策支持
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            导出全部报表
          </Button>
        </div>
      </div>

      {/* 可视化大屏入口 */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Monitor className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-semibold">运营可视化大屏</div>
              <p className="text-sm text-white/70 mt-1">
                实时数据驾驶舱 · 适合会议室 / 监控墙投放 · 1080P / 4K 自适应
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              预览
            </Button>
            <Button size="sm" className="bg-white text-slate-900 hover:bg-white/90">
              <Maximize2 className="w-4 h-4 mr-1" />
              全屏进入
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">
            <LineChartIcon className="w-3.5 h-3.5 mr-1" />
            数据看板
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="w-3.5 h-3.5 mr-1" />
            统计报表
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4 space-y-4">
          {/* 年度趋势 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">业务整体趋势</CardTitle>
              <CardDescription className="text-xs">
                近 6 个月 · GMV / 服务费 / 订单量（千元 / 单）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis dataKey="m" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="gmv"
                    name="GMV (万元)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fee"
                    name="服务费 (万元)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="订单 (单)"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* 业务结构 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-muted-foreground" />
                  业务结构占比
                </CardTitle>
                <CardDescription className="text-xs">
                  按 GMV 计 · 单位：%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={bizStructure}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {bizStructure.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {bizStructure.map((b) => (
                    <div
                      key={b.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ background: b.color }}
                      />
                      <span className="flex-1 truncate">{b.name}</span>
                      <span className="tabular-nums font-medium">
                        {b.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* TOP 用户 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  TOP 5 用户单位
                </CardTitle>
                <CardDescription className="text-xs">
                  本年累计 GMV 排名
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topUsers.map((u, idx) => (
                  <div key={u.name} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold tabular-nums shrink-0 ${
                        idx === 0
                          ? "bg-amber-500 text-white"
                          : idx === 1
                            ? "bg-slate-400 text-white"
                            : idx === 2
                              ? "bg-orange-600 text-white"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {u.orders} 单 · ¥ {(u.gmv / 10000).toFixed(0)}万
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 区域分布 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  区域 GMV 分布
                </CardTitle>
                <CardDescription className="text-xs">
                  华南区域 · 单位：万元
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={regionData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      horizontal={false}
                    />
                    <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <YAxis
                      dataKey="region"
                      type="category"
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                      width={50}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="gmv" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* 服务费按业务 + 订单结构 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                业务订单结构（近 6 个月）
              </CardTitle>
              <CardDescription className="text-xs">
                按业务类型分组堆叠 · 单位：单
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={yearTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="orders" name="订单数" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reports.map((r) => {
              const Icon = r.icon
              return (
                <Card key={r.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center ${r.bg}`}
                      >
                        <Icon className={`w-5 h-5 ${r.tone}`} />
                      </div>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {r.badge}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-base">{r.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {r.desc}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        在线查看
                      </Button>
                      <Button variant="outline" size="sm" className="px-2">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
