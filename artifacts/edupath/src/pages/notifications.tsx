import { useListNotifications, ListNotificationsType } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Search, ArrowUpRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Notifications() {
  const [type, setType] = useState<string>("all");
  
  const { data: notifications, isLoading } = useListNotifications({
    type: type !== "all" ? type as ListNotificationsType : undefined,
  });

  const getTypeColor = (notifType: string) => {
    switch(notifType) {
      case 'new_notification': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'last_date': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'admit_card': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'result': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatTypeLabel = (notifType: string) => {
    return notifType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground">Stay updated on exam dates, admit cards, and results.</p>
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Updates</SelectItem>
            <SelectItem value="new_notification">New Notifications</SelectItem>
            <SelectItem value="last_date">Last Dates</SelectItem>
            <SelectItem value="admit_card">Admit Cards</SelectItem>
            <SelectItem value="result">Results</SelectItem>
            <SelectItem value="answer_key">Answer Keys</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4 pt-4">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : notifications?.length ? (
        <div className="space-y-4 pt-4">
          {notifications.map(notif => (
            <Card key={notif.id} className={`border-border/50 bg-card/50 backdrop-blur transition-all hover:bg-card ${notif.isNew ? 'border-primary/30 shadow-[0_0_15px_-5px_rgba(var(--primary),0.1)]' : ''}`}>
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {notif.isNew && <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>}
                    <Badge variant="outline" className={getTypeColor(notif.type)}>
                      {formatTypeLabel(notif.type)}
                    </Badge>
                    {notif.isUrgent && (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                        <AlertCircle className="w-3 h-3" /> Action Required
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto sm:ml-0">
                      <Calendar className="w-3 h-3" />
                      {notif.date ? format(new Date(notif.date), 'MMM dd, yyyy') : 'Recent'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{notif.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{notif.examName}</p>
                  </div>
                </div>
                
                {notif.link && (
                  <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0 group" asChild>
                    <a href={notif.link} target="_blank" rel="noreferrer">
                      View Details
                      <ArrowUpRight className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card/30 rounded-xl border border-border/50">
          <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No notifications</h3>
          <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
        </div>
      )}
    </div>
  );
}
