"use client"

import { useState, useMemo } from "react"
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

type DealType = "warehouse" | "rent" | "sale"

type Transaction = {
  id: number
  type: DealType
  name: string
  party1: string // 出让/出租/出售方
  party2: string // 受让/承租/购买方
  amount: string
  date: string
}

const transactions: Transaction[] = [
  // 仓储交易
  {
    id: 1,
    type: "warehouse",
    name: "中铁建广州南沙仓储基地租赁项目",
    party1: "中铁建物资华南仓储有限公司",
    party2: "中铁十一局广深城际项目部",
    amount: "360万元",
    date: "2026-02-28",
  },
  {
    id: 2,
    type: "warehouse",
    name: "中铁建深圳前海智慧仓储租赁项目",
    party1: "中铁建物资华南专业运营有限公司",
    party2: "中铁十四局深圳地铁13号线项目部",
    amount: "280万元",
    date: "2026-02-27",
  },
  {
    id: 3,
    type: "warehouse",
    name: "中铁建东莞虎门港堆场租赁项目",
    party1: "中铁十四局集团广州分公司",
    party2: "中铁二十二局莞惠城际项目部",
    amount: "150万元",
    date: "2026-02-26",
  },
  {
    id: 4,
    type: "warehouse",
    name: "中铁十六局佛山顺德钢构仓储租赁项目",
    party1: "中铁十六局集团华南分公司",
    party2: "中铁二十局广佛环线项目部",
    amount: "180万元",
    date: "2026-02-25",
  },
  // 物资出租
  {
    id: 5,
    type: "rent",
    name: "盘扣式脚手架批量租赁",
    party1: "中铁建物资华南仓储有限公司",
    party2: "中铁十八局深惠城际项目部",
    amount: "78万元",
    date: "2026-02-26",
  },
  {
    id: 6,
    type: "rent",
    name: "塔吊标准节 6 节租赁",
    party1: "中铁十六局集团华南分公司",
    party2: "中铁二十二局广州分公司",
    amount: "32万元",
    date: "2026-02-25",
  },
  {
    id: 7,
    type: "rent",
    name: "工地周转木方 200 方租赁",
    party1: "中铁建物资华南专业运营有限公司",
    party2: "中铁二十四局广佛环线项目部",
    amount: "12万元",
    date: "2026-02-24",
  },
  {
    id: 8,
    type: "rent",
    name: "建筑施工电梯 SC200 4 台租赁",
    party1: "中铁二十四局集团华南分公司",
    party2: "中铁十一局深圳分公司",
    amount: "48万元",
    date: "2026-02-23",
  },
  // 物资出售
  {
    id: 9,
    type: "sale",
    name: "二手钢管扣件约 500 吨出售",
    party1: "中铁十四局集团广州分公司",
    party2: "广州金属回收有限公司",
    amount: "175万元",
    date: "2026-02-26",
  },
  {
    id: 10,
    type: "sale",
    name: "建筑模板 1000 张出售",
    party1: "中铁二十局集团华南分公司",
    party2: "佛山顺德建材贸易公司",
    amount: "4.5万元",
    date: "2026-02-25",
  },
  {
    id: 11,
    type: "sale",
    name: "二手集装箱 40HQ 8 个出售",
    party1: "中铁建物资华南专业运营有限公司",
    party2: "深圳盐田港务公司",
    amount: "7.84万元",
    date: "2026-02-24",
  },
  {
    id: 12,
    type: "sale",
    name: "工字钢 H300 约 80 吨出售",
    party1: "中铁二十二局集团华南分公司",
    party2: "东莞常平钢铁贸易公司",
    amount: "44万元",
    date: "2026-02-22",
  },
]

const tabConfig: { key: DealType; label: string; party1Header: string; party2Header: string }[] = [
  { key: "warehouse", label: "仓储交易", party1Header: "出租单位", party2Header: "承租单位" },
  { key: "rent", label: "物资出租", party1Header: "出租方", party2Header: "承租方" },
  { key: "sale", label: "物资出售", party1Header: "出售方", party2Header: "购买方" },
]

export function TransactionNotice() {
  const [activeTab, setActiveTab] = useState<DealType>("warehouse")

  const tabCounts = useMemo(() => {
    return {
      warehouse: transactions.filter((t) => t.type === "warehouse").length,
      rent: transactions.filter((t) => t.type === "rent").length,
      sale: transactions.filter((t) => t.type === "sale").length,
    } as Record<DealType, number>
  }, [])

  const list = useMemo(
    () => transactions.filter((t) => t.type === activeTab),
    [activeTab],
  )

  const headers = tabConfig.find((t) => t.key === activeTab)!

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

      <Card>
        <CardContent className="p-0">
          {/* Tab 切换 */}
          <div className="flex items-center gap-1 px-3 pt-3 border-b border-border">
            {tabConfig.map((t) => {
              const active = activeTab === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors -mb-px border-b-2",
                    active
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground",
                  )}
                  aria-pressed={active}
                >
                  {t.label}
                  <span
                    className={cn(
                      "ml-1 text-[11px]",
                      active ? "text-primary/80" : "text-muted-foreground/80",
                    )}
                  >
                    ({tabCounts[t.key]})
                  </span>
                </button>
              )
            })}
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-[60px] text-center">序号</TableHead>
                <TableHead className="font-semibold">公告名称</TableHead>
                <TableHead className="font-semibold">{headers.party1Header}</TableHead>
                <TableHead className="font-semibold">{headers.party2Header}</TableHead>
                <TableHead className="font-semibold text-right">成交金额</TableHead>
                <TableHead className="font-semibold text-center">成交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item, idx) => (
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
                  <TableCell className="text-muted-foreground">{item.party1}</TableCell>
                  <TableCell className="text-muted-foreground">{item.party2}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
