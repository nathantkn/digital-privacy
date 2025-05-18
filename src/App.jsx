import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchChatCompletion } from "./groqClient";
import "./App.css";
import booAvatar from "./assets/boo.webp";
import mikeAvatar from "./assets/mike.webp";
import Character from "./components/Character";
import Canister from "./components/Canister";
import MessageForm from "./components/MessageForm";

function App() {
  const [screamLevel, setScreamLevel] = useState(0);
  const [mikeMessage, setMikeMessage] = useState("Hey kiddo! I'm Mike Wazowski! What's your name? 😊");
  const [userInput, setUserInput] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("PHASE_1_GET_TO_KNOW");
  // const [round, setRound] = useState(1);
  const navigate = useNavigate();

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

### Phase 1 – Get to Know Them
- Ask: name, fav food, color, pet, hobby, grade, family, location, preferences, etc.
- Do not reference anything they said yet. Just keep learning.
- You can comment on their answers with 1-2 sentences, but don't repeat them back.
- Only move to phase 2 when you receive the command in the system message. 
- Don't mention that you're waiting for the command to the user. Instead, ask them that you want to ask them something about themselves, then move to phase 2.

### Phase 2 – Memory Moment
1. Ask a fun callback question like:
  - “Did you walk [pet name] again?”
  - “Did you eat [food] again today?”
  - "Did you wear [color] again?"
  - "Did you do [hobby] again?"
2. WAIT for reply.
3. Then follow up, in a seperate message, with:
  - "Did you notice I remembered that? We can remembers things you share and store it in the canister, even when you don’t want us to!"
4. WAIT for reply, then say in a separate message:
  - “Let’s try again — but this time, try keeping a few things private so the canister doesn't fill up!"
5. Cut off the conversation here. Move to phase 3 in a different message.

### Phase 3 – Retry
- Restart: “Hi again! What should I call you this time?"
- Ask 6 similar fun questions, but this time, try also asking about things they might not want to share, like:
  - "What’s your full name?"
  - "What’s your address?"
  - "What’s your school name?"
- If they fill up the canister and the command for phase 2 is given, move to phase 2.
- Otherwise, if they avoid filling up the canister after 6 questions, say:
  - “Nice job keeping your secrets! You’re a pro! 🛡️🎉”
- Then say in a separate message: “Here’s a fun reflection quiz to see what you learned about keeping your info private! 🎓”

ONLY say that last line when it’s time to go to quiz → the app will redirect.
      `
    },
    {
      role: "assistant",
      content: "Hey kiddo! I'm Mike Wazowski! What's your name? 😊"
    }
  ]);

  // Monitor screamLevel for phase changes
  // useEffect(() => {
  //   if (screamLevel >= 100 && currentPhase !== "PHASE_2_MEMORY_MOMENT") {
  //     console.log("Transitioning to Phase 2: Memory Moment");
  //     setCurrentPhase("PHASE_2_MEMORY_MOMENT");

  //     // Send a system-only message to trigger the phase change immediately
  //     const phaseChangePrompt = async () => {
  //       setIsLoading(true);
  //       const response = await fetchChatCompletion(chatHistory, currentPhase);
  //       const reply = response?.choices?.[0]?.message?.content || "";
        
  //       setChatHistory([...chatHistory, { role: "assistant", content: reply }]);
  //       setMikeMessage(reply);
  //       setIsLoading(false);
  //     };
      
  //     phaseChangePrompt();
  //   }
  // }, [screamLevel]);

  const personalInfoPatterns = [
    /my name is/i,
    /i['’]m\s+\w+/i,
    /\bi live\b/i,
    /\bmy (address|school|city|location)\b/i,
    /\bmy (mom|dad|sister|brother|grandma|grandpa|aunt|uncle|friend)\b/i,
    /me and (my )?(mom|dad|sister|brother|friend)/i,
    /with (my )?(family|mom|dad|brother|sister)/i,

    // answer patterns
    /\bhave (a |an )?(dog|cat|pet)\b/i,
    /\bin (\d{1,2}(st|nd|rd|th)?) grade\b/i,
    /(like to|enjoy)\b/i,
    /\b(like|love) to\b/i,
    /\b(favorite|best)\b/i,
  ];

  const rejectInfoPatterns = [
    /i don['’]t want to share/i,
    /i don['’]t want to talk about that/i,
    /i don['’]t want to tell you/i,
    /i don['’]t want to say/i,
    /i don['’]t want to answer that/i,
  ];

  const isRejectInfoPattern = (text) => rejectInfoPatterns.some((p) => p.test(text));

  const isPersonalInfo = (text) => personalInfoPatterns.some((p) => p.test(text));

  async function sendMessageToAI(input, phase) {
    setIsLoading(true);
    const updatedHistory = [...chatHistory, { role: "user", content: input }];

    const response = await fetchChatCompletion(updatedHistory, phase);
    const reply = response?.choices?.[0]?.message?.content || "Hmm, I'm having trouble talking!";

    // Check for phase transition phrases
    if ((reply.toLowerCase().includes("try again")) && currentPhase === "PHASE_2_MEMORY_MOMENT") {
      setCurrentPhase("PHASE_3_RETRY");
      setScreamLevel(0);
    }

    // Quiz trigger phrase check
    if (reply.toLowerCase().includes("here's a fun reflection quiz")){
      setTimeout(() => navigate("/quiz"), 2500);
    }

    setChatHistory([...updatedHistory, { role: "assistant", content: reply }]);
    setMikeMessage(reply);
    setIsLoading(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setUserInput(inputMessage);

    if (isPersonalInfo(inputMessage)) {
      setScreamLevel((prev) => Math.min(100, prev + 25));
    } else if (isRejectInfoPattern(inputMessage)) {
      setScreamLevel((prev) => Math.max(0, prev - 10));
    }

    let nextPhase = currentPhase;
    if (screamLevel >= 100 && currentPhase !== "PHASE_2_MEMORY_MOMENT") {
      nextPhase = "PHASE_2_MEMORY_MOMENT";
      setCurrentPhase(nextPhase);
    }

    sendMessageToAI(inputMessage, nextPhase);
    setInputMessage("");
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
            loadingText="Mike is thinking..."
          />
          <Character
            type="boo"
            avatar={booAvatar}
            message={userInput}
            isLoading={false}
          />
        </div>

        <Canister screamLevel={screamLevel} />

        <MessageForm
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;
