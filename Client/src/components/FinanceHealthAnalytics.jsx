import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import Sidebar from "./SideBar";

// **Register necessary Chart.js components**
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FinanceHealth = () => {
  const [financeData, setFinanceData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const emailCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("email="));

        if (!emailCookie) {
          setError("User email not found. Please log in.");
          return;
        }

        const email = decodeURIComponent(emailCookie.split("=")[1]);
        const response = await fetch(`http://localhost:3000/api/user?email=${email}`);
        if (!response.ok) throw new Error("Failed to fetch user ID");

        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchFinanceHealth = async () => {
      try {
        if (!userId) return;

        const response = await fetch(`http://localhost:3000/api/finance/health/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch financial data");

        const data = await response.json();
        setFinanceData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFinanceHealth();
  }, [userId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!financeData) return <p>Loading financial data...</p>;

  const { totalBalance, categorizedExpenses, predictedCashflow, recentTransactions } = financeData;

  return (
    <div>
        <div>
            <Sidebar/>
        </div>
        <div className="-mx-20" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Financial Overview</h2>

      <h3>Total Balance</h3>
      <p style={{ fontSize: "24px", fontWeight: "bold", color: totalBalance >= 0 ? "green" : "red" }}>
        ${totalBalance.toFixed(2)}
      </p>

      <h3>Expense Breakdown</h3>
      <Doughnut
        data={{
          labels: Object.keys(categorizedExpenses),
          datasets: [
            {
              data: Object.values(categorizedExpenses),
              backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
            },
          ],
        }}
      />

      <h3>Predicted Cash Flow</h3>
      <Bar
        data={{
          labels: ["Current", "Predicted"],
          datasets: [
            {
              label: "Cash Flow",
              data: [totalBalance, predictedCashflow],
              backgroundColor: ["#36a2eb", "#ffce56"],
            },
          ],
        }}
      />

      <h3>Recent Transactions</h3>
      <ul>
        {recentTransactions.map((tx) => (
          <li key={tx._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span>{tx.category}</span>
            <span style={{ color: tx.transactionType === "credit" ? "green" : "red" }}>
              {tx.transactionType === "credit" ? "+" : "-"}${tx.amount.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default FinanceHealth;
