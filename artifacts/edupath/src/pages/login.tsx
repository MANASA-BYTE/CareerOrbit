import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useGetProfile, useCreateProfile, CreateProfileBody } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParticleBackground } from "@/components/particle-background";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Login() {
  const [apaarId, setApaarId] = useState("");
  const [step, setStep] = useState<"enter_id" | "create_profile">("enter_id");
  const [isChecking, setIsChecking] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Custom fetch to check profile to avoid useQuery automatic error throwing blocking UX
  const checkProfile = async (id: string) => {
    setIsChecking(true);
    try {
      const res = await fetch(`/api/profile?aparId=${id}`);
      if (res.ok) {
        const profile = await res.json();
        login(profile);
        setLocation("/dashboard");
      } else if (res.status === 404) {
        setStep("create_profile");
      } else {
        toast({ title: "Error", description: "Something went wrong. Try again.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Network error.", variant: "destructive" });
    } finally {
      setIsChecking(false);
    }
  };

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apaarId.length !== 12) {
      toast({ title: "Invalid APAAR ID", description: "Must be exactly 12 digits.", variant: "destructive" });
      return;
    }
    checkProfile(apaarId);
  };

  const createProfileMutation = useCreateProfile();

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateProfileBody = {
      aparId: apaarId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      educationLevel: formData.get("educationLevel") as string,
      currentClass: formData.get("currentClass") as string,
      state: formData.get("state") as string,
    };

    createProfileMutation.mutate({ data }, {
      onSuccess: (profile) => {
        login(profile);
        setLocation("/dashboard");
        toast({ title: "Welcome to EduPath!", description: "Your profile has been created." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create profile.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card/80 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-3 rounded-2xl mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to EduPath</h1>
          <p className="text-muted-foreground text-sm text-center mt-2">
            {step === "enter_id" ? "Enter your 12-digit APAAR ID to continue" : "Let's set up your student profile"}
          </p>
        </div>

        {step === "enter_id" ? (
          <form onSubmit={handleIdSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apaarId">APAAR ID</Label>
              <Input
                id="apaarId"
                placeholder="1234 5678 9012"
                value={apaarId}
                onChange={(e) => setApaarId(e.target.value.replace(/\D/g, "").slice(0, 12))}
                className="text-center text-2xl tracking-[0.25em] h-14 bg-background/50"
                data-testid="input-apaar-id"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg" 
              disabled={apaarId.length !== 12 || isChecking}
              data-testid="btn-verify-id"
            >
              {isChecking ? <Loader2 className="animate-spin h-5 w-5" /> : "Continue"}
              {!isChecking && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required data-testid="input-name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" name="email" type="email" data-testid="input-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input id="phone" name="phone" type="tel" data-testid="input-phone" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level</Label>
              <Select name="educationLevel" required>
                <SelectTrigger data-testid="select-education">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentClass">Class / Degree</Label>
                <Input id="currentClass" name="currentClass" placeholder="e.g. Class 10" data-testid="input-class" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required data-testid="input-state" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-6" 
              disabled={createProfileMutation.isPending}
              data-testid="btn-create-profile"
            >
              {createProfileMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Profile"}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
