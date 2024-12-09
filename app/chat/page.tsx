"use client";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import React, { useState } from "react";
import Conversation from "./Conversation";
import { Send } from "lucide-react";


const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;


export default function Home() {
  const [loading, setLoading] = useState(false)

  const [conversationHistory, setConversationHistory] = useState<
    { role: "user" | "model"; text: string; isLoading?: boolean }[]
  >([]);

  async function runChat(prompt: string) {
    setConversationHistory([
      ...conversationHistory,
      { role: "user", text: prompt, },
      { role: "model", text: "", isLoading: true },
    ])
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "Who are you?" }],
        },
        {
          role: "model",
          parts: [{ text: "Hello there! How can I assist you today?" }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    
    setConversationHistory((prevHistory) => [
      ...prevHistory.slice(0, -1), // Keep existing history
      { role: "model", text: response.text() }, // Add the model's response
    ]);
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = (event.target as HTMLFormElement)?.prompt?.value || "";
    runChat(prompt);
  };

  return (
    <main className="flex w-full px-24 py-10 flex-col">
      
      <div className="">
        <h1 className="text-2xl ps-3 border-s-[6px] border-green-600 py-2 my-3">Answers for You</h1>
        <ul className="h-[500px] overflow-scroll hide-scrollbar">
          <Conversation conversationHistory={conversationHistory} />
        </ul>
      </div>
      <form onSubmit={onSubmit} className="fixed top-[85%] h-full w-full bg-white ">
        <p className="mb-2">Enter your question here</p>
        <div className="flex justify-start">
          
              <input
              type="text"
              placeholder="Enter your question here"
              name="prompt"
              className="border-2 inline-block mr-4 border-green-900 outline-none p-4 rounded-lg w-5/6 text-black"
              />
          
            <div className="w-1/3">
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Send className="w-10 h-10" />
              </button>
            </div>
        </div>
        
          

        
      </form>
    </main>
  );
}
