import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { 
  FiSearch, FiMessageSquare, FiUser, FiTruck, 
  FiClock, FiSend, FiArrowRight, FiActivity 
} from 'react-icons/fi';

// ربط السوكيت بالسيرفر
const socket = io(import.meta.env.VITE_API_URL); 

function ChatPage() {
  const [chats, setChats] = useState([]); // قائمة المحادثات
  const [selectedChat, setSelectedChat] = useState(null); // المحادثة المختارة
  const [messages, setMessages] = useState([]); // رسائل المحادثة المختارة
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // 1. جلب قائمة المحادثات عند فتح الصفحة
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/chats/admin/list`);
      setChats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chats", err);
      setLoading(false);
    }
  };

  // 2. جلب رسائل محادثة معينة عند الضغط عليها
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.order_id);
      
      // الانضمام لغرفة المحادثة عبر الـ Socket
      socket.emit('join_chat', selectedChat.order_id);

      // الاستماع للرسائل الجديدة
      socket.on('new_message', (newMessage) => {
        if (newMessage.order_id === selectedChat.order_id) {
          setMessages(prev => [...prev, newMessage]);
        }
      });
    }

    return () => {
      socket.off('new_message');
    };
  }, [selectedChat]);

  const fetchMessages = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chats/details/${orderId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  // تمرير الشات لأسفل تلقائياً عند وصول رسالة جديدة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="h-screen bg-[#F8F9FD] flex flex-col md:flex-row overflow-hidden" dir="rtl">
      
      {/* القسم الأيمن: قائمة المحادثات */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-l border-gray-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <FiMessageSquare className="text-blue-600"/> المحادثات
          </h1>
          <div className="relative">
            <FiSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="بحث في المحادثات..." 
              className="w-full bg-gray-50 border-none rounded-2xl pr-10 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {loading ? (
            <p className="text-center text-gray-400 mt-10">جاري التحميل...</p>
          ) : (
            chats.filter(c => c.order?.customer?.name.includes(searchTerm)).map((chat) => (
              <div 
                key={chat.order_id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedChat?.order_id === chat.order_id 
                    ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' 
                    : 'bg-white border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedChat?.order_id === chat.order_id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-500'}`}>
                    <FiUser size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-bold text-sm truncate ${selectedChat?.order_id === chat.order_id ? 'text-white' : 'text-gray-900'}`}>
                        {chat.order?.customer?.name}
                      </h3>
                      <span className={`text-[10px] ${selectedChat?.order_id === chat.order_id ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(chat.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className={`text-xs flex items-center gap-1 ${selectedChat?.order_id === chat.order_id ? 'text-blue-100' : 'text-blue-600'}`}>
                      <FiTruck size={12}/> {chat.order?.delivery?.name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* القسم الأيسر: نافذة الدردشة */}
      <div className={`flex-1 flex flex-col bg-[#F8F9FD] ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Header المحادثة */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                  <FiArrowRight />
                </button>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {selectedChat.order?.customer?.name[0]}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 leading-none mb-1">{selectedChat.order?.customer?.name}</h2>
                  <p className="text-xs text-gray-500">مراقبة محادثة الطلب #{selectedChat.order_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold">
                <FiActivity /> مباشر
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender_type === 'customer' ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 mb-1 px-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {msg.sender_type === 'customer' ? 'العميل' : 'المندوب'}
                    </span>
                  </div>
                  <div className={`max-w-[80%] md:max-w-[60%] p-4 rounded-[1.5rem] shadow-sm ${
                    msg.sender_type === 'customer' 
                    ? 'bg-white text-gray-800 rounded-tr-none' 
                    : 'bg-blue-600 text-white rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <span className={`text-[9px] mt-2 block opacity-70`}>
                       {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="max-w-3xl mx-auto relative">
                <input 
                  type="text" 
                  disabled
                  placeholder="وضع المراقبة فقط: لا يمكنك إرسال رسائل في هذه المحادثة" 
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 pr-6 text-sm text-gray-400 outline-none cursor-not-allowed italic"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                  <FiSend />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-10">
            <div className="w-24 h-24 bg-white shadow-xl shadow-blue-100 rounded-[2.5rem] flex items-center justify-center text-blue-500 mx-auto mb-6 transform -rotate-12">
              <FiMessageSquare size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-800">مركز مراقبة المحادثات</h2>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto">اختر أي محادثة من القائمة اليمنى لمراجعة تفاصيل الحوار بين المندوب والعميل.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;