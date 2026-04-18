import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";

export interface SubscriptionTierCardProps {
  tier: "free" | "pro" | "premium";
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  onSelect?: () => void;
}

export function SubscriptionTierCard({
  tier,
  name,
  price,
  description,
  features,
  highlighted = false,
  onSelect,
}: SubscriptionTierCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const createCheckout = trpc.monetization.createCheckoutSession.useMutation();

  const handleUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get tier ID based on tier name
      const tierIdMap: Record<string, number> = { free: 1, pro: 2, premium: 3 };
      const tierId = tierIdMap[tier];

      const session = await createCheckout.mutateAsync({
        tierId,
        billingCycle: "monthly",
      });

      if (session.checkoutUrl) {
        window.open(session.checkoutUrl, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const borderClass = highlighted
    ? "border-2 border-pink-500 shadow-lg shadow-pink-500/20"
    : "border border-border";

  return (
    <Card className={`relative flex flex-col ${borderClass} ${highlighted ? "scale-105" : ""}`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground ml-2">/month</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 mb-6 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={tier === "free" ? onSelect : handleUpgrade}
          disabled={isLoading}
          className={`w-full ${
            highlighted
              ? "bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          {isLoading ? "Processing..." : tier === "free" ? "Current Plan" : "Upgrade"}
        </Button>      </CardContent>
    </Card>
  );
}
