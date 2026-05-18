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

type DealCategory = "warehouse" | "material-rent" | "material-sale"

type DealItem = {
  id: number
  name: string
  partyA: string // 出租方 / 出售方
  partyB: string // 承租方 / 采购方
  amount: string
  date: string
}

const warehouseDeals: DealItem[] = [
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
]

const materialRentDeals: DealItem[] = [
  {
    id: 11,
    name: "盘扣式脚手架批量出租成交",
    partyA: "中铁建物资华南专业运营有限公司",
    partyB: "中铁十二局广州地铁18号线项目部",
    amount: "62万元",
    date: "2026-02-28",
  },
  {
    id: 12,
    name: "塔吊标准节出租成交",
    partyA: "中铁十六局集团华南分公司",
    partyB: "中铁二十局深圳前海项目部",
    amount: "48万元",
    date: "2026-02-27",
  },
  {
    id: 13,
    name: "工地周转木方出租成交",
    partyA: "中铁建物资华南仓储有限公司",
    partyB: "中铁十一局广佛同城项目部",
    amount: "23万元",
    date: "2026-02-26",
  },
  {
    id: 14,
    name: "钢管扣件套件出租成交",
    partyA: "中铁十四局集团广州分公司",
    partyB: "中铁二十二局东莞虎门项目部",
    amount: "35万元",
    date: "2026-02-25",
  },
  {
    id: 15,
    name: "建筑模板出租成交",
    partyA: "中铁二十局集团华南分公司",
    partyB: "中铁十八局佛山地铁项目部",
    amount: "18万元",
    date: "2026-02-24",
  },
]

const materialSaleDeals: DealItem[] = [
  {
    id: 21,
    name: "二手钢管扣件批量处置",
    partyA: "中铁十四局集团广州分公司",
    partyB: "广东建工物资循环利用有限公司",
    amount: "175万元",
    date: "2026-02-28",
  },
  {
    id: 22,
    name: "二手挖掘机配件批量出售",
    partyA: "中铁二十二局集团华南分公司",
    partyB: "深圳市机械再利用有限公司",
    amount: "26万元",
    date: "2026-02-27",
  },
  {
    id: 23,
    name: "建筑模板批量出售成交",
    partyA: "中铁二十局集团华南分公司",
    partyB: "佛山市顺翔建材有限公司",
    amount: "45万元",
    date: "2026-02-26",
  },
  {
    id: 24,
    name: "废旧钢筋切头打包出售",
    partyA: "中铁建物资华南仓储有限公司",
    partyB: "广州市再生资源回收公司",
    amount: "32万元",
    date: "2026-02-25",
  },
  {
    id: 25,
    name: "二手周转材料整批处置",
    partyA: "中铁十六局集团华南分公司",
    partyB: "中山市建材循环利用公司",
    amount: "58万元",
    date: "2026-02-24",
  },
]

const tabConfig: Record<
  DealCategory,
  { label: string; data: DealItem[]; partyALabel: string; partyBLabel: string }
> = {
  warehouse: {
    label: "仓储交易",
    data: warehouseDeals,
    partyALabel: "出租单位",
    partyBLabel: "承租单位",
  },
  "material-rent": {
    label: "物资出租",
    data: materialRentDeals,
    partyALabel: "出租单位",
    partyBLabel: "承租单位",
  },
  "material-sale": {
    label: "物资出售",
    data: materialSaleDeals,
    partyALabel: "出售单位",
    partyBLabel: "采购单位",
  },
}

export function TransactionNotice() {
  const [activeTab, setActiveTab] = useState<DealCategory>("warehouse")
  const cfg = tabConfig[activeTab]

  return (
    <section className="w-full">
      <div className="grid grid-cols-3 items-center mb-4">
        {/* 左：标题 */}
        <div className="flex items-center gap-2 justify-self-start">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">成交公告</h2>
          <Badge variant="secondary">最新成交</Badge>
        </div>

        {/* 中：3 个 tab，与标题同行居中 */}
        <div className="justify-self-center inline-flex items-center gap-1 rounded-md border border-border bg-card p-0.5">
          {(Object.keys(tabConfig) as DealCategory[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "px-4 py-1.5 text-sm rounded transition-colors",
                activeTab === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              aria-pressed={activeTab === key}
            >
              {tabConfig[key].label}
            </button>
          ))}
        </div>

        {/* 右：查看全部 */}
        <Button variant="link" className="text-primary justify-self-end">
          查看全部公告
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-[60px] text-center">序号</TableHead>
                <TableHead className="font-semibold">公告名称</TableHead>
                <TableHead className="font-semibold">{cfg.partyALabel}</TableHead>
                <TableHead className="font-semibold">{cfg.partyBLabel}</TableHead>
                <TableHead className="font-semibold text-right">成交金额</TableHead>
                <TableHead className="font-semibold text-center">成交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cfg.data.map((item, idx) => (
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
