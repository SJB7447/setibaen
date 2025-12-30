import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const Card = ({ children, className, hover = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -5, boxShadow: '0 20px 40px -15px rgba(139, 92, 246, 0.15)' } : {}}
            className={cn(
                'card transition-all duration-300',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
