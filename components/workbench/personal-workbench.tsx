"use client"

import { EnterpriseCenter } from "./personal/enterprise-center"
import { TodoList } from "./personal/todo-list"
import { WarehouseInfo } from "./personal/warehouse-info"
import { OrderManagement } from "./personal/order-management"
import { ContractManagement } from "./personal/contract-management"

interface PersonalWorkbenchProps {
  activeSubTab: string
}

export function PersonalWorkbench({ activeSubTab }: PersonalWorkbenchProps) {
  const renderContent = () => {
    switch (activeSubTab) {
      case "enterprise":
        return <EnterpriseCenter />
      case "todo":
        return <TodoList />
      case "warehouse-info":
        return <WarehouseInfo />
      case "order":
        return <OrderManagement />
      case "contract":
        return <ContractManagement />
      default:
        return <EnterpriseCenter />
    }
  }

  return <div className="w-full">{renderContent()}</div>
}
