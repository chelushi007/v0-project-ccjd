"use client"

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

const transactions = [
  {
    id: 1,
    name: "广州南沙仓储中心租赁项目",
    lessor: "中铁物资华南公司",
    lessee: "某物流集团有限公司",
    amount: "360万元",
    date: "2024-02-28",
  },
  {
    id: 2,
    name: "深圳前海智慧仓储租赁项目",
    lessor: "深圳前海物流园区",
    lessee: "某医药企业股份有限公司",
    amount: "280万元",
    date: "2024-02-27",
  },
  {
    id: 3,
    name: "东莞虎门港堆场租赁项目",
    lessor: "东莞港务物流集团",
    lessee: "某建设工程有限公司",
    amount: "150万元",
    date: "2024-02-26",
  },
  {
    id: 4,
    name: "佛山顺德钢材仓储租赁项目",
    lessor: "佛山顺德仓储中心",
    lessee: "某钢贸有限公司",
    amount: "180万元",
    date: "2024-02-25",
  },
  {
    id: 5,
    name: "惠州大亚湾恒温仓租赁项目",
    lessor: "惠州物流产业园",
    lessee: "某食品加工企业",
    amount: "220万元",
    date: "2024-02-24",
  },
  {
    id: 6,
    name: "中山火炬仓储基地租赁项目",
    lessor: "中山火炬物流园",
    lessee: "某电子科技公司",
    amount: "95万元",
    date: "2024-02-23",
  },
]

export function TransactionNotice() {
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
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">公告名称</TableHead>
                <TableHead className="font-semibold">出租单位</TableHead>
                <TableHead className="font-semibold">承租单位</TableHead>
                <TableHead className="font-semibold text-right">成交金额</TableHead>
                <TableHead className="font-semibold text-center">成交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-card-foreground hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.lessor}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.lessee}
                  </TableCell>
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
