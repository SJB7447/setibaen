import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const Button = ({ children, className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-primary text-surface shadow-lg hover:shadow-primary/30 border border-white/5 backdrop-blur-sm',
        secondary: 'bg-surface/80 backdrop-blur-md border border-primary/10 text-primary hover:bg-white/50 shadow-md',
        outline: 'border-2 border-primary text-primary hover:bg-primary/5',
        ghost: 'text-muted hover:text-primary hover:bg-primary/5',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'px-8 py-3 rounded-xl font-heading font-medium transition-all duration-300 flex items-center justify-center gap-2 tracking-wide',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
