"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateUserProfile } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: PlanFeature[];
  buttonColor: string;
  popular?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for portfolio creation",
    price: "$0",
    buttonColor: "bg-gray-500 hover:bg-gray-600",
    features: [
      { name: "1 Portfolio", included: true },
      { name: "Basic Templates", included: true },
      { name: "Resume Storage", included: true },
      { name: "Web3 Wallet Connection", included: true },
      { name: "AI Resume Generation", included: false },
      { name: "Custom Domain", included: false },
      { name: "Priority Support", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced features for professionals",
    price: "$9.99/month",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    popular: true,
    features: [
      { name: "5 Portfolios", included: true },
      { name: "Premium Templates", included: true },
      { name: "Resume Storage", included: true },
      { name: "Web3 Wallet Connection", included: true },
      { name: "AI Resume Generation", included: true },
      { name: "Custom Domain", included: false },
      { name: "Priority Support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Everything you need for your professional presence",
    price: "$19.99/month",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    features: [
      { name: "Unlimited Portfolios", included: true },
      { name: "All Templates", included: true },
      { name: "Resume Storage", included: true },
      { name: "Web3 Wallet Connection", included: true },
      { name: "AI Resume Generation", included: true },
      { name: "Custom Domain", included: true },
      { name: "Priority Support", included: true },
    ],
  },
];

export function SubscriptionPlans({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useUser();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (!user) return;
    
    setSelectedPlan(planId);
    setIsSubmitting(true);
    
    try {
      // Update user profile with selected plan
      await updateUserProfile(user.id, {
        subscription_plan: planId
      });
      
      toast({
        title: "Plan Selected",
        description: `You've selected the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
      });
      
      // Close the dialog and redirect to dashboard
      onClose();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast({
        title: "Error",
        description: "Failed to select plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center mx-auto max-w-md">
            Select the plan that best fits your needs. You can upgrade or downgrade at any time.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.id !== 'free' && <span className="text-sm text-muted-foreground ml-1">USD</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 mr-2" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full text-white ${plan.buttonColor}`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting && selectedPlan === plan.id ? "Processing..." : `Select ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SubscriptionBadge({ plan }: { plan: string }) {
  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "premium":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pro":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPlanName = (planId: string) => {
    return planId.charAt(0).toUpperCase() + planId.slice(1);
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPlanColor(plan)}`}>
      {getPlanName(plan)}
    </span>
  );
}
