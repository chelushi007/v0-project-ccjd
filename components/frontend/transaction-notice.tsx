"use client"

import { useState } from "react"
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

type DealType = "warehouse" | "materialRent" | "materialSale"

interface DealRecord {
  id: number
  name: string
  partyA: string
  partyB: string
  amount: string
  date: string
}

const tabs: { key: DealType; label: string; partyALabel: string; partyBLabel: string }[] = [
  { key: "warehouse", label: "仓储交易", partyALabel: "出租单位", partyBLabel: "承租单位" },
  { key: "materialRent", label: "物资出租", partyALabel: "出租单位", partyBLabel: "承租单位" },
  { key: "materialSale", label: "物资出售", partyALabel: "出售单位", partyBLabel: "采购单位" },
]

const dataMap: Record<DealType, DealRecord[]> = {
  warehouse: [
    {
      id: 1,
      name: "中铁建广州南沙仓储基地租赁项目",
      partyA: "中铁建物资华南仓储有限公司",
      partyB: "中铁十一局广深城际项目部",
      amount: "360万元",
      date: "2026-02-28",
    },
    {
      id: 2,
      name: "中铁建深圳前海智慧仓储租赁项目",
      partyA: "中铁建物资华南专业运营有限公司",
      partyB: "中铁十四局深圳地铁13号线项目部",
      amount: "280万元",
      date: "2026-02-27",
    },
    {
      id: 3,
      name: "中铁建东莞虎门港堆场租赁项目",
      partyA: "中铁十四局集团广州分公司",
      partyB: "中铁二十二局莞惠城际项目部",
      amount: "150万元",
      date: "2026-02-26",
    },
    {
      id: 4,
      name: "中铁十六局佛山顺德钢构仓储租赁项目",
      partyA: "中铁十六局集团华南分公司",
      partyB: "中铁二十局广佛环线项目部",
      amount: "180万元",
      date: "2026-02-25",
    },
    {
      id: 5,
      name: "中铁二十二局惠州大亚湾恒温仓租赁项目",
      partyA: "中铁二十二局集团华南分公司",
      partyB: "中铁十八局深惠城际项目部",
      amount: "220万元",
      date: "2026-02-24",
    },
    {
      id: 6,
      name: "中铁二十四局中山火炬仓储基地租赁项目",
      partyA: "中铁二十四局集团华南分公司",
      partyB: "中铁二十五局深中通道项目部",
      amount: "95万元",
      date: "2026-02-23",
    },
  ],
  materialRent: [
    {
      id: 11,
      name: "盘扣式脚手架 8000套 长租项目",
      partyA: "中铁十一局广州分公司",
      partyB: "中铁建华南区域指挥部",
      amount: "65万元",
      date: "2026-02-28",
    },
    {
      id: 12,
      name: "塔吊标准节 30节 半年租赁",
      partyA: "中铁十六局集团华南分公司",
      partyB: "中铁十四局深圳地铁项目部",
      amount: "48万元",
      date: "2026-02-27",
    },
    {
      id: 13,
      name: "周转木方 1200方 季度出租",
      partyA: "中铁建物资华南专业运营有限公司",
      partyB: "中铁二十局广佛环线项目部",
      amount: "21万元",
      date: "2026-02-26",
    },
    {
      id: 14,
      name: "施工电梯 SC200/200 6台月租",
      partyA: "中铁二十二局集团华南分公司",
      partyB: "中铁十八局深惠城际项目部",
      amount: "32万元",
      date: "2026-02-25",
    },
    {
      id: 15,
      name: "二手钢管 800吨 半年长租",
      partyA: "中铁十四局集团广州分公司",
      partyB: "中铁建广州南沙项目部",
      amount: "55万元",
      date: "2026-02-24",
    },
    {
      id: 16,
      name: "汽车吊 25T 单月出租",
      partyA: "中铁二十四局华南分公司",
      partyB: "中铁二十五局深中通道项目部",
      amount: "18万元",
      date: "2026-02-23",
    },
  ],
  materialSale: [
    {
      id: 21,
      name: "二手钢管扣件 500吨 整批出售",
      partyA: "中铁十四局集团广州分公司",
      partyB: "中铁建华南采购中心",
      amount: "175万元",
      date: "2026-02-28",
    },
    {
      id: 22,
      name: "废旧建筑模板 1500张 集中处置",
      partyA: "中铁二十局集团华南分公司",
      partyB: "再生资源华南采购联盟",
      amount: "62万元",
      date: "2026-02-27",
    },
    {
      id: 23,
      name: "二手挖掘机 PC200-8 1台",
      partyA: "中铁十八局华南分公司",
      partyB: "广东信达机械设备有限公司",
      amount: "26万元",
      date: "2026-02-26",
    },
    {
      id: 24,
      name: "废旧钢筋头 80吨 月度处置",
      partyA: "中铁二十四局华南分公司",
      partyB: "广州金鼎再生金属有限公司",
      amount: "22万元",
      date: "2026-02-25",
    },
    {
      id: 25,
      name: "拆除回收钢板 120吨",
      partyA: "中铁十六局集团华南分公司",
      partyB: "佛山顺鑫再生资源有限公司",
      amount: "31万元",
      date: "2026-02-24",
    },
    {
      id: 26,
      name: "电焊机/切割机 30台 整批出售",
      partyA: "中铁二十二局集团华南分公司",
      partyB: "中铁建华南调剂中心",
      amount: "8.5万元",
      date: "2026-02-23",
    },
  ],
}

export function TransactionNotice({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const [tab, setTab] = useState<DealType>("warehouse")
  const current = tabs.find((t) => t.key === tab)!
  const records = dataMap[tab]

  return (
    <section className="w-full">
      <div className="grid grid-cols-3 items-center mb-4">
        <div className="flex items-center gap-2 justify-self-start">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">成交公告</h2>
          <Badge variant="secondary">最新成交</Badge>
        </div>

        <div className="justify-self-center inline-flex items-center gap-1 rounded-md bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-1.5 text-sm rounded transition-colors font-medium",
                tab === t.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="justify-self-end">
          <Button
            variant="link"
            className="text-primary"
            onClick={() => onNavigate?.("transaction-notice-list")}
          >
            查看全部公告
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-[60px] text-center">序号</TableHead>
                <TableHead className="font-semibold">公告名称</TableHead>
                <TableHead className="font-semibold">{current.partyALabel}</TableHead>
                <TableHead className="font-semibold">{current.partyBLabel}</TableHead>
                <TableHead className="font-semibold text-right">成交金额</TableHead>
                <TableHead className="font-semibold text-center">成交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((item, idx) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
