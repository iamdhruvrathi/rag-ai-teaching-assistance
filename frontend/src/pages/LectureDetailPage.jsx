import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, Bot, User, Code2, Loader2, Play } from "lucide-react";
import { getTranscript, askQuestion } from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { cn } from "../utils/cn";

export default function LectureDetailPage() {
  const { id } = useParams();
  const [transcript, setTranscript] = useState([]);
  const [loadingTranscript, setLoadingTranscript] = useState(true);
  
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I've processed this lecture. What would you like to know?" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getTranscript(id).then((data) => {
      setTranscript(data);
      setLoadingTranscript(false);
    });
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = { role: "user", content: inputVal };
    setMessages((prev) => [...prev, userMessage]);
    setInputVal("");
    setIsTyping(true);

    try {
      const response = await askQuestion(id, userMessage.content);
      const aiMessage = { role: "ai", content: response.answer, sources: response.sources };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
       setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I had trouble answering that. Could you try again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-background fade-in-up">
      {/* Main Split Interface */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* LEFT: Transcript */}
        <div className="w-full md:w-1/2 flex flex-col border-r bg-card/30">
          <div className="p-4 border-b flex justify-between items-center bg-card z-10 shadow-sm">
            <h2 className="font-semibold text-lg">Lecture Transcript</h2>
            <div className="flex gap-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{transcript.length} chunks</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {loadingTranscript ? (
              <div className="flex flex-col gap-4 py-8 items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Loading transcript...</p>
              </div>
            ) : (
              transcript.map((chunk, i) => (
                <div 
                  key={i} 
                  className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer border border-transparent hover:border-border"
                >
                  <div className="text-xs text-muted-foreground whitespace-nowrap pt-1 flex flex-col items-center min-w-[3rem]">
                    <span>{formatTime(chunk.start)}</span>
                    <Play className="w-3 h-3 mt-1 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                  </div>
                  <div className="text-sm leading-relaxed text-foreground/90">
                    {chunk.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Chat */}
        <div className="w-full md:w-1/2 flex flex-col bg-background relative">
          <div className="p-4 border-b flex justify-between items-center bg-card z-10 shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" /> AI Assistant
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setMessages([{ role: "ai", content: "Conversation cleared. What can I help with?" }])}>
              Clear
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-24">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-4 w-full", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "ai" && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm flex flex-col gap-2",
                  msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm border"
                )}>
                  <p className="leading-relaxed">{msg.content}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-2">
                       <span className="text-xs opacity-70">Sources:</span>
                       {msg.sources.map((s, idx) => (
                         <span key={idx} className="text-xs bg-background/50 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:bg-background/80 transition-colors">
                           <Play className="w-3 h-3" /> {formatTime(s.start)}
                         </span>
                       ))}
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 w-full justify-start">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-3 text-sm border flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full justify-center bg-foreground/40 animate-bounce" style={{animationDelay: "0ms"}} />
                  <span className="w-2 h-2 rounded-full justify-center bg-foreground/40 animate-bounce" style={{animationDelay: "150ms"}} />
                  <span className="w-2 h-2 rounded-full justify-center bg-foreground/40 animate-bounce" style={{animationDelay: "300ms"}} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
            <form onSubmit={handleSend} className="relative flex items-center w-full max-w-2xl mx-auto">
              <Input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask a question about this lecture..."
                className="pr-12 py-6 rounded-full shadow-lg border-primary/20 bg-card focus-visible:ring-primary focus-visible:border-primary transition-all text-base"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1.5 rounded-full w-9 h-9 transition-transform active:scale-95"
                disabled={!inputVal.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* BOTTOM COLLAPSIBLE: Raw JSON Viewer */}
      <div className="border-t bg-card shrink-0">
        <button 
          onClick={() => setShowJson(!showJson)}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
        >
          <Code2 className="w-4 h-4" /> 
          {showJson ? "Hide Raw JSON (Dev Mode)" : "View Raw JSON (Dev Mode)"}
        </button>
        
        {showJson && (
          <div className="p-4 bg-black/90 text-green-400 font-mono text-xs h-48 overflow-y-auto w-full">
            <pre>{JSON.stringify(transcript, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
