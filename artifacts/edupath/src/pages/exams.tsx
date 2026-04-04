import { useListExams, ListExamsCategory } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Calendar, Building, MapPin, Search, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Exams() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  
  const { data: exams, isLoading } = useListExams({
    search: search || undefined,
    category: category !== "all" ? category as ListExamsCategory : undefined,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Competitive Exams</h1>
        <p className="text-muted-foreground">Find and track government and private competitive exams.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search exams..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="central">Central Govt</SelectItem>
            <SelectItem value="state">State Govt</SelectItem>
            <SelectItem value="banking">Banking</SelectItem>
            <SelectItem value="railway">Railway</SelectItem>
            <SelectItem value="defence">Defence</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : exams?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <Card key={exam.id} className="flex flex-col border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={exam.status === 'open' ? 'default' : 'secondary'} className={exam.status === 'open' ? 'bg-primary' : ''}>
                    {exam.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {exam.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                </div>
                <CardTitle className="line-clamp-2 leading-tight">{exam.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-2">
                  <Building className="h-3 w-3" />
                  {exam.conductingBody}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3"/> Deadline</span>
                    <span className="font-medium">
                      {exam.applicationEndDate ? format(new Date(exam.applicationEndDate), 'MMM dd, yyyy') : 'TBA'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/> Vacancies</span>
                    <span className="font-medium">{exam.totalVacancies?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/exams/${exam.id}`} className="w-full">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card/30 rounded-xl border border-border/50">
          <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No exams found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
