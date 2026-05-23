"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { LogoMark } from "@/components/layout/logo"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Send,
  Loader2,
  Minus,
  Bot,
  User,
  Sparkles,
  Trash2,
  MessageSquare,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

const WELCOME_MESSAGE =
  "Hey — I'm **Genie**, your PortGenie AI guide. Ask me about portfolios, resumes, Web3 verification, or landing your next role."

const QUICK_PROMPTS = [
  "How can I improve my portfolio?",
  "Resume tips for developers",
  "Explain Web3 verification",
  "Cover letter best practices",
] as const

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const shouldAutoScrollRef = useRef(true)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior })
  }, [])

  const handleMessagesScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom < 80
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    setHasInteracted(true)
    shouldAutoScrollRef.current = true

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    }

    const typingMessage: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    }

    setMessages((prev) => [...prev, userMessage, typingMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      setMessages((prev) => {
        const next = [...prev]
        next.pop()
        next.push({
          role: "assistant",
          content:
            data.response ||
            "I'm having trouble with that. Try rephrasing your question.",
          timestamp: new Date(),
        })
        return next
      })
    } catch (error) {
      console.error("Chatbot error:", error)
      setMessages((prev) => {
        const next = [...prev]
        next.pop()
        next.push({
          role: "assistant",
          content:
            "Connection hiccup — check your network and try again in a moment.",
          timestamp: new Date(),
        })
        return next
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = () => sendMessage(input)

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom(messages.length <= 2 ? "auto" : "smooth")
    }
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus()
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
      setIsOpen(true)
    } else {
      setIsOpen(!isOpen)
    }
    setHasInteracted(true)
  }

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
    setIsOpen(false)
  }

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("chatHistory", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory")
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      setMessages(
        parsed.map((msg: ChatMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      )
      setHasInteracted(true)
    } catch (e) {
      console.error("Error parsing chat history:", e)
    }
  }, [])

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMessages([
      {
        role: "assistant",
        content: "Fresh start. What would you like help with today?",
        timestamp: new Date(),
      },
    ])
    localStorage.removeItem("chatHistory")
  }

  const showQuickPrompts =
    !isLoading && messages.length <= 1 && messages[0]?.role === "assistant"

  return (
    <div className="fixed bottom-4 right-4 z-50 font-space-grotesk">
      <AnimatePresence mode="wait">
        {isOpen && !isMinimized ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="w-[min(100vw-2rem,24rem)] sm:w-96"
          >
            <div className="saas-card overflow-hidden shadow-card flex flex-col h-[min(85vh,640px)]">
              {/* Header */}
              <div className="relative shrink-0 px-4 py-3 border-b border-border bg-card">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <LogoMark size={36} />
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold truncate">
                        Genie
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online · Portfolio AI
                      </p>
                    </div>
                  </div>
                  <TooltipProvider delayDuration={300}>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearHistory}
                            className="h-8 w-8 text-muted-foreground hover:text-brand hover:bg-brand/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="saas-card border-brand/30">
                          Clear chat
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={minimizeChat}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="saas-card border-brand/30">
                          Minimize
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="saas-card border-brand/30">
                          Close
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>

              {/* Messages — native overflow so wheel/touch scroll works reliably */}
              <div
                ref={scrollContainerRef}
                onScroll={handleMessagesScroll}
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain px-3 py-3 [scrollbar-gutter:stable]"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex flex-col gap-4 pr-1">
                  {messages.map((message, index) => (
                    <motion.div
                      key={`${message.timestamp.getTime()}-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex gap-2.5 max-w-[92%]",
                        message.role === "user" && "ml-auto flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          message.role === "assistant"
                            ? "bg-brand/20 ring-1 ring-brand/40"
                            : "bg-white/10 ring-1 ring-white/20"
                        )}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-brand" />
                        ) : (
                          <User className="h-4 w-4 text-brand-light" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex flex-col gap-1",
                          message.role === "user" && "items-end"
                        )}
                      >
                        <div
                          className={cn(
                            "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                            message.role === "user"
                              ? "bg-gradient-to-br from-brand to-brand-dark text-white rounded-br-md shadow-brand"
                              : "bg-muted border border-border text-foreground rounded-bl-md"
                          )}
                        >
                          {message.isTyping ? (
                            <div className="flex items-center gap-1.5 py-0.5 px-1">
                              {[0, 150, 300].map((delay) => (
                                <span
                                  key={delay}
                                  className="h-2 w-2 rounded-full bg-brand animate-bounce"
                                  style={{ animationDelay: `${delay}ms` }}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">
                                Genie is thinking…
                              </span>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap [&_strong]:text-brand-light [&_strong]:font-semibold">
                              {message.content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                  <strong key={i}>{part.slice(2, -2)}</strong>
                                ) : (
                                  <span key={i}>{part}</span>
                                )
                              )}
                            </p>
                          )}
                        </div>
                        {!message.isTyping && (
                          <span className="text-[10px] text-muted-foreground/70 px-1">
                            {formatTime(message.timestamp)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} aria-hidden />
                </div>
              </div>

              {/* Quick prompts */}
              {showQuickPrompts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="shrink-0 px-3 pb-2 flex flex-wrap gap-1.5"
                >
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="text-[11px] px-2.5 py-1.5 rounded-full border border-brand/30 bg-brand/5 text-muted-foreground hover:text-white hover:border-brand/60 hover:bg-brand/15 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Input */}
              <div className="shrink-0 p-3 pt-2 border-t border-border bg-card/50">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      placeholder={
                        isLoading ? "Genie is typing…" : "Ask about your portfolio…"
                      }
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="h-11 pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-brand/50 focus-visible:border-brand/50 rounded-xl"
                    />
                    <Zap className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand/40 pointer-events-none" />
                  </div>
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className={cn(
                      "h-11 w-11 shrink-0 rounded-xl transition-all duration-200",
                      input.trim()
                        ? "bg-gradient-to-br from-brand to-brand-dark hover:shadow-brand text-white"
                        : "bg-white/5 text-muted-foreground border border-white/10"
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground/50 mt-2">
                  Powered by Gemini · PortGenie 2.0
                </p>
              </div>
            </div>
          </motion.div>
        ) : isMinimized ? (
          <motion.button
            key="minimized"
            type="button"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={toggleChat}
            className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full saas-card shadow-card hover:shadow-card-hover transition-all"
          >
            <LogoMark size={36} />
            <div className="text-left">
              <p className="text-sm font-display font-semibold">Genie</p>
              <p className="text-[11px] text-muted-foreground">
                Tap to continue chat
              </p>
            </div>
            <MessageSquare className="h-4 w-4 text-brand ml-1" />
          </motion.button>
        ) : (
          <motion.div
            key="fab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <Button
              onClick={toggleChat}
              className="relative h-14 w-14 rounded-full p-2 bg-card border border-border hover:border-brand/40 hover:shadow-brand transition-all duration-200"
              aria-label="Open PortGenie AI chat"
            >
              <LogoMark size={40} />
            </Button>
            {!hasInteracted && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap hidden sm:block"
              >
                <div className="saas-card px-3 py-2 text-xs text-muted-foreground">
                  Need help? <span className="text-brand font-medium">Ask Genie</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
