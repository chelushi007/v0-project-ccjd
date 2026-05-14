"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Save,
  MapPin,
  ImagePlus,
  Trash2,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WarehouseSiteAddProps {
  onBack: () => void
  onSubmit?: () => void
}

const facilityGroups: {
  key: string
  label: string
  options: string[]
  hasOther?: boolean
}[] = [
  {
    key: "loading",
    label: "装卸设备",
    options: ["龙门吊", "叉车", "行车", "地磅"],
    hasOther: true,
  },
  {
    key: "shelf",
    label: "货架设备",
    options: ["登高车", "重型货架", "悬臂货架", "托盘"],
    hasOther: true,
  },
  {
    key: "infra",
    label: "基础设施",
    options: ["办公室", "水电", "暖气", "员工宿舍", "停车场"],
    hasOther: true,
  },
  {
    key: "safety-env",
    label: "安全环保",
    options: [
      "消火栓",
      "灭火器",
      "消防沙池",
      "自动淋喷系统",
      "污水处理系统",
      "粉尘抑制设备",
      "固废收集点",
      "防汛物资",
      "应急照明",
    ],
    hasOther: true,
  },
  {
    key: "safety-eq",
    label: "安全配套",
    options: [
      "封闭式围墙",
      "铁丝网围栏",
      "车辆进出车牌识别",
      "人员进出人脸识别",
      "人员进出人工登记",
      "监控重点区域覆盖",
      "监控全覆盖",
      "无监控",
    ],
    hasOther: true,
  },
]

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1 h-4 bg-primary rounded-sm" />
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </div>
  )
}

function FieldLabel({
  required,
  children,
  className,
}: {
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <Label
      className={`text-sm text-muted-foreground shrink-0 ${className || ""}`}
    >
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  )
}

export function WarehouseSiteAdd({ onBack, onSubmit }: WarehouseSiteAddProps) {
  const [operationMode, setOperationMode] = useState<string[]>([])
  const [unlimited, setUnlimited] = useState({ height: false, load: false })
  const [facilities, setFacilities] = useState<Record<string, string[]>>({})
  const [facilityOther, setFacilityOther] = useState<Record<string, string>>({})
  const [renovate, setRenovate] = useState({
    rebuild: false,
    process: false,
    desc: "",
  })
  const [intro, setIntro] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [agree, setAgree] = useState(false)
  const [contactPhone, setContactPhone] = useState("")

  const toggleOperation = (key: string) => {
    setOperationMode((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    )
  }

  const toggleFacility = (groupKey: string, opt: string) => {
    setFacilities((prev) => {
      const cur = prev[groupKey] || []
      return {
        ...prev,
        [groupKey]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt],
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* 顶部标题 + 返回 */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">新增仓储信息</h1>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
      </div>

      {/* 运营方式 */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SectionHeader title="运营方式" />
          <div className="flex items-center gap-8 pl-3">
            <FieldLabel required>运营方式</FieldLabel>
            <div className="flex items-center gap-6">
              {[
                { key: "self", label: "自主" },
                { key: "entrust", label: "委托" },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={operationMode.includes(opt.key)}
                    onCheckedChange={() => toggleOperation(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 基础信息 */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          <SectionHeader title="基础信息" />
          <div className="pl-3 space-y-4">
            {/* 仓储名称 */}
            <div className="flex items-start gap-4">
              <FieldLabel required className="w-20 pt-2">
                仓储名称
              </FieldLabel>
              <Input
                placeholder="请输入50个字符以内的描述"
                maxLength={50}
                className="max-w-2xl"
              />
            </div>

            {/* 仓储类型 */}
            <div className="flex items-center gap-4">
              <FieldLabel className="w-20">仓储类型</FieldLabel>
              <Select>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">普通仓库</SelectItem>
                  <SelectItem value="integrated">综合仓库</SelectItem>
                  <SelectItem value="logistics">物流仓库</SelectItem>
                  <SelectItem value="cold">冷链仓库</SelectItem>
                  <SelectItem value="dangerous">危化品仓库</SelectItem>
                  <SelectItem value="open">露天堆场</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 三个面积字段 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
              <div className="flex items-center gap-3">
                <FieldLabel required className="w-20">
                  建筑面积
                </FieldLabel>
                <div className="flex items-center gap-1 flex-1">
                  <Input placeholder="0" type="number" />
                  <span className="text-sm text-muted-foreground">㎡</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FieldLabel required className="w-20">
                  可租面积
                </FieldLabel>
                <div className="flex items-center gap-1 flex-1">
                  <Input placeholder="0" type="number" />
                  <span className="text-sm text-muted-foreground">㎡</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FieldLabel className="w-20">公摊面积</FieldLabel>
                <div className="flex items-center gap-1 flex-1">
                  <Input placeholder="0" type="number" />
                  <span className="text-sm text-muted-foreground">㎡</span>
                </div>
              </div>
            </div>

            {/* 楼层 / 堆高限高 / 仓储架构 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
              <div className="flex items-center gap-3">
                <FieldLabel className="w-20">楼层</FieldLabel>
                <Select defaultValue="single">
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">单层</SelectItem>
                    <SelectItem value="multi">多层</SelectItem>
                    <SelectItem value="high">高层</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <FieldLabel className="w-20">堆高限高</FieldLabel>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    placeholder="0"
                    type="number"
                    disabled={unlimited.height}
                  />
                  <span className="text-sm text-muted-foreground">米</span>
                  <label className="flex items-center gap-1 cursor-pointer text-sm whitespace-nowrap">
                    <Checkbox
                      checked={unlimited.height}
                      onCheckedChange={(v) =>
                        setUnlimited((p) => ({ ...p, height: Boolean(v) }))
                      }
                    />
                    不限制
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FieldLabel className="w-20">仓储架构</FieldLabel>
                <Select defaultValue="steel">
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steel">钢结构</SelectItem>
                    <SelectItem value="concrete">混凝土结构</SelectItem>
                    <SelectItem value="brick">砖混结构</SelectItem>
                    <SelectItem value="mixed">混合结构</SelectItem>
                    <SelectItem value="open">露天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 消防备案 / 楼板承重 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <FieldLabel required className="w-20">
                  消防备案
                </FieldLabel>
                <Select defaultValue="yes">
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">有</SelectItem>
                    <SelectItem value="no">无</SelectItem>
                    <SelectItem value="applying">办理中</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <FieldLabel className="w-20">楼板承重</FieldLabel>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    placeholder="0"
                    type="number"
                    disabled={unlimited.load}
                  />
                  <span className="text-sm text-muted-foreground">吨</span>
                  <label className="flex items-center gap-1 cursor-pointer text-sm whitespace-nowrap">
                    <Checkbox
                      checked={unlimited.load}
                      onCheckedChange={(v) =>
                        setUnlimited((p) => ({ ...p, load: Boolean(v) }))
                      }
                    />
                    不限制
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 配套信息 */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          <SectionHeader title="配套信息" />
          <div className="pl-3 space-y-5">
            {facilityGroups.map((g) => (
              <div key={g.key} className="flex items-start gap-4">
                <FieldLabel className="w-20 pt-1">{g.label}</FieldLabel>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 flex-1">
                  {g.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <Checkbox
                        checked={facilities[g.key]?.includes(opt)}
                        onCheckedChange={() => toggleFacility(g.key, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                  {g.hasOther && (
                    <div className="flex items-center gap-2 min-w-[260px]">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox
                          checked={facilities[g.key]?.includes("__other")}
                          onCheckedChange={() => toggleFacility(g.key, "__other")}
                        />
                        其他
                      </label>
                      <Input
                        placeholder="请填写"
                        className="h-8 flex-1"
                        value={facilityOther[g.key] || ""}
                        onChange={(e) =>
                          setFacilityOther((p) => ({
                            ...p,
                            [g.key]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 改制/加工 */}
            <div className="flex items-start gap-4">
              <FieldLabel className="w-20 pt-1">改制/加工</FieldLabel>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 flex-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={renovate.rebuild}
                    onCheckedChange={(v) =>
                      setRenovate((p) => ({ ...p, rebuild: Boolean(v) }))
                    }
                  />
                  改制
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={renovate.process}
                    onCheckedChange={(v) =>
                      setRenovate((p) => ({ ...p, process: Boolean(v) }))
                    }
                  />
                  加工
                </label>
                <Input
                  placeholder="请输入改制/加工能力描述"
                  className="h-8 flex-1 min-w-[300px] max-w-xl"
                  value={renovate.desc}
                  onChange={(e) =>
                    setRenovate((p) => ({ ...p, desc: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 仓储描述 */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SectionHeader title="仓储描述" />
          <div className="pl-3 space-y-2">
            <div className="flex items-start gap-4">
              <FieldLabel className="w-20 pt-2">详细介绍</FieldLabel>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="请输入1000字以内的介绍"
                  maxLength={1000}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  className="min-h-[160px] resize-none"
                />
                <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                  {intro.length}/1000
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 仓储图片 */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SectionHeader title="仓储图片" />
          <div className="pl-3 space-y-3">
            <div className="flex items-start gap-4">
              <FieldLabel required className="w-20 pt-2">
                上传图片
              </FieldLabel>
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-start gap-3">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative w-[120px] h-[88px] rounded-md border bg-muted overflow-hidden group"
                    >
                      {/* 用样图占位 */}
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`仓储图片-${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          代表图
                        </span>
                      )}
                      <button
                        onClick={() =>
                          setImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1 right-1 w-5 h-5 rounded bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        aria-label="删除"
                        type="button"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 20 && (
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => [
                          ...prev,
                          `/.jpg?height=88&width=120&query=warehouse%20${prev.length + 1}`,
                        ])
                      }
                      className="w-[120px] h-[88px] rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition bg-muted/40"
                    >
                      <ImagePlus className="w-6 h-6 mb-1" />
                      <span className="text-xs">选择电脑图片上传</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ※ 只能上传仓储图片，上传的第一张图片作为仓储代表图片在门户展示。JPG、PNG、JPGE
                  格式，图片中不能包含有文字、数字、网址、名片等，最多上传 20 张，每张最大 20M。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 所在位置 */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SectionHeader title="所在位置" />
          <div className="pl-3 space-y-3">
            <div className="flex items-start gap-4">
              <FieldLabel required className="w-20 pt-2">
                具体位置
              </FieldLabel>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Select defaultValue="guangdong">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guangdong">广东省</SelectItem>
                      <SelectItem value="shanghai">上海市</SelectItem>
                      <SelectItem value="beijing">北京市</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="guangzhou">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guangzhou">广州市</SelectItem>
                      <SelectItem value="shenzhen">深圳市</SelectItem>
                      <SelectItem value="foshan">佛山市</SelectItem>
                      <SelectItem value="dongguan">东莞市</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="nansha">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nansha">南沙区</SelectItem>
                      <SelectItem value="huangpu">黄埔区</SelectItem>
                      <SelectItem value="haizhu">海珠区</SelectItem>
                      <SelectItem value="tianhe">天河区</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1 min-w-[260px]">
                    <Input placeholder="输入具体位置信息" className="pr-10" />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
                  </div>
                </div>

                {/* 地图占位 */}
                <div className="relative w-full h-[260px] rounded-md border bg-muted overflow-hidden">
                  <img
                    src="/.jpg?height=260&width=900&query=guangzhou%20map%20preview"
                    alt="地图预览"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-background/95 backdrop-blur-sm border rounded-md px-3 py-2 flex items-center gap-2 shadow-sm">
                      <MapPin className="w-4 h-4 text-destructive" />
                      <span className="text-xs text-foreground">
                        点击地图选择仓储坐标
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 联系信息 */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <SectionHeader title="联系信息" />
          <div className="pl-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <FieldLabel required className="w-20">
                  联系人
                </FieldLabel>
                <Input placeholder="请输入联系人名称" className="flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <FieldLabel required className="w-20">
                  联系方式
                </FieldLabel>
                <div className="relative flex-1">
                  <Input
                    placeholder="请输入联系人电话"
                    maxLength={11}
                    value={contactPhone}
                    onChange={(e) =>
                      setContactPhone(e.target.value.replace(/\D/g, ""))
                    }
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {contactPhone.length}/11
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 底部协议 + 提交 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <RadioGroup
              value={agree ? "yes" : ""}
              onValueChange={(v) => setAgree(v === "yes")}
            >
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <RadioGroupItem value="yes" id="agree" />
                <span>
                  我已阅读并同意
                  <a className="text-primary hover:underline ml-0.5">
                    《仓储租赁条例》
                  </a>
                </span>
              </label>
            </RadioGroup>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onBack}>
                取消
              </Button>
              <Button variant="outline">
                <Building2 className="w-4 h-4 mr-1" />
                保存草稿
              </Button>
              <Button disabled={!agree} onClick={onSubmit}>
                <Save className="w-4 h-4 mr-1" />
                提交审核
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
