"use client"

import { OperatorDashboard } from "./operation/operator-dashboard"
import { OperatorWarehouse } from "./operation/operator-warehouse"
import { OperatorDemand } from "./operation/operator-demand"
import { OperatorOrder } from "./operation/operator-order"
import { OperatorFee } from "./operation/operator-fee"
import { OperatorContract } from "./operation/operator-contract"
import { OperatorAnalytics } from "./operation/operator-analytics"
import { MaterialInventory } from "./personal/material-inventory"
import { MaterialInbound } from "./personal/material-inbound"
import { MaterialOutbound } from "./personal/material-outbound"
import { MaterialTransfer } from "./personal/material-transfer"

interface OperationWorkbenchProps {
  activeSubTab: string
}

export function OperationWorkbench({ activeSubTab }: OperationWorkbenchProps) {
  const renderContent = () => {
    switch (activeSubTab) {
      case "op-my-workbench":
        return <OperatorDashboard />
      case "op-warehouse":
        return <OperatorWarehouse />
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
        return <OperatorDemand />
      case "op-order":
        return <OperatorOrder />
      case "op-fee":
        return <OperatorFee />
      case "op-contract":
        return <OperatorContract />
      case "op-analytics":
        return <OperatorAnalytics />
      default:
        return <OperatorDashboard />
    }
  }

  return <div className="w-full min-w-0">{renderContent()}</div>
}
