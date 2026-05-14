"use client"

import { Settings, BarChart3, Users, Package, FileText, Building2, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const modules = [
  { icon: Building2, label: "仓储资源管理", description: "站点、库区、货位管理" },
  { icon: Users, label: "客户管理", description: "租户、委托方信息管理" },
  { icon: FileText, label: "合同管理", description: "租赁、托管合同全流程" },
  { icon: Package, label: "物料管理", description: "入库、出库、调拨管理" },
  { icon: BarChart3, label: "数据统计", description: "经营数据、报表分析" },
  { icon: TrendingUp, label: "运营分析", description: "收益分析、绩效考核" },
]

export function OperationWorkbench() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Settings className="w-10 h-10 text-accent" />
        </div>
        <p className="text-muted-foreground max-w-md">
          此模块正在开发中，将提供仓储资源管理、客户管理、合同管理、数据分析等运营功能
        </p>
      </div>

      {/* 功能模块预览 */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-lg">功能模块预览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <div
                  key={module.label}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors cursor-not-allowed opacity-60"
                >
                  <Icon className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-medium text-card-foreground mb-1">{module.label}</h3>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium text-card-foreground mb-3">运营场景支持</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-card-foreground">仓储自主出租</span>
                  <p className="text-xs text-muted-foreground">整租、分区出租、短期出租管理</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-card-foreground">委托出租运营</span>
                  <p className="text-xs text-muted-foreground">受托方统一出租运营管理</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-card-foreground">物料存放管理</span>
                  <p className="text-xs text-muted-foreground">存放、保管、安全管理</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-card-foreground">物料托管运营</span>
                  <p className="text-xs text-muted-foreground">分成模式、整租模式管理</p>
                </div>
              </div>
            </div>
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
