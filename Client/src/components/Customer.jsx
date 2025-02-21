import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./SideBar";

const CustomerSupport = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const formatResponse = (text) => {
        if (!text) return "";
    
        // Format headings (e.g., # Heading -> <strong>Heading</strong>)
        text = text.replace(/^#\s+(.*$)/gm, "<strong>$1</strong>"); // # Heading
        text = text.replace(/^##\s+(.*$)/gm, "<strong>$1</strong>"); // ## Heading
        text = text.replace(/^###\s+(.*$)/gm, "<strong>$1</strong>"); // ### Heading
    
        // Format lists (e.g., - Item -> <li>Item</li>)
        text = text.replace(/^-\s+(.*$)/gm, "<li>$1</li>"); // - Item
        text = text.replace(/^\*\s+(.*$)/gm, "<li>$1</li>"); // * Item
    
        // Wrap lists in <ul> tags
        text = text.replace(/(<li>.*<\/li>)/gms, "<ul>$1</ul>");
    
        // Replace newlines with <br> tags
        text = text.replace(/\n/g, "<br>");
    
        return text;
    };

    const handleAskQuestion = async () => {
        if (!question) {
            setError("Please enter a question.");
            return;
        }
        
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:3000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: question }),
            });
            const data = await response.json();
            const formattedAnswer = formatResponse(data.answer); // Format the response
            setAnswer(formattedAnswer);
        } catch (error) {
            console.error("Error fetching response:", error);
            setError("Error processing your request. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Customer Q&A Support</h1>

                {/* Input and Button */}
                <div className="flex space-x-4 mb-8">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAskQuestion}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            "Ask"
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Answer Section */}
                {answer && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Answer:</h2>
                        <p
                            className="text-gray-700"
                            dangerouslySetInnerHTML={{ __html: answer }} // Render HTML
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerSupport;