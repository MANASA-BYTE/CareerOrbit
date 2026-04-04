import { useGetExam, getGetExamQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Globe, 
  Download, 
  CheckCircle2, 
  FileText, 
  IndianRupee, 
  BookOpen, 
  GraduationCap
} from "lucide-react";
import { format } from "date-fns";

export default function ExamDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: exam, isLoading } = useGetExam(id, { 
    query: { 
      enabled: !!id, 
      queryKey: getGetExamQueryKey(id) 
    } 
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground">The exam you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const procedureSteps = exam.applicationProcedure?.split('\n').filter(s => s.trim().length > 0) || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between bg-card/50 backdrop-blur border border-border/50 p-6 rounded-2xl">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={exam.status === 'open' ? 'default' : 'secondary'} className={exam.status === 'open' ? 'bg-primary' : ''}>
              {exam.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {exam.isUrgent && <Badge variant="destructive">URGENT</Badge>}
            <Badge variant="outline">{exam.category}</Badge>
            {exam.isNational && <Badge variant="outline" className="border-accent text-accent">National Level</Badge>}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{exam.fullName || exam.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {exam.conductingBody}
              </span>
              {exam.state && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {exam.state}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          {exam.officialWebsite && (
            <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href={exam.officialWebsite} target="_blank" rel="noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Official Website
              </a>
            </Button>
          )}
          {exam.syllabusUrl && (
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <a href={exam.syllabusUrl} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download Syllabus
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Description & Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-muted-foreground whitespace-pre-line">{exam.description || 'No description provided.'}</p>
              </div>
              
              {exam.eligibility && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    Eligibility Criteria
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">{exam.eligibility}</p>
                </div>
              )}
              
              {exam.examPattern && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-emerald-500" />
                    Exam Pattern
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">{exam.examPattern}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {procedureSteps.length > 0 && (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Application Procedure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {procedureSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 font-medium text-xs">
                        {idx + 1}
                      </div>
                      <p className="text-muted-foreground">{step.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DateRow label="Application Start" date={exam.applicationStartDate} />
              <DateRow label="Application End" date={exam.applicationEndDate} isUrgent={exam.isUrgent} />
              <DateRow label="Exam Date" date={exam.examDate} />
              <DateRow label="Result Date" date={exam.resultDate} />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Key Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" /> Fee
                </span>
                <span className="font-medium">{exam.applicationFee || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Vacancies
                </span>
                <span className="font-medium">{exam.totalVacancies?.toLocaleString() || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {exam.requiredDocuments && exam.requiredDocuments.length > 0 && (
            <Card className="border-border/50 bg-card/50 backdrop-blur bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exam.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-1" />
                      <span className="text-sm text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DateRow({ label, date, isUrgent }: { label: string, date?: string, isUrgent?: boolean }) {
  if (!date) return null;
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {label}
      </span>
      <span className={`font-medium ${isUrgent ? 'text-destructive' : ''}`}>
        {format(new Date(date), 'MMM dd, yyyy')}
      </span>
    </div>
  );
}
