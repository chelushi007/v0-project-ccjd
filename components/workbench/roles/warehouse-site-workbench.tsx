"use client"

import { EnterpriseCenter } from "../personal/enterprise-center"
import { TodoList } from "../personal/todo-list"
import { WarehouseInfo } from "../personal/warehouse-info"
import { MaterialManagement } from "../shared/material-management"
import { WarehouseOrderManagement } from "./warehouse-order-management"
import { SettlementManagement } from "../shared/settlement-management"
import { ContractManagement } from "../personal/contract-management"

interface WarehouseSiteWorkbenchProps {
  subTab: string
}

export function WarehouseSiteWorkbench({ subTab }: WarehouseSiteWorkbenchProps) {
  const renderContent = () => {
    // 企业中心
    if (subTab === "enterprise") {
      return <EnterpriseCenter roleType="warehouse-site" />
    }

    // 待办事项
    if (subTab.startsWith("todo-")) {
      const todoType = subTab.replace("todo-", "")
      return <TodoList activeTab={todoType} roleType="warehouse-site" />
    }

    // 仓储信息管理
    if (subTab === "warehouse-info") {
      return <WarehouseInfo roleType="warehouse-site" />
    }

    // 物资管理
    if (subTab === "material") {
      return <MaterialManagement roleType="warehouse-site" />
    }

    // 订单管理
    if (subTab.startsWith("order-")) {
      const orderType = subTab.replace("order-", "")
      return <WarehouseOrderManagement subTab={orderType} roleType="warehouse-site" />
    }

    // 结算管理
    if (subTab.startsWith("settlement-")) {
      return <SettlementManagement subTab={subTab} roleType="warehouse-site" />
    }

    // 合同管理
    if (subTab === "contract") {
      return <ContractManagement roleType="warehouse-site" />
    }

    // 默认显示企业中心
    return <EnterpriseCenter roleType="warehouse-site" />
  }

  return (
    <div>
      {renderContent()}
    </div>
  )
}
