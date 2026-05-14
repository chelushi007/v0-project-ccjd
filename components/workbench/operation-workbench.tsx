"use client"

import { WarehouseInfo } from "./personal/warehouse-info"
import { ContractManagement } from "./personal/contract-management"
import { DemandManagement } from "./personal/demand-management"
import { OrderManagement } from "./personal/order-management"
import { MaterialInventory } from "./personal/material-inventory"
import { MaterialInbound } from "./personal/material-inbound"
import { MaterialOutbound } from "./personal/material-outbound"
import { MaterialTransfer } from "./personal/material-transfer"
import { OperatorDashboard } from "./operation/operator-dashboard"
import { OperatorServiceFee } from "./operation/operator-service-fee"

interface OperationWorkbenchProps {
  activeSubTab: string
}

export function OperationWorkbench({ activeSubTab }: OperationWorkbenchProps) {
  const renderContent = () => {
    switch (activeSubTab) {
      case "op-my-workbench":
        return <OperatorDashboard />
      case "op-warehouse":
        return <WarehouseInfo />
      case "op-material":
      case "op-material-inventory":
        return <MaterialInventory />
      case "op-material-inbound":
        return <MaterialInbound />
      case "op-material-outbound":
        return <MaterialOutbound />
      case "op-material-transfer":
        return <MaterialTransfer />
      case "op-demand":
      case "op-demand-self":
        return <DemandManagement subTab="self-rent" />
      case "op-demand-entrust":
        return <DemandManagement subTab="entrust-rent" />
      case "op-demand-material":
        return <DemandManagement subTab="material-rent" />
      case "op-demand-material-sale":
        return <DemandManagement subTab="material-sale" />
      case "op-order":
      case "op-order-warehouse":
        return <OrderManagement subTab="warehouse" />
      case "op-order-storage":
        return <OrderManagement subTab="storage" />
      case "op-order-trade":
        return <OrderManagement subTab="trade" />
      case "op-settlement":
      case "op-service-fee":
        return <OperatorServiceFee />
      case "op-contract":
        return <ContractManagement />
      default:
        return <OperatorDashboard />
    }
  }

  return <div className="w-full min-w-0">{renderContent()}</div>
}
