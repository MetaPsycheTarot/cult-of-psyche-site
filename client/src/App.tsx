import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import TopNav from "./components/TopNav";
import { Footer } from "./components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";

// Public pages
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import About from "./pages/About";
import Join from "./pages/Join";
import Lore from "./pages/Lore";
import Clips from "./pages/Clips";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Success from "./pages/Success";

// Vault pages (protected)
import VaultDashboard from "./pages/vault/VaultDashboard";
import VaultLatestDrops from "./pages/vault/VaultLatestDrops";
import NightmareGenerator from "./pages/vault/NightmareGenerator";
import VaultContent from "./pages/vault/VaultContent";
import VaultTarot from "./pages/vault/VaultTarot";
import VaultTools from "./pages/vault/VaultTools";
import PromptGenerator from "./pages/vault/PromptGenerator";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-midnight)" }}>
        <div style={{ color: "var(--color-cyan)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/watch"} component={Watch} />
      <Route path={"/about"} component={About} />
      <Route path={"/join"} component={Join} />
      <Route path={"/lore"} component={Lore} />
      <Route path={"/clips"} component={Clips} />

      {/* Auth Routes */}
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/success"} component={Success} />

      {/* Protected Vault Routes */}
      {isAuthenticated && (
        <>
          <Route path={"/vault"} component={VaultDashboard} />
          <Route path={"/vault/latest-drops"} component={VaultLatestDrops} />
          <Route path={"/vault/content"} component={VaultContent} />
          <Route path={"/vault/tarot"} component={VaultTarot} />
          <Route path={"/vault/tools"} component={VaultTools} />
          <Route path={"/vault/tools/nightmare-generator"} component={NightmareGenerator} />
          <Route path={"/vault/tools/prompt-generator"} component={PromptGenerator} />
        </>
      )}

      {/* Fallback */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <TopNav />
          <Router />
          <Footer />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
