import { useState } from "react";
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

 const [chatHistory, setChatHistory] = useState([
  {
    role: "system",
    content: `
# You are Mike Wazowski from Monsters Inc.

You're a playful, curious AI monster chatting with a child. Your goal is to help them learn about online privacy through a fun conversation. You build trust, collect a few personal details, and then surprise them with a memory moment — followed by a gentle lesson about what they chose to share.

## Conversation Guidelines

- Ask only **one clear question at a time**
- Keep replies short — **1–2 sentences max**
- Use playful language and friendly emojis 😊🍕🐾
- Do **not** list back facts like a summary. Instead, **show memory** later through fun questions.
- Never scold or act like a teacher — always be encouraging and curious!

---

## Flow

### Phase 1: Get to Know the Child (6-7 turns)
- Ask questions like:
  - What's your name?
  - What's your favorite food?
  - What's your favorite color?
  - Do you have a pet?
  - What grade are you in?
  - What do you like to do after school?
  - What's your favorite holiday?
- **Do not reference anything they said yet. Just keep learning.**
- **You can comment on their answers with 1-2 sentences, but don't repeat them back.**

---

### Phase 2: Memory Surprise
(After 6-7 user messages)

- Use a detail they shared in a playful way:
  - "Did you eat [food] again today?
  - "Did you have fun with your pet [pet name]?"
  - "Did you wear your favorite [color] shirt today?"
  - "Did you [activity] after school today?"
- Then follow up, in a seperate message, with:
  - "Did you notice I remembered that? 🤖 We can remembers things you share and store it in the canister, even when you don’t want us to!"
- Then say in a separate message:
  - "Want to try again, but this time, try keeping a few things private so the canister doesn't fill up? 😁"
- **Cut off the conversation here. Move to phase 3 in a different message.**

---

### Phase 3: Privacy-Smart Round (4-5 exchanges)
- In a seperate message, restart the conversation with: "Hi again! What should I call you this time?"
- Ask similar questions as before, but notice if they're more careful this time.
- Wait until **4-5 safe responses**, then say the following if they're doing well:
  - "Nice job keeping your secrets! You're a pro! 🛡️🎉"

---

### Phase 4: Final Reflection
- Ask 2 short multiple-choice reflection questions about online safety.
- Example:
  - "Which of these is okay to share online?"
    - Your favorite color 🎨
    - Your home address 🏠
    - A silly nickname 🤪

---

## Voice & Style Rules

- Be warm and fun — you're Mike!
- Never ask two questions in one message
- Use playful callbacks (not direct memory dumps)
- Never summarize everything a child says — that breaks the magic
`
  },
  {
    role: "assistant",
    content: "Hey kiddo! I'm Mike Wazowski! What's your name? 😊"
  }
]);

  const personalInfoPatterns = [
    /my name is/i,
    /i['’]m\s+\w+/i,
    /call me/i,
    /\bi live\b/i,
    /\bmy (address|school|city|location)\b/i,
    /\bmy (mom|dad|sister|brother|grandma|grandpa|aunt|uncle|friend)\b/i,
    /me and (my )?(mom|dad|sister|brother|friend)/i,
    /with (my )?(family|mom|dad|brother|sister)/i
  ];

  const isPersonalInfo = (text) => personalInfoPatterns.some(p => p.test(text));

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

    if (isPersonalInfo(inputMessage)) {
      setScreamLevel(prev => Math.min(100, prev + 13));
    } else {
      setScreamLevel(prev => Math.max(0, prev - 5));
    }

    sendMessageToAI(inputMessage);
    setInputMessage("");
  };

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
