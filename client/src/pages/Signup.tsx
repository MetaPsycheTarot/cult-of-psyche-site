import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Signup() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/vault");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-midnight)" }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            Join the Cult
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Create your account to access the vault and the system.
          </p>
        </div>

        <div
          className="p-8 rounded-lg border-2"
          style={{
            background: "rgba(0, 217, 255, 0.05)",
            borderColor: "var(--color-cyan)",
          }}
        >
          <a href={getLoginUrl()}>
            <Button
              className="w-full mb-4"
              style={{
                background: "var(--color-hot-pink)",
                color: "var(--color-midnight)",
              }}
            >
              Sign Up with Google
            </Button>
          </a>

          <p className="text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Already have an account?{" "}
            <a href="/login" className="font-semibold" style={{ color: "var(--color-cyan)" }}>
              Sign in
            </a>
          </p>
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--color-text-secondary)" }}>
          By signing up, you agree to join the system and participate in the ritual.
        </p>
      </div>
    </div>
  );
}
