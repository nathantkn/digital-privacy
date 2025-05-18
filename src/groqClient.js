import Groq from "groq-sdk";

console.log("Loaded API Key:", import.meta.env.VITE_GROQ_API_KEY); // should show partial key

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function fetchChatCompletion(messages) {
  return groq.chat.completions.create({
    messages,
    model: "llama3.1-70b-8192",
  });
}
