import React from 'react'
import { cn } from '../../lib/utils'

interface SolarSystemProps {
  isPlaying: boolean
  speed: number
  showOrbits: boolean
  showLabels: boolean
}

const PLANETS = [
  { id: 'mercury', name: 'Mercury', color: '#b5b5b5', size: 12, orbit: 100, duration: 10 },
  { id: 'venus', name: 'Venus', color: '#e39e1c', size: 18, orbit: 150, duration: 18 },
  { id: 'earth', name: 'Earth', color: '#3f8cff', size: 20, orbit: 200, duration: 30, hasMoon: true },
  { id: 'mars', name: 'Mars', color: '#ff5733', size: 16, orbit: 250, duration: 50 },
  { id: 'jupiter', name: 'Jupiter', color: '#d8ca9d', size: 40, orbit: 350, duration: 120 },
  { id: 'saturn', name: 'Saturn', color: '#e3e0c0', size: 36, orbit: 420, duration: 240, hasRing: true },
  { id: 'uranus', name: 'Uranus', color: '#b5e3e3', size: 26, orbit: 480, duration: 480 },
  { id: 'neptune', name: 'Neptune', color: '#3b5bdb', size: 26, orbit: 540, duration: 900 },
  { id: 'pluto', name: 'Pluto', color: '#aaa', size: 10, orbit: 600, duration: 1400 },
]

export function SolarSystem({ isPlaying, speed, showOrbits, showLabels }: SolarSystemProps) {
  return (
    <div className="relative w-[90vmin] h-[90vmin] perspective-[2000px] flex items-center justify-center">
      {/* Simulation Container */}
      <div 
        className={cn(
          "relative w-full h-full transform-style-3d transition-transform duration-1000",
          "hover:rotate-x-[20deg]"
        )}
      >
        {/* Sun */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 shadow-[0_0_80px_20px_rgba(255,165,0,0.6)] animate-pulse" />
          {showLabels && (
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest uppercase text-yellow-500/80">Sun</span>
          )}
        </div>

        {/* Planets */}
        <ul className="list-none m-0 p-0 transform-style-3d">
          {PLANETS.map((planet) => {
            const orbitDuration = planet.duration / speed
            const orbitSize = planet.orbit

            return (
              <li 
                key={planet.id}
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03] transition-opacity duration-500 transform-style-3d",
                  !showOrbits && "border-transparent"
                )}
                style={{ 
                  width: `${orbitSize}px`, 
                  height: `${orbitSize}px` 
                }}
              >
                {/* Planet Body */}
                <div 
                  className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center transform-style-3d",
                    !isPlaying && "pause-animation"
                  )}
                  style={{ 
                    width: `${planet.size}px`, 
                    height: `${planet.size}px`,
                    transformOrigin: `center ${orbitSize / 2}px`,
                    animation: isPlaying ? `orbit ${orbitDuration}s infinite linear` : 'none',
                    animationPlayState: isPlaying ? 'running' : 'paused'
                  }}
                >
                  <div 
                    className="w-full h-full rounded-full shadow-lg relative z-20 transition-all duration-300 hover:scale-125"
                    style={{ backgroundColor: planet.color }}
                  >
                    {planet.hasRing && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[30%] border-[4px] border-white/20 rounded-[50%] rotate-x-[75deg] pointer-events-none" />
                    )}
                    
                    {planet.hasMoon && (
                      <div 
                        className="absolute top-1/2 left-1/2 w-[40px] h-[40px] -translate-x-1/2 -translate-y-1/2 transform-style-3d pointer-events-none"
                        style={{ animation: `orbit 2.5s infinite linear` }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      </div>
                    )}
                  </div>

                  {showLabels && (
                    <span className="absolute -top-6 text-[8px] font-bold text-white/40 tracking-widest uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {planet.name}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes orbit {
          from { transform: rotate(0deg) translateY(0) rotate(0deg); }
          to { transform: rotate(360deg) translateY(0) rotate(-360deg); }
        }
        .transform-style-3d { transform-style: preserve-3d; }
        .pause-animation { animation-play-state: paused !important; }
      `}} />
    </div>
  )
}
