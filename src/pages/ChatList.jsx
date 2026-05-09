import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiUser, FiMoreVertical } from "react-icons/fi";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ;

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("_id");

  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const response = await axios.get(
          `${API_BASE_URL}/api/chat/user-chats/${userId}`
        );

        if (response.data && response.data.success) {
          // Backend response structure
          setChats(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching chat list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId, API_BASE_URL]);

  // Search filter
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.otherUserName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const isNotSystemMsg = chat.lastMessage !== "";

    return matchesSearch && isNotSystemMsg;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Your Messages
            </h1>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <FiMoreVertical className="text-gray-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" />

            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Chats List Area */}
        <div className="h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>

              <p>Loading your chats...</p>
            </div>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.chatId}
                onClick={() =>
                  navigate(`/chat/${chat.otherUserId}`)
                }
                className="flex items-center gap-4 p-5 hover:bg-orange-50 cursor-pointer transition-all border-b border-gray-50 last:border-0 group"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm overflow-hidden">
                    {chat.profilePic ? (
                      <img
                        src={
                          chat.profilePic.startsWith("http")
                            ? chat.profilePic
                            : `${API_BASE_URL}/${chat.profilePic.replace(
                                /^\/+/,
                                ""
                              )}`
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      chat.otherUserName
                        ?.charAt(0)
                        .toUpperCase() || <FiUser />
                    )}
                  </div>

                  {chat.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                {/* Message Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-800 truncate text-lg">
                      {chat.otherUserName}
                    </h3>

                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                      {chat.lastMessageTime
                        ? new Date(
                            chat.lastMessageTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate pr-4">
                      {chat.lastMessage || "No messages yet"}
                    </p>

                    {chat.unreadCount > 0 && (
                      <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-10">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FiUser className="text-gray-300 text-3xl" />
              </div>

              <p className="text-gray-500 font-medium">
                No messages yet
              </p>

              <p className="text-gray-400 text-sm mt-1">
                When someone contacts you about an item, it will
                appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;