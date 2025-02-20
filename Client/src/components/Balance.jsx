import { useEffect, useState } from "react";
import axios from "axios";

const Balance = ({ userId }) => {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/balance/${userId}`, { withCredentials: true });
        setBalances(response.data);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [userId]);

  return (
    <div>
      <h2>Account Balances</h2>
      <ul>
        {balances.map((account) => (
          <li key={account.account_id}>
            {account.name} - ${account.balances.current}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Balance;
