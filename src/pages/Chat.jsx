import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { FiSend, FiArrowLeft, FiMoreVertical } from "react-icons/fi";

const Chat = () => {
  const { id: sellerId } = useParams();
  const navigate = useNavigate();
  
  const userId = localStorage.getItem("userId") || localStorage.getItem("_id");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sellerName, setSellerName] = useState("Loading...");
  const [isConnected, setIsConnected] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ---------------- SOCKET CONNECT ---------------- */
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        transports: ["polling", "websocket"], 
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socketRef.current.on("connect", () => {
        console.log(" Socket Connected:", socketRef.current.id);
        setIsConnected(true);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error(" Socket Connection Error:", err.message);
        setIsConnected(false);
      });

      socketRef.current.on("disconnect", () => {
        console.log(" Socket Disconnected");
        setIsConnected(false);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  /* ---------------- GET SELLER INFO (UPDATED TO HIT DB) ---------------- */
  useEffect(() => {
    const fetchSeller = async () => {
      if (!sellerId || sellerId === "undefined") return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/user/${sellerId}`);
        if (res.data && res.data.success) {
          setSellerName(res.data.data.name || "Unknown User");
        } else {
          setSellerName("Unknown User");
        }
      } catch (err) {
        console.error(" Error fetching seller name:", err);
        setSellerName("Unknown User");
      }
    };
    fetchSeller();
  }, [sellerId]);

  /* ---------------- CREATE OR GET CHAT ---------------- */
  useEffect(() => {
    const createChat = async () => {
      if (!userId || !sellerId || sellerId === "undefined") return;
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat/create`, {
          sender: userId,
          receiver: sellerId 
        });
        const id = res.data?.chatId || res.data?.data?.chatId;
        if (id) {
          console.log(" Chat ID set to:", id);
          setChatId(id);
        }
      } catch (err) {
        console.error(" Chat API Error:", err.response?.data?.message || err.message);
      }
    };
    createChat();
  }, [sellerId, userId]);

  /* ---------------- JOIN & RECEIVE ---------------- */
  useEffect(() => {
    if (!chatId || !isConnected || !socketRef.current) return;

    const socket = socketRef.current; // Create a stable reference
    console.log(" Joining room:", chatId);
    socket.emit("join_chat", chatId);

    const handleMessage = (msg) => {
      console.log(" New message received via socket:", msg);
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id || (m.isTemp && m.text === msg.text && m.sender === msg.sender));
        if (exists) {
          return prev.map(m => m.isTemp && m.text === msg.text ? msg : m);
        }
        return [...prev, msg];
      });
    };

    socket.on("receive_message", handleMessage);

    return () => {
      // Fixed: Added null check to prevent white screen crash on unmount
      if (socket) {
        socket.off("receive_message", handleMessage);
      }
    };
  }, [chatId, isConnected]);

  /* ---------------- LOAD HISTORY ---------------- */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/messages/${chatId}`);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error(" History fetch error:", err.message);
      }
    };
    fetchMessages();
  }, [chatId]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!isConnected) return console.error("Socket not connected");
    if (!chatId) return console.error("No ChatId found");
    if (!text.trim()) return;

    const messageText = text.trim();

    const msgData = {
      chatId: chatId,
      sender: userId,
      receiver: sellerId,
      message: messageText,
    };

    console.log(" Sending message:", msgData);
    
    socketRef.current.emit("send_message", msgData);

    const tempMsg = {
      _id: `temp-${Date.now()}`,
      isTemp: true, 
      chatId: chatId,
      sender: userId,
      receiver: sellerId,
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setText("");
  };

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] pt-16">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col bg-white shadow-xl overflow-hidden md:my-4 md:rounded-2xl border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-orange-50 rounded-full transition-colors">
              <FiArrowLeft className="text-gray-600 w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              {sellerName !== "Loading..." ? sellerName[0]?.toUpperCase() : "?"}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{sellerName}</h1>
              <p className={`text-xs flex items-center gap-1 ${isConnected ? "text-green-600" : "text-gray-400"}`}>
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-600" : "bg-gray-300"}`}></span>
                {isConnected ? "Online" : "Connecting..."}
              </p>
            </div>
          </div>
          <FiMoreVertical className="text-gray-400 cursor-pointer" />
        </div>

        {/* MESSAGING AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#FEFCE8]">
          {messages.map((msg, index) => (
            <div key={msg._id || index} className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                  msg.sender === userId ? "bg-orange-500 text-white rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                } ${msg.isTemp ? "opacity-70" : "opacity-100"}`}>
                <p className="text-sm md:text-base leading-relaxed">
                  {msg.text || msg.message}
                </p>
                <div className={`text-[10px] mt-1 text-right ${msg.sender === userId ? "text-orange-100" : "text-gray-400"}`}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-200">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-gray-700"
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim() || !isConnected}
              className={`p-3 rounded-lg transition-all ${text.trim() && isConnected ? "bg-orange-500 text-white shadow-md" : "bg-gray-200 text-gray-400"}`}
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;