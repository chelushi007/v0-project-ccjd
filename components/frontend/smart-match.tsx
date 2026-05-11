"use client"

import { Sparkles, ArrowRight, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface SmartMatchProps {
  onNavigate?: (page: string) => void
}

export function SmartMatch({ onNavigate }: SmartMatchProps) {
  const [description, setDescription] = useState("")

  const handleQuickMatch = (type: "material" | "rent") => {
    onNavigate?.("smart-match")
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">智能匹配</h2>
          <Badge variant="secondary" className="bg-accent/10 text-accent">AI匹配</Badge>
        </div>
        <Button variant="link" className="text-primary" onClick={() => onNavigate?.("smart-match")}>
          进入智能匹配
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 快捷入口 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group"
                  onClick={() => handleQuickMatch("material")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                      物资寻找
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      寻找合适的循环物资
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group"
                  onClick={() => handleQuickMatch("rent")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                      仓储承租
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      寻找合适的仓储空间
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 文本描述输入 */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="用自然语言描述您的需求，例如：我需要在广州番禺区找一个3000平方米的仓库，用于存放建材物资..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    AI将分析您的需求并推荐最合适的仓储资源
                  </p>
                  <Button onClick={() => onNavigate?.("smart-match")}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    智能匹配
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
