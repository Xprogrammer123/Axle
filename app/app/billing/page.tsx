'use client'

import { Button } from '@/components-beta/Button'
import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { PlusIcon } from '@phosphor-icons/react'

const page = () => {
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any | null>(null)
  const [plans, setPlans] = useState<any[]>([])

  const [buyOpen, setBuyOpen] = useState(false)
  const [selectedCredits, setSelectedCredits] = useState<number>(1000)
  const [customCredits, setCustomCredits] = useState<string>('')
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [subData, plansData] = await Promise.all([
          api.getSubscription(),
          api.getPlans(),
        ])
        setSubscription(subData?.subscription || subData)
        setPlans(plansData?.plans || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeCredits = subscription?.credits ?? 0
  const activePlan = (subscription?.plan || subscription?.planName || 'free')

  const creditPackages = useMemo(
    () => [
      { credits: 500, price: 10, tag: "Starter" },
      { credits: 1500, price: 30, tag: "Pro" },
      { credits: 2500, price: 50, tag: "Premium" },
      { credits: 5000, price: 100, tag: "Ultra" },
    ],
    []
  )

  const selectedPrice = useMemo(() => {
    const direct = creditPackages.find((p) => p.credits === selectedCredits)?.price
    if (direct) return direct
    const custom = Number(customCredits)
    if (!Number.isFinite(custom) || custom <= 0) return 0
    // 100 credits = $1 (matches 1000=$10)
    return Math.round((custom / 100) * 100) / 100
  }, [creditPackages, customCredits, selectedCredits])

  const selectedCreditsEffective = useMemo(() => {
    if (customCredits.trim().length > 0) {
      const custom = Number(customCredits)
      if (Number.isFinite(custom) && custom > 0) return custom
    }
    return selectedCredits
  }, [customCredits, selectedCredits])

  const handleUpgrade = async (planId: string) => {
    try {
      const { url } = await api.createCheckout(planId)
      window.location.href = url
    } catch (e) {
      console.error(e)
    }
  }

  const handleBuyCredits = async () => {
    setCheckingOut(true)
    try {
      // Backend credits checkout endpoint will be added; for now route to portal as fallback.
      const { url } = await api.getPortalLink()
      window.open(url, '_blank')
      setBuyOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setCheckingOut(false)
    }
  }

  const planLabel = String(activePlan).toUpperCase()

  return (
    <div className="h-full overflow-y-auto gap-7 flex flex-col w-full p-10 max-w-5xl mx-auto">
      <div className="flex pb-6 borer-b border-dark/10 w-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <p className="text-dark/35 font-medium text-xs">CREDITS BALANCE</p>
          <div className="bg-dark/4 text-dark/75 font-semibold text-xs rounded-lg p-1 px-1.5">{loading ? '—' : planLabel}</div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-dark text-5xl font-bold">
            {loading ? '—' : activeCredits}
          </h2>
          <p className="text-dark/35 font-medium text-xs">Available credits</p>
        </div>
        <div className="flex gap-2 mt-1.5 items-center">
          <Button className="bg-dark text-white py-3 px-7" onClick={() => setBuyOpen(true)} disabled={loading}>Add Credits</Button>
          <Button className="bg-accent text-white py-3 px-7" onClick={() => handleUpgrade('pro')} disabled={loading}>Upgrade Plan</Button>
        </div>
      </div> 
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {(plans || []).slice(0, 3).map((p: any) => {
          const isPopular = Boolean(p?.popular)
          return (
            <div
              key={p.id}
              className={
                isPopular
                  ? 'bg-dark text-white rounded-4xl p-6 border-2 border-dark shadow-lg shadow-dark/10'
                  : 'bg-white/60 text-dark rounded-4xl p-6 border-2 border-dark/3 shadow-lg shadow-dark/4'
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className={isPopular ? 'text-white font-bold text-lg' : 'text-dark font-bold text-lg'}>
                    {p.name}
                  </h3>
                  <p className={isPopular ? 'text-white/60 text-sm font-medium' : 'text-dark/50 text-sm font-medium'}>
                    {p.description}
                  </p>
                </div>
                {isPopular ? (
                  <div className="bg-white/15 text-white text-[10px] font-bold px-2 py-1 rounded-full">Most Popular</div>
                ) : null}
              </div>
              <div className="mt-6">
                <div className={isPopular ? 'text-white text-4xl font-extrabold' : 'text-dark text-4xl font-extrabold'}>
                  ${p.price}
                </div>
                <div className={isPopular ? 'text-white/60 text-sm font-medium mt-1' : 'text-dark/50 text-sm font-medium mt-1'}>
                  per month
                </div>
                <div className={isPopular ? 'text-white/70 text-sm font-semibold mt-4' : 'text-dark/60 text-sm font-semibold mt-4'}>
                  {p.monthlyCredits?.toLocaleString?.() || p.monthlyCredits} credits/month
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                {(p.features || []).slice(0, 6).map((f: string) => (
                  <div key={f} className={isPopular ? 'text-white/70 text-sm font-medium' : 'text-dark/60 text-sm font-medium'}>
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  className={isPopular ? 'w-full bg-white text-dark py-3.5' : 'w-full bg-dark text-white py-3.5'}
                  onClick={() => handleUpgrade(p.id)}
                  disabled={loading}
                >
                  Upgrade to {p.name}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {buyOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => setBuyOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-4xl w-full max-w-md p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-dark font-bold text-lg">Get Tokens</h3>
                  <p className="text-dark/50 text-sm font-medium">Select a package or enter custom</p>
                </div>
                <button
                  onClick={() => setBuyOpen(false)}
                  className="text-dark/40 hover:text-dark transition-all"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {creditPackages.map((pkg) => {
                  const selected = selectedCredits === pkg.credits && customCredits.trim().length === 0
                  return (
                    <button
                      key={pkg.credits}
                      onClick={() => {
                        setCustomCredits('')
                        setSelectedCredits(pkg.credits)
                      }}
                      className={
                        selected
                          ? 'border-2 border-accent rounded-3xl p-4 text-left bg-white'
                          : 'border-2 border-dark/5 rounded-3xl p-4 text-left bg-white'
                      }
                    >
                      <div className="text-dark font-extrabold text-xl">{pkg.credits.toLocaleString()}</div>
                      <div className="text-dark/50 text-xs font-semibold uppercase">{pkg.tag}</div>
                      <div className="mt-2 inline-flex bg-dark/5 text-dark font-semibold text-sm rounded-xl px-2 py-1">
                        ${pkg.price.toFixed(2)}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-3">
                <button
                  onClick={() => setCustomCredits('1000')}
                  className="w-full border-2 border-dashed flex gap-2 items-center justify-center border-dark/10 rounded-xl p-4 text-dark/70 font-semibold"
                >
                  <PlusIcon /> Custom amount
                </button>
              </div>

              <div className="mt-3 bg-dark/3 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-dark/40 text-xs font-semibold">You get</div>
                  <div className="text-dark font-bold">
                    {selectedCreditsEffective.toLocaleString()} tokens
                  </div>
                </div>
                <div className="text-dark font-extrabold text-xl">${selectedPrice.toFixed(2)}</div>
              </div>

              {customCredits.trim().length > 0 ? (
                <div className="mt-3">
                  <input
                    value={customCredits}
                    onChange={(e) => setCustomCredits(e.target.value)}
                    className="w-full bg-dark/3 outline-0 rounded-2xl text-sm p-3 text-dark"
                    placeholder="Enter tokens e.g. 2500"
                    inputMode="numeric"
                  />
                </div>
              ) : null}

              <div className="flex gap-2 mt-4">
                <Button className="w-full bg-dark/5 text-dark py-3" onClick={() => setBuyOpen(false)}>
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
  )
}

export default page