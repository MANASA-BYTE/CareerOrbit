import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Exams from "@/pages/exams";
import ExamDetail from "@/pages/exam-detail";
import Notes from "@/pages/notes";
import Jobs from "@/pages/jobs";
import Careers from "@/pages/careers";
import AiTrends from "@/pages/ai-trends";
import AiMentor from "@/pages/ai-mentor";
import Notifications from "@/pages/notifications";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/:rest*">
        {() => (
          <Layout>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/exams" component={Exams} />
              <Route path="/exams/:id" component={ExamDetail} />
              <Route path="/notes" component={Notes} />
              <Route path="/jobs" component={Jobs} />
              <Route path="/careers" component={Careers} />
              <Route path="/ai-trends" component={AiTrends} />
              <Route path="/ai-mentor" component={AiMentor} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/profile" component={Profile} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
