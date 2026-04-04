import { useState, useRef, useEffect } from "react";
import { useChatWithMentor, ChatMessageBodyContext, ChatMessageBodyConversationHistoryItem } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Send, Bot, User, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  relatedExams?: string[];
  relatedCareers?: string[];
  error?: boolean;
};

export default function AiMentor() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [context, setContext] = useState<string>("general");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm your AI Mentor. I'm here to help you navigate your academic journey, prepare for exams, or plan your career. What would you like to discuss today?`,
      suggestions: ["How do I prepare for UPSC?", "What careers are good for a math student?", "I need help planning my study schedule."]
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChatWithMentor();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string = input) => {
    if (!text.trim() || chatMutation.isPending) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Prepare conversation history
    const history: ChatMessageBodyConversationHistoryItem[] = messages
      .filter(m => m.id !== "welcome" && !m.error)
      .map(m => ({ role: m.role, content: m.content }));

    chatMutation.mutate(
      { 
        data: { 
          message: text, 
          studentId: user?.id, 
          context: context as ChatMessageBodyContext,
          conversationHistory: history
        } 
      },
      {
        onSuccess: (data) => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant",
            content: data.reply,
            suggestions: data.suggestions,
            relatedExams: data.relatedExams,
            relatedCareers: data.relatedCareers
          }]);
        },
        onError: () => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant",
            content: "I'm sorry, I encountered an error while processing your request. Please try again.",
            error: true
          }]);
        }
      }
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-theme(spacing.16))] md:h-[100vh] flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            AI Mentor
          </h1>
          <p className="text-muted-foreground">Always-on guidance tailored to your academic profile.</p>
        </div>
        <Select value={context} onValueChange={setContext}>
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder="Chat Context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Guidance</SelectItem>
            <SelectItem value="exam">Exam Prep</SelectItem>
            <SelectItem value="career">Career Planning</SelectItem>
            <SelectItem value="study">Study Strategies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur overflow-hidden flex flex-col shadow-xl">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center border ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/10 border-accent/20 text-accent'
                  }`}>
                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  
                  <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : msg.error 
                          ? 'bg-destructive/10 border border-destructive/20 text-destructive rounded-tl-sm'
                          : 'bg-background border border-border rounded-tl-sm'
                    }`}>
                      {msg.error && <AlertCircle className="h-4 w-4 mb-2" />}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>

                    {msg.role === 'assistant' && !msg.error && (
                      <div className="flex flex-col gap-2 w-full mt-1">
                        {msg.relatedExams && msg.relatedExams.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {msg.relatedExams.map(ex => (
                              <Badge key={ex} variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">{ex}</Badge>
                            ))}
                          </div>
                        )}
                        {msg.relatedCareers && msg.relatedCareers.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {msg.relatedCareers.map(c => (
                              <Badge key={c} variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">{c}</Badge>
                            ))}
                          </div>
                        )}
                        {msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {msg.suggestions.map(s => (
                              <Button 
                                key={s} 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-auto py-1.5 px-3 rounded-full border-primary/30 text-primary hover:bg-primary/10"
                                onClick={() => handleSend(s)}
                              >
                                <Sparkles className="h-3 w-3 mr-1.5" />
                                {s}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {chatMutation.isPending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="p-4 rounded-2xl bg-background border border-border rounded-tl-sm flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background/50 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 relative"
          >
            <Input 
              placeholder="Ask anything about your studies, exams, or career..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-14 pr-16 text-base rounded-full bg-background border-border/50 focus-visible:ring-primary/30"
              disabled={chatMutation.isPending}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-shadow"
              disabled={!input.trim() || chatMutation.isPending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground">AI can make mistakes. Verify important facts and deadlines independently.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
