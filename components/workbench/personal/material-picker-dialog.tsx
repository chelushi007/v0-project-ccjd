"use client"

import { useMemo, useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Maximize2,
  Minimize2,
  Package2,
  Star,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface MaterialItem {
  id: string // 分类编号-物料编号
  categoryId: string // 所属分类
  name: string // 物料名称
  spec: string // 规格型号
  unit: string // 计量单位
  auxUnit: string // 辅助计量单位
  tags?: string[]
  isCommon?: boolean // 是否为常用物料
}

interface MaterialCategory {
  id: string
  label: string
  children?: MaterialCategory[]
}

const CATEGORY_TREE: MaterialCategory[] = [
  {
    id: "XH",
    label: "XH-循环物料",
    children: [
      {
        id: "XH01",
        label: "XH01-模板类",
        children: [
          { id: "XH0101", label: "XH0101-梁体模板" },
          { id: "XH0102", label: "XH0102-墙体模板" },
          { id: "XH0103", label: "XH0103-柱模板" },
        ],
      },
      { id: "XH02", label: "XH02-支护类" },
      { id: "XH04", label: "XH04-脚手架类" },
      { id: "XH05", label: "XH05-拼装类" },
      { id: "XH06", label: "XH06-轨道类" },
      { id: "XH07", label: "XH07-型材类" },
      { id: "XH08", label: "XH08-电线电缆" },
      { id: "XH09", label: "XH09-房屋建筑类" },
      { id: "XH11", label: "XH11-其他材料" },
    ],
  },
]

// 模拟物料数据
const ALL_MATERIALS: MaterialItem[] = [
  // XH01-模板类
  {
    id: "XH01010000390905",
    categoryId: "XH0101",
    name: "铁路箱梁内模板",
    spec: "24m",
    unit: "吨",
    auxUnit: "套",
    isCommon: true,
  },
  {
    id: "XH01010000610878",
    categoryId: "XH0101",
    name: "铁路箱梁内模板",
    spec: "31.5m",
    unit: "吨",
    auxUnit: "套",
  },
  {
    id: "XH01010000390904",
    categoryId: "XH0101",
    name: "铁路箱梁内模板",
    spec: "32m",
    unit: "吨",
    auxUnit: "套",
  },
  {
    id: "XH01010000390909",
    categoryId: "XH0101",
    name: "铁路箱梁外模板",
    spec: "24m",
    unit: "吨",
    auxUnit: "套",
    isCommon: true,
  },
  {
    id: "XH01010000731016",
    categoryId: "XH0101",
    name: "铁路箱梁外模板",
    spec: "31.5m",
    unit: "吨",
    auxUnit: "套",
  },
  {
    id: "XH01010000390907",
    categoryId: "XH0101",
    name: "铁路箱梁外模板",
    spec: "32m",
    unit: "吨",
    auxUnit: "套",
  },
  {
    id: "XH01010000387935",
    categoryId: "XH0101",
    name: "铁路箱梁模板",
    spec: "24m",
    unit: "吨",
    auxUnit: "套",
  },
  {
    id: "XH01010000554707",
    categoryId: "XH0101",
    name: "铁路箱梁模板",
    spec: "31.5m",
    unit: "吨",
    auxUnit: "套",
    isCommon: true,
  },
  {
    id: "XH01010000610885",
    categoryId: "XH0101",
    name: "铁路箱梁模板",
    spec: "32-24m",
    unit: "吨",
    auxUnit: "套",
  },
  {
    id: "XH01020100012001",
    categoryId: "XH0102",
    name: "墙体钢模板",
    spec: "1500×3000mm",
    unit: "吨",
    auxUnit: "块",
  },
  {
    id: "XH01030100022205",
    categoryId: "XH0103",
    name: "圆柱钢模板",
    spec: "φ800×3000mm",
    unit: "吨",
    auxUnit: "套",
  },
  // XH04-脚手架
  {
    id: "XH04010000110023",
    categoryId: "XH04",
    name: "钢管脚手架",
    spec: "Φ48×3.5mm",
    unit: "吨",
    auxUnit: "根",
    isCommon: true,
  },
  {
    id: "XH04010000110045",
    categoryId: "XH04",
    name: "盘扣式脚手架",
    spec: "立杆 2.5m",
    unit: "吨",
    auxUnit: "套",
  },
  {
    id: "XH04010000110078",
    categoryId: "XH04",
    name: "扣件式脚手架",
    spec: "国标",
    unit: "吨",
    auxUnit: "套",
  },
  // XH06-轨道
  {
    id: "XH06010000220011",
    categoryId: "XH06",
    name: "重型钢轨",
    spec: "60kg/m × 12m",
    unit: "吨",
    auxUnit: "根",
  },
  {
    id: "XH06010000220022",
    categoryId: "XH06",
    name: "轻型钢轨",
    spec: "30kg/m × 12m",
    unit: "吨",
    auxUnit: "根",
  },
  // XH07-型材
  {
    id: "XH07010000330011",
    categoryId: "XH07",
    name: "H 型钢",
    spec: "HW400×400",
    unit: "吨",
    auxUnit: "根",
    isCommon: true,
  },
  {
    id: "XH07010000330022",
    categoryId: "XH07",
    name: "工字钢",
    spec: "I40b",
    unit: "吨",
    auxUnit: "根",
  },
  // XH08-电缆
  {
    id: "XH08010000440011",
    categoryId: "XH08",
    name: "电力电缆",
    spec: "YJV-3×95",
    unit: "米",
    auxUnit: "盘",
  },
]

function flattenCategoryIds(node: MaterialCategory): string[] {
  const ids = [node.id]
  if (node.children) {
    for (const child of node.children) ids.push(...flattenCategoryIds(child))
  }
  return ids
}

function CategoryTreeNode({
  node,
  level,
  selectedId,
  onSelect,
  expanded,
  onToggle,
}: {
  node: MaterialCategory
  level: number
  selectedId: string | null
  onSelect: (id: string) => void
  expanded: Set<string>
  onToggle: (id: string) => void
}) {
  const isExpanded = expanded.has(node.id)
  const hasChildren = !!node.children?.length
  const isSelected = selectedId === node.id

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect(node.id)
          if (hasChildren) onToggle(node.id)
        }}
        className={cn(
          "w-full flex items-center gap-1 py-1.5 pr-2 text-left text-sm rounded transition-colors",
          isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-muted text-foreground",
        )}
        style={{ paddingLeft: `${level * 14 + 6}px` }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <CategoryTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface MaterialPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (items: MaterialItem[]) => void
  initialSelected?: MaterialItem[]
}

export function MaterialPickerDialog({
  open,
  onOpenChange,
  onConfirm,
  initialSelected = [],
}: MaterialPickerDialogProps) {
  // 顶部 Tab：物料信息 / 常用物料 / 物料选中信息
  const [tab, setTab] = useState<"all" | "common" | "selected">("all")

  // 全屏切换
  const [fullscreen, setFullscreen] = useState(false)

  // 左侧树
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["XH", "XH01"]),
  )
  const [selectedCategory, setSelectedCategory] = useState<string>("XH0101")
  const [categoryKeyword, setCategoryKeyword] = useState("")

  // 右侧筛选
  const [filterCode, setFilterCode] = useState("")
  const [filterName, setFilterName] = useState("")
  const [filterSpec, setFilterSpec] = useState("")
  const [filterTag, setFilterTag] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  // 已选物料
  const [selected, setSelected] = useState<MaterialItem[]>(initialSelected)

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // 按 tab + 分类 + 筛选条件过滤
  const filtered = useMemo(() => {
    let list = ALL_MATERIALS

    if (tab === "common") {
      list = list.filter((m) => m.isCommon)
    } else if (tab === "selected") {
      const ids = new Set(selected.map((s) => s.id))
      list = list.filter((m) => ids.has(m.id))
    } else {
      // tab=all：按选中分类过滤
      if (selectedCategory && selectedCategory !== "XH") {
        list = list.filter((m) => m.categoryId.startsWith(selectedCategory))
      }
    }

    if (filterCode) list = list.filter((m) => m.id.includes(filterCode))
    if (filterName) list = list.filter((m) => m.name.includes(filterName))
    if (filterSpec) list = list.filter((m) => m.spec.includes(filterSpec))

    return list
  }, [tab, selectedCategory, filterCode, filterName, filterSpec, selected])

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const isPicked = (id: string) => selected.some((s) => s.id === id)
  const togglePick = (item: MaterialItem) => {
    setSelected((prev) =>
      isPicked(item.id) ? prev.filter((s) => s.id !== item.id) : [...prev, item],
    )
  }
  const allOnPagePicked =
    pageData.length > 0 && pageData.every((m) => isPicked(m.id))
  const toggleAllOnPage = () => {
    if (allOnPagePicked) {
      setSelected((prev) => prev.filter((s) => !pageData.some((p) => p.id === s.id)))
    } else {
      const toAdd = pageData.filter((m) => !isPicked(m.id))
      setSelected((prev) => [...prev, ...toAdd])
    }
  }

  const handleConfirm = () => {
    onConfirm(selected)
    onOpenChange(false)
  }

  // 模糊查询分类树（简化：根据 keyword 过滤可见根节点）
  const visibleTree = useMemo(() => {
    if (!categoryKeyword) return CATEGORY_TREE
    const kw = categoryKeyword.toLowerCase()
    const filterNode = (n: MaterialCategory): MaterialCategory | null => {
      const selfMatch = n.label.toLowerCase().includes(kw) || n.id.toLowerCase().includes(kw)
      const filteredChildren = n.children?.map(filterNode).filter(Boolean) as
        | MaterialCategory[]
        | undefined
      if (selfMatch || (filteredChildren && filteredChildren.length)) {
        return { ...n, children: filteredChildren }
      }
      return null
    }
    return CATEGORY_TREE.map(filterNode).filter(Boolean) as MaterialCategory[]
  }, [categoryKeyword])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "p-0 gap-0 overflow-hidden flex flex-col",
          fullscreen
            ? "!max-w-none w-screen h-screen !rounded-none sm:!max-w-none"
            : "!max-w-[1280px] w-[95vw] h-[85vh] sm:!max-w-[1280px]",
        )}
      >
        {/* 顶部标题栏 */}
        <DialogHeader className="px-5 py-3 border-b flex flex-row items-center justify-between space-y-0 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Package2 className="w-4 h-4 text-primary" />
            物料信息
          </DialogTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setFullscreen((v) => !v)}
            >
              {fullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-5 border-b shrink-0">
          <div className="flex items-center gap-6">
            {[
              { key: "all", label: "物料信息", icon: Package2 },
              { key: "common", label: "常用物料", icon: Star },
              { key: "selected", label: "物料选中信息", icon: CheckCircle2 },
            ].map((t) => {
              const isActive = tab === t.key
              const Icon = t.icon
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setTab(t.key as typeof tab)
                    setPage(1)
                  }}
                  className={cn(
                    "relative py-3 flex items-center gap-1.5 text-sm transition-colors",
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                  {t.key === "selected" && (
                    <Badge
                      variant={selected.length > 0 ? "destructive" : "secondary"}
                      className="ml-0.5 h-4 min-w-4 px-1 text-[10px] tabular-nums"
                    >
                      {selected.length}
                    </Badge>
                  )}
                  {isActive && (
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-t" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 主体：左树 + 右表 */}
        <div className="flex-1 flex min-h-0">
          {/* 左侧分类树（仅在"物料信息"tab 显示） */}
          {tab === "all" && (
            <div className="w-[280px] shrink-0 border-r flex flex-col bg-muted/20">
              <div className="p-3 border-b space-y-2 shrink-0">
                <div className="text-xs font-medium text-muted-foreground">模糊查询</div>
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      value={categoryKeyword}
                      onChange={(e) => setCategoryKeyword(e.target.value)}
                      placeholder="分类编号、分类名称、标签"
                      className="pl-7 h-8 text-xs"
                    />
                  </div>
                  <Button size="sm" className="h-8 px-3">
                    查询
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-1.5">
                {visibleTree.map((node) => (
                  <CategoryTreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    selectedId={selectedCategory}
                    onSelect={(id) => {
                      setSelectedCategory(id)
                      setPage(1)
                    }}
                    expanded={expandedNodes}
                    onToggle={toggleNode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 右侧：表格 */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* 筛选条 */}
            <div className="p-3 border-b shrink-0 bg-muted/20">
              <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto] gap-2 items-center">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  物料信息
                </span>
                <Input
                  value={filterCode}
                  onChange={(e) => {
                    setFilterCode(e.target.value)
                    setPage(1)
                  }}
                  placeholder="编号"
                  className="h-8 text-xs"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  名称
                </span>
                <Input
                  value={filterName}
                  onChange={(e) => {
                    setFilterName(e.target.value)
                    setPage(1)
                  }}
                  placeholder="名称、别名"
                  className="h-8 text-xs"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  规格型号
                </span>
                <Input
                  value={filterSpec}
                  onChange={(e) => {
                    setFilterSpec(e.target.value)
                    setPage(1)
                  }}
                  placeholder="规格型号"
                  className="h-8 text-xs"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  标签
                </span>
                <Input
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  placeholder="标签"
                  className="h-8 text-xs"
                />
                <Button size="sm" className="h-8 px-3">
                  查询
                </Button>
              </div>
            </div>

            {/* 表格 */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/40 z-10">
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allOnPagePicked}
                        onCheckedChange={toggleAllOnPage}
                      />
                    </TableHead>
                    <TableHead className="w-[180px]">分类编号-物料编号</TableHead>
                    <TableHead>物料名称</TableHead>
                    <TableHead className="w-[140px]">规格型号</TableHead>
                    <TableHead className="w-[100px]">计量单位</TableHead>
                    <TableHead className="w-[110px]">辅助计量单位</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-sm text-muted-foreground"
                      >
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageData.map((m) => {
                      const picked = isPicked(m.id)
                      return (
                        <TableRow
                          key={m.id}
                          className={cn(
                            "cursor-pointer",
                            picked && "bg-primary/5 hover:bg-primary/10",
                          )}
                          onClick={() => togglePick(m)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={picked}
                              onCheckedChange={() => togglePick(m)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {m.id}
                          </TableCell>
                          <TableCell className="text-sm">{m.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {m.spec}
                          </TableCell>
                          <TableCell className="text-sm">{m.unit}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {m.auxUnit}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 分页 */}
            <div className="px-3 py-2 border-t flex items-center justify-between text-xs shrink-0 bg-muted/10">
              <span className="text-muted-foreground">
                共 <span className="text-foreground font-semibold">{totalCount}</span>{" "}
                条
              </span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">10 条/页</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                  (n) => (
                    <Button
                      key={n}
                      size="sm"
                      variant={n === page ? "default" : "outline"}
                      className="h-7 w-7 p-0"
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </Button>
                  ),
                )}
                {totalPages > 5 && (
                  <span className="text-muted-foreground">...</span>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  ›
                </Button>
                <span className="text-muted-foreground ml-1">前往</span>
                <Input className="h-7 w-12 text-xs text-center" defaultValue={page} />
                <span className="text-muted-foreground">页</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="px-5 py-3 border-t flex items-center justify-between shrink-0">
          <div className="text-xs text-muted-foreground">
            已选 <span className="text-primary font-semibold">{selected.length}</span>{" "}
            条物料
            {selected.length > 0 && (
              <Button
                variant="link"
                className="h-auto p-0 ml-2 text-xs text-destructive"
                onClick={() => setSelected([])}
              >
                清空
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button
              disabled={selected.length === 0}
              onClick={handleConfirm}
              className="bg-primary hover:bg-primary/90"
            >
              确定
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
