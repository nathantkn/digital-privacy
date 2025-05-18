import React from 'react';
import "../styles/SpeechBubble.css";

const SpeechBubble = ({ type, isLoading, message, loadingText }) => {
    return (
        <div className={`speech-bubble ${type}-bubble`}>
            <div className="message-text">
            {isLoading ? (
                <span className="loading-dots">{loadingText}<span>.</span><span>.</span><span>.</span></span>
            ) : message}
            </div>
            <div className={`speech-pointer ${type}-pointer`}></div>
        </div>
    );
};

export default SpeechBubble;