import { useCallback, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()
  const [approvedTransactions, setApprovedTransactions] = useState<Record<string, boolean>>({}) // bug 7: set all InputChecks initially to not checked.

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      setApprovedTransactions((currentChecks) => ({ ...currentChecks, [transactionId]: newValue })) // bug 7: maintain the current state and update the transactionId's value to the newValue
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
    },
    [fetchWithoutCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
          approved={approvedTransactions[transaction.id] || false} // bug 7: pass approvedTransaction[transaction.id] as a prop
        />
      ))}
    </div>
  )
}
