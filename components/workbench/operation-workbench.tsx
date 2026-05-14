"use client"

import { OperatorDashboard } from "./operation/operator-dashboard"
import { OperatorWarehouse } from "./operation/operator-warehouse"
import { OperatorMaterial } from "./operation/operator-material"
import { OperatorDemand } from "./operation/operator-demand"
import { OperatorOrder } from "./operation/operator-order"
import { OperatorFee } from "./operation/operator-fee"
import { OperatorContract } from "./operation/operator-contract"
import { OperatorAnalytics } from "./operation/operator-analytics"

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
        return <OperatorMaterial />
      case "op-demand":
      case "op-demand-self":
      case "op-demand-entrust":
      case "op-demand-material":
      case "op-demand-material-sale":
        return <OperatorDemand subTab={activeSubTab} />
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
