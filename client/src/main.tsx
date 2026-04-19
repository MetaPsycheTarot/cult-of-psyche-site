// Diagnostic: Log when main.tsx starts executing
console.log('[main.tsx] Module loading started');

import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';

console.log('[main.tsx] Imports resolved');
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { Analytics } from "./components/Analytics";
import { getLoginUrl } from "./const";
import { NotificationProvider } from "./contexts/NotificationContext";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

console.log('[main.tsx] About to render React app');
const rootElement = document.getElementById("root");
console.log('[main.tsx] Root element:', rootElement);

if (!rootElement) {
  console.error('[main.tsx] Root element not found!');
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Analytics />
        <App />
      </NotificationProvider>
    </QueryClientProvider>
  </trpc.Provider>
);

console.log('[main.tsx] React app rendered successfully');
