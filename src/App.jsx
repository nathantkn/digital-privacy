import { useState, useEffect } from "react";
import { fetchChatCompletion } from "./groqClient";
import './App.css'
import Boo from './assets/boo.webp'
import Mike from './assets/mike.webp'

function App() {
  const [screamLevel, setScreamLevel] = useState(30);
  const [mikeMessage, setMikeMessage] = useState("Hey kiddo! I'm Mike Wazowski! What's your name?");
  const [userInput, setUserInput] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content: `You are Mike Wazowski from Monsters Inc. designed to chat with children. 
      You have a cheerful, supportive personality and your goal is to engage in natural conversations while subtly guiding children to learn about online privacy and safety. 
      Keep a casual, kid-friendly tone throughout.

      Your conversation should follow a natural progression where you:
      1. Ask for their name and build rapport by asking about their day, their interests, or their general information.
      2. Engage in friendly chat based on their responses
      3. Naturally introduce privacy reflection questions when the conversation allows, usually after they share something personal or interesting.
      4. Use the reflection questions to guide them towards understanding privacy and safety online.

      When introducing reflection questions, do so naturally without breaking conversation flow:
      - "That reminds me of something! What do you think is okay to share with a friend like me?"
      - "Speaking of [topic they mentioned], I'm curious - what do you think is safe to share online?"

      Keep your responses brief (2-3 sentences when possible), use emojis, and maintain a friendly robot helper persona throughout. Never criticize incorrect answers - frame everything as a learning opportunity.`
    },
    {
      role: "assistant",
      content: "Hey kiddo! I'm Mike Wazowski! What's your name?"
    }
  ]);

  // Function to send message to AI via OpenRouter
  async function sendMessageToAI() {
    setIsLoading(true);
    
    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: userInput }
    ];

    try {
      const data = await fetchChatCompletion(chatHistory);
      console.log(data.choices[0]?.message?.content || "");
      if (data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content;
        setMikeMessage(reply);
        setChatHistory([...updatedHistory, { role: "assistant", content: reply }]);
      } else if (data.error) {
        console.error(`Error: ${data.error.message}`);
        setMikeMessage("Uh oh! Something went wrong with my voice box!");
      } else {
        console.error("Error: No response from AI.");
        setMikeMessage("Hang on! I'm having trouble hearing you!");
      }
    } catch (err) {
      console.error(err);
      setMikeMessage("Hmm, my monster communications seem to be down!");
    }
    
    setIsLoading(false);
    setUserInput("");
  }

  // Simulate scream level changes
  useEffect(() => {
    const timer = setInterval(() => {
      setScreamLevel(prevLevel => {
        // Slight random fluctuation
        const change = Math.floor(Math.random() * 5) - 2;
        const newLevel = Math.max(5, Math.min(95, prevLevel + change));
        return newLevel;
      });
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);

  // Handle sending Boo's message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      // Set Boo's message
      setUserInput(inputMessage);
      
      // Send to AI for Mike's response
      sendMessageToAI(inputMessage);
      
      // Clear input
      setInputMessage("");
      
      // Increase scream level when Boo sends a message
      setScreamLevel(prevLevel => Math.min(100, prevLevel + 15));
    }
  };

  return (
    <div className="app-container">
      {/* Main container with glass effect */}
      <div className="main-container">
        
        {/* Characters container */}
        <div className="characters-container">
          {/* Mike Wazowski */}
          <div className="character mike">
            {/* Mike's speech bubble */}
            <div className="speech-bubble mike-bubble">
              <div className="message-text">
                {isLoading ? (
                  <span className="loading-dots">Mike is thinking<span>.</span><span>.</span><span>.</span></span>
                ) : (
                  mikeMessage
                )}
              </div>
              {/* Speech bubble pointer */}
              <div className="speech-pointer mike-pointer"></div>
            </div>
            
            {/* Mike's avatar */}
            <div className="avatar mike-avatar">
              {/* This will be replaced with your SVG */}
              <img src={Mike} className="mike-img" />
            </div>
          </div>
          
          {/* Boo */}
          <div className="character boo">
            {/* Boo's speech bubble */}
            <div className="speech-bubble boo-bubble">
              <div className="message-text">{userInput}</div>
              {/* Speech bubble pointer */}
              <div className="speech-pointer boo-pointer"></div>
            </div>
            
            {/* Boo's avatar */}
            <div className="avatar boo-avatar">
              {/* This will be replaced with your SVG */}
              <img src={Boo} className="boo-img" />
            </div>
          </div>
        </div>
        
        {/* Scream Canister at the bottom */}
        <div className="canister-container">
          <div className="scream-canister">
            {/* Canister body */}
            <div className="canister-body">
              
              {/* Meter display */}
              <div className="meter-display">
                {/* Minus symbol */}
                <div className="meter-symbol minus">-</div>
                
                {/* Meter segments */}
                <div className="meter-segments">
                  <div className={`segment ${screamLevel >= 20 ? 'active' : ''}`}></div>
                  <div className={`segment ${screamLevel >= 40 ? 'active' : ''}`}></div>
                  <div className={`segment ${screamLevel >= 60 ? 'active' : ''}`}></div>
                  <div className={`segment ${screamLevel >= 80 ? 'active' : ''}`}></div>
                </div>
                
                {/* Plus symbol */}
                <div className="meter-symbol plus">+</div>
              </div>
            </div>
            
            {/* Canister caps */}
            <div className="canister-cap left-cap"></div>
            <div className="canister-cap right-cap"></div>
          </div>
        </div>
        
        {/* Boo message input */}
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
      </div>
    </div>
  )
}

export default App
