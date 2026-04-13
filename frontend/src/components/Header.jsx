import { BookOpen, Library, Upload } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";

export default function Header() {
  const location = useLocation();

  const navItems = [
    { name: "Library", path: "/library", icon: Library },
    { name: "Upload", path: "/upload", icon: Upload },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold hidden sm:inline-block text-lg">
            AI Lecture Assistant
          </span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "transition-colors hover:text-foreground/80 flex items-center gap-2",
                location.pathname.startsWith(item.path)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
