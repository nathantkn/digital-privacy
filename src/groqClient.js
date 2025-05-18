import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function fetchChatCompletion(messages) {
  return groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
  });
}
