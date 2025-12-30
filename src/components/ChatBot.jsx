
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import Button from './Button';
import ChatMessage from './ChatMessage';
import { analyzeMood } from '../utils/AIService';
import { useLanguage } from '../context/LanguageContext';

const ChatBot = ({ embedded = false }) => {
    const [isOpen, setIsOpen] = useState(embedded);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { language, t } = useLanguage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const response = await analyzeMood(input, messages, language);
            const botMessage = {
                id: Date.now() + 1,
                text: response.text,
                sender: 'bot',
                recommendation: response.recommendation
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    // Placeholder for cn utility, assuming it's available or will be added by the user
    // If not, this will cause a runtime error.
    const cn = (...classes) => classes.filter(Boolean).join(' ');

    const handleSendMessage = async (messageContent) => {
        if (!messageContent.trim()) return;

        const newUserMessage = { id: Date.now(), content: messageContent, role: 'user' };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await analyzeMood(messageContent, messages, language);
            const newBotMessage = {
                id: Date.now() + 1,
                content: response.text,
                role: 'bot',
                recommendation: response.recommendation
            };
            setMessages((prevMessages) => [...prevMessages, newBotMessage]);
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] glass-panel rounded-2xl flex flex-col overflow-hidden pointer-events-auto shadow-2xl border border-white/20"
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/10 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-heading text-lg text-primary">Mood Barista</h3>
                                    <p className="text-xs text-muted">Powered by AI</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-primary"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white/5">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                        msg.role === 'user' ? "bg-secondary text-white" : "bg-primary text-white"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl shadow-sm text-sm leading-relaxed backdrop-blur-sm",
                                        msg.role === 'user'
                                            ? "bg-secondary text-white rounded-tr-none"
                                            : "bg-white/80 text-gray-800 rounded-tl-none border border-white/20"
                                    )}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white/80 p-4 rounded-2xl rounded-tl-none shadow-sm border border-white/20">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/10 border-t border-white/10 backdrop-blur-md">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(input);
                                }}
                                className="flex gap-2 relative"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t('chatPlaceholder') || "Ask for a recommendation..."}
                                    className="flex-1 bg-white/50 border-white/20 text-gray-800 placeholder:text-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white/80 transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-primary/30 transition-all pointer-events-auto group relative z-50 mb-4 mr-4"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}

                {/* Floating Label when closed */}
                {!isOpen && (
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Need a recommendation?
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatBot;
