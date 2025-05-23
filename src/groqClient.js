import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Initialize the Groq client
export async function fetchChatCompletion(messages) {
  return groq.chat.completions.create({
    messages,
    model: "llama3-70b-8192",
  });
}

