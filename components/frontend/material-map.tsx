"use client"

import { useMemo, useState } from "react"
import {
  ArrowRight,
  Boxes,
  Building2,
  Package,
  Maximize2,
  ShieldCheck,
  Cog,
  TrainTrack,
  Layers,
  Home as HomeIcon,
  Puzzle,
  Cable,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MaterialMapProps {
  onNavigate?: (page: string) => void
}

// 中国地图底图（与仓储地图共用素材）
const CHINA_MAP_IMG =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E4%B8%8B%E8%BD%BD-pWQJMDERqh5FaOT1WHhzsw5iTgUNnG.png"

// 省份近似中心（百分比）—— 与仓储地图保持一致
const PROVINCE_CENTER_PCT: Record<string, { x: number; y: number }> = {
  北京市: { x: 67.5, y: 31 },
  天津市: { x: 69.5, y: 33 },
  上海市: { x: 78, y: 51 },
  重庆市: { x: 55, y: 55 },
  河北省: { x: 66, y: 33 },
  山西省: { x: 62, y: 37 },
  辽宁省: { x: 76, y: 26 },
  吉林省: { x: 80, y: 21 },
  黑龙江省: { x: 78, y: 13 },
  江苏省: { x: 75, y: 47 },
  浙江省: { x: 76, y: 55 },
  安徽省: { x: 70, y: 49 },
  福建省: { x: 72, y: 63 },
  江西省: { x: 67, y: 60 },
  山东省: { x: 70, y: 39 },
  河南省: { x: 64, y: 45 },
  湖北省: { x: 62, y: 52 },
  湖南省: { x: 60, y: 60 },
  广东省: { x: 64, y: 70 },
  海南省: { x: 60, y: 80 },
  四川省: { x: 49, y: 55 },
  贵州省: { x: 54, y: 64 },
  云南省: { x: 46, y: 68 },
  陕西省: { x: 57, y: 45 },
  甘肃省: { x: 48, y: 41 },
  青海省: { x: 38, y: 43 },
  内蒙古自治区: { x: 55, y: 24 },
  广西壮族自治区: { x: 56, y: 70 },
  西藏自治区: { x: 25, y: 53 },
  宁夏回族自治区: { x: 53, y: 39 },
  新疆维吾尔自治区: { x: 20, y: 30 },
}

// 物资分类（左侧菜单）：全部 + 8 大类 + 电线电缆 + 其他材料
type CategoryId =
  | "all"
  | "template"
  | "support"
  | "section"
  | "rail"
  | "scaffold"
  | "house"
  | "assembly"
  | "cable"
  | "other"

const categories: { id: CategoryId; label: string; icon: React.ElementType; tone: string }[] = [
  { id: "all", label: "全部物资", icon: Boxes, tone: "text-primary" },
  { id: "template", label: "模板类", icon: Layers, tone: "text-amber-600" },
  { id: "support", label: "支护类", icon: ShieldCheck, tone: "text-emerald-600" },
  { id: "section", label: "型材类", icon: Cog, tone: "text-sky-600" },
  { id: "rail", label: "轨道类", icon: TrainTrack, tone: "text-rose-600" },
  { id: "scaffold", label: "脚手架类", icon: Wrench, tone: "text-orange-600" },
  { id: "house", label: "房屋建筑类", icon: HomeIcon, tone: "text-indigo-600" },
  { id: "assembly", label: "拼装类", icon: Puzzle, tone: "text-violet-600" },
  { id: "cable", label: "电线电缆", icon: Cable, tone: "text-yellow-600" },
  { id: "other", label: "其他材料", icon: Package, tone: "text-slate-600" },
]

type ProvinceMatrix = Record<CategoryId, { rent: number; sale: number; warehouses: number; deal: number }>

// 各省份各分类需求矩阵（rent + sale = 总需求；deal 单位：万元）
const provinceMatrix: Record<string, ProvinceMatrix> = {
  广东省: {
    all: { rent: 168, sale: 142, warehouses: 23, deal: 18650 },
    template: { rent: 38, sale: 22, warehouses: 18, deal: 3120 },
    support: { rent: 32, sale: 18, warehouses: 16, deal: 2860 },
    section: { rent: 24, sale: 28, warehouses: 14, deal: 2540 },
    rail: { rent: 12, sale: 10, warehouses: 8, deal: 1820 },
    scaffold: { rent: 28, sale: 20, warehouses: 17, deal: 2380 },
    house: { rent: 14, sale: 16, warehouses: 9, deal: 1960 },
    assembly: { rent: 8, sale: 12, warehouses: 6, deal: 1280 },
    cable: { rent: 6, sale: 10, warehouses: 5, deal: 1420 },
    other: { rent: 6, sale: 6, warehouses: 5, deal: 1270 },
  },
  北京市: {
    all: { rent: 142, sale: 118, warehouses: 35, deal: 22680 },
    template: { rent: 28, sale: 18, warehouses: 22, deal: 3680 },
    support: { rent: 24, sale: 14, warehouses: 18, deal: 2940 },
    section: { rent: 22, sale: 24, warehouses: 16, deal: 2820 },
    rail: { rent: 18, sale: 14, warehouses: 12, deal: 2680 },
    scaffold: { rent: 22, sale: 16, warehouses: 18, deal: 2540 },
    house: { rent: 12, sale: 14, warehouses: 8, deal: 2180 },
    assembly: { rent: 8, sale: 8, warehouses: 6, deal: 1820 },
    cable: { rent: 4, sale: 6, warehouses: 4, deal: 1480 },
    other: { rent: 4, sale: 4, warehouses: 4, deal: 2540 },
  },
  上海市: {
    all: { rent: 128, sale: 108, warehouses: 30, deal: 19840 },
    template: { rent: 24, sale: 16, warehouses: 18, deal: 3120 },
    support: { rent: 22, sale: 14, warehouses: 16, deal: 2680 },
    section: { rent: 20, sale: 22, warehouses: 14, deal: 2540 },
    rail: { rent: 14, sale: 12, warehouses: 10, deal: 2320 },
    scaffold: { rent: 20, sale: 14, warehouses: 16, deal: 2180 },
    house: { rent: 10, sale: 14, warehouses: 8, deal: 1960 },
    assembly: { rent: 8, sale: 8, warehouses: 6, deal: 1680 },
    cable: { rent: 6, sale: 4, warehouses: 4, deal: 1280 },
    other: { rent: 4, sale: 4, warehouses: 4, deal: 2080 },
  },
  江苏省: {
    all: { rent: 156, sale: 132, warehouses: 28, deal: 15320 },
    template: { rent: 32, sale: 22, warehouses: 18, deal: 2680 },
    support: { rent: 28, sale: 18, warehouses: 16, deal: 2380 },
    section: { rent: 22, sale: 26, warehouses: 14, deal: 2120 },
    rail: { rent: 14, sale: 12, warehouses: 10, deal: 1820 },
    scaffold: { rent: 24, sale: 18, warehouses: 16, deal: 1980 },
    house: { rent: 14, sale: 12, warehouses: 8, deal: 1480 },
    assembly: { rent: 10, sale: 10, warehouses: 6, deal: 1180 },
    cable: { rent: 6, sale: 8, warehouses: 4, deal: 920 },
    other: { rent: 6, sale: 6, warehouses: 4, deal: 760 },
  },
  浙江省: {
    all: { rent: 124, sale: 96, warehouses: 22, deal: 11280 },
    template: { rent: 24, sale: 16, warehouses: 14, deal: 2120 },
    support: { rent: 22, sale: 12, warehouses: 12, deal: 1820 },
    section: { rent: 18, sale: 20, warehouses: 10, deal: 1620 },
    rail: { rent: 10, sale: 8, warehouses: 7, deal: 1380 },
    scaffold: { rent: 20, sale: 14, warehouses: 12, deal: 1480 },
    house: { rent: 12, sale: 10, warehouses: 6, deal: 1080 },
    assembly: { rent: 8, sale: 8, warehouses: 5, deal: 880 },
    cable: { rent: 6, sale: 4, warehouses: 4, deal: 580 },
    other: { rent: 4, sale: 4, warehouses: 3, deal: 320 },
  },
  山东省: {
    all: { rent: 134, sale: 112, warehouses: 25, deal: 12450 },
    template: { rent: 26, sale: 18, warehouses: 16, deal: 2380 },
    support: { rent: 22, sale: 14, warehouses: 14, deal: 1980 },
    section: { rent: 18, sale: 22, warehouses: 12, deal: 1820 },
    rail: { rent: 12, sale: 10, warehouses: 8, deal: 1480 },
    scaffold: { rent: 22, sale: 16, warehouses: 14, deal: 1620 },
    house: { rent: 14, sale: 12, warehouses: 7, deal: 1180 },
    assembly: { rent: 8, sale: 10, warehouses: 5, deal: 980 },
    cable: { rent: 6, sale: 6, warehouses: 4, deal: 580 },
    other: { rent: 6, sale: 4, warehouses: 3, deal: 432 },
  },
  河南省: {
    all: { rent: 108, sale: 86, warehouses: 20, deal: 9650 },
    template: { rent: 22, sale: 12, warehouses: 12, deal: 1680 },
    support: { rent: 18, sale: 12, warehouses: 11, deal: 1480 },
    section: { rent: 14, sale: 16, warehouses: 9, deal: 1380 },
    rail: { rent: 10, sale: 8, warehouses: 7, deal: 1180 },
    scaffold: { rent: 18, sale: 12, warehouses: 11, deal: 1280 },
    house: { rent: 10, sale: 10, warehouses: 6, deal: 980 },
    assembly: { rent: 6, sale: 8, warehouses: 4, deal: 780 },
    cable: { rent: 6, sale: 4, warehouses: 3, deal: 480 },
    other: { rent: 4, sale: 4, warehouses: 3, deal: 412 },
  },
  湖北省: {
    all: { rent: 102, sale: 84, warehouses: 18, deal: 7820 },
    template: { rent: 20, sale: 14, warehouses: 11, deal: 1380 },
    support: { rent: 18, sale: 10, warehouses: 10, deal: 1280 },
    section: { rent: 14, sale: 18, warehouses: 9, deal: 1180 },
    rail: { rent: 10, sale: 8, warehouses: 6, deal: 980 },
    scaffold: { rent: 18, sale: 12, warehouses: 10, deal: 1080 },
    house: { rent: 10, sale: 8, warehouses: 5, deal: 780 },
    assembly: { rent: 6, sale: 6, warehouses: 4, deal: 580 },
    cable: { rent: 4, sale: 4, warehouses: 3, deal: 320 },
    other: { rent: 2, sale: 4, warehouses: 2, deal: 242 },
  },
  四川省: {
    all: { rent: 96, sale: 78, warehouses: 21, deal: 9420 },
    template: { rent: 18, sale: 12, warehouses: 13, deal: 1680 },
    support: { rent: 16, sale: 10, warehouses: 11, deal: 1480 },
    section: { rent: 14, sale: 16, warehouses: 10, deal: 1380 },
    rail: { rent: 8, sale: 6, warehouses: 6, deal: 1180 },
    scaffold: { rent: 16, sale: 12, warehouses: 11, deal: 1180 },
    house: { rent: 10, sale: 8, warehouses: 6, deal: 880 },
    assembly: { rent: 6, sale: 6, warehouses: 4, deal: 680 },
    cable: { rent: 4, sale: 4, warehouses: 3, deal: 480 },
    other: { rent: 4, sale: 4, warehouses: 3, deal: 482 },
  },
  福建省: {
    all: { rent: 78, sale: 64, warehouses: 15, deal: 6420 },
    template: { rent: 14, sale: 10, warehouses: 9, deal: 1180 },
    support: { rent: 12, sale: 8, warehouses: 8, deal: 980 },
    section: { rent: 10, sale: 12, warehouses: 7, deal: 880 },
    rail: { rent: 6, sale: 6, warehouses: 5, deal: 780 },
    scaffold: { rent: 14, sale: 10, warehouses: 8, deal: 880 },
    house: { rent: 8, sale: 6, warehouses: 4, deal: 680 },
    assembly: { rent: 6, sale: 4, warehouses: 3, deal: 480 },
    cable: { rent: 4, sale: 4, warehouses: 3, deal: 280 },
    other: { rent: 4, sale: 4, warehouses: 2, deal: 282 },
  },
  重庆市: {
    all: { rent: 88, sale: 72, warehouses: 19, deal: 7280 },
    template: { rent: 16, sale: 12, warehouses: 11, deal: 1280 },
    support: { rent: 14, sale: 10, warehouses: 10, deal: 1080 },
    section: { rent: 12, sale: 14, warehouses: 9, deal: 980 },
    rail: { rent: 8, sale: 6, warehouses: 5, deal: 880 },
    scaffold: { rent: 16, sale: 12, warehouses: 10, deal: 1080 },
    house: { rent: 8, sale: 8, warehouses: 5, deal: 680 },
    assembly: { rent: 6, sale: 4, warehouses: 4, deal: 580 },
    cable: { rent: 4, sale: 4, warehouses: 3, deal: 380 },
    other: { rent: 4, sale: 2, warehouses: 2, deal: 342 },
  },
  湖南省: { all: { rent: 72, sale: 58, warehouses: 14, deal: 5180 }, template: { rent: 14, sale: 10, warehouses: 8, deal: 980 }, support: { rent: 12, sale: 8, warehouses: 7, deal: 780 }, section: { rent: 10, sale: 12, warehouses: 6, deal: 720 }, rail: { rent: 6, sale: 4, warehouses: 4, deal: 580 }, scaffold: { rent: 12, sale: 8, warehouses: 7, deal: 680 }, house: { rent: 8, sale: 6, warehouses: 4, deal: 480 }, assembly: { rent: 4, sale: 4, warehouses: 3, deal: 380 }, cable: { rent: 4, sale: 4, warehouses: 2, deal: 280 }, other: { rent: 2, sale: 2, warehouses: 2, deal: 302 } },
  江西省: { all: { rent: 54, sale: 42, warehouses: 10, deal: 3210 }, template: { rent: 10, sale: 8, warehouses: 6, deal: 580 }, support: { rent: 8, sale: 6, warehouses: 5, deal: 480 }, section: { rent: 8, sale: 8, warehouses: 5, deal: 440 }, rail: { rent: 4, sale: 4, warehouses: 3, deal: 380 }, scaffold: { rent: 10, sale: 6, warehouses: 6, deal: 480 }, house: { rent: 6, sale: 4, warehouses: 3, deal: 320 }, assembly: { rent: 4, sale: 2, warehouses: 2, deal: 220 }, cable: { rent: 2, sale: 2, warehouses: 1, deal: 180 }, other: { rent: 2, sale: 2, warehouses: 1, deal: 130 } },
  辽宁省: { all: { rent: 82, sale: 64, warehouses: 18, deal: 6850 }, template: { rent: 16, sale: 10, warehouses: 11, deal: 1180 }, support: { rent: 12, sale: 8, warehouses: 10, deal: 980 }, section: { rent: 12, sale: 14, warehouses: 8, deal: 920 }, rail: { rent: 6, sale: 6, warehouses: 5, deal: 780 }, scaffold: { rent: 14, sale: 10, warehouses: 10, deal: 880 }, house: { rent: 8, sale: 6, warehouses: 4, deal: 680 }, assembly: { rent: 6, sale: 4, warehouses: 3, deal: 480 }, cable: { rent: 4, sale: 4, warehouses: 3, deal: 380 }, other: { rent: 4, sale: 2, warehouses: 2, deal: 572 } },
  天津市: { all: { rent: 64, sale: 52, warehouses: 16, deal: 5680 }, template: { rent: 12, sale: 8, warehouses: 9, deal: 980 }, support: { rent: 10, sale: 6, warehouses: 8, deal: 880 }, section: { rent: 8, sale: 10, warehouses: 7, deal: 780 }, rail: { rent: 6, sale: 4, warehouses: 5, deal: 680 }, scaffold: { rent: 10, sale: 8, warehouses: 8, deal: 780 }, house: { rent: 6, sale: 6, warehouses: 4, deal: 580 }, assembly: { rent: 4, sale: 4, warehouses: 3, deal: 480 }, cable: { rent: 4, sale: 4, warehouses: 3, deal: 280 }, other: { rent: 4, sale: 2, warehouses: 2, deal: 442 } },
  河北省: { all: { rent: 96, sale: 78, warehouses: 22, deal: 8920 }, template: { rent: 18, sale: 14, warehouses: 14, deal: 1680 }, support: { rent: 16, sale: 10, warehouses: 12, deal: 1380 }, section: { rent: 12, sale: 14, warehouses: 10, deal: 1180 }, rail: { rent: 8, sale: 6, warehouses: 6, deal: 980 }, scaffold: { rent: 16, sale: 12, warehouses: 12, deal: 1180 }, house: { rent: 10, sale: 8, warehouses: 6, deal: 880 }, assembly: { rent: 6, sale: 6, warehouses: 4, deal: 680 }, cable: { rent: 4, sale: 4, warehouses: 3, deal: 480 }, other: { rent: 6, sale: 4, warehouses: 3, deal: 482 } },
  陕西省: { all: { rent: 60, sale: 48, warehouses: 15, deal: 5180 }, template: { rent: 10, sale: 8, warehouses: 9, deal: 880 }, support: { rent: 8, sale: 6, warehouses: 8, deal: 780 }, section: { rent: 8, sale: 10, warehouses: 6, deal: 720 }, rail: { rent: 4, sale: 4, warehouses: 4, deal: 580 }, scaffold: { rent: 12, sale: 8, warehouses: 9, deal: 780 }, house: { rent: 6, sale: 4, warehouses: 4, deal: 480 }, assembly: { rent: 4, sale: 4, warehouses: 3, deal: 380 }, cable: { rent: 4, sale: 2, warehouses: 2, deal: 280 }, other: { rent: 4, sale: 2, warehouses: 2, deal: 302 } },
  广西壮族自治区: { all: { rent: 48, sale: 38, warehouses: 12, deal: 3820 }, template: { rent: 8, sale: 6, warehouses: 7, deal: 680 }, support: { rent: 6, sale: 4, warehouses: 6, deal: 580 }, section: { rent: 6, sale: 8, warehouses: 5, deal: 520 }, rail: { rent: 4, sale: 4, warehouses: 3, deal: 480 }, scaffold: { rent: 8, sale: 6, warehouses: 7, deal: 580 }, house: { rent: 6, sale: 4, warehouses: 3, deal: 380 }, assembly: { rent: 4, sale: 2, warehouses: 2, deal: 280 }, cable: { rent: 4, sale: 2, warehouses: 2, deal: 180 }, other: { rent: 2, sale: 2, warehouses: 1, deal: 142 } },
}

// 推荐物资条目（按分类 + 省份联动展示）
type MaterialItem = {
  id: number
  name: string
  province: string
  warehouseName: string
  category: Exclude<CategoryId, "all">
  type: "rent" | "sale"
  price: string
  unit: string
  spec: string
  status: string
}

const materialItems: MaterialItem[] = [
  { id: 1, name: "组合钢模板 65系列 9成新 现货 1500套", province: "广东省", warehouseName: "深圳前海综合物流仓", category: "template", type: "rent", price: "0.32", unit: "元/套/天", spec: "65×100", status: "竞价中" },
  { id: 2, name: "工字钢 I20a 闲置出租 总长 800m", province: "广东省", warehouseName: "广州黄埔保税仓", category: "section", type: "rent", price: "0.18", unit: "元/m/天", spec: "I20a", status: "竞价中" },
  { id: 3, name: "盘扣式脚手架立杆 8000根 大量到货", province: "广东省", warehouseName: "东莞松山湖工程材料库", category: "scaffold", type: "rent", price: "0.06", unit: "元/根/天", spec: "Q345 60×3.0", status: "固定价" },
  { id: 4, name: "P50/P60 钢轨二手 长度 25m 共 120 根", province: "北京市", warehouseName: "北京通州轨交集料站", category: "rail", type: "sale", price: "3,820", unit: "元/吨", spec: "P50", status: "可议价" },
  { id: 5, name: "型钢支护 H400×200 重防腐 现货 240吨", province: "北京市", warehouseName: "北京大兴机械总仓", category: "support", type: "rent", price: "0.85", unit: "元/吨/天", spec: "H400×200", status: "竞价中" },
  { id: 6, name: "可拆装板房 6×3m 含空调 闲置 30套", province: "上海市", warehouseName: "上海临港装配建材仓", category: "house", type: "sale", price: "9,800", unit: "元/套", spec: "6×3m", status: "可议价" },
  { id: 7, name: "拼装式钢栈桥模块 2t/㎡ 总长 80m", province: "上海市", warehouseName: "上海浦东桥隧周转库", category: "assembly", type: "rent", price: "12.6", unit: "元/㎡/天", spec: "2t/㎡", status: "竞价中" },
  { id: 8, name: "ZRYJV22 4×95 阻燃电缆 余 3000m", province: "江苏省", warehouseName: "南京江宁电缆中心仓", category: "cable", type: "sale", price: "286", unit: "元/m", spec: "4×95mm²", status: "固定价" },
  { id: 9, name: "异形钢模板 弧形墙体 8成新", province: "江苏省", warehouseName: "苏州相城建材联合仓", category: "template", type: "sale", price: "4,250", unit: "元/吨", spec: "弧形", status: "可议价" },
  { id: 10, name: "槽钢 [16a 长度 12m 现存 60吨", province: "浙江省", warehouseName: "宁波镇海钢材集中库", category: "section", type: "rent", price: "0.16", unit: "元/m/天", spec: "[16a", status: "竞价中" },
  { id: 11, name: "脚手架横杆 1.5m 12000根 物流园直发", province: "山东省", warehouseName: "济南章丘工器具中心库", category: "scaffold", type: "sale", price: "12.8", unit: "元/根", spec: "1.5m", status: "固定价" },
  { id: 12, name: "钢便桥拼装单元 12m 6套 重型加固", province: "河南省", warehouseName: "郑州中牟轨建总仓", category: "assembly", type: "rent", price: "85", unit: "元/m/天", spec: "12m 单元", status: "竞价中" },
  { id: 13, name: "矿用工字钢支护 240根 含连接件", province: "河北省", warehouseName: "石家庄正定型钢中转仓", category: "support", type: "rent", price: "0.78", unit: "元/吨/天", spec: "I18", status: "固定价" },
  { id: 14, name: "彩钢活动板房二手 5×3m 18套", province: "湖北省", warehouseName: "武汉东西湖装配仓", category: "house", type: "sale", price: "6,800", unit: "元/套", spec: "5×3m", status: "可议价" },
  { id: 15, name: "P43 钢轨现货 共计 60 吨", province: "四川省", warehouseName: "成都青白江钢轨集料站", category: "rail", type: "rent", price: "1,260", unit: "元/吨/月", spec: "P43", status: "竞价中" },
  { id: 16, name: "塑料模板 1830×915 闲置 800张", province: "福建省", warehouseName: "福州长乐建材综合仓", category: "template", type: "sale", price: "62", unit: "元/张", spec: "18mm", status: "可议价" },
  { id: 17, name: "电焊机/发电机 轨道式 8台打包出售", province: "重庆市", warehouseName: "重庆江津机电中心仓", category: "other", type: "sale", price: "12,800", unit: "元/台", spec: "500A", status: "固定价" },
  { id: 18, name: "YJV 3×185 高压电缆 闲置 1200m", province: "湖南省", warehouseName: "长沙望城电力周转库", category: "cable", type: "rent", price: "0.85", unit: "元/m/天", spec: "3×185", status: "竞价中" },
  { id: 19, name: "圆钢 Φ32 闲置 80 吨 出租可分单", province: "辽宁省", warehouseName: "沈阳浑南钢材联合仓", category: "section", type: "rent", price: "0.20", unit: "元/m/天", spec: "Φ32", status: "竞价中" },
  { id: 20, name: "拼装钢围檩 2t/m 现货 400m", province: "江西省", warehouseName: "南昌新建桥隧物资仓", category: "assembly", type: "rent", price: "32", unit: "元/m/天", spec: "2t/m", status: "竞价中" },
  { id: 21, name: "盘扣立杆 60×2.75 现货 2万根", province: "广西壮族自治区", warehouseName: "南宁武鸣脚手架中心库", category: "scaffold", type: "rent", price: "0.05", unit: "元/根/天", spec: "60×2.75", status: "固定价" },
  { id: 22, name: "其他建材打包 含护栏/网片/夹具等", province: "陕西省", warehouseName: "西安灞桥综合材料仓", category: "other", type: "sale", price: "面议", unit: "整批", spec: "混合", status: "可议价" },
  { id: 23, name: "异形支护构件 弧形/角部 现货", province: "天津市", warehouseName: "天津滨海支护构件仓", category: "support", type: "rent", price: "0.92", unit: "元/吨/天", spec: "异形", status: "竞价中" },
  { id: 24, name: "钢板房地基模块 1.5×1.5m 60块", province: "广东省", warehouseName: "佛山顺德装配地基仓", category: "house", type: "rent", price: "8", unit: "元/块/天", spec: "1.5×1.5m", status: "竞价中" },
]

// 颜色梯度（按全部物资总需求量分档）
function getHeatColor(value: number, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return "#16a34a"
  if (isHovered) return "#22c55e"
  if (value >= 240) return "#15803d"
  if (value >= 160) return "#22c55e"
  if (value >= 100) return "#4ade80"
  if (value >= 60) return "#86efac"
  if (value > 0) return "#dcfce7"
  return "#f1f5f9"
}

const heatBins = [
  { color: "#dcfce7", label: "<60" },
  { color: "#86efac", label: "60-99" },
  { color: "#4ade80", label: "100-159" },
  { color: "#22c55e", label: "160-239" },
  { color: "#15803d", label: "≥240" },
]

export function MaterialMap({ onNavigate }: MaterialMapProps) {
  const [activeCat, setActiveCat] = useState<CategoryId>("all")
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)

  // 计算左侧分类各自总需求（用于菜单徽标）
  const categoryTotals = useMemo(() => {
    const totals: Record<CategoryId, number> = {
      all: 0, template: 0, support: 0, section: 0, rail: 0, scaffold: 0, house: 0, assembly: 0, cable: 0, other: 0,
    }
    Object.values(provinceMatrix).forEach((m) => {
      ;(Object.keys(m) as CategoryId[]).forEach((k) => {
        totals[k] += m[k].rent + m[k].sale
      })
    })
    return totals
  }, [])

  // 全国汇总（基于当前分类）
  const totals = useMemo(() => {
    let rent = 0, sale = 0, warehouses = 0, deal = 0
    Object.values(provinceMatrix).forEach((m) => {
      const c = m[activeCat]
      rent += c.rent; sale += c.sale; warehouses += c.warehouses; deal += c.deal
    })
    return { rent, sale, warehouses, deal }
  }, [activeCat])

  const displayProvince = hoveredProvince || selectedProvince
  const displayMetrics = displayProvince ? provinceMatrix[displayProvince]?.[activeCat] : null

  // 右侧推荐：按 分类 × 省份 联动过滤
  const recommendList = useMemo(() => {
    return materialItems.filter((it) => {
      const okCat = activeCat === "all" ? true : it.category === activeCat
      const okProv = displayProvince ? it.province === displayProvince : true
      return okCat && okProv
    })
  }, [activeCat, displayProvince])

  return (
    <div className="w-full">
      <div className="grid grid-cols-[minmax(180px,18%)_minmax(0,1fr)_minmax(240px,24%)] gap-0 h-[460px]">
        {/* 左侧：物资分类导航 */}
        <div className="bg-[#0f2742] text-white rounded-l-lg p-3 flex flex-col h-full overflow-hidden">
          <h3 className="text-[#86efac] font-medium mb-3 text-sm px-1">物资分类</h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded">
            {categories.map((c) => {
              const Icon = c.icon
              const isActive = activeCat === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs transition-colors",
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      isActive ? "text-[#86efac]" : "text-white/60",
                    )}
                  />
                  <span className="flex-1 text-left truncate">{c.label}</span>
                  <span
                    className={cn(
                      "text-[10px] tabular-nums",
                      isActive ? "text-[#86efac]" : "text-white/50",
                    )}
                  >
                    {categoryTotals[c.id].toLocaleString()}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="pt-3 border-t border-white/15 mt-3 px-1">
            <p className="text-[11px] text-white/60 leading-relaxed">
              鼠标悬停地图省份可查看出租/出售需求与关联仓储
            </p>
          </div>
        </div>

        {/* 中间：地图 */}
        <div className="bg-[#eef9f1] border-y border-border relative h-full overflow-hidden">
          {/* 右上角入口：物资地图（指向物资列表） */}
          <div className="absolute top-2 right-2 z-30">
            <Button
              variant="secondary"
              size="sm"
              className="h-7 px-2.5 text-xs bg-white/95 hover:bg-white shadow-sm border border-border"
              onClick={() => onNavigate?.("material-list")}
            >
              物资地图
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* 图例 */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 border border-border rounded-md px-3 py-2 shadow-sm">
            <div className="text-[11px] text-muted-foreground mb-1.5">
              {categories.find((c) => c.id === activeCat)?.label}总需求（条）
            </div>
            <div className="flex items-center gap-2">
              {heatBins.map((bin) => (
                <div key={bin.label} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm border border-black/5" style={{ backgroundColor: bin.color }} />
                  <span className="text-[10px] text-foreground/70">{bin.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 中国地图底图 + 圆点 */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-full max-h-full aspect-[785/645] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CHINA_MAP_IMG || "/placeholder.svg"}
                alt="中国地图"
                className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none opacity-90"
                draggable={false}
              />
              {Object.entries(PROVINCE_CENTER_PCT).map(([province, pos]) => {
                const m = provinceMatrix[province]?.[activeCat]
                if (!m) return null
                const total = m.rent + m.sale
                const isSelected = selectedProvince === province
                const isHovered = hoveredProvince === province
                const fill = getHeatColor(total, isSelected, isHovered)
                const maxValue = activeCat === "all" ? 320 : 80
                const ratio = Math.min(1, total / maxValue)
                const size = 12 + ratio * 26
                return (
                  <button
                    key={province}
                    onMouseEnter={() => setHoveredProvince(province)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => setSelectedProvince((prev) => (prev === province ? null : province))}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all hover:scale-110",
                      isSelected && "ring-2 ring-emerald-600 ring-offset-1 z-10",
                    )}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: size,
                      height: size,
                      backgroundColor: fill,
                    }}
                    title={`${province} · 总需求 ${total} 条`}
                  >
                    {total > 0 && size >= 24 && (
                      <span className="text-[10px] font-semibold text-white leading-none drop-shadow">
                        {total}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 省份信息卡片 */}
          {displayProvince && displayMetrics && (
            <div className="absolute top-12 right-3 bg-white/97 border border-border rounded-lg shadow-lg p-4 min-w-[230px] z-20 pointer-events-none">
              <h4 className="font-bold text-base mb-1 text-foreground flex items-center gap-2">
                {displayProvince}
                <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0">
                  {categories.find((c) => c.id === activeCat)?.label}
                </Badge>
              </h4>
              <div className="space-y-2 text-sm mt-3">
                <DetailRow label="出租需求" value={`${displayMetrics.rent.toLocaleString()} 条`} highlight tone="emerald" />
                <DetailRow label="出售需求" value={`${displayMetrics.sale.toLocaleString()} 条`} highlight tone="amber" />
                <DetailRow label="关联仓储数" value={`${displayMetrics.warehouses.toLocaleString()} 座`} />
                <DetailRow label="成交金额" value={`${displayMetrics.deal.toLocaleString()} 万元`} highlight tone="primary" />
              </div>
            </div>
          )}
        </div>

        {/* 右侧：推荐物资（联动 分类 × 地区） */}
        <Card className="rounded-l-none rounded-r-lg border-l-0 h-full flex flex-col">
          <CardContent className="p-3 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
              <div className="flex items-center gap-1.5 min-w-0">
                <Boxes className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-foreground truncate">
                  {displayProvince || "全国"}·{categories.find((c) => c.id === activeCat)?.label}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">共 {recommendList.length} 条</span>
            </div>

            {/* 全国汇总（无地区聚焦时展示当前分类总览） */}
            {!displayProvince && (
              <div className="grid grid-cols-2 gap-1.5 mb-2 text-[10px]">
                <SummaryChip label="出租" value={totals.rent} tone="emerald" />
                <SummaryChip label="出售" value={totals.sale} tone="amber" />
                <SummaryChip label="仓储" value={totals.warehouses} tone="sky" />
                <SummaryChip label="成交(万)" value={Math.round(totals.deal / 100) / 10 + "k"} tone="primary" />
              </div>
            )}

            <div className="flex-1 space-y-2 overflow-auto">
              {recommendList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                  <Package className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs">暂无匹配的物资推荐</p>
                  <p className="text-[10px] mt-1 opacity-70">尝试切换分类或地区</p>
                </div>
              ) : (
                recommendList.slice(0, 3).map((it) => (
                  <div
                    key={it.id}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-md hover:border-emerald-500/40 transition-all cursor-pointer bg-card"
                    onClick={() => onNavigate?.("material-detail")}
                  >
                    <div className="flex">
                      <div className="w-20 h-20 bg-muted relative flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground/30" />
                        </div>
                        <Badge
                          className={cn(
                            "absolute top-1 left-1 text-[10px] text-white px-1 py-0",
                            it.type === "rent" ? "bg-emerald-500" : "bg-amber-500",
                          )}
                        >
                          {it.type === "rent" ? "出租" : "出售"}
                        </Badge>
                      </div>
                      <div className="flex-1 p-2 min-w-0">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-emerald-700 font-bold text-sm">{it.price}</span>
                          <span className="text-[10px] text-muted-foreground">{it.unit}</span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-emerald-100 text-emerald-700 px-1 py-0 ml-auto"
                          >
                            {it.status}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-foreground line-clamp-1 leading-tight font-medium">
                          {it.name}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                          <Maximize2 className="w-3 h-3 shrink-0" />
                          <span className="shrink-0">{it.spec}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                          <Building2 className="w-3 h-3 shrink-0 text-emerald-600" />
                          <span className="truncate" title={it.warehouseName}>
                            {it.warehouseName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 mt-auto border-t border-border">
              <Button
                variant="link"
                className="w-full text-emerald-700 text-xs h-6"
                onClick={() => onNavigate?.("material-list")}
              >
                查看更多
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  highlight,
  tone = "primary",
}: {
  label: string
  value: string
  highlight?: boolean
  tone?: "primary" | "emerald" | "amber"
}) {
  const toneCls =
    tone === "emerald"
      ? "text-emerald-700"
      : tone === "amber"
        ? "text-amber-700"
        : "text-primary"
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold tabular-nums", highlight ? toneCls : "text-foreground")}>{value}</span>
    </div>
  )
}

function SummaryChip({
  label,
  value,
  tone,
}: {
  label: string
  value: number | string
  tone: "emerald" | "amber" | "sky" | "primary"
}) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : tone === "sky"
          ? "bg-sky-50 text-sky-700 border-sky-100"
          : "bg-primary/10 text-primary border-primary/20"
  return (
    <div className={cn("border rounded-md px-2 py-1 flex items-center justify-between", cls)}>
      <span className="opacity-75">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}
