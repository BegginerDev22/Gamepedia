import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Shield } from 'lucide-react';
import { ChatMessage } from '../types';

interface LiveChatProps {
  matchId: string;
  teamA: string;
  teamB: string;
}

const MOCK_MESSAGES: string[] = [
  "What a spray transfer!",
  "Team Soul looking strong today",
  "GodL need to rotate faster",
  "Drop location clash incoming?",
  "OP gameplay",
  "Jonathan is on another level",
  "Zone luck is real",
  "Who is IGL for Team XSpark?",
  "Predictions?",
  "Lag?",
  "1v4 clutch loading...",
  "GGWP",
  "Admin pause please",
  "Where is the stream link?",
  "Spower entry fragging like a beast"
];

const MOCK_USERS = ["User123", "BgmiFan_99", "SniperKing", "ZoneWarrior", "EsportsLover", "TrollFace"];

export const LiveChat: React.FC<LiveChatProps> = ({ matchId, teamA, teamB }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'sys-1', user: 'System', text: 'Welcome to the live match chat. Be respectful.', timestamp: new Date().toISOString(), isSystem: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom safely
  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollable = chatContainerRef.current;
      // Using scrollTo on the container prevents the whole window from scrolling
      scrollable.scrollTo({
        top: scrollable.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance to add a message every 3 seconds
        const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
        const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const teamSupport = Math.random() > 0.5 ? teamA : teamB;

        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          user: randomUser,
          text: randomMsg,
          timestamp: new Date().toISOString(),
          teamSupport
        };

        setMessages(prev => [...prev.slice(-50), newMsg]); // Keep last 50 messages
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [teamA, teamB]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
        <h3 className="font-heading font-bold text-slate-900 dark:text-white flex items-center">
          <MessageSquare size={18} className="mr-2 text-gamepedia-blue" /> Live Chat
        </h3>
        <span className="flex items-center text-xs text-green-500 font-bold">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span> 1.2k Online
        </span>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
            {msg.isSystem ? (
              <div className="w-full text-center my-2">
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            ) : (
              <div className={`max-w-[85%] ${msg.user === 'You' ? 'bg-gamepedia-blue text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} rounded-lg p-2.5 shadow-sm`}>
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className={`text-xs font-bold ${msg.user === 'You' ? 'text-blue-100' : 'text-slate-900 dark:text-slate-200'}`}>
                    {msg.user}
                  </span>
                  {msg.teamSupport && msg.user !== 'You' && (
                     <span className="text-[9px] px-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        {msg.teamSupport} Fan
                     </span>
                  )}
                </div>
                <p className={`text-sm ${msg.user === 'You' ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>{msg.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Say something..."
          className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-950 border focus:border-gamepedia-blue rounded-lg text-sm outline-none dark:text-white transition-colors"
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="p-2 bg-gamepedia-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};