import React, { useEffect, useRef, useState } from 'react'

interface FluidDynamicsProps {
  isPlaying: boolean
  density?: number
  viscosity?: number
  particleCount?: number
  colorMode?: 'default' | 'electric' | 'fire' | 'ocean'
}

export function FluidDynamics({ 
  isPlaying, 
  density = 0.1, 
  viscosity = 0.01, 
  particleCount = 2000,
  colorMode = 'default'
}: FluidDynamicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0, down: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const particles: Particle[] = []
    const numParticles = particleCount
    const width = canvas.width = canvas.offsetWidth
    const height = canvas.height = canvas.offsetHeight

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 2
        this.vy = (Math.random() - 0.5) * 2
        this.size = Math.random() * 2 + 1
        
        let hue = 200 + Math.random() * 40
        if (colorMode === 'electric') hue = 50 + Math.random() * 20
        if (colorMode === 'fire') hue = 10 + Math.random() * 30
        if (colorMode === 'ocean') hue = 180 + Math.random() * 60
        
        this.color = `hsla(${hue}, 100%, 50%, ${Math.random() * 0.5 + 0.2})`
      }

      update(mouseX: number, mouseY: number, isMouseDown: boolean) {
        if (isMouseDown) {
          const dx = mouseX - this.x
          const dy = mouseY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 200) {
            const force = (200 - distance) / 200
            this.vx += (dx / distance) * force * 0.8
            this.vy += (dy / distance) * force * 0.8
          }
        }

        this.x += this.vx
        this.y += this.vy

        // Viscosity / Friction
        this.vx *= (1 - viscosity)
        this.vy *= (1 - viscosity)

        // Boundaries
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle())
    }

    const render = () => {
      if (isPlaying) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.fillRect(0, 0, width, height)

        particles.forEach(p => {
          p.update(mouse.x, mouse.y, mouse.down)
          p.draw(ctx)
        })
      }
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPlaying, mouse, viscosity, particleCount, colorMode])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setMouse(prev => ({ ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top }))
    }
  }

  return (
    <div className="w-full h-full relative bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseDown={() => setMouse(prev => ({ ...prev, down: true }))}
        onMouseUp={() => setMouse(prev => ({ ...prev, down: false }))}
      />
      <div className="absolute top-4 left-4 pointer-events-none space-y-1">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Interactive Solver</p>
        <p className="text-[8px] text-white/30 uppercase tracking-tighter">Click and drag to interact with particles</p>
      </div>
    </div>
  )
}