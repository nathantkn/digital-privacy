import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function BackgroundManager() {
    const location = useLocation();

    useEffect(() => {
        // Set the data-route attribute on the body element
        document.body.setAttribute('data-route', location.pathname);
        
        return () => {
        // Clean up when component unmounts
            document.body.removeAttribute('data-route');
        };
    }, [location.pathname]);

    return null;
}

export default BackgroundManager;