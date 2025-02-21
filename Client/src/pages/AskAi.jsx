import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/SideBar";
import Cookies from "js-cookie";

const Chatbot = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // ✅ Format response correctly
    const formatResponse = (text) => {
        if (!text) return "";

        try {
            const parsed = JSON.parse(text);
            if (typeof parsed === "string") {
                text = parsed; // Convert if it's a string inside JSON
            } else if (typeof parsed === "object") {
                text = JSON.stringify(parsed, null, 2); // Convert object to formatted string
            }
        } catch (e) {
            // Not a JSON string, continue as is
        }

        return String(text)
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
            .replace(/==(.*?)==/g, "<mark>$1</mark>"); // Highlight
    };

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

                const response = await fetch(`http://localhost:3000/api/user?email=${encodeURIComponent(emailFromCookie)}`);
                if (!response.ok) throw new Error("Failed to fetch user ID");

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
            const fetchChatHistory = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/chat/history/${userId}`);
                    if (!response.ok) throw new Error("Failed to fetch chat history");

                    const data = await response.json();
                    console.log("✅ Chat History API Response:", data);

                    const formattedMessages = data.messages.map(msg => ({
                        question: msg.question,
                        answer: formatResponse(msg.response)
                    }));

                    setMessages(formattedMessages);
                } catch (error) {
                    console.error("❌ Error fetching chat history:", error);
                }
            };
            fetchChatHistory();
        }
    }, [userId]);

    // ✅ Auto-scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ Send Message Function
    const sendMessage = async () => {
        if (!question.trim()) return;

        setLoading(true);

        // ✅ Add temporary user message
        const tempUserMessage = { question, answer: "⏳ Generating response...", tempId: Date.now() };
        setMessages((prev) => [...prev, tempUserMessage]);

        try {
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, question }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();
            console.log("✅ API Response:", data); // Debugging response

            let formattedAnswer = data.answer;

            if (typeof formattedAnswer === "object") {
                formattedAnswer = JSON.stringify(formattedAnswer, null, 2); // Convert object to string
            }

            formattedAnswer = formatResponse(formattedAnswer);

            setMessages((prev) =>
                prev.filter(msg => msg.tempId !== tempUserMessage.tempId).concat([{ question, answer: formattedAnswer }])
            );
        } catch (error) {
            console.error("❌ Error:", error);
            setMessages((prev) => prev.filter(msg => msg.tempId !== tempUserMessage.tempId)); // Remove loading msg
            setMessages((prev) => [...prev, { question, answer: "❌ Failed to send. Try again." }]);
        }

        setLoading(false);
        setQuestion("");
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full max-w-3xl mx-auto p-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Finance Chatbot</h2>

                <div className="flex flex-col p-4 h-96 overflow-y-auto bg-gray-100 rounded-lg shadow-md">
                    {messages.map((msg, index) => (
                        <div key={index} className="flex flex-col my-2">
                            {/* User Question */}
                            <div className="flex items-center space-x-2 justify-end">
                                <span className="text-2xl">👤</span>
                                <div className="p-3 rounded-lg shadow-md bg-blue-500 text-white max-w-xs">
                                    <p className="font-semibold">{msg.question}</p>
                                </div>
                            </div>

                            {/* ✅ Bot Answer */}
                            <div className="flex items-center space-x-2 justify-start mt-1">
                                <span className="text-2xl">🤖</span>
                                <div className="p-3 rounded-lg shadow-md bg-gray-300 text-black max-w-xs">
                                    <p
                                        className="text-sm"
                                        dangerouslySetInnerHTML={{ __html: msg.answer }} // ✅ Render formatted HTML
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Loading Animation */}
                {loading && <p className="text-center text-blue-500 mt-2">🤖 Thinking...</p>}

                <div className="flex mt-4">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask about finance..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
