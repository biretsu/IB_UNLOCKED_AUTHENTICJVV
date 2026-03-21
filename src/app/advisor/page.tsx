"use client";

import { useState, useRef, useEffect } from "react";
import { aiAcademicAdvisorGuidance } from "@/ai/flows/ai-academic-advisor-guidance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Sparkles, Loader2, SendHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I'm your AI Academic Advisor. I can help you understand which IB subjects align best with your future goals. What's on your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await aiAcademicAdvisorGuidance({ question: userMsg });
      setMessages(prev => [...prev, { role: "bot", content: result.answer }]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Issue",
        description: "I'm having trouble connecting to my knowledge base. Please check your internet or try again later.",
      });
      setMessages(prev => [...prev, { role: "bot", content: "I apologize, but I encountered an error. Please ensure your environment is correctly configured and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "bot", content: "Chat cleared. How can I help you with your IB journey today?" }]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100svh-4rem)] flex flex-col">
      <div className="flex flex-col flex-1 h-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> AI Academic Advisor
            </h1>
            <p className="text-sm text-muted-foreground">Expert guidance for your IB Subject Choices.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden shadow-2xl border-2 bg-background/50 backdrop-blur-sm">
          <CardHeader className="bg-primary text-primary-foreground py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center ring-2 ring-accent/30">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-md font-bold">IB Counseling Assistant</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] text-primary-foreground/70 uppercase tracking-widest font-bold">Online & Ready</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full p-6" ref={scrollRef}>
              <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex w-full animate-fade-in",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}>
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted/80 text-foreground rounded-tl-none border backdrop-blur-md"
                    )}>
                      <div className={cn(
                        "flex items-center gap-2 mb-2 font-black text-[10px] uppercase tracking-tighter opacity-60",
                        msg.role === "user" ? "text-primary-foreground" : "text-primary"
                      )}>
                        {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                        {msg.role === "user" ? "Student" : "Advisor"}
                      </div>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-muted/80 p-4 rounded-2xl rounded-tl-none border shadow-sm flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Consulting files...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-4 border-t bg-muted/20 backdrop-blur-md">
            <form 
              className="flex gap-3 max-w-3xl mx-auto"
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            >
              <Input 
                placeholder="Ask about 4 HLs, Math difficulty, or career paths..."
                className="flex-1 rounded-xl px-6 bg-background h-12 border-2 focus:ring-accent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-xl w-12 h-12 p-0 shadow-lg hover:scale-105 transition-transform">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizontal className="w-5 h-5" />}
              </Button>
            </form>
            <p className="text-[9px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-medium">
              AI guidance should always be verified against official IBO.org and university portals.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
