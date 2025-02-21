import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Cookies from "js-cookie";

const Chatbot = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState("");

    // ✅ Fetch User ID on Component Mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const emailFromCookie = Cookies.get("email");
                if (!emailFromCookie) {
                    console.error("❌ No email found in cookies!");
                    return;
                }
                setEmail(emailFromCookie);

                // ✅ Use query parameter instead of body in GET request
                const response = await fetch(`http://localhost:3000/api/user?email=${encodeURIComponent(emailFromCookie)}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user ID");
                }

                const data = await response.json();
                setUserId(data.userId);
            } catch (error) {
                console.error("❌ Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    // ✅ Fetch Chat History when `userId` is Available
    useEffect(() => {
        if (userId) {
            fetchChatHistory();
        }
    }, [userId]);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/chat/history/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch chat history");

            const data = await response.json();
            setMessages(data.messages);
        } catch (error) {
            console.error("❌ Error fetching chat history:", error);
        }
    };

    const sendMessage = async () => {
        if (!question.trim()) return;
    
        try {
            // 1. Create temporary message with pending state
            const tempUserMessage = { 
                sender: "User", 
                text: question,
                tempId: Date.now() // Unique identifier for optimistic update
            };
            setMessages((prev) => [...prev, tempUserMessage]);
    
            // 2. Send to backend
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, question }),
            });
    
            if (!response.ok) throw new Error("Failed to save message");
    
            // 3. Replace temporary message with persisted message
            const data = await response.json();
            setMessages((prev) => 
                prev.map(msg => 
                    msg.tempId === tempUserMessage.tempId 
                        ? { ...data.userMessage } // From backend
                        : msg
                ).concat(data.botMessage) // Add bot response
            );
    
        } catch (error) {
            console.error("❌ Error:", error);
            // Remove temporary message on error
            setMessages((prev) => 
                prev.filter(msg => msg.tempId !== tempUserMessage.tempId)
            );
            setMessages((prev) => [...prev, { 
                sender: "Bot", 
                text: "Failed to save history. Please try again." 
            }]);
        }
    
        setQuestion("");
    };

    return (
        <div>
            <Sidebar />
            <div style={styles.container}>
                <h2>Finance Chatbot</h2>
                <div style={styles.chatbox}>
                    {messages.map((msg, index) => (
                        <div key={index} style={msg.sender === "User" ? styles.userMessage : styles.botMessage}>
                            <strong>{msg.sender}: </strong>{msg.text}
                        </div>
                    ))}
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask about finance..."
                        style={styles.input}
                    />
                    <button onClick={sendMessage} style={styles.button}>Send</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" },
    chatbox: { border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto", backgroundColor: "#f9f9f9" },
    userMessage: { textAlign: "right", padding: "5px", margin: "5px", backgroundColor: "#dcf8c6", borderRadius: "10px" },
    botMessage: { textAlign: "left", padding: "5px", margin: "5px", backgroundColor: "#f1f1f1", borderRadius: "10px" },
    inputContainer: { display: "flex", marginTop: "10px" },
    input: { flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" },
    button: { marginLeft: "10px", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }
};

export default Chatbot;
