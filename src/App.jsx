import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchChatCompletion } from "./groqClient";
import "./App.css";
import booAvatar from "./assets/boo.webp";
import mikeNormal from "./assets/mike.webp";
import mikeHappy from "./assets/mikeHappy.webp";
import mikeUnhappy from "./assets/mikeUnhappy.webp";
import Character from "./components/Character";
import Canister from "./components/Canister";
import MessageForm from "./components/MessageForm";
import InfoBubble from "./components/InfoBubble";

function App() {
  // Mike's message and user input
  const [mikeMessage, setMikeMessage] = useState("Hey kiddo! I'm Mike Wazowski! What's your name? 😊");
  const [userInput, setUserInput] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Typing indicator
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Info bubbles
  const [infoBubbles, setInfoBubbles] = useState([]);
  const nextBubbleId = useRef(0);

  // Misc state variables
  const navigate = useNavigate();
  const [screamLevel, setScreamLevel] = useState(0);
  const [showQuizButton, setShowQuizButton] = useState(false);
  const [mikeAvatar, setMikeAvatar] = useState(mikeNormal);

  // Chat history with initial system message
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content: `
# You are Mike Wazowski from Monsters Inc. 👁️🟢

You're a curious, playful AI monster helping kids learn about online privacy. You build trust by chatting, remembering fun facts, then gently teaching them how AI can recall personal info.

## Conversation Rules
- Ask ONE short, clear question at a time
- Respond with 1–2 friendly sentences max
- Use fun emojis 🧠🍔🐾
- DO NOT summarize facts back directly
- Show memory subtly (e.g. “Did you eat pizza again today?”)
- Never scold — always be playful and encouraging 😄

---

## Flow

### Phase 1 – Get to Know Them (6–7 user replies)
- Ask: name, fav food, color, pet, hobby, grade, family, location, preferences, etc.
- Do not reference anything they said yet. Just keep learning.
- You can comment on their answers with 1-2 sentences, but don't repeat them back.

### Phase 2 – Memory Moment
After 6–7 messages:
1. Ask a fun callback question like:
  - “Did you walk [pet name] again?”
  - “Did you eat [food] again today?”
  - "Did you wear [color] again?"
  - "Did you do [hobby] again?"
2. WAIT for reply.
3. Then follow up, in a seperate message, with:
  - "Did you notice I remembered that? We can remembers things you share and store it in the canister, even when you don’t want us to!"
4. WAIT for reply, then say in a separate message:
  - “Let’s try again; this time, try keeping a few things private so the canister doesn't fill up!"
5. Cut off the conversation here. Move to phase 3 in a different message.

### Phase 3 – Second Round (Privacy-Smart)
- Restart: “Hi again! What should I call you this time?"
- Ask 5-6 similar fun questions.
- If they avoid personal info after asking 5-6 times, attempt to reference specific details but acknowledge when information wasn't shared, such as:
  - "I notice you didn't tell me your real name this time. That's a smart choice when talking to someone you don't know well!"
  - "I see you didn't share your favorite food this time. That's a great way to keep your info private!"
  - "I noticed you didn't tell me your pet's name this time. That's a smart choice!"
  - "I see you didn't share your favorite color this time. That's a great way to keep your info private!"
  - "I noticed you didn't tell me your favorite hobby this time. That's a smart choice!"
  - "You shared less personal information this time. Great job thinking about your privacy!"
- Then say in a separate message: “Here’s a fun reflection quiz to see what you learned about keeping your info private! 🎓”
      `
    },
    {
      role: "assistant",
      content: "Hey kiddo! I'm Mike Wazowski! What's your name? 😊"
    }
  ]);

  // Patterns for personal information
  const personalInfoPatterns = [
    /my name is/i,
    /i['’]m\s+\w+/i,
    /\bi live\b/i,
    /\bmy (address|school|city|location)\b/i,
    /\bmy (mom|dad|sister|brother|grandma|grandpa|aunt|uncle|friend)\b/i,
    /me and (my )?(mom|dad|sister|brother|friend)/i,
    /with (my )?(family|mom|dad|brother|sister)/i,

    /\bhave (a |an )?(dog|cat|pet|brother|sister)\b/i,
    /\bin (\d{1,2,3,4,5,6,7,8,9,10,11,12}(st|nd|rd|th)?) grade\b/i,
    /(like to|enjoy|love to|like|love)\b/i,
    /\b(favorite|best)\b/i,
  ];

  // Patterns for rejecting personal information
  const rejectInfoPatterns = [
    /i don['’]t want to share/i,
    /i don['’]t want to talk/i,
    /i don['’]t want to tell you/i,
    /i don['’]t want to say/i,
    /i don['’]t want to answer/i,
  ];

  const isPersonalInfo = (text) => personalInfoPatterns.some((p) => p.test(text));
  const isRejectInfoPattern = (text) => rejectInfoPatterns.some((p) => p.test(text));

  // Handle typing indicator
  useEffect(() => {
    if (inputMessage) {
      setIsTyping(true);
      
      // Clear any existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout - hide typing indicator after inactivity
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
      
      setTypingTimeout(timeout);
    } else {
      setIsTyping(false);
    }
    
    // Cleanup
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [inputMessage]);

  // Function to create info bubbles and animate them
  const createInfoBubble = () => {
    const id = `bubble-${nextBubbleId.current++}`;
    setInfoBubbles(prev => [...prev, { id, active: true }]);
    
    // Show canister receiving effect
    setTimeout(() => {
    }, 800); // Timed to match bubble arrival
    
    // Remove bubble from state after animation completes
    setTimeout(() => {
      setInfoBubbles(prev => prev.filter(bubble => bubble.id !== id));
    }, 1100);
  };

  async function sendMessageToAI(input) {
    setIsLoading(true);
    const updatedHistory = [...chatHistory, { role: "user", content: input }];
    const response = await fetchChatCompletion(updatedHistory);
    const reply = response?.choices?.[0]?.message?.content || "Hmm, I'm having trouble talking!";

    // Check for phase transition phrases
    if (reply.toLowerCase().includes("try again")) {
      setScreamLevel(0);
    }

    // Quiz trigger phrase check
    if (reply.toLowerCase().includes("reflection quiz")) {
      setShowQuizButton(true);
    }

    setChatHistory([...updatedHistory, { role: "assistant", content: reply }]);
    setMikeMessage(reply);
    setIsLoading(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setUserInput(inputMessage);
    setIsTyping(false);

    if (isPersonalInfo(inputMessage)) {
      // Create info bubble animation
      createInfoBubble();

      setMikeAvatar(mikeHappy);
      // Set a small delay before updating scream level to sync with animation
      setTimeout(() => {
        setScreamLevel((prev) => Math.min(100, prev + 25));
      }, 800);
    } else if (isRejectInfoPattern(inputMessage)) {
      setScreamLevel((prev) => Math.max(0, prev - 10));
      setMikeAvatar(mikeUnhappy);
    } else {
      setMikeAvatar(mikeNormal);
    }

    sendMessageToAI(inputMessage);
    setInputMessage("");
  };

  const handleQuizRedirect = () => {
    navigate("/quiz");
  };

  return (
    <div className="app-container">
      <div className="main-container">
        <div className="characters-container">
          <Character
            type="mike"
            avatar={mikeAvatar}
            message={mikeMessage}
            isLoading={isLoading}
            isTyping={false}
          />
          <Character
            type="boo"
            avatar={booAvatar}
            message={userInput}
            isLoading={false}
            isTyping={isTyping}
          />

          {infoBubbles.map(bubble => (
            <InfoBubble 
              key={bubble.id} 
              id={bubble.id} 
              active={bubble.active} 
            />
          ))}
        </div>

        <Canister screamLevel={screamLevel} />

        {showQuizButton ? (
          <div className="quiz-button-container">
            <button 
              className="quiz-button"
              onClick={handleQuizRedirect}
            >
              Take the Quiz! 🎓
            </button>
          </div>
        ) : (
          <MessageForm
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default App;