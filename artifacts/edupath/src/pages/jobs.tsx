import { useListJobs, ListJobsSector } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, IndianRupee, Calendar, Search, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState<string>("all");
  
  const { data: jobs, isLoading } = useListJobs({
    search: search || undefined,
    sector: sector !== "all" ? sector as ListJobsSector : undefined,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
        <p className="text-muted-foreground">Discover government and private sector opportunities.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search roles, organizations..." 
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="psu">PSU</SelectItem>
            <SelectItem value="startup">Startup</SelectItem>
            <SelectItem value="ngo">NGO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : jobs?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <Card key={job.id} className="flex flex-col border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={job.sector === 'government' ? 'text-accent border-accent/30 bg-accent/5' : ''}>
                    {job.sector.toUpperCase()}
                  </Badge>
                  <div className="flex gap-2">
                    {job.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                    {job.isTrending && <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Trending</Badge>}
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-1">{job.title}</CardTitle>
                <div className="text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                  <Building2 className="h-4 w-4" />
                  {job.organization}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {job.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}{job.state ? `, ${job.state}` : ''}
                  </div>
                )}
                
                {(job.salaryText || job.salaryMin) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    {job.salaryText || `₹${job.salaryMin?.toLocaleString()} - ₹${job.salaryMax?.toLocaleString()}`}
                  </div>
                )}

                {job.applicationDeadline && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Deadline: {format(new Date(job.applicationDeadline), 'MMM dd, yyyy')}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                  <a href={job.applicationUrl || "#"} target="_blank" rel="noreferrer">Apply Now</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card/30 rounded-xl border border-border/50">
          <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
