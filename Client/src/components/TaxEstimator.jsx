import { useState } from "react";

const TaxEstimator = () => {
  const [email, setEmail] = useState("");
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const estimateTax = async () => {
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3000/estimate-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, taxYear }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error estimating tax");

      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 -mx-32 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Tax Estimation</h2>
      <input
        type="email"
        className="border p-2 w-full mb-2"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 w-full mb-2"
        placeholder="Tax Year"
        value={taxYear}
        onChange={(e) => setTaxYear(e.target.value)}
      />
      <button
        onClick={estimateTax}
        className="bg-[#31572C] text-white p-2 w-full rounded-md"
      >
        Estimate Tax
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold">Tax Estimation Result:</h3>
          <p>Taxable Income: ${result.taxableIncome.toFixed(2)}</p>
          <p>Deductible Expenses: ${result.deductibleExpenses.toFixed(2)}</p>
          <p>Estimated Tax Owed: ${result.estimatedTax.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default TaxEstimator;
