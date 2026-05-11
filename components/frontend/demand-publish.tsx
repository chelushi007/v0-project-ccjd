"use client"

import { Plus, FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DemandPublishProps {
  onNavigate?: (page: string) => void
}

export function DemandPublish({ onNavigate }: DemandPublishProps) {
  const handleQuickPublish = () => {
    // 跳转到详细发布页面（简化版弹窗或跳转）
    onNavigate?.("detail-publish")
  }

  const handleDetailPublish = () => {
    // 跳转到详细发布页面
    onNavigate?.("detail-publish")
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">需求发布</h2>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* 我要发布 */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground text-lg">我要发布</h3>
                  <p className="text-sm text-muted-foreground">发布仓储出租需求信息</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group border-dashed"
                  onClick={handleQuickPublish}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                        快捷发布
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        填写基础信息快速发布
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group"
                  onClick={handleDetailPublish}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                        详细发布
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        填写完整信息精准匹配
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
