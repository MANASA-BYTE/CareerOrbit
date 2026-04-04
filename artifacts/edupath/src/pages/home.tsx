import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/particle-background";
import { ArrowRight, Sparkles, GraduationCap, Briefcase, Bot } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative flex flex-col">
      <ParticleBackground />
      
      {/* Navbar */}
      <header className="border-b border-white/10 bg-background/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">EduPath</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard" className="w-full">
                <Button variant="default" data-testid="btn-go-dashboard">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login" className="w-full">
                <Button variant="default" data-testid="btn-login">Login / Register</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>India's Most Comprehensive Student Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-primary-foreground to-primary/50 leading-tight">
            Your Digital Nerve Center <br className="hidden md:block" />
            for Academic Success
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From Class 5 to PhD, EduPath guides your career, tracks competitive exams, stores your notes, and finds you jobs. Your brilliant senior who has done it all.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href={isAuthenticated ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="btn-hero-cta">
                Get Started with APAAR ID
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          <FeatureCard 
            icon={<GraduationCap className="h-8 w-8 text-primary" />}
            title="Exam Tracking"
            description="Never miss a deadline. Track central, state, and competitive exams with curated syllabus and previous papers."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Briefcase className="h-8 w-8 text-accent" />}
            title="Career Guidance"
            description="Discover trending domains, check required skills, and follow detailed roadmaps to your dream job."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Bot className="h-8 w-8 text-emerald-400" />}
            title="AI Mentor"
            description="Stuck on a concept? Not sure what to study next? Chat with an intelligent mentor tailored to your path."
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
    >
      <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center mb-4 border border-border">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
