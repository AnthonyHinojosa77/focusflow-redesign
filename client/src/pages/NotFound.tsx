import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background scanlines">
      <div className="w-full max-w-md mx-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm px-8 py-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-neon-magenta/30 bg-neon-magenta/5 flex items-center justify-center neon-glow-magenta">
            <AlertTriangle className="h-8 w-8 text-neon-magenta" />
          </div>
        </div>

        <h1 className="font-mono text-4xl font-bold text-neon-cyan neon-text-cyan mb-2">
          404
        </h1>

        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          Signal Lost
        </h2>

        <p className="font-mono text-xs text-muted-foreground mb-8 leading-relaxed">
          The page you are looking for doesn't exist.
          <br />
          It may have been moved or deleted.
        </p>

        <Button
          onClick={handleGoHome}
          className="font-mono text-xs px-6"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Base
        </Button>
      </div>
    </div>
  );
}
