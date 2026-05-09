"use client"

import { EnterpriseCenter } from "../personal/enterprise-center"
import { TodoList } from "../personal/todo-list"
import { MaterialManagement } from "../shared/material-management"
import { PropertyOrderManagement } from "./property-order-management"
import { SettlementManagement } from "../shared/settlement-management"
import { ContractManagement } from "../personal/contract-management"

interface PropertyOwnerWorkbenchProps {
  subTab: string
}

export function PropertyOwnerWorkbench({ subTab }: PropertyOwnerWorkbenchProps) {
  const renderContent = () => {
    // 企业中心
    if (subTab === "enterprise") {
      return <EnterpriseCenter roleType="property" />
    }

    // 待办事项
    if (subTab.startsWith("todo-")) {
      const todoType = subTab.replace("todo-", "")
      return <TodoList activeTab={todoType} roleType="property" />
    }

    // 物资管理
    if (subTab === "material") {
      return <MaterialManagement roleType="property" />
    }

    // 订单管理
    if (subTab.startsWith("order-")) {
      const orderType = subTab.replace("order-", "")
      return <PropertyOrderManagement subTab={orderType} />
    }

    // 结算管理
    if (subTab.startsWith("settlement-")) {
      return <SettlementManagement subTab={subTab} roleType="property" />
    }

    // 合同管理
    if (subTab === "contract") {
      return <ContractManagement roleType="property" />
    }

    // 默认显示企业中心
    return <EnterpriseCenter roleType="property" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">个人工作台 - 物权单位</h1>
          <p className="text-muted-foreground">
            管理仓储承租、物资存放及托管运营业务
          </p>
        </div>
      </div>
      {renderContent()}
    </div>
  )
}
