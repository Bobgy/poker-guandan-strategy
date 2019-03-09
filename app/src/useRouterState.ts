import { useState, useMemo } from 'react'

export function useRouterState(defaultRoute: string) {
  const [route, navigate] = useState(defaultRoute)
  const navigation = useMemo(
    () => ({
      navigate,
    }),
    [navigate],
  )
  return {
    route,
    navigation,
  }
}
