"use client"

import { Bell, ArrowRight, CheckCircle2, Calendar, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const transactions = [
  {
    id: 1,
    type: "租赁成交",
    title: "广州南沙仓储中心 - 某物流公司",
    area: "3000㎡",
    duration: "2年",
    date: "2024-02-28",
    amount: "约360万元",
  },
  {
    id: 2,
    type: "委托运营",
    title: "钢材托管项目 - 中铁物资华南公司",
    content: "周转钢材2000吨",
    date: "2024-02-27",
    amount: "约500万元",
  },
  {
    id: 3,
    type: "租赁成交",
    title: "深圳宝安恒温仓 - 某医药企业",
    area: "1500㎡",
    duration: "3年",
    date: "2024-02-26",
    amount: "约280万元",
  },
  {
    id: 4,
    type: "物资存放",
    title: "东莞虎门堆场 - 某建设集团",
    content: "建材物资存储",
    date: "2024-02-25",
    amount: "约50万元/年",
  },
  {
    id: 5,
    type: "租赁成交",
    title: "佛山顺德钢材仓 - 某钢贸公司",
    area: "5000㎡",
    duration: "1年",
    date: "2024-02-24",
    amount: "约180万元",
  },
  {
    id: 6,
    type: "委托运营",
    title: "周转材料托管 - 某施工单位",
    content: "脚手架、模板等",
    date: "2024-02-23",
    amount: "约120万元",
  },
]

const typeColors: Record<string, string> = {
  "租赁成交": "bg-primary text-primary-foreground",
  "委托运营": "bg-accent text-accent-foreground",
  "物资存放": "bg-chart-3 text-white",
}

export function TransactionNotice() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">成交公告</h2>
        </div>
        <Button variant="link" className="text-primary">
          查看全部公告
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {transactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <Badge className={typeColors[item.type] || "bg-muted"}>
                    {item.type}
                  </Badge>
                  <div>
                    <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      {item.area && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {item.area}
                        </span>
                      )}
                      {item.duration && <span>租期：{item.duration}</span>}
                      {item.content && <span>{item.content}</span>}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary">{item.amount}</div>
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <CheckCircle2 className="w-3 h-3" />
                      已成交
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
