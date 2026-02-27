"use client";

import { Button } from "@/components-beta/Button";
import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { PlusIcon, Crown, Lock, Ticket } from "@phosphor-icons/react";
import { getCreditLimit, getNextTierName } from "@/lib/planLimits";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const staticPlans = [
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    priceText: "$9.99/month",
    agentLimit: 10,
    monthlyCredits: 2500,
    description: "Perfect for indie hackers and small projects",
    features: [
      "10 agents",
      "5 active schedule triggers per agent",
      "5 Webhook triggers",
      "2,500 monthly credits"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 49.99,
    priceText: "$49.99/month",
    agentLimit: 50,
    monthlyCredits: 5000,
    popular: true,
    description: "Best for growing teams",
    features: [
      "50 agents",
      "20 active schedule triggers per agent",
      "20 Webhook triggers",
      "5,000 monthly credits"
    ]
  },
  {
    id: "custom",
    name: "Custom",
    price: 249.99,
    priceText: "$249.99/month",
    agentLimit: Number.POSITIVE_INFINITY,
    monthlyCredits: 10000,
    description: "Enterprise-grade automation",
    features: [
      "Unlimited agents",
      "Unlimited schedule triggers",
      "Unlimited Webhook triggers",
      "10,000 monthly credits"
    ]
  }
];

const page = () => {
  const searchParams = useSearchParams();
  const coupon = searchParams.get("coupon");

  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[]>(staticPlans);
  const [creditHistory, setCreditHistory] = useState<any[]>([]);

  const [buyOpen, setBuyOpen] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState<number>(0);
  const [customCredits, setCustomCredits] = useState<string>("");
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [subData, historyData] = await Promise.all([
          api.getBillingStatus(),
          api.getCreditHistory().catch(() => ({ history: [] }))
        ]);
        setSubscription(subData);
        if (historyData?.history) {
          setCreditHistory(historyData.history);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeCredits = subscription?.credits ?? 0;
  const activePlan = subscription?.plan || "free";
  const creditCap = useMemo(() => getCreditLimit(activePlan), [activePlan]);

  const allCreditPackages = useMemo(
    () => [
      { id: "100", credits: 100, price: 2, tag: "Lite" },
      { id: "200", credits: 200, price: 4, tag: "Starter" },
      { id: "500", credits: 500, price: 10, tag: "Growth" },
      { id: "700", credits: 700, price: 14, tag: "Pro" },
      { id: "1000", credits: 1000, price: 20, tag: "Business" },
      { id: "1500", credits: 1500, price: 30, tag: "Premium" },
    ],
    []
  );

  // Packages are now fetched from backend
  const selectedPrice = useMemo(() => {
    const direct = allCreditPackages.find((p) => p.credits === selectedCredits)
      ?.price;
    if (direct) return direct;
    const custom = Number(customCredits);
    if (!Number.isFinite(custom) || custom <= 0) return 0;
    // 100 credits = $1 (matches 1000=$10)
    return Math.round((custom / 100) * 100) / 100;
  }, [allCreditPackages, customCredits, selectedCredits]);

  const selectedCreditsEffective = useMemo(() => {
    if (customCredits.trim().length > 0) {
      const custom = Number(customCredits);
      if (Number.isFinite(custom) && custom > 0) return Math.min(custom, creditCap === Infinity ? custom : creditCap);
    }
    return selectedCredits;
  }, [customCredits, selectedCredits, creditCap]);

  const isCustomOverCap = useMemo(() => {
    if (creditCap === Infinity) return false;
    const custom = Number(customCredits);
    return Number.isFinite(custom) && custom > creditCap;
  }, [customCredits, creditCap]);

  const handleUpgrade = async (planId: string) => {
    console.log("handleUpgrade called with planId:", planId);
    setCheckingOut(true);
    try {
      const { url } = await api.createCheckout(planId, coupon || undefined);
      window.location.href = url;
    } catch (e) {
      console.error(e);
      setCheckingOut(false);
    }
  };

  const handleBuyCredits = async () => {
    setCheckingOut(true);
    try {
      const selectedPkg = allCreditPackages.find(p => p.credits === selectedCredits);
      if (!selectedPkg) {
        throw new Error("Invalid credit package selected.");
      }

      const { url } = await api.createCreditsCheckout(selectedPkg.id);
      window.location.href = url;
    } catch (e) {
      console.error(e);
      setCheckingOut(false);
    }
  };

  const planLabel = String(activePlan).toUpperCase();

  return (
    <div className="h-full pt-20 overflow-y-auto relative gap-7 flex flex-col w-full p-10 max-w-6xl mx-auto">
      <div className="bg-dark/15 dark:bg-white/7 w-2/3 mx-auto absolute -top-20 rounded-full blur-[100px] left-0 right-0 h-32"></div>

      {coupon && (
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="bg-accent text-white p-2 rounded-lg">
            <Ticket weight="fill" className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-dark dark:text-white">Coupon Code Applied: <span className="font-mono text-accent">{coupon}</span></p>
            <p className="text-xs text-dark/60 dark:text-white/60">Discount will be applied at checkout.</p>
          </div>
        </div>
      )}

      <div className="flex pb-6 border-b border-dark/10 dark:border-white/10 w-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <p className="text-dark/35 dark:text-white/35 font-medium text-xs">CREDITS BALANCE</p>
          <div className="bg-dark/4 dark:bg-white/3 text-dark/75 dark:text-white/75 font-semibold text-xs rounded-lg p-1 px-1.5">
            {loading ? "—" : planLabel}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-dark dark:text-white text-5xl font-bold">
            {loading ? "—" : activeCredits}
          </h2>
          <p className="text-dark/35 dark:text-white/35 font-medium text-xs">Available credits</p>
        </div>
        <div className="flex gap-2 mt-1.5 items-center">
          <Button
            className="bg-dark dark:bg-white text-white dark:text-dark py-3 px-7"
            onClick={() => setBuyOpen(true)}
            disabled={loading}
          >
            Add Credits
          </Button>
          <Button
            className="bg-accent text-white py-3 px-7"
            onClick={() => {
              const target =
                activePlan === "pro"
                  ? "premium"
                  : plans.find((p: any) => p.name.toLowerCase() === "pro")?.id ||
                  "pro";
              handleUpgrade(target);
            }}
            disabled={loading || checkingOut}
            loading={checkingOut}
          >
            {activePlan === "pro" ? "Upgrade to Premium" : "Upgrade Plan"}
          </Button>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {(plans || []).slice(0, 3).map((p: any) => {
          const isPopular = Boolean(p?.popular);
          return (
            <div
              key={p.id}
              className={
                isPopular
                  ? "bg-dark dark:bg-white/10 text-white dark:text-dark rounded-4xl p-6 flex flex-col justify-between border-2 border-dark dark:border-white/3 shadow-lg shadow-dark/10"
                  : "bg-surface/70 dark:bg-white/5 text-dark dark:text-white rounded-4xl p-6 flex flex-col justify-between border-2 border-border dark:border-white/5 shadow-lg shadow-dark/4"
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3
                    className={
                      isPopular
                        ? "text-white dark:text-white font-bold text-lg"
                        : "text-dark dark:text-white font-bold text-lg"
                    }
                  >
                    {p.name}
                  </h3>
                  <p
                    className={
                      isPopular
                        ? "text-white/60 dark:text-white/60 max-w-[150px] text-sm font-medium"
                        : "text-dark/50 dark:text-white/50 max-w-[150px] text-sm font-medium"
                    }
                  >
                    {p.description}
                  </p>
                </div>
                {isPopular ? (
                  <div className="bg-surface/20 dark:bg-white/10 text-white dark:text-white w-fit text-[10px] font-bold px-5 py-2 rounded-full">
                    Most Popular
                  </div>
                ) : null}
              </div>
              <div className="mt-6">
                <div
                  className={
                    isPopular
                      ? "text-white dark:text-white text-4xl font-extrabold"
                      : "text-dark dark:text-white text-4xl font-extrabold"
                  }
                >
                  ${p.price}
                </div>
                <div
                  className={
                    isPopular
                      ? "text-white/60 dark:text-white/60 text-sm font-medium mt-1"
                      : "text-dark/50 text-sm font-medium mt-1"
                  }
                >
                  per month
                </div>
                <div
                  className={
                    isPopular
                      ? "text-white/70 dark:text-white/70 text-sm font-semibold mt-4"
                      : "text-dark/60 dark:text-white/60 text-sm font-semibold mt-4"
                  }
                >
                  {p.monthlyCredits?.toLocaleString?.() || p.monthlyCredits}{" "}
                  credits/month
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                {(p.features || []).slice(0, 6).map((f: string) => (
                  <div
                    key={f}
                    className={
                      isPopular
                        ? "text-white/70 dark:text-white/70 text-sm font-medium flex items-start gap-2"
                        : "text-dark/60 dark:text-white/60 text-sm font-medium flex items-start gap-2"
                    }
                  >
                    <span className="text-[10px] mt-1 text-accent">●</span>
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  className={
                    isPopular
                      ? "w-full bg-surface dark:bg-white/10 text-dark dark:text-white py-3.5"
                      : "w-full bg-dark dark:bg-white/10 text-white dark:text-whitedark py-3.5"
                  }
                  onClick={() => handleUpgrade(p.id)}
                  disabled={loading || checkingOut}
                  loading={checkingOut}
                >
                  Upgrade to {p.name}
                </Button>
              </div>
            </div>
          );
        })}
      </div>



      {creditHistory.length > 0 && (
        <div className="w-full mt-4">
          <h3 className="text-xl font-bold dark:text-white text-dark mb-4 filter drop-shadow-sm">Credit History</h3>
          <div className="bg-surface/70 dark:bg-white/5 border border-dark/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark/5 dark:bg-white/5 text-dark/70 dark:text-white/70 text-sm">
                  <th className="py-3 px-6 font-semibold border-b border-dark/10 dark:border-white/10">Date</th>
                  <th className="py-3 px-6 font-semibold border-b border-dark/10 dark:border-white/10">Description</th>
                  <th className="py-3 px-6 font-semibold border-b border-dark/10 dark:border-white/10">Amount</th>
                  <th className="py-3 px-6 font-semibold border-b border-dark/10 dark:border-white/10">Type</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {creditHistory.map((item) => (
                  <tr key={item.id} className="border-b border-dark/5 dark:border-white/5 last:border-0 hover:bg-dark/2 dark:hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6 text-dark/60 dark:text-white/60">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-dark dark:text-white font-medium">
                      {item.description}
                    </td>
                    <td className={`py-4 px-6 font-bold ${item.amount > 0 ? 'text-emerald-500' : 'text-dark dark:text-white'}`}>
                      {item.amount > 0 ? '+' : ''}{item.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${item.type === 'purchase' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        item.type === 'usage' ? 'bg-dark/10 dark:bg-white/10 text-dark/70 dark:text-white/70' :
                          item.type === 'bonus' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                            'bg-dark/10 dark:bg-white/10 text-dark/70 dark:text-white/70'
                        }`}>
                        {item.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {buyOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => setBuyOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-surface dark:bg-[#050505] rounded-4xl w-full max-w-md p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-dark dark:text-white font-bold text-lg">Get Tokens</h3>
                  <p className="text-dark/50 dark:text-white/50 text-sm font-medium">
                    Select a package or enter custom
                  </p>
                </div>
                <button
                  onClick={() => setBuyOpen(false)}
                  className="text-dark/40 dark:text-white/40 hover:text-dark transition-all"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {allCreditPackages.map((pkg) => {
                  const isOverCap = creditCap !== Infinity && pkg.credits > creditCap;
                  const selected =
                    !isOverCap &&
                    selectedCredits === pkg.credits &&
                    customCredits.trim().length === 0;
                  return (
                    <button
                      key={pkg.credits}
                      disabled={isOverCap}
                      onClick={() => {
                        if (isOverCap) return;
                        setCustomCredits("");
                        setSelectedCredits(pkg.credits);
                      }}
                      className={
                        isOverCap
                          ? "border-2 border-dark/5 dark:border-white/5 rounded-3xl p-4 text-left bg-dark/2 dark:bg-white/2 opacity-50 cursor-not-allowed relative"
                          : selected
                            ? "border-2 border-accent rounded-3xl p-4 text-left bg-surface dark:bg-white/2"
                            : "border-2 border-dark/5 dark:border-white/5 rounded-3xl p-4 text-left bg-surface dark:bg-white/2"
                      }
                    >
                      {isOverCap && (
                        <div className="absolute top-3 right-3">
                          <Lock size={14} weight="bold" className="text-dark/30 dark:text-white/30" />
                        </div>
                      )}
                      <div className={`font-extrabold text-xl ${isOverCap ? 'text-dark/30 dark:text-white/30' : 'text-dark dark:text-white'}`}>
                        {pkg.credits.toLocaleString()}
                      </div>
                      <div className={`text-xs font-semibold uppercase ${isOverCap ? 'text-dark/20 dark:text-white/20' : 'text-dark/50 dark:text-white/50'}`}>
                        {pkg.tag}
                      </div>
                      <div className={`mt-2 inline-flex text-sm rounded-xl px-2 py-1 font-semibold ${isOverCap ? 'bg-dark/3 text-dark/30 dark:text-white/30' : 'bg-dark/5 text-dark dark:text-white'}`}>
                        ${pkg.price.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>

              {creditCap !== Infinity && (
                <div className="mt-3 flex items-center gap-2 bg-dark/3 dark:bg-white/5 rounded-xl p-3">
                  <Crown weight="fill" size={14} className="text-amber-500 shrink-0" />
                  <p className="text-dark/50 dark:text-white/40 text-xs font-medium">
                    Max {creditCap.toLocaleString()} credits on your plan.{' '}
                    <Link href="/app/billing" className="text-accent hover:underline font-semibold" onClick={() => setBuyOpen(false)}>
                      Upgrade to {getNextTierName(activePlan)} →
                    </Link>
                  </p>
                </div>
              )}

              <div className="mt-3">
                <button
                  onClick={() => setCustomCredits(String(creditCap === Infinity ? 1000 : Math.min(creditCap, 1000)))}
                  className="w-full border-2 border-dashed flex gap-2 items-center justify-center border-dark/10 dark:border-white/5 rounded-xl p-4 text-dark/70 dark:text-white/50 font-semibold"
                >
                  <PlusIcon /> Custom amount
                </button>
              </div>

              <div className="mt-3 bg-dark/3 dark:bg-white/5 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-dark/40 dark:text-white/25 text-xs font-semibold">
                    You get
                  </div>
                  <div className="text-dark dark:text-white font-bold">
                    {selectedCreditsEffective.toLocaleString()} tokens
                  </div>
                </div>
                <div className="text-dark dark:text-white font-extrabold text-xl">
                  ${selectedPrice.toFixed(2)}
                </div>
              </div>

              {customCredits.trim().length > 0 ? (
                <div className="mt-3 space-y-1.5">
                  <input
                    value={customCredits}
                    onChange={(e) => setCustomCredits(e.target.value)}
                    className={`w-full bg-dark/3 dark:bg-white/3 outline-0 rounded-2xl text-sm p-3 text-dark dark:text-white ${isCustomOverCap ? 'ring-2 ring-red-500/50' : ''}`}
                    placeholder={`Enter tokens (max ${creditCap === Infinity ? 'unlimited' : creditCap.toLocaleString()})`}
                    inputMode="numeric"
                  />
                  {isCustomOverCap && (
                    <p className="text-red-500 text-xs font-medium px-1">
                      Max {creditCap.toLocaleString()} credits on your plan. Value will be capped.
                    </p>
                  )}
                </div>
               ) : null}

              <div className="flex gap-2 mt-4">
                <Button
                  className="w-full bg-dark dark:bg-white dark:text-dark text-white py-3"
                  onClick={() => setBuyOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full bg-accent text-white py-3"
                  onClick={handleBuyCredits}
                  loading={checkingOut}
                  disabled={checkingOut}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default page;
