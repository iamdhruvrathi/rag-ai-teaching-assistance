import { ArrowRight, Bot, Video, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      
      <div className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Now faster with updated embeddings
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          AI Lecture <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Assistant</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Turn your lectures into an interactive AI tutor. Upload videos, automatically extract transcripts, and ask questions to learn faster than ever.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/upload">
            <Button size="lg" className="w-full sm:w-auto group">
              Upload Lecture
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/library">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Library
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 p-6 glass-effect rounded-2xl">
          <div className="p-3 bg-primary/10 rounded-full">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">1. Upload Video</h3>
          <p className="text-muted-foreground text-sm">Upload any local MP4 lecture. We support long-form educational content.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 glass-effect rounded-2xl">
          <div className="p-3 bg-primary/10 rounded-full">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">2. Auto-Transcribe</h3>
          <p className="text-muted-foreground text-sm">Our AI extracts audio, transcribes accurately with timestamps, and generates vector embeddings.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 glass-effect rounded-2xl">
          <div className="p-3 bg-primary/10 rounded-full">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">3. Chat & Learn</h3>
          <p className="text-muted-foreground text-sm">Ask any question. The AI fetches exact context from the video and cites timestamps.</p>
        </div>
      </div>
    </div>
  );
}
