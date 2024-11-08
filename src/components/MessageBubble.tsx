import React from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClass = isUser
    ? 'bg-blue-500 text-white ml-auto' // Changed from 'self-end' to 'ml-auto'
    : 'bg-gray-700 text-white';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[70%] rounded-2xl p-3 ${bubbleClass}`}>
        <p>{message.text}</p>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;