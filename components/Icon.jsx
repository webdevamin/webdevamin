import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

    return (
        <FontAwesomeIcon
            icon={icon}
            size={currentSize}
            className={`transition-all ease-linear duration-300
            hover:opacity-70 ${classes || ''} hover:rotate-[360deg]
            text-base sm:text-lg lg:text-xl`}
        />
    )
}

export default Icon