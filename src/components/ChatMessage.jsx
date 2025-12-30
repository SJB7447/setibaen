import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import CafeCard from './CafeCard';

const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                }`}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`flex flex-col gap-2 max-w-[80%]`}>
                <div className={`p-3 rounded-2xl text-sm ${isUser
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-surface border border-white/10 text-text rounded-tl-none'
                    }`}>
                    {message.text}
                </div>

                {message.recommendation && (
                    <div className="w-64">
                        <CafeCard cafe={message.recommendation} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChatMessage;
