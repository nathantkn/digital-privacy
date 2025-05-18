import React from 'react';
import SpeechBubble from './SpeechBubble';
import "../styles/Character.css";

const Character = ({ type, avatar, message, isLoading, isTyping }) => {
    return (
        <div className={`character ${type}`}>
            <SpeechBubble 
                type={type} 
                message={message} 
                isLoading={isLoading} 
                isTyping={isTyping}
            />
            <div className={`avatar ${type}-avatar`}>
                <img src={avatar} className={`${type}-img`} alt={type} />
            </div>
        </div>
    );
};

export default Character;