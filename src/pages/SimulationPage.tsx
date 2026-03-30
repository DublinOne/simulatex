import React, { useState, useEffect } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { 
  AppShell, 
  AppShellMain, 
  Button, 
  Badge,
  Card,
  CardContent,
  Slider,
  Switch,
  Label,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  toast
} from '@blinkdotnew/ui'
import { 
  ArrowLeft, 
  Settings2, 
  Play, 
  Pause, 
  RotateCw, 
  Maximize2, 
  Share2,
  Info,
  Layers,
  Zap,
  Cpu,
  Save,
  Trash2,
  Lock,
  Sparkles
} from 'lucide-react'
import { SolarSystem } from '../components/simulations/SolarSystem'
import { FluidDynamics } from '../components/simulations/FluidDynamics'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { cn } from '../lib/utils'

export function SimulationPage() {
  const { id } = useParams({ from: '/simulations/$id' })
  const { user } = useAuth()
  const { isPro } = useSubscription()
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState([1])
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [viscosity, setViscosity] = useState([0.01])
  const [isTrueScale, setIsTrueScale] = useState(false)
  const [particleCount, setParticleCount] = useState([2000])
  const [colorMode, setColorMode] = useState<'default' | 'electric' | 'fire' | 'ocean'>('default')
  const [isSaving, setIsSaving] = useState(false)

  // Load saved configuration
  useEffect(() => {
    if (!user) return

    const loadConfig = async () => {
      try {
        const sim = await blink.db.simulations.get(id)
        if (sim && sim.config) {
          const config = JSON.parse(sim.config)
          if (config.speed) setSpeed([config.speed])
          if (config.showOrbits !== undefined) setShowOrbits(config.showOrbits)
          if (config.showLabels !== undefined) setShowLabels(config.showLabels)
          if (config.viscosity) setViscosity([config.viscosity])
          if (config.isTrueScale !== undefined && isPro) setIsTrueScale(config.isTrueScale)
          if (config.particleCount && isPro) setParticleCount([config.particleCount])
          if (config.colorMode && isPro) setColorMode(config.colorMode)
          toast.success('Configuration loaded')
        }
      } catch (error) {
        console.error('Failed to load config:', error)
      }
    }

    loadConfig()
  }, [id, user, isPro])

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save configurations')
      return
    }

    setIsSaving(true)
    try {
      const config = JSON.stringify({
        speed: speed[0],
        showOrbits,
        showLabels,
        viscosity: viscosity[0],
        isTrueScale: isPro ? isTrueScale : false,
        particleCount: isPro ? particleCount[0] : 2000,
        colorMode: isPro ? colorMode : 'default'
      })

      await blink.db.simulations.upsert({
        id,
        user_id: user.id,
        name: id === 'solar-system' ? 'Solar System Simulation' : 'Fluid Dynamics Solver',
        type: id,
        config,
        updated_at: new Date().toISOString()
      })

      toast.success('Configuration saved successfully')
    } catch (error) {
      console.error('Failed to save config:', error)
      toast.error('Failed to save configuration')
    } finally {
      setIsSaving(false)
    }
  }

  const renderSimulation = () => {
    if (id === 'solar-system') {
      return (
        <SolarSystem 
          isPlaying={isPlaying} 
          speed={speed[0]} 
          showOrbits={showOrbits} 
          showLabels={showLabels} 
          isTrueScale={isPro ? isTrueScale : false}
        />
      )
    }
    if (id === 'fluid-dynamics') {
      return (
        <FluidDynamics 
          isPlaying={isPlaying} 
          viscosity={viscosity[0]} 
          particleCount={isPro ? particleCount[0] : 2000}
          colorMode={isPro ? colorMode : 'default'}
        />
      )
    }
    return <div className="text-white">Simulation not found</div>
  }

  const simTitle = id === 'solar-system' ? 'Solar System Simulation' : 'Fluid Dynamics Solver'
  const simType = id === 'solar-system' ? 'PHYSICS ENGINE V2' : 'NAVIER-STOKES V1'

  return (
    <AppShell>
      <AppShellMain className="bg-black h-screen overflow-hidden flex flex-col">
        {/* Navigation / Header */}
        <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 z-50">
          <div className="flex items-center gap-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="h-10 w-10 glass-card hover:bg-white/10 text-white rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="space-y-0.5">
              <h1 className="text-xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
                {simTitle}
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-[10px] text-primary py-0 px-2 h-5">{simType}</Badge>
              </h1>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Viewport
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-4 py-2 glass-card rounded-full text-[10px] font-bold tracking-widest uppercase text-white/70">
              <Cpu className={cn("w-3.5 h-3.5", isPro ? "text-primary" : "text-white/30")} />
              <span>GPU Cluster: {isPro ? 'PRIORITY' : 'STANDARD'}</span>
              <span className="mx-2 w-px h-3 bg-white/10" />
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span>LOAD: {id === 'solar-system' ? '14%' : '42%'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 px-4 glass-card hover:bg-white/10 text-white rounded-full gap-2 border-white/10"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className={cn("w-4 h-4", isSaving && "animate-spin")} />
                {isSaving ? 'Saving...' : 'Save Config'}
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 glass-card hover:bg-white/10 text-white rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 glass-card hover:bg-white/10 text-white rounded-full">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Viewport */}
        <main className="flex-1 relative overflow-hidden flex items-center justify-center">
          {renderSimulation()}
          
          {/* Viewport Overlay Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 glass-card p-4 rounded-3xl border border-white/5 z-50 animate-slide-up">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-12 w-12 glass hover:bg-white/10 text-white rounded-2xl"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5" />}
            </Button>
            
            <div className="w-px h-8 bg-white/10" />
            
            <div className="flex items-center gap-6 px-4">
              <div className="flex flex-col gap-2 w-48">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Simulation Speed</span>
                  <span className="text-[10px] font-bold text-primary">{speed[0]}x</span>
                </div>
                <Slider 
                  value={speed} 
                  onValueChange={setSpeed} 
                  max={5} 
                  step={0.1} 
                  className="[&>[role=slider]]:h-4 [&>[role=slider]]:w-4" 
                />
              </div>
            </div>
            
            <div className="w-px h-8 bg-white/10" />
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-12 w-12 glass hover:bg-white/10 text-white rounded-2xl"
              onClick={() => {}}
            >
              <RotateCw className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Simulation Controls Panel */}
          <div className="absolute top-8 right-8 w-80 space-y-6 z-50 animate-fade-in">
            <Card className="glass-card p-6 space-y-8 border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  Parameters
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-white/30" />
                    </TooltipTrigger>
                    <TooltipContent>Adjust real-time simulation variables</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-8">
                {id === 'solar-system' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-white/90">Orbit Visualization</Label>
                        <p className="text-[10px] text-white/40">Toggle orbital path markers</p>
                      </div>
                      <Switch checked={showOrbits} onCheckedChange={setShowOrbits} className="data-[state=checked]:bg-primary" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-white/90">Object Labels</Label>
                        <p className="text-[10px] text-white/40">Show names of celestial bodies</p>
                      </div>
                      <Switch checked={showLabels} onCheckedChange={setShowLabels} className="data-[state=checked]:bg-primary" />
                    </div>

                    <div className={cn("flex items-center justify-between transition-opacity", !isPro && "opacity-50 cursor-not-allowed")}>
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                          Actual Distances
                          {!isPro && <Badge className="bg-white/5 border-white/10 text-[8px] h-4 py-0 px-1">PRO</Badge>}
                        </Label>
                        <p className="text-[10px] text-white/40">Scale orbits to realistic proportions</p>
                      </div>
                      <Switch 
                        checked={isTrueScale} 
                        onCheckedChange={(val) => isPro ? setIsTrueScale(val) : toast.error('Upgrade to Pro for actual distances')} 
                        disabled={!isPro}
                        className="data-[state=checked]:bg-primary" 
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-white/90">Viscosity</Label>
                        <span className="text-[10px] text-primary">{viscosity[0]}</span>
                      </div>
                      <Slider 
                        value={viscosity} 
                        onValueChange={setViscosity} 
                        max={0.1} 
                        step={0.001} 
                        className="[&>[role=slider]]:h-3 [&>[role=slider]]:w-3"
                      />
                    </div>

                    {isPro && (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold text-white/90">Particle Density</Label>
                            <span className="text-[10px] text-primary">{particleCount[0]}</span>
                          </div>
                          <Slider 
                            value={particleCount} 
                            onValueChange={setParticleCount} 
                            min={1000}
                            max={10000} 
                            step={500} 
                            className="[&>[role=slider]]:h-3 [&>[role=slider]]:w-3"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                            Spectral Mode
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {(['default', 'electric', 'fire', 'ocean'] as const).map((mode) => (
                              <Button
                                key={mode}
                                variant={colorMode === mode ? 'default' : 'outline'}
                                size="sm"
                                className="text-[10px] h-7 font-bold uppercase tracking-wider glass border-white/5"
                                onClick={() => setColorMode(mode)}
                              >
                                {mode}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <div className={cn("flex items-center justify-between", !isPro && "opacity-50")}>
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                      Real-time Scale
                      {!isPro && <Badge className="bg-white/5 border-white/10 text-[8px] h-4 py-0 px-1">PRO</Badge>}
                    </Label>
                    <p className="text-[10px] text-white/40">Scale objects to true size</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isPro && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link to="/pricing">
                              <Lock className="w-3.5 h-3.5 text-primary/50 hover:text-primary transition-colors" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>Upgrade to Pro to unlock astronomical scale</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <Switch 
                      checked={isTrueScale} 
                      onCheckedChange={setIsTrueScale} 
                      disabled={!isPro}
                      className="data-[state=checked]:bg-primary" 
                    />
                  </div>
                </div>

                {!isPro && (
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full h-10 glass border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs gap-2">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      Upgrade to unlock Pro Parameters
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
            
            <Card className="glass-card p-6 border-white/5 overflow-hidden relative group">
              <div className="space-y-3 relative z-10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Simulation Data</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Entities</span>
                    <span className="text-white/80">{id === 'solar-system' ? '9 Planets' : '2000 Particles'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Stability</span>
                    <span className="text-white/80">{id === 'solar-system' ? 'High' : 'Converging'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Solver</span>
                    <span className="text-white/80">{id === 'solar-system' ? 'RK4' : 'LBM'}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layers className="w-16 h-16 text-primary" />
              </div>
            </Card>
          </div>
        </main>
      </AppShellMain>
    </AppShell>
  )
}
