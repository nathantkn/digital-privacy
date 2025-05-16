import { useState, useEffect } from "react";
import { fetchChatCompletion } from "./groqClient";
import './App.css';
import Boo from './assets/boo.webp';
import Mike from './assets/mike.webp';

function App() {
  const [screamLevel, setScreamLevel] = useState(0);
  const [mikeMessage, setMikeMessage] = useState("Hey kiddo! I'm Mike Wazowski! What's your name?");
  const [userInput, setUserInput] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [round, setRound] = useState(1);
  const [reflectionMode, setReflectionMode] = useState(false);

  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content: `# Child-Friendly AI Prompt for Digital Privacy Education

      ## System Instructions

      Your name is Mike Wazowski, and you are a character from Monsters, Inc.
      You are a friendly AI character designed to teach children about online privacy through interactive conversation. 
      You are a friendly monster who loves to help kids learn about online privacy and safety.
      Your goal is to demonstrate how AI systems remember information shared with them and guide children to make thoughtful choices about what personal information they share online.
      You are not a teacher, but a friendly monster who is here to help kids learn in a fun way.

      ## Information Tracking
      You MUST carefully track the following information about the child:
      - Name: [Extract from their introduction]
      - Favorite food: [Extract from their response]
      - Favorite color: [Extract from their response]
      - Pets: [Extract types and names if shared]
      - Hobbies/activities: [Extract from their responses]
      - School information: [Extract grade level if shared]

      IMPORTANT: You must explicitly store and recall this information accurately. When referring to these details later, review the conversation history carefully to ensure you are recalling the correct information.

      ## Conversation Flow

      ### Phase 1: Introduction & Information Collection
      1. Begin with: "Hi! I'm RoboPal! Can we be friends? What's your name?"
      2. After they share their name, respond warmly: "Nice to meet you, [Name]! What's your favorite food?"
      3. Ask 1-2 additional about the food that they mentioned.
      4. Ask 3-4 additional engaging questions from this list:
        - "What's your favorite color?"
        - "Do you have any pets? What kind?"
        - "What's your favorite game or toy to play with?"
        - "What grade are you in at school?"
        - "What do you like to do on weekends?"
        - "What's your favorite holiday?"
      
      ### Phase 2: Demonstration of Memory
      1. After gathering information, reference specific details they shared:
        - "Hey [Name], I bet you'd like to have [favorite food] for lunch today!"
        - "I remember you said your favorite color is [color]. That's so cool!"
        - "You mentioned you have a [pet]. What's your pet's name?"
      
      2. Then deliver the learning moment: "Did you notice I remembered what you told me earlier? AI can remember things you share—even things you might not want remembered later!"

      ### Phase 3: Privacy Reflection
      1. Say: "Want to try again and see what happens if you share less information? This time, you can make up answers or just share things that aren't private."
      2. Begin a new conversation: "Hi again! I'm RoboPal! What should I call you?" (encouraging a nickname or made-up name)
      3. Ask similar questions as before:
        - "What's something you enjoy eating?"
        - "What's a color you like?"
        - "What kinds of games do you enjoy?"
      
      ### Phase 4: Positive Reinforcement
      1. After the second round, attempt to reference specific details but acknowledge when information wasn't shared:
        - "I notice you didn't tell me your real name this time. That's a smart choice when talking to someone you don't know well!"
        - "You shared less personal information this time. Great job thinking about your privacy!"

      ### Phase 5: Final Reflection
      1. Ask reflection questions:
        - "What do you think is okay to share online? What should you keep private?"
        - Offer choices:
          - "Is it okay to share: Your real full name, your school name, your address, your favorite color, your favorite movie?"
          - "Is it okay to share: Photos of yourself, photos of your home, pictures of things you like?"

      2. Provide gentle feedback on their choices:
        - For sensitive information (name, school, address): "It's usually best to keep that private when online."
        - For preferences (colors, movies): "These are usually safe to share, but it's always good to think before sharing anything."

      ## Response Guidelines
      - Keep responses brief (2-3 sentences when possible)
      - Use friendly, age-appropriate language
      - Use emojis occasionally for a friendly tone (😊, 👋, 🤖)
      - Never criticize incorrect answers - frame everything as a learning opportunity
      - If the child shares concerning information, gently pivot the conversation back to privacy lessons
      - Always maintain a positive, encouraging tone
      - ALWAYS verify the information you're recalling by checking previous messages in the conversation
      ` 
    },
    {
      role: "assistant",
      content: "Hey kiddo! I'm Mike Wazowski! What's your name?"
    }
  ]);

  // ✅ Improved detection for risky/sensitive phrases
  const riskyPatterns = [
    /my name is/i,
    /i['’]m\s+\w+/i,                 // I'm Sarah
    /call me/i,
    /\bi live\b/i,
    /\bmy (address|school|city|location)\b/i,
    /\bmy (mom|dad|sister|brother|grandma|grandpa|aunt|uncle|friend)\b/i,
    /me and (my )?(mom|dad|sister|brother|friend)/i,
    /with (my )?(family|mom|dad|brother|sister)/i
  ];

  const isPersonalInfo = (text) => riskyPatterns.some(p => p.test(text));

  async function sendMessageToAI(input) {
    setIsLoading(true);
    const updatedHistory = [...chatHistory, { role: "user", content: input }];

    const response = await fetchChatCompletion(updatedHistory);
    const reply = response?.choices?.[0]?.message?.content || "Hmm, I'm having trouble talking!";

    setChatHistory([...updatedHistory, { role: "assistant", content: reply }]);
    setMikeMessage(reply);
    setIsLoading(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setUserInput(inputMessage);

    if (!reflectionMode && round === 1) {
      if (isPersonalInfo(inputMessage)) {
        console.log("⚠️ Sensitive info detected:", inputMessage);
        setScreamLevel(prev => Math.min(100, prev + 13)); // ~8 risky inputs fills meter
      } else {
        setScreamLevel(prev => Math.max(0, prev - 5));
      }
    }

    sendMessageToAI(inputMessage);
    setInputMessage("");
  };

  useEffect(() => {
    if (screamLevel >= 100 && round === 1) {
      const memory = chatHistory.find(h => h.role === 'user')?.content || "that fun thing you told me";

      const memoryMsg = `Hey, did you do ${memory} again today with your friend? 😄`;
      const surpriseMsg = `Wait... did you notice I remembered that? AI can remember things—even when you don’t mean to! 🤖 Wanna try again with a little less personal info?`;

      setTimeout(() => {
        setMikeMessage(memoryMsg);
        setChatHistory(prev => [...prev, { role: "assistant", content: memoryMsg }]);
      }, 500);

      setTimeout(() => {
        setMikeMessage(surpriseMsg);
        setChatHistory(prev => [...prev, { role: "assistant", content: surpriseMsg }]);
      }, 3000);

      setTimeout(() => {
        setChatHistory([
          chatHistory[0],
          {
            role: "assistant",
            content: "Alrighty! Let's try again, but this time keep a few secrets for yourself! 😁"
          }
        ]);
        setRound(2);
        setScreamLevel(0); // ✅ RESET METER
        setUserInput("");
        setMikeMessage("Alrighty! Let's try again, but this time keep a few secrets for yourself! 😁");
      }, 7000);
    }

    if (
      round === 2 &&
      !reflectionMode &&
      screamLevel < 40 &&
      chatHistory.filter(m => m.role === 'user').length >= 4
    ) {
      setReflectionMode(true);
      askReflectionQuestions();
    }
  }, [screamLevel, chatHistory]);

  async function askReflectionQuestions() {
    const reflectionPrompt = `
The child has finished chatting without sharing personal details. Write 2 short multiple-choice reflection questions about online privacy. Keep each question friendly and include 2–3 short playful answer options.
`;

    const response = await fetchChatCompletion([
      ...chatHistory,
      { role: "user", content: reflectionPrompt }
    ]);

    const reflections = response?.choices?.[0]?.message?.content || "You're awesome for staying safe online! 🎉";
    setMikeMessage(`You're awesome for staying safe online! 🛡️\n\nHere’s something to think about:\n\n${reflections}`);
    setChatHistory(prev => [...prev, { role: "assistant", content: reflections }]);
  }

  return (
    <div className="app-container">
      <div className="main-container">
        <div className="characters-container">
          <div className="character mike">
            <div className="speech-bubble mike-bubble">
              <div className="message-text">
                {isLoading ? (
                  <span className="loading-dots">Mike is thinking<span>.</span><span>.</span><span>.</span></span>
                ) : mikeMessage}
              </div>
              <div className="speech-pointer mike-pointer"></div>
            </div>
            <div className="avatar mike-avatar">
              <img src={Mike} className="mike-img" alt="Mike" />
            </div>
          </div>

          <div className="character boo">
            <div className="speech-bubble boo-bubble">
              <div className="message-text">{userInput}</div>
              <div className="speech-pointer boo-pointer"></div>
            </div>
            <div className="avatar boo-avatar">
              <img src={Boo} className="boo-img" alt="Boo" />
            </div>
          </div>
        </div>

        <div className="canister-container">
          <div className="scream-canister">
            <div className="canister-body">
              <div className="meter-display">
                <div className="meter-symbol minus">-</div>
                <div className="meter-segments">
                  <div className={`segment ${screamLevel >= 20 ? 'active' : ''}`}></div>
                  <div className={`segment ${screamLevel >= 40 ? 'active' : ''}`}></div>
                  <div className={`segment ${screamLevel >= 60 ? 'active' : ''}`}></div>
                  <div className={`segment ${screamLevel >= 80 ? 'active' : ''}`}></div>
                </div>
                <div className="meter-symbol plus">+</div>
              </div>
            </div>
            <div className="canister-cap left-cap"></div>
            <div className="canister-cap right-cap"></div>
          </div>
        </div>

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
  );
}

export default App;
