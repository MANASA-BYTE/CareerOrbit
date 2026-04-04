import { useAuth } from "@/hooks/use-auth";
import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "wouter";
import { CalendarDays, GraduationCap, Briefcase, BookOpen, Bot, TrendingUp, Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your academic journey today.</p>
        </div>
        <Link href="/ai-mentor">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Chat with AI Mentor
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Exams" value={summary?.openExams} total={summary?.totalExams} icon={GraduationCap} color="text-blue-500" href="/exams" />
        <StatCard title="Open Jobs" value={summary?.openJobs} total={summary?.totalJobs} icon={Briefcase} color="text-green-500" href="/jobs" />
        <StatCard title="Total Notes" value={summary?.totalNotes} icon={BookOpen} color="text-purple-500" href="/notes" />
        <StatCard title="AI Trends" value={summary?.aiTrends} icon={Bot} color="text-amber-500" href="/ai-trends" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary?.upcomingDeadlines && summary.upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {summary.upcomingDeadlines.map((deadline, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-background border">
                    <div className="flex flex-col">
                      <span className="font-medium">{deadline.name}</span>
                      <span className="text-sm text-muted-foreground capitalize">{deadline.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-destructive">{format(new Date(deadline.deadline), 'MMM dd, yyyy')}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p>You have {summary?.latestNotifications || 0} new notifications</p>
              <Link href="/notifications">
                <Button variant="link" className="mt-2">View All</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, total, icon: Icon, color, href }: any) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground">{title}</h3>
            <div className={`p-2 rounded-xl bg-background border ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold group-hover:text-primary transition-colors">
              {value !== undefined ? value : '--'}
              {total !== undefined && <span className="text-lg text-muted-foreground font-normal"> / {total}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
