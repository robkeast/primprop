import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import IPhoneFrame from './components/IPhoneFrame';
import MessageBubble from './components/MessageBubble';
import Button from './components/Button';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatHistory = (messages: Message[]): string => {
    return messages.map(msg => `${msg.sender.toUpperCase()}:${msg.text}`).join(' -- ');
  };

  const sendMessage = async (text: string, sender: 'user' | 'ai') => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (sender === 'user') {
      setIsLoading(true);
      setError(null);
      try {
        const history = formatHistory([...messages, newMessage]);
        const requestBody = JSON.stringify({ message: text, history });

        const response = await fetch('https://hook.eu2.make.com/x9st4xqy57d7yf2wkobqvbzjv19cmj32', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        sendMessage(responseText, 'ai');
      } catch (error) {
        console.error('Error:', error);
        setError(`An error occurred while processing your request. Please try again. Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim(), 'user');
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartMessage = (message: string) => {
    setMessages([]); // Clear the message history
    sendMessage(message, 'ai');
  };

  const handleBumpMessage = (message: string) => {
    sendMessage(message, 'ai');
  };

  return (
    <div className="min-h-screen bg-[#2a3439] flex flex-col items-center justify-center p-4">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <Button onClick={() => handleStartMessage("Hi there [First Name]! I'm Chloe from Prime Location Properties. What brings you to explore Dubai's real estate market today?")}>Start</Button>
        <Button onClick={() => handleBumpMessage("Just bumping this up in case you got busy before :)")}>Bump 1</Button>
        <Button onClick={() => handleBumpMessage("Do you still want help?")}>Bump 2</Button>
        <Button onClick={() => handleBumpMessage("I must have the wrong number. Apologies. I will remove your number. Thanks")}>Bump 3</Button>
      </div>
      <IPhoneFrame>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-full p-3 mt-2">
                  <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-800">
            <div className="flex items-center bg-gray-700 rounded-full p-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 outline-none px-2 bg-transparent text-white"
                placeholder="Type a message..."
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className={`ml-2 bg-blue-500 text-white rounded-full p-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                disabled={isLoading}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </IPhoneFrame>
    </div>
  );
};

export default App;