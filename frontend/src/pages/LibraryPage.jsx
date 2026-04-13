import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Clock, Video } from "lucide-react";
import { getLectures } from "../services/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export default function LibraryPage() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLectures().then((data) => {
      setLectures(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container max-w-screen-xl py-8 fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>
          <p className="text-muted-foreground mt-1 text-sm">Access and chat with your uploaded lectures.</p>
        </div>
        <Link to="/upload">
          <Button>Upload New</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex flex-col h-[280px] bg-card rounded-xl border opacity-50">
              <div className="h-40 bg-muted/60 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted/60 rounded w-3/4" />
                <div className="h-4 bg-muted/60 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed glass-effect">
          <div className="p-4 bg-muted/50 rounded-full mb-4">
            <Video className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No lectures uploaded yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mt-2 mb-6">
            Get started by uploading your first lecture video to generate transcripts and enable AI chat.
          </p>
          <Link to="/upload">
            <Button>Upload Lecture</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <Link key={lecture.id} to={`/lecture/${lecture.id}`} className={lecture.status !== "ready" ? "pointer-events-none" : ""}>
              <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 group h-full flex flex-col ${lecture.status !== "ready" ? "opacity-75" : ""}`}>
                <div className="h-40 w-full bg-muted relative overflow-hidden">
                  {lecture.thumbnail ? (
                    <img src={lecture.thumbnail} alt={lecture.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <Video className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {lecture.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lecture.duration}
                    </div>
                  )}
                  {lecture.status === "ready" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary text-primary-foreground p-3 rounded-full">
                        <Play className="w-6 h-6 ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg line-clamp-1" title={lecture.title}>{lecture.title}</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 pt-0 mt-auto">
                  <Badge variant={lecture.status === "ready" ? "success" : "processing"}>
                    {lecture.status === "ready" ? "Ready to Chat" : "Processing..."}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
