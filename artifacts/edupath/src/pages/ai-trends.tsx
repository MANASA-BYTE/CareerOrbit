import { useGetAiTrends } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, BrainCircuit, Rocket, Target, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function AiTrends() {
  const { data: trends, isLoading } = useGetAiTrends();

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'revolutionary': return 'text-primary bg-primary/10 border-primary/20';
      case 'high': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-primary/10 via-accent/5 to-background p-8 rounded-3xl border border-primary/20">
        <div className="max-w-2xl">
          <Badge className="mb-4 bg-primary text-primary-foreground border-none">
            <Sparkles className="w-3 h-3 mr-1" /> Future Forward
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">
            AI & Technology Trends
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay ahead of the curve. Understand the technologies reshaping the global job market and the skills you need to thrive in them.
          </p>
        </div>
        <div className="shrink-0 bg-card/80 p-6 rounded-2xl border backdrop-blur-xl shadow-xl w-full md:w-72">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Not sure what to learn?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Talk to our AI Mentor to get personalized recommendations based on these trends.</p>
          <Link href="/ai-mentor">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Start Chat</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : trends?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {trends.map(trend => (
            <Card key={trend.id} className={`flex flex-col border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all ${trend.isBoom ? 'shadow-[0_0_30px_-15px_rgba(var(--primary),0.3)] border-primary/30' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={getImpactColor(trend.impact)}>
                    {trend.impact.toUpperCase()} IMPACT
                  </Badge>
                  {trend.isBoom && (
                    <Badge className="bg-accent text-accent-foreground border-none">
                      <Zap className="w-3 h-3 mr-1" /> Booming Now
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{trend.title}</CardTitle>
                <div className="text-sm text-muted-foreground font-medium">Category: {trend.category}</div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">{trend.description}</p>
                
                <div className="bg-background/50 p-3 rounded-lg border flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-primary" /> Readiness Year
                  </span>
                  <span className="font-bold text-lg">{trend.readinessYear || 'Now'}</span>
                </div>

                {trend.skills && trend.skills.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Skills Needed
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {trend.skills.map(skill => (
                        <span key={skill} className="text-xs px-2 py-1 bg-secondary/50 rounded-md border border-border/50">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {trend.careers && trend.careers.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Target className="w-3 h-3" /> Related Careers
                    </span>
                    <div className="flex flex-col gap-1">
                      {trend.careers.map(career => (
                        <span key={career} className="text-sm truncate before:content-['•'] before:mr-2 before:text-primary">{career}</span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card/30 rounded-xl border border-border/50">
          <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No trends found</h3>
        </div>
      )}
    </div>
  );
}
