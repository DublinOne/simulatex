import React from 'react'
import { Link } from '@tanstack/react-router'
import { 
  AppShell, 
  AppShellSidebar, 
  AppShellMain, 
  MobileSidebarTrigger, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarItem, 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody,
  StatGroup,
  Stat,
  Card,
  CardContent,
  CardFooter,
  Badge,
  Button,
  AreaChart,
  BarChart,
  CardHeader,
  CardTitle,
  CardDescription
} from '@blinkdotnew/ui'
import { 
  LayoutDashboard, 
  Orbit, 
  Zap, 
  History, 
  Plus, 
  Play, 
  Globe2, 
  Dna, 
  CloudRain,
  Waves,
  Activity,
  Cpu,
  Database,
  Sparkles,
  CreditCard
} from 'lucide-react'
import { useSubscription } from '../hooks/useSubscription'

const MOCK_SIMULATIONS = [
  {
    id: 'solar-system',
    name: 'Solar System Simulation',
    description: 'An interactive model of our solar system with real-time orbits and planet details.',
    type: 'Physics',
    icon: <Globe2 className="w-8 h-8 text-primary" />,
    status: 'Ready',
  },
  {
    id: 'fluid-dynamics',
    name: 'Fluid Dynamics Solver',
    description: 'Real-time Navier-Stokes based fluid simulation for exploring turbulent flows.',
    type: 'Engineering',
    icon: <Waves className="w-8 h-8 text-blue-400" />,
    status: 'New',
  },
  {
    id: 'dna-folding',
    name: 'Protein Folding Model',
    description: 'Visualize complex protein folding patterns and molecular dynamics.',
    type: 'Biology',
    icon: <Dna className="w-8 h-8 text-accent" />,
    status: 'Beta',
  }
]

const PERFORMANCE_DATA = [
  { time: '00:00', cpu: 12, memory: 45, fps: 60 },
  { time: '04:00', cpu: 18, memory: 48, fps: 58 },
  { time: '08:00', cpu: 45, memory: 72, fps: 55 },
  { time: '12:00', cpu: 32, memory: 65, fps: 60 },
  { time: '16:00', cpu: 55, memory: 85, fps: 52 },
  { time: '20:00', cpu: 28, memory: 60, fps: 60 },
  { time: '23:59', cpu: 15, memory: 50, fps: 60 },
]

const USAGE_DATA = [
  { day: 'Mon', physics: 45, bio: 12, env: 8 },
  { day: 'Tue', physics: 52, bio: 15, env: 10 },
  { day: 'Wed', physics: 48, bio: 22, env: 12 },
  { day: 'Thu', physics: 65, bio: 25, env: 15 },
  { day: 'Fri', physics: 80, bio: 35, env: 20 },
  { day: 'Sat', physics: 95, bio: 45, env: 25 },
  { day: 'Sun', physics: 75, bio: 40, env: 22 },
]

export function DashboardPage() {
  const { subscriptionStatus, isPro } = useSubscription()

  return (
    <AppShell>
      <AppShellSidebar>
        <Sidebar className="glass border-r border-white/5">
          <SidebarHeader className="h-16 flex items-center px-6">
            <span className="text-xl font-heading font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary fill-current" />
              SimulateX
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground/50 uppercase text-[10px] font-bold tracking-widest px-6 py-4">Main</SidebarGroupLabel>
              <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" href="/dashboard" active />
              <SidebarItem icon={<Orbit className="w-4 h-4" />} label="My Simulations" href="/simulations" />
              <SidebarItem icon={<Activity className="w-4 h-4" />} label="Analytics" href="/analytics" />
              <SidebarItem icon={<History className="w-4 h-4" />} label="History" href="/history" />
            </SidebarGroup>

            <SidebarGroup className="mt-auto pb-6">
              {!isPro ? (
                <Link to="/pricing">
                  <SidebarItem 
                    icon={<Sparkles className="w-4 h-4 text-primary fill-current" />} 
                    label="Upgrade to Pro" 
                    className="bg-primary/5 hover:bg-primary/10 border border-primary/10 mx-4 rounded-xl text-primary font-bold"
                  />
                </Link>
              ) : (
                <SidebarItem 
                  icon={<CreditCard className="w-4 h-4" />} 
                  label="Manage Billing" 
                  onClick={() => window.open('/api/stripe/portal', '_blank')}
                  className="mx-4 rounded-xl"
                />
              )}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </AppShellSidebar>
      
      <AppShellMain className="bg-[#0c0e14]">
        <div className="md:hidden flex items-center gap-2 px-6 h-16 glass border-b border-white/5">
          <MobileSidebarTrigger />
          <span className="font-heading font-bold text-white">SimulateX</span>
        </div>
        
        <Page className="max-w-7xl mx-auto p-6 md:p-10">
          <PageHeader className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <PageTitle className="text-4xl font-heading font-bold text-white tracking-tight">System Overview</PageTitle>
                {isPro && (
                  <Badge className="bg-primary/20 border-primary/20 text-primary py-0 px-2 h-6 font-bold tracking-widest uppercase text-[10px]">
                    Pro Account
                  </Badge>
                )}
              </div>
              <PageDescription className="text-muted-foreground text-lg">Real-time telemetry and predictive simulation metrics.</PageDescription>
            </div>
            <div className="flex gap-4">
              {!isPro && (
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="h-12 px-6 font-bold glass text-primary border-primary/20 hover:bg-primary/5">
                    <Sparkles className="mr-2 w-4 h-4 fill-current" />
                    Go Pro
                  </Button>
                </Link>
              )}
              <Button size="lg" className="h-12 px-6 font-medium shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                <Plus className="mr-2 w-4 h-4" />
                New Simulation
              </Button>
            </div>
          </PageHeader>
          
          <PageBody className="space-y-10">
            {!isPro && (
              <Card className="glass-card border-primary/10 bg-primary/5 p-8 relative overflow-hidden group hover:bg-primary/[0.07] transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary fill-current animate-pulse" />
                      Scale your simulations to infinity.
                    </h2>
                    <p className="text-muted-foreground max-w-lg">
                      Unlock high-fidelity physics engines, true astronomical scale, and priority computational resources with a SimulateX Pro subscription.
                    </p>
                  </div>
                  <Link to="/pricing">
                    <Button size="lg" className="h-14 px-10 font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] shrink-0">
                      Explore Pro Tiers
                    </Button>
                  </Link>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-48 h-48 text-primary" />
                </div>
              </Card>
            )}

            <StatGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Stat label="Active Jobs" value="12" icon={<Orbit className="text-primary w-5 h-5" />} className="glass-card p-6" />
              <Stat label="Queue Wait" value="0.2s" trend={isPro ? -95 : 0} trendLabel={isPro ? "Priority" : "Standard"} icon={<Zap className="text-accent w-5 h-5" />} className="glass-card p-6" />
              <Stat label="Node Efficiency" value="94%" trend={5.2} trendLabel="vs avg" icon={<Activity className="text-blue-400 w-5 h-5" />} className="glass-card p-6" />
              <Stat label="Estimated End" value="14:20" icon={<History className="text-green-400 w-5 h-5" />} className="glass-card p-6" />
            </StatGroup>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl font-heading font-bold text-white">Computing History</CardTitle>
                  <CardDescription className="text-muted-foreground">Resource utilization across active viewports (24h)</CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaChart 
                    data={PERFORMANCE_DATA} 
                    dataKey={['cpu', 'memory']} 
                    xAxisKey="time" 
                    height={300} 
                  />
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl font-heading font-bold text-white">Daily Simulation Load</CardTitle>
                  <CardDescription className="text-muted-foreground">Total execution time categorized by simulation field</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={USAGE_DATA} 
                    dataKey={['physics', 'bio', 'env']} 
                    xAxisKey="day" 
                    height={300} 
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-white">Active Simulations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_SIMULATIONS.map((sim) => (
                  <Card key={sim.id} className="glass-card group overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                          {sim.icon}
                        </div>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-xs py-1 px-3">
                          {sim.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-heading font-bold text-white group-hover:text-primary transition-colors">{sim.name}</h3>
                        <p className="text-muted-foreground line-clamp-2 leading-relaxed">{sim.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">{sim.type}</Badge>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-8 pt-0">
                      <Link to={`/simulations/${sim.id}`} className="w-full">
                        <Button variant="outline" className="w-full h-12 glass group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 font-medium">
                          Launch Engine
                          <Play className="ml-2 w-4 h-4 fill-current" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </PageBody>
        </Page>
      </AppShellMain>
    </AppShell>
  )
}
