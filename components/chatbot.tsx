"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Loader2, MinusCircle, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your PortGenie Portfolio Guide powered by Gemini AI. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    // Add placeholder for assistant typing animation
    const typingMessage: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    }

    setMessages((prev) => [...prev, userMessage, typingMessage])
    setInput("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot API");
      }

      const data = await response.json();
      
      // Replace typing indicator with actual response
      setMessages((prev) => {
        const newMessages = [...prev];
        // Remove the typing indicator
        newMessages.pop();
        
        // Add the actual response
        newMessages.push({
          role: "assistant",
          content: data.response || "I'm having trouble processing that request. Please try again.",
          timestamp: new Date(),
        });
        
        return newMessages;
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      
      // Replace typing indicator with error message
      setMessages((prev) => {
        const newMessages = [...prev];
        // Remove the typing indicator
        newMessages.pop();
        
        // Add error message
        newMessages.push({
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        });
        
        return newMessages;
      });
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current && !isMinimized) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
  }

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
  }, [messages])

  // Load chat history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory')
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        // Convert string dates back to Date objects
        const formattedHistory = parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(formattedHistory)
      } catch (e) {
        console.error("Error parsing chat history:", e)
      }
    }
  }, [])

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMessages([{
      role: "assistant",
      content: "Chat history cleared. How can I help you today?",
      timestamp: new Date(),
    }])
    localStorage.removeItem('chatHistory')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && !isMinimized ? (
        <Card className="w-80 md:w-96 shadow-xl border-2 border-blue-500/20 rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span>PortGenie Guide</span>
            </CardTitle>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearHistory}
                      className="h-7 w-7 rounded-full text-white hover:bg-blue-700/60"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Clear chat history</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-white hover:bg-blue-700/60"
                      onClick={minimizeChat}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Minimize</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-white hover:bg-blue-700/60"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Close</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 pb-2 bg-gray-50 dark:bg-gray-900">
            <ScrollArea 
              className="h-80" 
              ref={scrollAreaRef}
            >
              <div className="flex flex-col gap-3 pb-1">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3 max-w-[95%] animate-in fade-in duration-200",
                      message.role === "user"
                        ? "ml-auto flex-row-reverse"
                        : ""
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-1 ring-2 ring-white shadow-sm">
                        <Bot className="h-4 w-4 text-white" />
                      </Avatar>
                    )}
                    
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 ring-2 ring-white shadow-sm">
                        <User className="h-4 w-4 text-white" />
                      </Avatar>
                    )}
                    
                    <div 
                      className={cn(
                        "px-4 py-2.5 rounded-2xl shadow-sm text-sm",
                        message.role === "user"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      )}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]"></div>
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]"></div>
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]"></div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t bg-white dark:bg-gray-900">
            <div className="flex w-full items-center gap-2">
              <Input
                ref={inputRef}
                placeholder={isLoading ? "Waiting for response..." : "Ask for portfolio help..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-gray-300 dark:border-gray-700 focus-visible:ring-blue-500"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className={cn(
                  "rounded-full transition-all duration-200",
                  input.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 dark:bg-gray-700"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : isMinimized ? (
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer flex items-center gap-2 pr-4 transition-all hover:shadow-xl hover:pr-5 animate-in slide-in-from-right"
          onClick={toggleChat}
        >
          <Avatar className="h-8 w-8 rounded-full bg-white/20">
            <Bot className="h-5 w-5 text-white" />
          </Avatar>
          <span className="text-sm font-medium">PortGenie Guide</span>
        </div>
      ) : (
        <Button
          className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-xl animate-in fade-in zoom-in"
          onClick={toggleChat}
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
} 