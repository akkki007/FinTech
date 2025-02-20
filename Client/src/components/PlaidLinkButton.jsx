import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

const PlaidLinkButton = ({ userId }) => {
  const [linkToken, setLinkToken] = useState(null);

  // Fetch link token when the component mounts
useEffect(() => {
    const createLinkToken = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/create_link_token", {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            setLinkToken(data.link_token);
        } catch (error) {
            console.error("Error creating link token:", error);
        }
    };
    createLinkToken();
}, []);

const onSuccess = async (publicToken) => {
    try {
        const response = await fetch("http://localhost:3000/api/exchange_public_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                public_token: publicToken,
                userId,
            }),
        });
        if (response.ok) {
            alert("Bank account linked successfully!" + linkToken);
        } else {
            console.error("Error exchanging public token:", response.statusText);
        }
    } catch (error) {
        console.error("Error exchanging public token:", error);
    }
};

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

return (
    <button
        onClick={() => open()}
        disabled={!ready}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
        Connect Bank Account
    </button>
);
};

export default PlaidLinkButton;
