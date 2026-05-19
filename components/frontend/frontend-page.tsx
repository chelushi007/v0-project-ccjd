"use client"

import { HeroBanner } from "./hero-banner"
import { SearchEngine } from "./search-engine"
import { DemandPublish } from "./demand-publish"
import { SmartMatch } from "./smart-match"
import { MapDistribution } from "./map-distribution"
import { WarehouseOpportunity } from "./warehouse-opportunity"
import { MaterialRecommend } from "./material-recommend"
import { TiejianWarehouse } from "./tiejian-warehouse"
import { HotSites } from "./hot-sites"
import { FeaturedTransport } from "./featured-transport"
import { TransactionNotice } from "./transaction-notice"
import { TransactionTicker } from "./transaction-ticker"

interface FrontendPageProps {
  onNavigate?: (page: string) => void
}

export function FrontendPage({ onNavigate }: FrontendPageProps) {
  return (
    <div className="space-y-8">
      {/* Banner 轮播图 */}
      <HeroBanner />

      {/* 实时成交滚动信息 */}
      <TransactionTicker />

      {/* 搜索引擎 */}
      <SearchEngine onNavigate={onNavigate} />

      {/* 需求发布 + 智能匹配 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DemandPublish onNavigate={onNavigate} />
        <SmartMatch onNavigate={onNavigate} />
      </div>

      {/* 仓储地图 / 物资地图 双 Tab */}
      <MapDistribution onNavigate={onNavigate} />

      {/* 资讯板块：仓储商机 → 铁建仓储 → 热门站点（含原平台推荐内容）→ 精选专运单位 → 闲置物资 */}
      <WarehouseOpportunity onNavigate={onNavigate} />
      <TiejianWarehouse onNavigate={onNavigate} />
      <HotSites onNavigate={onNavigate} />
      <FeaturedTransport onNavigate={onNavigate} />
      <MaterialRecommend onNavigate={onNavigate} />

      {/* 成交公告 */}
      <TransactionNotice onNavigate={onNavigate} />

      {/* 页脚 */}
      <footer className="py-8 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>提供专业的仓储资源服务，助力物资循环利用</p>
        </div>
      </footer>
    </div>
  )
}
