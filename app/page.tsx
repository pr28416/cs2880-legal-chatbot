"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageView from "@/components/ui/message";
import { Message } from "@/lib/types/message";
import { Send } from "lucide-react";
import { useState } from "react";
import { SearchResponse } from "./api/search/types";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    const searchResponse = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query: message }),
    });
    const searchData = (await searchResponse.json()) as SearchResponse;

    if (searchData.sections.length === 0) {
      setMessages([
        ...messages,
        {
          role: "assistant",
          content: "I couldn't find any relevant information in the document.",
          sources: [],
        },
      ]);
      return;
    }

    const generateResponse = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ query: message, sections: searchData.sections }),
    });
    const reader = generateResponse.body?.getReader();
    if (!reader) return;

    // Add initial empty assistant message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", sources: searchData.sections },
    ]);

    let partialContent = "";

    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode and append new text
      partialContent += new TextDecoder().decode(value);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content = partialContent;
        return newMessages;
      });
    }
  };

  const handleSend = async (message: string) => {
    if (loading) return;
    setLoading(true);
    setMessages([...messages, { role: "user", content: message, sources: [] }]);
    setInput("");
    await sendMessage(message);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen items-center text-primary bg-sidebar dark:bg-background overflow-hidden">
      {/* Nav bar */}
      <div className="flex flex-row items-center justify-between p-4 w-full">
        <div className="text-lg font-semibold">Legal AI Assistant</div>
      </div>

      {/* Chat container */}
      <div className="h-full w-full max-w-5xl px-4 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-4">
            {messages.map((message, idx) => (
              <MessageView key={idx} message={message} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-3xl tracking-tight font-medium">
            What can I help you with?
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="flex flex-row p-4 mb-2 w-full max-w-5xl px-4 items-center gap-2">
        <Input
          className="h-12 rounded-2xl focus-visible:outline-none focus-visible:ring-0 bg-background dark:bg-muted/50"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
        />
        <Button
          className="rounded-2xl h-12 w-12"
          size="icon"
          onClick={() => handleSend(input)}
          disabled={loading}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
