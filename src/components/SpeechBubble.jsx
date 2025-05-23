import "../styles/SpeechBubble.css";

const SpeechBubble = ({ type, isLoading, message, isTyping }) => {
    return (
        <div className={`speech-bubble ${type}-bubble`}>
            <div className="message-text">
            {isLoading && type === "mike" ? (
                <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            ) : isTyping && type === "boo" ? (
                <span className="loading-dots typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            ) : message}
            </div>
            <div className={`speech-pointer ${type}-pointer`}></div>
        </div>
    );
};

export default SpeechBubble;