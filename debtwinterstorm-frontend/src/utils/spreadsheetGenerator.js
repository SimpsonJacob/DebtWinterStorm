import * as XLSX from "xlsx";

// Sort debts based on debt strategy (either 'snowball' or 'avalanche')
function sortDebts(debtStrategy, debts) {
  if (debtStrategy === 'snowball') {
    debts.sort((a, b) => a.balance - b.balance); // Sort by balance (smallest first)
  } else if (debtStrategy === 'avalanche') {
    debts.sort((a, b) => b.interestRate - a.interestRate); // Sort by interest rate (highest first)
  }
}

// Main function to calculate and generate the spreadsheet
export const generateSpreadsheet = (debts, debtStrategy, additionalPayment = 0) => {
  let totalInterestPaid = 0;
  let rollingMinimumPayment = 0; // Used to carry over the minimum payment once a debt is paid off

  // Sort debts according to the strategy
  sortDebts(debtStrategy, debts);

  // Initialize headers for the sheet (Month + Debt Names)
  const headers = ["Month", ...debts.map(debt => debt.name)]; // Add debt names as headers
  let maxMonths = 0;

  // Calculate the maximum months needed to pay off the debts
  debts.forEach(debt => {
    let balance = debt.balance;
    let months = 0;
    while (balance > 0) {
      balance -= debt.minimumPayment;
      months++;
    }
    maxMonths = Math.max(maxMonths, months); // Track the max months required for any debt
  });

  // Initialize the sheet data with headers (Month + Debt Names)
  const sheetData = [headers];

  // Track balances month by month
  let month = 0;
  while (debts.some(debt => debt.balance > 0)) {
    month++;
    let row = [`Month ${month}`]; // Start each row with the month label

    // Process each debt
    debts.forEach((debt) => {
      if (debt.balance > 0) {
        let interest = debt.balance * (debt.interestRate / 12);
        totalInterestPaid += interest;
        debt.balance += interest;

        // Calculate the payment, ensuring that we apply any extra payments
        let payment = Math.min(debt.balance, debt.minimumPayment + additionalPayment + rollingMinimumPayment);
        debt.balance -= payment;

        // Track the remaining balance after payment
        row.push(debt.balance.toFixed(2));

        // If the debt is paid off
        if (debt.balance <= 0) {
          rollingMinimumPayment += debt.minimumPayment; // Add minimum payment to rolling payment
          debt.balance = 0;
        }
      } else {
        // If the debt is paid off, fill the future months with 0.00
        row.push("0.00");
      }
    });

    // Add the row for this month
    sheetData.push(row);

    // Stop if all debts are paid off
    if (debts.every(d => d.balance <= 0)) {
      break;
    }
  }

  console.log(`Total Interest Paid: $${totalInterestPaid.toFixed(2)}`);
  console.log(`Total Months to pay off: ${sheetData.length - 1}`);

  // Create the Excel sheet from the sheetData (no need to transpose)
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Debt Timeline");

  // Write the spreadsheet to a file
  XLSX.writeFile(wb, "Debt_Timeline_Plan_Sideways.xlsx");
};
