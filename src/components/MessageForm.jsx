import React from 'react';
import "../styles/MessageForm.css";

const MessageForm = ({ inputMessage, setInputMessage, handleSubmit, isLoading }) => {
    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="message-input"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
            />
            <button
                type="submit"
                className={`send-button ${isLoading ? 'disabled' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? 'Sending...' : 'Send'}
            </button>
        </form>
    );
};

export default MessageForm;