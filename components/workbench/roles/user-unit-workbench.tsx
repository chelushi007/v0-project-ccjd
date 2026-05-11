"use client"

import { EnterpriseCenter } from "../personal/enterprise-center"
import { TodoList } from "../personal/todo-list"
import { MaterialOrderManagement } from "../shared/material-order-management"
import { SettlementManagement } from "../shared/settlement-management"
import { ContractManagement } from "../personal/contract-management"

interface UserUnitWorkbenchProps {
  subTab: string
}

export function UserUnitWorkbench({ subTab }: UserUnitWorkbenchProps) {
  const renderContent = () => {
    // 企业中心
    if (subTab === "enterprise") {
      return <EnterpriseCenter roleType="user" />
    }

    // 待办事项
    if (subTab.startsWith("todo-")) {
      const todoType = subTab.replace("todo-", "")
      return <TodoList activeTab={todoType} roleType="user" />
    }

    // 订单管理
    if (subTab.startsWith("order-")) {
      const orderType = subTab.replace("order-", "")
      return <MaterialOrderManagement subTab={orderType} roleType="user" />
    }

    // 结算管理
    if (subTab.startsWith("settlement-")) {
      return <SettlementManagement subTab={subTab} roleType="user" />
    }

    // 合同管理
    if (subTab === "contract") {
      return <ContractManagement roleType="user" />
    }

    // 默认显示企业中心
    return <EnterpriseCenter roleType="user" />
  }

  return (
    <div>
      {renderContent()}
    </div>
  )
}
