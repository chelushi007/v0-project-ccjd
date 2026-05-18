"use client"

import { useMemo, useState } from "react"
import { Bell, ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type DealCategory = "仓储交易" | "物资出租" | "物资出售"

interface TransactionRecord {
  id: number
  category: DealCategory
  name: string
  // 双方：仓储交易=出租/承租；物资出租=出租/承租；物资出售=出售/采购
  partyA: string
  partyB: string
  amount: string
  date: string
}

const transactions: TransactionRecord[] = [
  // 仓储交易
  {
    id: 1,
    category: "仓储交易",
    name: "中铁建广州南沙仓储基地租赁项目",
    partyA: "中铁建物资华南仓储有限公司",
    partyB: "中铁十一局广深城际项目部",
    amount: "360万元",
    date: "2026-02-28",
  },
  {
    id: 2,
    category: "仓储交易",
    name: "中铁建深圳前海智慧仓储租赁项目",
    partyA: "中铁建物资华南专业运营有限公司",
    partyB: "中铁十四局深圳地铁13号线项目部",
    amount: "280万元",
    date: "2026-02-27",
  },
  {
    id: 3,
    category: "仓储交易",
    name: "中铁建东莞虎门港堆场租赁项目",
    partyA: "中铁十四局集团广州分公司",
    partyB: "中铁二十二局莞惠城际项目部",
    amount: "150万元",
    date: "2026-02-26",
  },
  {
    id: 4,
    category: "仓储交易",
    name: "中铁十六局佛山顺德钢构仓储租赁项目",
    partyA: "中铁十六局集团华南分公司",
    partyB: "中铁二十局广佛环线项目部",
    amount: "180万元",
    date: "2026-02-25",
  },
  // 物资出租
  {
    id: 5,
    category: "物资出租",
    name: "盘扣式脚手架 30吨 6 个月租期",
    partyA: "中铁十一局广深城际项目部",
    partyB: "中铁十四局深惠城际项目部",
    amount: "32.4万元",
    date: "2026-02-26",
  },
  {
    id: 6,
    category: "物资出租",
    name: "工地周转木方 200方 4 个月租期",
    partyA: "中铁建物资华南专业运营有限公司",
    partyB: "中铁二十局广佛环线项目部",
    amount: "9.6万元",
    date: "2026-02-25",
  },
  {
    id: 7,
    category: "物资出租",
    name: "塔吊标准节 10节 8 个月租期",
    partyA: "中铁十六局集团华南分公司",
    partyB: "中铁二十二局莞惠城际项目部",
    amount: "14.4万元",
    date: "2026-02-23",
  },
  {
    id: 8,
    category: "物资出租",
    name: "工程围挡 600米 3 个月租期",
    partyA: "中铁二十二局集团华南分公司",
    partyB: "中铁二十五局深中通道项目部",
    amount: "1.44万元",
    date: "2026-02-22",
  },
  // 物资出售
  {
    id: 9,
    category: "物资出售",
    name: "二手钢管扣件 500吨 整批转让",
    partyA: "中铁十四局集团广州分公司",
    partyB: "中铁十八局深惠城际项目部",
    amount: "175万元",
    date: "2026-02-26",
  },
  {
    id: 10,
    category: "物资出售",
    name: "建筑模板 1000张 批量出售",
    partyA: "中铁二十局集团华南分公司",
    partyB: "中铁二十四局集团华南分公司",
    amount: "4.5万元",
    date: "2026-02-24",
  },
  {
    id: 11,
    category: "物资出售",
    name: "大型混凝土泵车 1台",
    partyA: "中铁二十四局集团华南分公司",
    partyB: "中铁二十五局深中通道项目部",
    amount: "32万元",
    date: "2026-02-22",
  },
  {
    id: 12,
    category: "物资出售",
    name: "工地集装箱办公房 12间 整批转让",
    partyA: "中铁十八局深惠城际项目部",
    partyB: "中铁十一局广深城际项目部",
    amount: "10.2万元",
    date: "2026-02-21",
  },
]

const tabConfig: Record<
  DealCategory,
  { partyALabel: string; partyBLabel: string; nameLabel: string }
> = {
  仓储交易: { partyALabel: "出租单位", partyBLabel: "承租单位", nameLabel: "公告名称" },
  物资出租: { partyALabel: "出租单位", partyBLabel: "承租单位", nameLabel: "物资名称" },
  物资出售: { partyALabel: "出售单位", partyBLabel: "采购单位", nameLabel: "物资名称" },
}

export function TransactionNotice() {
  const [tab, setTab] = useState<DealCategory>("仓储交易")

  const filtered = useMemo(
    () => transactions.filter((item) => item.category === tab),
    [tab],
  )

  const counts = useMemo(
    () =>
      ({
        仓储交易: transactions.filter((t) => t.category === "仓储交易").length,
        物资出租: transactions.filter((t) => t.category === "物资出租").length,
        物资出售: transactions.filter((t) => t.category === "物资出售").length,
      }) as Record<DealCategory, number>,
    [],
  )

  const cfg = tabConfig[tab]

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">成交公告</h2>
          <Badge variant="secondary">最新成交</Badge>
        </div>
        <Button variant="link" className="text-primary">
          查看全部公告
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Tabs：成交类型 */}
      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {(["仓储交易", "物资出租", "物资出售"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
            <span
              className={cn(
                "ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px]",
                tab === t
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-[60px] text-center">序号</TableHead>
                <TableHead className="font-semibold">{cfg.nameLabel}</TableHead>
                <TableHead className="font-semibold">{cfg.partyALabel}</TableHead>
                <TableHead className="font-semibold">{cfg.partyBLabel}</TableHead>
                <TableHead className="font-semibold text-right">成交金额</TableHead>
                <TableHead className="font-semibold text-center">成交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                    暂无成交记录
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-card-foreground hover:text-primary transition-colors">
                          {item.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.partyA}</TableCell>
                    <TableCell className="text-muted-foreground">{item.partyB}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-primary font-semibold">{item.amount}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
