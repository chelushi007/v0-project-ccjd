"use client"

import { Plus, FileText, ChevronRight, Package, Warehouse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DemandPublishProps {
  onNavigate?: (page: string) => void
}

export function DemandPublish({ onNavigate }: DemandPublishProps) {
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
          <div className="grid grid-cols-2 gap-6">

            {/* 仓储出租 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Warehouse className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">仓储出租</h3>
                  <p className="text-xs text-muted-foreground">发布仓储出租信息</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group border-dashed"
                  onClick={() => onNavigate?.("detail-publish-quick")}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-card-foreground group-hover:text-primary transition-colors">
                        快捷发布
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        填写基础信息快速发布
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group"
                  onClick={() => onNavigate?.("detail-publish-detail")}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-card-foreground group-hover:text-primary transition-colors">
                        详细发布
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        填写完整信息精准匹配
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border -ml-3" />

              {/* 物料出租 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">物料出租</h3>
                    <p className="text-xs text-muted-foreground">从循环物料库发布出租</p>
                  </div>
                </div>
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:border-accent/50 group"
                  onClick={() => onNavigate?.("material-publish")}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-card-foreground group-hover:text-accent transition-colors">
                        发布物料出租
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        引用循环物料库中的物料
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
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
