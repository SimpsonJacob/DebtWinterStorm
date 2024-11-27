import React from "react";

function DebtTable({ debts, debtStrategy }) {
  // Function to sort debts based on the chosen strategy
  const sortDebts = (debts, strategy) => {
    if (strategy === "avalanche") {
      return debts.sort((a, b) => b.interestRate - a.interestRate); // Sort by highest interest rate
    } else if (strategy === "snowball") {
      return debts.sort((a, b) => a.balance - b.balance); // Sort by smallest balance
    }
    return debts; // Return debts as is if no strategy is selected
  };

  return (
    <div className="Debt-table">
      <h2>Open Accounts</h2>
      <table>
        <thead>
          <tr>
            <th>Debt Name</th>
            <th>Debt Amount</th>
            <th>Monthly Minimum Payment</th>
            <th>Interest Rate</th> {/* Interest rate displayed */}
          </tr>
        </thead>
        <tbody>
          {sortDebts(debts, debtStrategy).map((debt, index) => (
            <tr key={index}>
              <td>{debt.debtName}</td>
              <td>${debt.balance.toFixed(2)}</td>
              <td>${debt.minimumPayment.toFixed(2)}</td>
              <td>{debt.interestRate ? `${(debt.interestRate * 100).toFixed(2)}%` : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DebtTable;
