import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen transition-colors duration-1000 overflow-x-hidden selection:bg-secondary/30">
            <main className="relative z-10 container mx-auto px-6 pt-32 pb-12 max-w-7xl">
                {children}
            </main>
        </div>
    );
};

export default Layout;
