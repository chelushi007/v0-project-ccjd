"use client"

import { EnterpriseCenter } from "../personal/enterprise-center"
import { TodoList } from "../personal/todo-list"
import { WarehouseInfo } from "../personal/warehouse-info"
import { MaterialManagement } from "../shared/material-management"
import { WarehouseOrderManagement } from "./warehouse-order-management"
import { SettlementManagement } from "../shared/settlement-management"
import { ContractManagement } from "../personal/contract-management"

interface WarehouseUnitWorkbenchProps {
  subTab: string
}

export function WarehouseUnitWorkbench({ subTab }: WarehouseUnitWorkbenchProps) {
  const renderContent = () => {
    // 企业中心
    if (subTab === "enterprise") {
      return <EnterpriseCenter roleType="warehouse-unit" />
    }

    // 待办事项
    if (subTab.startsWith("todo-")) {
      const todoType = subTab.replace("todo-", "")
      return <TodoList activeTab={todoType} roleType="warehouse-unit" />
    }

    // 仓储信息管理
    if (subTab === "warehouse-info") {
      return <WarehouseInfo roleType="warehouse-unit" />
    }

    // 物资管理
    if (subTab === "material") {
      return <MaterialManagement roleType="warehouse-unit" />
    }

    // 订单管理
    if (subTab.startsWith("order-")) {
      const orderType = subTab.replace("order-", "")
      return <WarehouseOrderManagement subTab={orderType} roleType="warehouse-unit" />
    }

    // 结算管理
    if (subTab.startsWith("settlement-")) {
      return <SettlementManagement subTab={subTab} roleType="warehouse-unit" />
    }

    // 合同管理
    if (subTab === "contract") {
      return <ContractManagement roleType="warehouse-unit" />
    }

    // 默认显示企业中心
    return <EnterpriseCenter roleType="warehouse-unit" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">个人工作台 - 仓储单位</h1>
          <p className="text-muted-foreground">
            管理仓储出租、委托出租及物资存放业务
          </p>
        </div>
      </div>
      {renderContent()}
    </div>
  )
}
