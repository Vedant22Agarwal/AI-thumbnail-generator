import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
  {
    name: "Basic",
    price: 999,
    period: "month",
    features: [
      "50 AI Thumbnails/mo",
      "Basic Templates",
      "Standard Resolution",
      "No Watermark",
      "Email Support",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    price: 1599,
    period: "month",
    features: [
      "Unlimited AI Thumbnails",
      "Premium Templates",
      "4K Resolution",
      "A/B Testing Tools",
      "Priority Support",
      "Custom Fonts",
      "Brand Kit Analysis",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    price: 2599,
    period: "month",
    features: [
      "Everything in Pro",
      "API Access",
      "Team Collaboration",
      "Custom Branding",
      "Dedicated Account Manager",
    ],
    mostPopular: false,
  },
];