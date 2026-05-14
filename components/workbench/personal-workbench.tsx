"use client"

import { EnterpriseCenter } from "./personal/enterprise-center"
import { TodoList } from "./personal/todo-list"
import { WarehouseInfo } from "./personal/warehouse-info"
import { ContractManagement } from "./personal/contract-management"
import { DemandManagement } from "./personal/demand-management"
import { OrderManagement } from "./personal/order-management"
import { MaterialInventory } from "./personal/material-inventory"
import { MaterialInbound } from "./personal/material-inbound"
import { MaterialOutbound } from "./personal/material-outbound"
import { MaterialTransfer } from "./personal/material-transfer"
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
      case "material-inventory":
        return <MaterialInventory />
      case "material-inbound":
        return <MaterialInbound />
      case "material-outbound":
        return <MaterialOutbound />
      case "material-transfer":
        return <MaterialTransfer />
      case "demand":
      case "demand-self":
        return <DemandManagement subTab="self-rent" />
      case "demand-entrust":
        return <DemandManagement subTab="entrust-rent" />
      case "demand-material":
        return <DemandManagement subTab="material-rent" />
      case "demand-material-sale":
        return <DemandManagement subTab="material-sale" />
      case "order":
      case "order-warehouse":
        return <OrderManagement subTab="warehouse" />
      case "order-storage":
        return <OrderManagement subTab="storage" />
      case "order-trade":
        return <OrderManagement subTab="trade" />
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
