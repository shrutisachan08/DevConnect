import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const ChatPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);
  const messagesEndRef = useRef(null);

  // 🔁 Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Initialize socket listeners
  useEffect(() => {
    if (!socketInstance || !currentUserId) return;

    socketInstance.on('receiveMessage', (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          fromSelf: msg.from !== currentUserId,
          text: msg.message,
        }
      ]);
    });

    socketInstance.on('online-users', (users) => {
      setOnlineUserIds(users);
    });

    return () => {
      socketInstance.off('receiveMessage');
      socketInstance.off('online-users');
    };
  }, [socketInstance, currentUserId]);

  // ✅ Get current user and set up socket
  useEffect(() => {
    axios.get('http://localhost:5000/check', { withCredentials: true })
      .then(res => {
        if (res.data.user) {
          const userId = res.data.user._id;
          setCurrentUserId(userId);

          const sock = io('http://localhost:5000', {
            withCredentials: true,
          });

          sock.emit('add-user', userId);
          setSocketInstance(sock);
        }
      })
      .catch(err => console.error('❌ Auth check failed:', err));
  }, []);

  // ✅ Load matches
  useEffect(() => {
    axios.get('http://localhost:5000/match', { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setMatches(res.data.matches);
        }
      })
      .catch(err => console.error('❌ Failed to fetch matches:', err));
  }, []);

  // ✅ Load chat history
  const loadChat = async (userId, username) => {
    setSelectedUser(userId);
    setSelectedUsername(username);
    setMessages([]);

    try {
      const res = await axios.get(`http://localhost:5000/messages/chat/${userId}`, {
        withCredentials: true
      });

      if (res.data.success) {
        const formatted = res.data.messages.map((m) => ({
          ...m,
          fromSelf: m.from === currentUserId,
          text: m.message
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error("❌ Chat load failed:", err);
    }
  };

  // ✅ Send message
  const handleSend = async () => {
    if (!text.trim() || !selectedUser || !currentUserId) return;

    const msg = {
      from: currentUserId,
      to: selectedUser,
      message: text
    };

    try {
      // ✅ FIXED endpoint
      await axios.post('http://localhost:5000/messages/send', msg, {
        withCredentials: true
      });

      socketInstance.emit('sendMessage', msg);

      setMessages((prev) => [...prev, { ...msg, fromSelf: true, text }]);
      setText('');
    } catch (err) {
      console.error('❌ Send failed:', err);
    }
  };

  return (
    <div className="flex h-[90vh] bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">💬 Chats</h2>
        {matches.length === 0 ? (
          <p className="text-gray-400">No chats yet. Start matching to chat!</p>
        ) : (
          matches.map((m) => {
            const id =
              typeof m.userId === 'object' && m.userId !== null
                ? m.userId._id
                : m.userId || m._id;

            const name =
              (typeof m.userId === 'object' && m.userId?.githubUsername) ||
              m.githubUsername ||
              m.username ||
              "Unnamed";

            return (
              <div
                key={id}
                onClick={() => loadChat(id, name)}
                className={`flex items-center justify-between p-2 cursor-pointer rounded hover:bg-gray-700 ${selectedUser === id ? 'bg-gray-700' : ''}`}
              >
                <span>{name}</span>
                {onlineUserIds.includes(id) && (
                  <span className="ml-2 h-2 w-2 bg-green-400 rounded-full" title="Online" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-4">
        <div className="mb-2 text-xl font-semibold">
          {selectedUser ? `Chatting with: ${selectedUsername}` : 'Select a user to chat'}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 border-t border-gray-700 pt-4">
          {messages.map((m, index) => (
            <div
              key={m._id ? m._id.toString() : `temp-${index}`}
              className={`max-w-sm p-2 rounded-lg ${m.fromSelf ? 'bg-purple-600 self-end' : 'bg-gray-700 self-start'}`}
            >
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l bg-gray-800 border border-gray-600"
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-purple-600 px-4 py-2 rounded-r hover:bg-purple-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
