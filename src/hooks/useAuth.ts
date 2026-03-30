import { useEffect, useState } from 'react'
import { blink } from '../blink/client'
import type { BlinkUser } from '@blinkdotnew/sdk'

export function useAuth() {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.isLoading) setIsLoading(false)
    })
    return unsubscribe
  }, [])

  const plan = user?.metadata ? (JSON.parse(user.metadata).plan || 'free') : 'free'
  const isPro = plan === 'pro'

  const login = () => blink.auth.login()
  const logout = () => blink.auth.logout()

  return { user, isLoading, isAuthenticated: !!user, plan, isPro, login, logout }
}
