import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import CrimsonQuillTales from "./pages/CrimsonQuillTales";
import CultPsycheHub from "./pages/CultPsycheHub";
import TempleOfWisdom from "./pages/TempleOfWisdom";
import OracleChamber from "./pages/OracleChamber";
import TheBecomingVault from "./pages/TheBecomingVault";
import PsychePath from "./pages/PsychePath";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/crimson-quill-tales"} component={CrimsonQuillTales} />
      <Route path={"/cult-psyche-hub"} component={CultPsycheHub} />
      <Route path={"/temple-of-wisdom"} component={TempleOfWisdom} />
      <Route path={"/oracle-chamber"} component={OracleChamber} />
      <Route path={"/the-becoming-vault"} component={TheBecomingVault} />
      <Route path={"/psyche-path"} component={PsychePath} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <TopNav />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
