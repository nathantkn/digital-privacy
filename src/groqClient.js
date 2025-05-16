import Groq from "groq-sdk";
const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

export async function fetchChatCompletion(messages) {
  return groq.chat.completions.create({
    messages: messages,
    model: "llama-3.3-70b-versatile",
  });
}