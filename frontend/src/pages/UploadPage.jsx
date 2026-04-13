import { useState, useCallback } from "react";
import { UploadCloud, FileVideo, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadLecture } from "../services/api";
import { Button } from "../components/ui/Button";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, done
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "video/mp4" || droppedFile.name.endsWith(".mp4")) {
        setFile(droppedFile);
      } else {
        alert("Please upload an MP4 file.");
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processLecture = async () => {
    if (!file) return;
    setStatus("uploading");
    
    try {
      const response = await uploadLecture(file, (p) => setProgress(p));
      setStatus("done");
      setTimeout(() => {
         navigate("/library");
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Failed to upload");
    }
  };

  return (
    <div className="container max-w-3xl py-12 fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Lecture</h1>
        <p className="text-muted-foreground">Upload an MP4 video to transcribe and make it searchable.</p>
      </div>

      <div className="glass-effect rounded-2xl p-8 border border-border/50 shadow-sm relative overflow-hidden">
        {status !== "idle" && (
          <div className="absolute inset-x-0 top-0 h-1 bg-secondary">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className={status !== "idle" ? "hidden" : "block"}>
          <div 
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-colors cursor-pointer
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload").click()}
          >
            <input 
              id="file-upload" 
              type="file" 
              accept=".mp4,video/mp4" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <div className="p-4 bg-muted/50 rounded-full mb-4 pointer-events-none">
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-lg pointer-events-none">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground mt-1 pointer-events-none">MP4 video (max 2GB)</p>
          </div>

          {file && (
            <div className="mt-6 flex items-center justify-between p-4 bg-card border rounded-lg">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileVideo className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div className="truncate">
                  <p className="font-medium truncate text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button onClick={processLecture}>Process Lecture</Button>
            </div>
          )}
        </div>

        {status !== "idle" && (
          <div className="py-8 flex flex-col items-center max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              {status === "done" ? "Processing Complete!" : "Processing Pipeline"}
              {status === "done" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </h3>

            <div className="space-y-4 w-full">
              {[
                { id: "uploading", label: "Uploading video..." },
                { id: "extracting", label: "Extracting audio..." },
                { id: "transcribing", label: "Transcribing audio to JSON..." },
                { id: "embedding", label: "Generating vector embeddings..." }
              ].map((step, idx) => {
                let stepStatus = "pending";
                if (status === "done") stepStatus = "done";
                else if (progress > idx * 25 && progress <= (idx + 1) * 25) stepStatus = "current";
                else if (progress > (idx + 1) * 25) stepStatus = "done";

                return (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    stepStatus === "current" ? "bg-primary/5 border-primary/30" : 
                    stepStatus === "done" ? "bg-card border-border opacity-70" : "opacity-40"
                  }`}>
                    {stepStatus === "done" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : stepStatus === "current" ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className={`text-sm font-medium ${stepStatus === "current" ? "text-primary" : "text-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {status === "done" && (
              <p className="mt-8 text-sm text-muted-foreground animate-pulse flex items-center gap-2">
                Redirecting to library <ArrowRight className="w-4 h-4" />
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
