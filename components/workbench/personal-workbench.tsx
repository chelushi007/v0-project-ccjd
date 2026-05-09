"use client"

import { User, FileText, Bell, Settings, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const quickActions = [
  { icon: FileText, label: "我的需求", count: 3 },
  { icon: Bell, label: "消息通知", count: 12 },
  { icon: CheckCircle2, label: "待办事项", count: 5 },
  { icon: Settings, label: "账户设置", count: 0 },
]

export function PersonalWorkbench() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">个人工作台</h1>
        <p className="text-muted-foreground max-w-md">
          此模块正在开发中，将提供个人业务管理、需求跟踪、消息通知等功能
        </p>
      </div>

      {/* 功能预览卡片 */}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">功能预览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <div
                  key={action.label}
                  className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-not-allowed opacity-60"
                >
                  <div className="relative">
                    <Icon className="w-6 h-6 text-primary mb-2" />
                    {action.count > 0 && (
                      <Badge className="absolute -top-2 -right-4 h-5 min-w-5 flex items-center justify-center p-0 text-xs">
                        {action.count}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-card-foreground">{action.label}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium text-card-foreground mb-3">计划功能</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                我的租赁订单管理
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                需求发布与跟踪
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                收藏的仓储资源
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                合同与账单管理
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                消息与通知中心
              </li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-muted-foreground">
              敬请期待
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
