import { useEffect, useState } from 'react'
import { blink } from '../blink/client'
import { useAuth } from './useAuth'

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise'

export function useSubscription() {
  const { user, isLoading: authLoading } = useAuth()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionPlan>('free')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setSubscriptionStatus('free')
      setIsLoading(false)
      return
    }

    const loadSubscription = async () => {
      try {
        const subs = await blink.db.subscriptions.list({
          where: { user_id: user.id, status: 'active' }
        })
        if (subs && subs.length > 0) {
          setSubscriptionStatus(subs[0].plan_type as SubscriptionPlan)
        } else {
          setSubscriptionStatus('free')
        }
      } catch (error) {
        console.error('Failed to load subscription:', error)
        setSubscriptionStatus('free')
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscription()
  }, [user, authLoading])

  const isPro = subscriptionStatus === 'pro' || subscriptionStatus === 'enterprise'

  return { subscriptionStatus, isPro, isLoading: isLoading || authLoading }
}
