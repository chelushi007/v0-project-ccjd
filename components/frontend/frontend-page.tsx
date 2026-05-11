"use client"

import { HeroBanner } from "./hero-banner"
import { SearchEngine } from "./search-engine"
import { DemandPublish } from "./demand-publish"
import { SmartMatch } from "./smart-match"
import { WarehouseMap } from "./warehouse-map"
import { WarehouseOpportunity } from "./warehouse-opportunity"
import { PlatformRecommend } from "./platform-recommend"
import { TransactionNotice } from "./transaction-notice"

export function FrontendPage() {
  return (
    <div className="space-y-8">
      {/* Banner轮播图 */}
      <HeroBanner />

      {/* 搜索引擎 */}
      <SearchEngine />

      {/* 需求发布 + 智能匹配 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DemandPublish />
        <SmartMatch />
      </div>

      {/* 仓储地图 */}
      <WarehouseMap />

      {/* 仓储商机 */}
      <WarehouseOpportunity />

      {/* 平台推荐 */}
      <PlatformRecommend />

      {/* 成交公告 */}
      <TransactionNotice />

      {/* 页脚 */}
      <footer className="py-8 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>提供专业的仓储资源服务，助力物资循环利用</p>
        </div>
      </footer>
    </div>
  )
}
