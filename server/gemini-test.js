import { GoogleGenerativeAI } from "@google/generative-ai";

// The client gets the API key from the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyAIluXb5oRqiU9l7LU7GwCGE1m--xGRQjk");

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const response = await model.generateContent("Explain how AI works in a few words");
  console.log(response.response.text());
}

main().catch(console.error);
