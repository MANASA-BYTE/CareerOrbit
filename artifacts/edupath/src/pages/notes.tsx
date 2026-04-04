import { useListNotes, ListNotesFolder, useGetNotesFolders } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, FileText, Download, Star, Search, Filter } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function Notes() {
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("all");

  const { data: folders, isLoading: isLoadingFolders } = useGetNotesFolders();
  const { data: notes, isLoading: isLoadingNotes } = useListNotes({
    folder: activeFolder !== "all" ? activeFolder as ListNotesFolder : undefined,
    subject: search || undefined
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Notes</h1>
          <p className="text-muted-foreground">Access curated notes, previous papers, and study materials.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search subjects..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Folders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFolder === "all" 
              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
              : "bg-card/50 hover:bg-card border-border/50 hover:border-primary/50"
          }`}
          onClick={() => setActiveFolder("all")}
        >
          <div className="flex items-center gap-3">
            <Filter className={`h-5 w-5 ${activeFolder === "all" ? "" : "text-muted-foreground"}`} />
            <div>
              <div className="font-medium">All Notes</div>
              <div className={`text-xs ${activeFolder === "all" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                Browse everything
              </div>
            </div>
          </div>
        </div>

        {isLoadingFolders ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-[74px] rounded-xl" />)
        ) : folders?.map((f) => (
          <div 
            key={f.folder}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeFolder === f.folder 
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                : "bg-card/50 hover:bg-card border-border/50 hover:border-primary/50"
            }`}
            onClick={() => setActiveFolder(f.folder)}
          >
            <div className="flex items-center gap-3">
              <Folder className={`h-5 w-5 ${activeFolder === f.folder ? "" : "text-muted-foreground"}`} />
              <div>
                <div className="font-medium">{f.label}</div>
                <div className={`text-xs ${activeFolder === f.folder ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {f.count} files
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {activeFolder === "all" ? "Recent Notes" : folders?.find(f => f.folder === activeFolder)?.label}
        </h2>
        
        {isLoadingNotes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : notes?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <Card key={note.id} className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-background">{note.subject}</Badge>
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-medium">{note.rating?.toFixed(1) || 'New'}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {note.description || "No description provided."}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-3 border-t border-border/50 flex justify-between items-center bg-background/50 rounded-b-xl mt-auto">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Download className="h-3 w-3" />
                    {note.downloads || 0}
                  </div>
                  <Button size="sm" variant="secondary" asChild>
                    <a href={note.fileUrl} target="_blank" rel="noreferrer" download>
                      Download
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card/30 rounded-xl border border-border/50">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No notes found</h3>
            <p className="text-muted-foreground">No materials match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
