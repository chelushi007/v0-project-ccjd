"use client"

import { EnterpriseCenter } from "../personal/enterprise-center"
import { TodoList } from "../personal/todo-list"
import { SiteManagement } from "../shared/site-management"
import { MaterialManagement } from "../shared/material-management"
import { WarehouseOrderManagement } from "./warehouse-order-management"
import { MaterialOrderManagement } from "../shared/material-order-management"
import { SettlementManagement } from "../shared/settlement-management"
import { ContractManagement } from "../personal/contract-management"

interface TransportUnitWorkbenchProps {
  subTab: string
}

export function TransportUnitWorkbench({ subTab }: TransportUnitWorkbenchProps) {
  const renderContent = () => {
    // 企业中心
    if (subTab === "enterprise") {
      return <EnterpriseCenter roleType="transport" />
    }

    // 待办事项
    if (subTab.startsWith("todo-")) {
      const todoType = subTab.replace("todo-", "")
      return <TodoList activeTab={todoType} roleType="transport" />
    }

    // 站点管理
    if (subTab === "site") {
      return <SiteManagement />
    }

    // 物资管理
    if (subTab === "material") {
      return <MaterialManagement roleType="transport" />
    }

    // 仓储订单管理
    if (subTab.startsWith("warehouse-order-")) {
      const orderType = subTab.replace("warehouse-order-", "")
      return <WarehouseOrderManagement subTab={orderType} roleType="transport" />
    }

    // 物资订单管理
    if (subTab.startsWith("material-order-")) {
      const orderType = subTab.replace("material-order-", "")
      return <MaterialOrderManagement subTab={orderType} roleType="transport" />
    }

    // 结算管理
    if (subTab.startsWith("settlement-")) {
      return <SettlementManagement subTab={subTab} roleType="transport" />
    }

    // 合同管理
    if (subTab === "contract") {
      return <ContractManagement roleType="transport" />
    }

    // 默认显示企业中心
    return <EnterpriseCenter roleType="transport" />
  }

  return (
    <div>
      {renderContent()}
    </div>
  )
}
