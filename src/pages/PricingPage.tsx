import React from 'react'
import { Link } from '@tanstack/react-router'
import { 
  AppShell, 
  AppShellMain, 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Badge
} from '@blinkdotnew/ui'
import { ArrowLeft, Check, Zap, Sparkles, Orbit, Cpu } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring basic simulations',
    features: [
      'Access to basic Solar System',
      'Basic Fluid Dynamics (2k particles)',
      '12 active simulations',
      'Standard processing'
    ],
    buttonText: 'Current Plan',
    current: true
  },
  {
    name: 'Pro',
    price: '$19',
    interval: '/mo',
    description: 'Advanced features for professional research',
    features: [
      'Actual Distance Scaling in Solar System',
      'High-Density Fluid (10k particles)',
      'Custom Spectral Color Modes',
      'Unlimited simulations',
      'Priority GPU processing',
      'Saved configurations'
    ],
    buttonText: 'Upgrade to Pro',
    current: false,
    highlight: true
  }
]

export function PricingPage() {
  const { isPro, user, login } = useAuth()

  const handleUpgrade = async () => {
    if (!user) {
      login()
      return
    }
    
    // For development/demo purposes, we allow manual upgrade
    if (import.meta.env.DEV) {
      try {
        await blink.db.subscriptions.upsert({
          id: `sub_${user.id}`,
          user_id: user.id,
          status: 'active',
          plan_type: 'pro',
          updated_at: new Date().toISOString()
        })
        toast.success('Simulated Upgrade Successful (Dev Mode)')
        window.location.reload()
      } catch (error) {
        toast.error('Failed to simulate upgrade')
      }
      return
    }

    // Real Stripe implementation would go here
    window.open('https://buy.stripe.com/test_demo', '_blank')
  }

  return (
    <AppShell>
      <AppShellMain className="bg-[#0c0e14] min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
          <div className="flex flex-col items-center text-center space-y-6">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-white mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white tracking-tight">
              Unlock the <span className="text-primary">Full Universe</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Choose the plan that fits your simulation needs. High-fidelity rendering and advanced physics await.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PLANS.map((plan) => {
              const isActive = (plan.name === 'Pro' && isPro) || (plan.name === 'Free' && !isPro)
              
              return (
                <Card 
                  key={plan.name} 
                  className={cn(
                    "glass-card border-white/5 relative flex flex-col transition-all duration-300",
                    plan.highlight && "border-primary/50 shadow-[0_0_40px_rgba(var(--primary),0.1)] scale-105 z-10"
                  )}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white px-4 py-1 text-xs font-bold uppercase tracking-widest shadow-lg">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
                      {plan.name}
                      {plan.name === 'Pro' ? <Zap className="w-6 h-6 text-primary fill-current" /> : <Orbit className="w-6 h-6 text-white/20" />}
                    </CardTitle>
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.interval}</span>
                    </div>
                    <CardDescription className="text-muted-foreground mt-4 text-base">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-10 pt-6 flex-1">
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-white/70">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter className="p-10 pt-0">
                    <Button 
                      onClick={plan.name === 'Pro' && !isPro ? handleUpgrade : undefined}
                      variant={plan.highlight ? 'default' : 'outline'} 
                      className={cn(
                        "w-full h-14 text-lg font-bold transition-all duration-300",
                        isActive ? "bg-white/5 text-white/50 border-white/10 cursor-default" : ""
                      )}
                      disabled={isActive}
                    >
                      {isActive ? 'Current Plan' : plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <div className="glass-card p-10 rounded-3xl border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                Enterprise Solutions
              </h3>
              <p className="text-muted-foreground">Custom simulation environments and dedicated GPU clusters.</p>
            </div>
            <Button variant="outline" className="h-12 px-8 glass border-white/10">Contact Sales</Button>
          </div>
        </div>
      </AppShellMain>
    </AppShell>
  )
}

import { cn } from '../lib/utils'
