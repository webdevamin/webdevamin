'use client';

import { useState, useEffect } from 'react'

const Icon = ({ icon, size, classes }) => {
    const [currentSize, setCurrentSize] = useState(size || 'sm');

    // Handle responsive sizing on client side only
    useEffect(() => {
        if (size) return; // If specific size is provided, use that

        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setCurrentSize('xs');
            } else if (width < 1024) {
                setCurrentSize('sm');
            } else {
                setCurrentSize('lg');
            }
        };

        // Set initial size
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [size]);

    // For Lucide React, we'll create a simple wrapper component
    // The actual icon components will be passed as children
    return (
        <div className={`transition-all ease-linear duration-300
            hover:opacity-70 ${classes || ''} hover:rotate-[360deg]
            text-base sm:text-lg lg:text-xl`}>
            {icon}
        </div>
    )
}

export default Icon