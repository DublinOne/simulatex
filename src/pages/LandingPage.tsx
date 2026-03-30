import React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@blinkdotnew/ui'
import { Play, Sparkles } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]">
      <div className="max-w-4xl text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-float">
          <Sparkles className="w-4 h-4" />
          <span>Simulation Engine v1.0</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tight text-white leading-tight">
          Visualize the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Unseen Universe
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          SimulateX is the world's first interactive platform to create, run, and visualize complex dynamic models in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              Launch Dashboard
              <Play className="ml-2 w-5 h-5 fill-current" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-medium glass text-primary border-primary/20">
              <Sparkles className="mr-2 w-5 h-5 fill-current" />
              Go Pro
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="fixed top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
