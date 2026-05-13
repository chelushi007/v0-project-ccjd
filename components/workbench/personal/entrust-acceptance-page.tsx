"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Handshake,
  Building2,
  MapPin,
  Ruler,
  Calendar,
  Coins,
  FileText,
  Phone,
  User,
  Paperclip,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface EntrustAcceptanceData {
  id: string
  title: string
  location: string
  area: string
  type: string
  entruster: string
  trustee: string
  submitDate: string
  /** 期望租金（如：12-15 元/m²/月） */
  expectedRent?: string
  /** 期望租期 */
  expectedTerm?: string
  /** 起租日期 */
  expectedStart?: string
  /** 联系人 */
  contactName?: string
  contactPhone?: string
  /** 附加描述 */
  description?: string
}

interface Props {
  data: EntrustAcceptanceData
  onBack: () => void
  onSubmit?: (payload: AcceptancePayload) => void
}

interface AcceptancePayload {
  decision: "accept" | "reject"
  handler: string
  matchingDays: string
  serviceFeeRate: string
  expectedCloseDate: string
  channels: string[]
  remark: string
  rejectReason?: string
}

export function EntrustAcceptancePage({ data, onBack, onSubmit }: Props) {
  const [decision, setDecision] = useState<"accept" | "reject">("accept")
  const [handler, setHandler] = useState("张明（华南公司 · 仓储事业部）")
  const [matchingDays, setMatchingDays] = useState("15")
  const [serviceFeeRate, setServiceFeeRate] = useState("3")
  const [expectedCloseDate, setExpectedCloseDate] = useState("")
  const [channels, setChannels] = useState<string[]>(["平台公开发布", "定向推荐"])
  const [remark, setRemark] = useState("")
  const [rejectReason, setRejectReason] = useState("")

  const toggleChannel = (c: string) =>
    setChannels((arr) => (arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c]))

  const handleSubmit = () => {
    onSubmit?.({
      decision,
      handler,
      matchingDays,
      serviceFeeRate,
      expectedCloseDate,
      channels,
      remark,
      rejectReason: decision === "reject" ? rejectReason : undefined,
    })
    onBack()
  }

  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-accent/10">
              <Handshake className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold leading-tight">
                  受理委托需求单
                </h2>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] h-5">
                  待受理
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                {data.id}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          服务商：<span className="text-foreground font-medium">{data.trustee}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 左：委托需求详情 */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">需求标题</div>
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {data.title}
                  </h3>
                </div>
                <Badge variant="outline" className="text-[11px] h-5">
                  提交于 {data.submitDate}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                <Info
                  icon={Building2}
                  label="委托方"
                  value={data.entruster}
                  wide
                />
                <Info icon={MapPin} label="所在区域" value={data.location} />
                <Info icon={Ruler} label="出租面积" value={data.area} />
                <Info icon={FileText} label="仓储类型" value={data.type} />
                <Info
                  icon={Coins}
                  label="期望租金"
                  value={data.expectedRent ?? "12 - 15 元/m²/月"}
                  accent
                />
                <Info
                  icon={Calendar}
                  label="期望租期"
                  value={data.expectedTerm ?? "24 个月（含半年免租期）"}
                />
                <Info
                  icon={Calendar}
                  label="期望起租"
                  value={data.expectedStart ?? "2026-06-15"}
                />
                <Info icon={User} label="联系人" value={data.contactName ?? "李文涛"} />
                <Info
                  icon={Phone}
                  label="联系电话"
                  value={data.contactPhone ?? "138-2814-5520"}
                />
              </div>

              <Separator />

              <div>
                <div className="text-xs text-muted-foreground mb-1.5">需求描述</div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {data.description ??
                    "该仓储基地位于产业集中区，紧邻物流主干道，已具备进出场地、自动消防、24h 安保等基础条件。委托方希望服务商优先撮合具备类似业态运营经验的承租企业，并协助办理租赁备案与押金监管事宜。"}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Paperclip className="w-3.5 h-3.5" />
                附件：
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary"
                >
                  仓储现场照片.zip
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary"
                >
                  权属证明.pdf
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary"
                >
                  消防验收报告.pdf
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 受理决策表单 */}
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">受理决策</h3>
              </div>

              <RadioGroup
                value={decision}
                onValueChange={(v) => setDecision(v as "accept" | "reject")}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <DecisionTile
                  value="accept"
                  current={decision}
                  title="接受委托"
                  desc="确认接受本次委托，由 华南公司 启动撮合与签约流程"
                  tone="emerald"
                />
                <DecisionTile
                  value="reject"
                  current={decision}
                  title="拒绝委托"
                  desc="本次委托不在服务能力范围内，需说明拒绝原因"
                  tone="rose"
                />
              </RadioGroup>

              {decision === "accept" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="受理人">
                      <Input
                        value={handler}
                        onChange={(e) => setHandler(e.target.value)}
                      />
                    </Field>
                    <Field label="预计撮合周期（天）">
                      <Select value={matchingDays} onValueChange={setMatchingDays}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 天</SelectItem>
                          <SelectItem value="15">15 天</SelectItem>
                          <SelectItem value="30">30 天</SelectItem>
                          <SelectItem value="60">60 天</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="服务费率（%）">
                      <Input
                        value={serviceFeeRate}
                        onChange={(e) => setServiceFeeRate(e.target.value)}
                        type="number"
                        min="0"
                        step="0.1"
                      />
                    </Field>
                    <Field label="预计签约日期">
                      <Input
                        type="date"
                        value={expectedCloseDate}
                        onChange={(e) => setExpectedCloseDate(e.target.value)}
                      />
                    </Field>
                  </div>

                  <Field label="撮合渠道（可多选）">
                    <div className="flex flex-wrap gap-2">
                      {[
                        "平台公开发布",
                        "定向推荐",
                        "存量客户走访",
                        "合作经纪商",
                      ].map((c) => {
                        const on = channels.includes(c)
                        return (
                          <Button
                            key={c}
                            type="button"
                            variant={on ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleChannel(c)}
                            className="h-8 text-xs"
                          >
                            {c}
                          </Button>
                        )
                      })}
                    </div>
                  </Field>

                  <Field label="承诺事项与备注">
                    <Textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="如：承诺 15 个工作日内反馈不少于 3 个意向承租方、配合签署三方协议等"
                      className="min-h-[88px]"
                    />
                  </Field>
                </>
              ) : (
                <Field label="拒绝原因">
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请填写拒绝受理的具体原因，便于委托方调整或重新委托"
                    className="min-h-[120px]"
                  />
                </Field>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右：受理须知 + 提交栏 */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold">受理须知</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary">·</span>
                  受理后委托单状态将变更为"已受理"，并自动通知委托方。
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">·</span>
                  服务商需在承诺撮合周期内完成至少 1 次书面进展反馈。
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">·</span>
                  服务费率不得高于平台规定上限（默认 5%）。
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">·</span>
                  如拒绝委托，原因将同步至委托方，且不再产生受理记录。
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/[0.02]">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">委托方</span>
                <span className="text-foreground text-right truncate ml-2">
                  {data.entruster}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">服务商</span>
                <span className="text-foreground font-medium">{data.trustee}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">预计服务费率</span>
                <span className="text-primary font-semibold tabular-nums">
                  {decision === "accept" ? `${serviceFeeRate || 0}%` : "—"}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  className={
                    decision === "accept"
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }
                >
                  {decision === "accept" ? "确认受理" : "提交拒绝"}
                </Button>
                <Button variant="outline" size="lg" onClick={onBack}>
                  取消
                </Button>
              </div>
              {decision === "reject" && !rejectReason && (
                <div className="flex items-start gap-1.5 text-[11px] text-rose-600">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                  拒绝时需填写原因
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ============ 子组件 ============

function Info({
  icon: Icon,
  label,
  value,
  accent,
  wide,
}: {
  icon: React.ElementType
  label: string
  value: string
  accent?: boolean
  wide?: boolean
}) {
  return (
    <div className={wide ? "md:col-span-2 space-y-1" : "space-y-1"}>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div
        className={`text-sm leading-tight ${
          accent ? "text-primary font-semibold" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function DecisionTile({
  value,
  current,
  title,
  desc,
  tone,
}: {
  value: "accept" | "reject"
  current: "accept" | "reject"
  title: string
  desc: string
  tone: "emerald" | "rose"
}) {
  const active = current === value
  const toneCls =
    tone === "emerald"
      ? active
        ? "border-emerald-400 bg-emerald-50"
        : "border-border"
      : active
        ? "border-rose-400 bg-rose-50"
        : "border-border"
  const titleCls =
    tone === "emerald"
      ? active
        ? "text-emerald-700"
        : "text-foreground"
      : active
        ? "text-rose-700"
        : "text-foreground"
  return (
    <Label
      htmlFor={`decision-${value}`}
      className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${toneCls}`}
    >
      <RadioGroupItem value={value} id={`decision-${value}`} className="mt-0.5" />
      <div className="space-y-0.5">
        <div className={`text-sm font-medium ${titleCls}`}>{title}</div>
        <div className="text-[11px] text-muted-foreground leading-relaxed">{desc}</div>
      </div>
    </Label>
  )
}
