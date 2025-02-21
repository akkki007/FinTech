import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Sidebar from "./SideBar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CashFlowChart = () => {
  const [cashflow, setCashflow] = useState([]);
  const [predictedCashflow, setPredictedCashflow] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Get Email from Cookies
  useEffect(() => {
    const emailCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("email="))
      ?.split("=")[1];

    if (emailCookie) {
      setEmail(decodeURIComponent(emailCookie));
    }
  }, []);

  // ✅ Fetch Weekly Cash Flow
  useEffect(() => {
    if (!email) return;

    const fetchCashflow = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/api/report/cashflow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) throw new Error("Failed to fetch cash flow data");

        const data = await response.json();

        if (!data.cashflow || data.cashflow.length === 0) {
          setError("No cash flow data available.");
          setCashflow([]);
        } else {
          setCashflow(data.cashflow);
        }
      } catch (error) {
        console.error("❌ Error fetching cash flow:", error.message);
        setError("Unable to load cash flow data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCashflow();
  }, [email]);

  // ✅ Fetch Predicted Cash Flow
  useEffect(() => {
    if (!email) return;

    const fetchPrediction = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/report/predict-cashflow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) throw new Error("Failed to fetch predicted cash flow");

        const data = await response.json();
        setPredictedCashflow(data.predicted_cashflow);
      } catch (error) {
        console.error("❌ Error predicting cash flow:", error.message);
      }
    };

    fetchPrediction();
  }, [email]);

  // ✅ Chart Data
  const chartData = {
    labels: cashflow.map((entry) => entry.week),
    datasets: [
      {
        label: "Net Cash Flow",
        data: cashflow.map((entry) => entry.net_cashflow),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.3)",
      },
      {
        label: "Moving Average",
        data: cashflow.map((entry) => entry.moving_avg),
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.3)",
      },
    ],
  };

  return (
    <div>
      <Sidebar />
      <div className="p-6 mx-72 mt-5 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Cash Flow Prediction</h2>

        {loading ? (
          <p className="text-blue-500">⏳ Loading cash flow data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cashflow.length === 0 ? (
          <p className="text-gray-500">📉 No cash flow data available.</p>
        ) : (
          <Line data={chartData} />
        )}

        {predictedCashflow !== null && !isNaN(predictedCashflow) && (
          <p className="text-lg font-bold mt-4">
            🔮 Predicted Cash Flow for Next Week: ${predictedCashflow.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default CashFlowChart;
