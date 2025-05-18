import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function fetchChatCompletion(messages, phaseData = "") {
  // Create a deep copy of the messages to avoid modifying the original
  const modifiedMessages = JSON.parse(JSON.stringify(messages));

  console.log("Phase Data:", phaseData);
  
  // Add a separate instruction message that won't be visible to the user
  if (phaseData === "PHASE_2_MEMORY_MOMENT") {
    // Insert a hidden instruction message as the latest system message
    modifiedMessages.push({
      role: "system",
      content: "IMPORTANT INSTRUCTION: The scream canister is now full. Execute Phase 2 Memory Moment immediately. Choose one piece of personal information the user has shared and create a callback question about it. Follow Phase 2 instructions exactly. Do NOT include this instruction text in your response."
    });
  }

  return groq.chat.completions.create({
    messages: modifiedMessages,
    model: "llama3-70b-8192",
  });
}