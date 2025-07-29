"use client";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  sentAt: string;
  read: boolean;
}

import { FC } from 'react';

interface ChatPageProps {
  params: { matchId: string };
}

const ChatPage: FC<ChatPageProps> = ({ params }) => {
  const matchId = params.matchId;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    axios.get(`/api/chat/${matchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMessages(res.data));
    socketRef.current = io('/', { query: { token } });
    socketRef.current.emit('join', matchId);
    socketRef.current.on('message', (msg: Message) => {
      setMessages(msgs => [...msgs, msg]);
    });
    socketRef.current.on('typing', () => setIsTyping(true));
    socketRef.current.on('stopTyping', () => setIsTyping(false));
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [matchId]);

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    if (!input.trim()) return;
    const res = await axios.post(`/api/chat/${matchId}`, { content: input }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (socketRef.current) {
      socketRef.current.emit('message', res.data);
    }
    setInput('');
    setTyping(false);
    if (socketRef.current) {
      socketRef.current.emit('stopTyping', matchId);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!typing) {
      setTyping(true);
      if (socketRef.current) {
        socketRef.current.emit('typing', matchId);
      }
    }
    if (e.target.value === '') {
      setTyping(false);
      if (socketRef.current) {
        socketRef.current.emit('stopTyping', matchId);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-gray-200 rounded px-3 py-1">{msg.content}</span>
          </div>
        ))}
        {isTyping && <div className="text-gray-500">Typing...</div>}
      </div>
      <div className="p-4 border-t flex">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={handleInput}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white px-4 py-1 rounded">Send</button>
      </div>
    </div>
  );
}
