"use client"

import { EnterpriseCenter } from "./personal/enterprise-center"
import { TodoList } from "./personal/todo-list"
import { WarehouseInfo } from "./personal/warehouse-info"
import { ContractManagement } from "./personal/contract-management"
import { DemandManagement } from "./personal/demand-management"
import { OrderManagement } from "./personal/order-management"
import { MaterialManagement } from "./shared/material-management"
import { SettlementManagement } from "./shared/settlement-management"

interface PersonalWorkbenchProps {
  activeSubTab: string
}

export function PersonalWorkbench({ activeSubTab }: PersonalWorkbenchProps) {
  const renderContent = () => {
    switch (activeSubTab) {
      case "my-workbench":
        return <TodoList />
      case "enterprise":
        return <EnterpriseCenter />
      case "warehouse":
        return <WarehouseInfo />
      case "material":
        return <MaterialManagement />
      case "demand":
      case "demand-self":
        return <DemandManagement subTab="self-rent" />
      case "demand-entrust":
        return <DemandManagement subTab="entrust-rent" />
      case "demand-material":
        return <DemandManagement subTab="material-rent" />
      case "order":
        return <OrderManagement />
      case "settlement":
      case "settlement-reconciliation":
        return <SettlementManagement subTab="reconciliation" />
      case "settlement-settle":
        return <SettlementManagement subTab="settle" />
      case "contract":
        return <ContractManagement />
      default:
        return <TodoList />
    }
  }

  return <div className="w-full min-w-0">{renderContent()}</div>
}
