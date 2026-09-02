import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { BreathingAnimation } from '../components/animations/BreathingAnimation';
import { assetsConfig } from '../config/assets.config';
import { siteCopy, type Language } from '../config/detail-content.config';
import { getAnswer } from '../config/qa.config';
import { getRandomQuestions } from '../config/questions.config';
import {
  buildDashScopeRequest,
  normalizeAssistantText,
  readDashScopeResponse,
  type DashScopeMessage,
} from '../lib/dashscope-chat';
import { useLanguageStore } from '../store/languageStore';
import './Chat.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSessionProps {
  language: Language;
}

const API_URL = '/api/chat';

const createMessage = (text: string, isUser: boolean, prefix: string): Message => ({
  id: `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  text,
  isUser,
  timestamp: new Date(),
});

const ChatSession: React.FC<ChatSessionProps> = ({ language }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const copy = siteCopy[language];
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo || '/home';

  const [messages, setMessages] = useState<Message[]>(() => [
    createMessage(copy.chatGreeting, false, 'greeting'),
  ]);
  const [inputText, setInputText] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
    () => getRandomQuestions(language),
  );
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSuggestedQuestions(getRandomQuestions(language));
  }, [language]);

  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, [messages, isLoading]);

  const getErrorMessage = (errorMessage?: string) => {
    let message = language === 'CN'
      ? '抱歉，服务暂时不可用，请稍后再试。'
      : 'Sorry, the service is temporarily unavailable. Please try again later.';

    if (errorMessage?.includes('Failed to fetch') || errorMessage?.includes('NetworkError')) {
      message = language === 'CN'
        ? '网络连接失败，请检查网络后重试。'
        : 'Network error: unable to connect to the server. Please check your connection.';
    } else if (errorMessage?.includes('HTTP 404')) {
      message = language === 'CN' ? '问答接口暂未找到，请联系管理员。' : 'The chat endpoint was not found. Please contact support.';
    } else if (errorMessage?.includes('HTTP 500')) {
      message = language === 'CN' ? '问答服务出现内部错误，请稍后再试。' : 'The chat server encountered an internal error. Please try again later.';
    } else if (errorMessage?.includes('HTTP 503')) {
      message = language === 'CN'
        ? '问答服务尚未配置 API Key，请完成配置后重试。'
        : 'The chat API key has not been configured yet.';
    } else if (errorMessage?.includes('HTTP 403')) {
      message = language === 'CN' ? '当前请求没有访问权限。' : 'This request is not authorized.';
    }

    return message;
  };

  const refreshSuggestedQuestions = () => {
    setSuggestedQuestions(getRandomQuestions(language));
  };

  const replaceMessageText = (messageId: string, text: string) => {
    setMessages((previous) => previous.map((message) => (
      message.id === messageId ? { ...message, text } : message
    )));
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = (text ?? inputText).trim();
    if (!messageText || isLoading) return;

    const userMessage = createMessage(messageText, true, 'user');
    const botMessage = createMessage('', false, 'bot');
    const requestMessages: DashScopeMessage[] = [...messages, userMessage].map((message) => ({
      role: message.isUser ? 'user' : 'assistant',
      content: message.text,
    }));

    setMessages((previous) => [...previous, userMessage, botMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildDashScopeRequest(requestMessages)),
      });

      const replyText = await readDashScopeResponse(response, (delta) => {
        setMessages((previous) => previous.map((message) => (
          message.id === botMessage.id ? { ...message, text: `${message.text}${delta}` } : message
        )));
      });

      // 非流式兼容响应不会触发 delta 回调，需要补写完整回答。
      replaceMessageText(botMessage.id, normalizeAssistantText(replyText));
      refreshSuggestedQuestions();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Chat request failed:', error);
      const localAnswer = getAnswer(messageText);
      replaceMessageText(
        botMessage.id,
        localAnswer ?? getErrorMessage(error instanceof Error ? error.message : String(error)),
      );
      if (localAnswer) refreshSuggestedQuestions();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-background">
        <header className="chat-header">
          <button
            type="button"
            className="chat-back-button"
            onClick={() => navigate(returnTo)}
            aria-label={language === 'CN' ? '返回上一页' : 'Back'}
          >
            <img src={assetsConfig.icons.back} alt="" aria-hidden="true" />
          </button>
          <h1 className="chat-title">{copy.chatTitle}</h1>
          <LanguageSwitch />
        </header>

        <main className="chat-content">
          <section className="chat-greeting-area" aria-label={copy.chatTitle}>
            <div className="chat-greeting-bubble">
              <p>{messages[0]?.text}</p>
            </div>
            <div className="chat-priest-model" aria-hidden="true">
              <BreathingAnimation>
                <img src={assetsConfig.chat.priestModel} alt="" />
              </BreathingAnimation>
            </div>
          </section>

          <section className="chat-messages" aria-live="polite" aria-label={language === 'CN' ? '对话记录' : 'Conversation'}>
            {messages.slice(1).map((message) => (
              <article key={message.id} className={`chat-message ${message.isUser ? 'user' : 'bot'}`}>
                <div className="chat-bubble">
                  {message.text ? (
                    <p>{message.text}</p>
                  ) : (
                    <div className="chat-loading" aria-label={language === 'CN' ? '正在回答' : 'Preparing an answer'}>
                      <span /><span /><span />
                    </div>
                  )}
                </div>
              </article>
            ))}

            <div ref={messagesEndRef} />
          </section>

          {suggestedQuestions.length > 0 && (
            <section className="chat-suggested-questions">
              <h2 className="suggested-title">{copy.suggestedQuestions}</h2>
              <div className="suggested-list">
                {suggestedQuestions.map((question) => (
                  <button
                    type="button"
                    key={question}
                    className="suggested-question"
                    onClick={() => void handleSendMessage(question)}
                    disabled={isLoading}
                  >
                    <span>{question}</span>
                    <span className="suggested-arrow" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>

        <form
          className="chat-input-area"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSendMessage();
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder={copy.chatPlaceholder}
            aria-label={copy.chatPlaceholder}
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          />
          <button
            type="submit"
            className="chat-send-button"
            disabled={!inputText.trim() || isLoading}
          >
            {copy.send}
          </button>
        </form>
      </div>
    </div>
  );
};

export const Chat: React.FC = () => {
  const { language } = useLanguageStore();
  return <ChatSession language={language} />;
};
