import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, GraduationCap, MapPin, Loader2, Save, X, Edit2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Profile() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateProfile();

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      educationLevel: formData.get("educationLevel") as string,
      currentClass: formData.get("currentClass") as string,
      state: formData.get("state") as string,
    };

    updateProfileMutation.mutate(
      { id: user.id, data },
      {
        onSuccess: (updatedProfile) => {
          login(updatedProfile);
          setIsEditing(false);
          toast({ title: "Profile Updated", description: "Your changes have been saved." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        }
      }
    );
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border/50 bg-card/50 backdrop-blur h-fit">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center overflow-hidden shadow-xl">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-primary/50" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground mt-1 tracking-wider font-mono">APAAR: {user.aparId}</p>
            </div>
            <div className="w-full pt-4 border-t border-border/50 space-y-3">
              <div className="flex items-center text-sm text-muted-foreground gap-3">
                <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{user.educationLevel.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span className="truncate">{user.state || 'State not set'}</span>
              </div>
              {user.createdAt && (
                <div className="flex items-center text-xs text-muted-foreground/50 gap-3 pt-2">
                  <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Manage your contact and academic details.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField label="Full Name" value={user.name} icon={<User className="w-4 h-4" />} />
                  <InfoField label="Email Address" value={user.email} icon={<Mail className="w-4 h-4" />} />
                  <InfoField label="Phone Number" value={user.phone} icon={<Phone className="w-4 h-4" />} />
                  <InfoField label="Current Class/Degree" value={user.currentClass} />
                  <InfoField label="School/Institution" value={user.school} />
                </div>
                
                {user.careerInterests && user.careerInterests.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <Label className="text-muted-foreground mb-3 block">Career Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.careerInterests.map(interest => (
                        <Badge key={interest} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" defaultValue={user.name} required />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={user.phone} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level</Label>
                  <Select name="educationLevel" defaultValue={user.educationLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class5_8">Class 5-8</SelectItem>
                      <SelectItem value="class9_10">Class 9-10</SelectItem>
                      <SelectItem value="class11_12">Class 11-12</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentClass">Class / Degree</Label>
                    <Input id="currentClass" name="currentClass" defaultValue={user.currentClass} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" defaultValue={user.state} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoField({ label, value, icon }: { label: string, value?: string, icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground flex items-center gap-2">
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
      </Label>
      <div className="font-medium">{value || <span className="text-muted-foreground/50 italic">Not provided</span>}</div>
    </div>
  );
}
