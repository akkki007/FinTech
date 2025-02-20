import PlaidLinkButton from "../components/PlaidLinkButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SDashboard = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const emailCookie = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("email="));
        
                if (!emailCookie) {
                    console.error("No email found in cookies");
                    return;
                }
        
                const email = decodeURIComponent(emailCookie.split("=")[1]);
                console.log("Fetching user ID for email:", email);
        
                const response = await fetch("http://localhost:3000/api/user?email=" + email);
        
                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
        
                const data = await response.json();
                console.log("User ID:", data.userId);
                setUserId(data.userId);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    return (
        <main className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Financial Dashboard</h1>
            <div className="space-y-6 flex flex-col">
                <PlaidLinkButton userId={userId} />
            </div>
        </main>
    );
};

export default SDashboard;
