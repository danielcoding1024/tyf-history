import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assetsConfig } from '../config/assets.config';
import { getRandomQuestions } from '../config/questions.config';
import { BreathingAnimation } from '../components/animations/BreathingAnimation';
import './Chat.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const API_URL = 'http://tyfhistory.com/api/chat';

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const returnTo = (location.state as { returnTo?: string })?.returnTo || '/home';

  // Initialize greeting and suggested questions (English only)
  useEffect(() => {
    const greeting = 'Hello, I am your digital history guide. How can I help you?';

    setMessages([
      {
        id: 'greeting',
        text: greeting,
        isUser: false,
        timestamp: new Date(),
      },
    ]);

    setSuggestedQuestions(getRandomQuestions('EN'));
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleBack = () => navigate(returnTo);

  const appendBotMessage = (text: string) => {
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const appendErrorMessage = (errorMessage?: string) => {
    let message = 'Sorry, an error occurred. Please try again later.';
    if (errorMessage) {
      // Show user-friendly error messages
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        message = 'Network error: Unable to connect to the server. Please check your internet connection.';
      } else if (errorMessage.includes('CORS')) {
        message = 'CORS error: The server is not allowing requests from this origin.';
      } else if (errorMessage.includes('HTTP 404')) {
        message = 'API endpoint not found. Please contact support.';
      } else if (errorMessage.includes('HTTP 500')) {
        message = 'Server error: The API server encountered an internal error.';
      } else if (errorMessage.includes('HTTP 403')) {
        message = 'Access forbidden: You do not have permission to access this resource.';
      }
    }
    appendBotMessage(message);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = (text ?? inputText).trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const requestBody = {
        question: messageText,
      };

      console.log('Sending chat request to:', API_URL);
      console.log('Request body:', requestBody);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Check for different possible response formats
      // API returns: {"lang":"en","answer":"...","tags":[]}
      let replyText = '';
      if (data && typeof data.answer === 'string') {
        replyText = data.answer;
      } else if (data && typeof data.reply === 'string') {
        replyText = data.reply;
      } else if (data && typeof data.response === 'string') {
        replyText = data.response;
      } else if (typeof data === 'string') {
        replyText = data;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format. Expected answer, reply, response, or string.');
      }

      appendBotMessage(replyText);

      // Refresh suggested questions
      setSuggestedQuestions(getRandomQuestions('EN'));
    } catch (err) {
      console.error('Chat error details:', err);
      let errorMessage = '';
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        errorMessage = String(err);
      }
      appendErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (q: string) => handleSendMessage(q);

  return (
    <div className="chat-page">
      <div className="chat-background">
        <div className="chat-header">
          <button className="chat-back-button" onClick={handleBack}>
            <img src={assetsConfig.icons.back} alt="Back" />
          </button>

          <h2 className="chat-title">Digital Avatar Priest</h2>
        </div>

        <div className="chat-content">
          <div className="chat-greeting-area">
            <div
              className="chat-greeting-bubble"
              style={{
                backgroundImage: `url(${assetsConfig.chat.bubbleImage})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              <p>{messages[0]?.text || ''}</p>
            </div>

            <div className="chat-priest-model">
              <BreathingAnimation>
                <img src={assetsConfig.chat.priestModel} alt="Priest" />
              </BreathingAnimation>
            </div>
          </div>

          <div className="chat-messages">
            {messages.slice(1).map((m) => (
              <div key={m.id} className={`chat-message ${m.isUser ? 'user' : 'bot'}`}>
                <div
                  className="chat-bubble"
                  style={{
                    backgroundImage: `url(${assetsConfig.chat.bubbleImage})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message bot">
                <div className="chat-bubble">
                  <div className="chat-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {suggestedQuestions.length > 0 && (
            <div
              className="chat-suggested-questions"
              style={{
                backgroundImage: `url(${assetsConfig.chat.bubbleImage})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              <h3 className="suggested-title">Suggested Questions</h3>

              <div className="suggested-list">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="suggested-question"
                    onClick={() => handleSuggestedQuestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <button
            className="chat-send-button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};