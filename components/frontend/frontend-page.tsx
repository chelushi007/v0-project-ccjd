"use client"

import { HeroBanner } from "./hero-banner"
import { SearchEngine } from "./search-engine"
import { DemandPublish } from "./demand-publish"
import { SmartMatch } from "./smart-match"
import { WarehouseMap } from "./warehouse-map"
import { WarehouseOpportunity } from "./warehouse-opportunity"
import { MaterialRecommend } from "./material-recommend"
import { PlatformRecommend } from "./platform-recommend"
import { TiejianWarehouse } from "./tiejian-warehouse"
import { HotSites } from "./hot-sites"
import { FeaturedTransport } from "./featured-transport"
import { TransactionNotice } from "./transaction-notice"

interface FrontendPageProps {
  onNavigate?: (page: string) => void
}

export function FrontendPage({ onNavigate }: FrontendPageProps) {
  return (
    <div className="space-y-8">
      {/* Banner轮播图 */}
      <HeroBanner />

      {/* 搜索引擎 */}
      <SearchEngine onNavigate={onNavigate} />

      {/* 需求发布 + 智能推荐 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DemandPublish onNavigate={onNavigate} />
        <SmartMatch onNavigate={onNavigate} />
      </div>

      {/* 仓储地图 */}
      <WarehouseMap onNavigate={onNavigate} />

      {/* 仓储商机 */}
      <WarehouseOpportunity />

      {/* 物料推荐 */}
      <MaterialRecommend />

      {/* 平台推荐 */}
      <PlatformRecommend />

      {/* 铁建仓储 */}
      <TiejianWarehouse />

      {/* 热门站点 */}
      <HotSites />

      {/* 精选专运单位 */}
      <FeaturedTransport />

      {/* 成交公告 */}
      <TransactionNotice />

      {/* 页脚 */}
      <footer className="py-8 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>提供专业的仓储资源服务，助力物料循环利用</p>
        </div>
      </footer>
    </div>
  )
}
