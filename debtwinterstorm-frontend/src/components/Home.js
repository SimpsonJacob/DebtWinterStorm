import React, { useState } from "react";
import DebtTable from "./DebtTable";
import { generateSpreadsheet } from "../utils/spreadsheetGenerator";
import "./Home.css";

function Home() {
  const [debtName, setDebtName] = useState("");
  const [debtAmount, setDebtAmount] = useState("");
  const [debtMinPayment, setDebtMinPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");  // Add state for interest rate
  const [debts, setDebts] = useState([]);
  const [debtStrategy, setDebtStrategy] = useState("avalanche"); // Default strategy
  const [loading, setLoading] = useState(false); // State for loading indication
  const [error, setError] = useState(""); // State for error messages

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!debtName || !debtAmount || !debtMinPayment || !interestRate) return; // Ensure all fields are filled

    // Convert debt amount and minimum payment to numbers
    const amount = parseFloat(debtAmount);
    const minPayment = parseFloat(debtMinPayment);
    const interest = parseFloat(interestRate) / 100;

    // Validation: Minimum payment shouldn't exceed debt amount
    if (minPayment > amount) {
      setError("Minimum payment cannot exceed debt amount");
      return;
    }

    const newDebt = {
      debtName,
      balance: amount, // Store debtAmount as balance
      interestRate: interest, // Store interestRate as decimal
      minimumPayment: minPayment,
    };

    setDebts((prevDebts) => [...prevDebts, newDebt]);
    setDebtName("");
    setDebtAmount("");
    setDebtMinPayment("");
    setInterestRate(""); // Reset interest rate
    setError(""); // Clear any error messages
  };

  const handleStrategyChange = (event) => {
    setDebtStrategy(event.target.value); // Update debt strategy based on user selection
  };

  const handleGenerateSpreadsheet = () => {
    setLoading(true);
    generateSpreadsheet(debts, debtStrategy);
    setLoading(false);
  };

  return (
    <div className="Background">
      <div className="Homepage">
        <div className="Home-header">
          <h1 className="Home-title">Welcome to the Debt Winter Storm app!</h1>
          <p className="Home-description">
            This app is to help users track and manage debt, as well as teach them about different methods to squash their debt.
          </p>
        </div>

        <form className="Home-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="debtName">Account Name:</label>
            <input
              type="text"
              id="debtName"
              name="debtName"
              value={debtName}
              onChange={(e) => setDebtName(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="debtAmount">Account Amount:</label>
            <input
              type="number"
              id="debtAmount"
              name="debtAmount"
              value={debtAmount}
              onChange={(e) => setDebtAmount(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="debtMinPayment">Monthly Minimum Payment:</label>
            <input
              type="number"
              id="debtMinPayment"
              name="debtMinPayment"
              value={debtMinPayment}
              onChange={(e) => setDebtMinPayment(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="interestRate">Interest Rate (as %):</label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <input type="submit" value="Add Account" />
          </div>

          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </form>

        {/* Debt Table Component */}
        <DebtTable debts={debts} />

        {/* Debt Strategy Selector */}
        <div className="Strategy-select">
          <label htmlFor="debtStrategy">Select Debt Strategy:</label>
          <select
            id="debtStrategy"
            value={debtStrategy}
            onChange={handleStrategyChange}
          >
            <option value="avalanche">Avalanche (Highest Interest First)</option>
            <option value="snowball">Snowball (Smallest Balance First)</option>
          </select>
        </div>

        {/* Button to trigger the spreadsheet generation */}
        <div className="Submit-form">
          <button
            type="button"
            onClick={handleGenerateSpreadsheet}
            disabled={debts.length === 0 || loading}
          >
            {loading ? "Generating..." : "Generate Debt Timeline"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
