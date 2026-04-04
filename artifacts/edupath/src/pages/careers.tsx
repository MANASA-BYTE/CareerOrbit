import { useListCareers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compass, TrendingUp, IndianRupee, ArrowRight, Activity, BookOpen, GraduationCap, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Careers() {
  const { data: careers, isLoading } = useListCareers({});

  const getDemandColor = (demand: string) => {
    switch(demand) {
      case 'very_high': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'high': return 'text-primary bg-primary/10 border-primary/20';
      case 'moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Career Paths</h1>
        <p className="text-muted-foreground">Explore detailed roadmaps, required skills, and growth opportunities.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : careers?.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {careers.map(career => (
            <Dialog key={career.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-background">{career.domain}</Badge>
                      {career.isTrending && (
                        <div className="flex items-center gap-1 text-xs font-medium text-accent">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">{career.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6">
                    <p className="text-muted-foreground line-clamp-2">{career.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" /> Avg Salary
                        </span>
                        <div className="font-medium">{career.averageSalary || 'N/A'}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Activity className="h-4 w-4" /> Demand
                        </span>
                        <Badge variant="outline" className={getDemandColor(career.jobDemand)}>
                          {career.jobDemand.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {career.skills && career.skills.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Core Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.slice(0, 4).map(skill => (
                            <Badge key={skill} variant="secondary" className="bg-secondary/50">{skill}</Badge>
                          ))}
                          {career.skills.length > 4 && (
                            <Badge variant="secondary" className="bg-secondary/50">+{career.skills.length - 4}</Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 text-primary font-medium flex items-center text-sm group-hover:translate-x-1 transition-transform">
                      View Full Roadmap <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 border-b bg-card/50 backdrop-blur shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{career.domain}</Badge>
                    <Badge variant="outline" className={getDemandColor(career.jobDemand)}>
                      {career.jobDemand.replace('_', ' ').toUpperCase()} DEMAND
                    </Badge>
                  </div>
                  <DialogTitle className="text-3xl">{career.title}</DialogTitle>
                  <DialogDescription className="text-base mt-2">
                    {career.description}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-8">
                    {career.roadmap && career.roadmap.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                          <Compass className="h-5 w-5 text-primary" /> Roadmap
                        </h3>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                          {career.roadmap.map((step, idx) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary font-bold z-10 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                {idx + 1}
                              </div>
                              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-muted/50 border">
                                {step}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {career.skills && (
                        <Card className="shadow-none border-border/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <BookOpen className="h-4 w-4" /> Skills Required
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                              {career.skills.map(s => <li key={s}>{s}</li>)}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="space-y-6">
                        {career.relatedExams && (
                          <Card className="shadow-none border-border/50 bg-primary/5 border-primary/20">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                <GraduationCap className="h-4 w-4" /> Target Exams
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-col gap-2">
                                {career.relatedExams.map(e => (
                                  <Badge key={e} variant="secondary" className="w-fit">{e}</Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        
                        {career.topCompanies && (
                          <Card className="shadow-none border-border/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="h-4 w-4" /> Top Employers
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {career.topCompanies.map(c => (
                                  <span key={c} className="text-sm px-2 py-1 rounded border bg-background">{c}</span>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card/30 rounded-xl border border-border/50">
          <Compass className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No careers found</h3>
        </div>
      )}
    </div>
  );
}
