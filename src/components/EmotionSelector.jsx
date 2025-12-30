import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Zap, Coffee, Moon } from 'lucide-react';
import { cn } from '../utils/cn';
import { useLanguage } from '../context/LanguageContext';

const emotions = [
    { id: 'happy', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'stressed', icon: Zap, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'tired', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'excited', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-50' },
];

const EmotionSelector = ({ onSelect, selected }) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {emotions.map((emotion) => (
                <button
                    key={emotion.id}
                    onClick={() => onSelect(emotion.id)}
                    className="flex flex-col items-center group transition-transform hover:scale-110 active:scale-95"
                >
                    <div className={cn(
                        "p-4 rounded-full transition-all duration-300 relative border-2",
                        selected === emotion.id
                            ? `${emotion.bg} border-${emotion.color.split('-')[1]}-500 shadow-md scale-110`
                            : "bg-surface border-transparent shadow-sm group-hover:shadow-md"
                    )}>
                        <emotion.icon size={32} strokeWidth={1.5} className={cn("transition-colors", selected === emotion.id ? emotion.color : "text-gray-400 group-hover:text-gray-600")} />
                    </div>
                    <span className={cn(
                        "mt-3 text-sm font-medium transition-colors font-heading",
                        selected === emotion.id ? "text-primary" : "text-muted group-hover:text-primary"
                    )}>
                        {t(emotion.id)}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default EmotionSelector;
