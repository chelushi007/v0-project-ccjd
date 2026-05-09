"use client"

import { useState } from "react"
import { Plus, FileText, Send, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const demandTypes = [
  { id: "rent", label: "仓储寻租", icon: "🏭", description: "寻找合适的仓储空间" },
  { id: "store", label: "物资存放", icon: "📦", description: "物资存储管理服务" },
  { id: "entrust", label: "委托运营", icon: "🤝", description: "物资托管运营服务" },
  { id: "lease", label: "仓储出租", icon: "🏢", description: "发布仓储出租信息" },
]

export function DemandPublish() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("")

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">需求发布</h2>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              发布需求
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>发布仓储需求</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>需求类型</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择需求类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {demandTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>联系人</Label>
                  <Input placeholder="请输入联系人姓名" />
                </div>
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input placeholder="请输入联系电话" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>期望区域</Label>
                  <Input placeholder="如：广东省广州市" />
                </div>
                <div className="space-y-2">
                  <Label>需求面积</Label>
                  <Input placeholder="如：1000㎡" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>详细描述</Label>
                <Textarea placeholder="请详细描述您的仓储需求..." className="min-h-[100px]" />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>取消</Button>
                <Button onClick={() => setIsOpen(false)}>
                  <Send className="w-4 h-4 mr-2" />
                  提交需求
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {demandTypes.map((type) => (
          <Card
            key={type.id}
            className="group cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
            onClick={() => {
              setSelectedType(type.id)
              setIsOpen(true)
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{type.icon}</div>
              <h3 className="font-medium text-card-foreground mb-1">{type.label}</h3>
              <p className="text-xs text-muted-foreground">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
