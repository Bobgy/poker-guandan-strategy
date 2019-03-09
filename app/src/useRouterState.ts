import { useState, useMemo, useEffect, useCallback } from 'react'
import { History } from 'history'

// using internal state
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

interface RouteConfig {
  path: string
  title: string
}

interface RoutesConfig {
  base: string
  defaultRoute: string
  routes: {
    [route: string]: RouteConfig
  }
}

export const NOT_FOUND = 'NOT_FOUND'
const NOT_FOUND_CONFIG: RouteConfig = {
  path: '/not-found',
  title: 'Page Not Found',
}

// remove ending /
function normalizePath(path: string) {
  if (path.endsWith('/')) {
    return path.substring(0, path.length - 1)
  }

  return path
}

export function createBrowserRouterHook(
  providedRoutesConfig: RoutesConfig,
  history: History,
) {
  const routesConfig: RoutesConfig = {
    ...providedRoutesConfig,
    routes: { ...providedRoutesConfig.routes, [NOT_FOUND]: NOT_FOUND_CONFIG },
  }
  function getCurrentPath() {
    const pathNowRaw = history.location.pathname
    if (pathNowRaw.startsWith(routesConfig.base)) {
      return normalizePath(pathNowRaw.substring(routesConfig.base.length))
    }

    return routesConfig.base + NOT_FOUND_CONFIG.path
  }
  function match(pathname: string) {
    const [route, routeConfig] = Object.entries(routesConfig.routes).find(
      ([_, routeConfig]) => routeConfig.path === pathname,
    ) || [NOT_FOUND, NOT_FOUND_CONFIG]

    return {
      route,
      routeConfig,
    }
  }

  return function useBrowserRouterState() {
    const [route, setRoute] = useState(match(getCurrentPath()).route)

    useEffect(() => {
      function historyEventHandler(location: any, action: any) {
        // console.log(location)
        // console.log(action)
        // console.log(getCurrentPath())
        // console.log(match(getCurrentPath()))
        setRoute(match(getCurrentPath()).route)
      }

      // listen for all incoming navigations, returns function to unlisten the event handler
      return history.listen(historyEventHandler)
    }, [setRoute])

    useEffect(() => {
      window.document.title = routesConfig.routes[route].title
    }, [])

    // dispatch navigation action
    const navigate = useCallback(
      (routeToDispatch, { replace = false } = {}) => {
        // check validity of the route, if not found, go to the NOT_FOUND page
        routeToDispatch = routesConfig.routes[routeToDispatch]
          ? routeToDispatch
          : NOT_FOUND
        const routeMatched = routesConfig.routes[routeToDispatch]

        if (replace) {
          history.replace(routesConfig.base + routeMatched.path)
        } else {
          history.push(routesConfig.base + routeMatched.path)
        }
      },
      [routesConfig, NOT_FOUND_CONFIG],
    )

    return {
      route,
      title: routesConfig.routes[route].title,
      navigation: {
        navigate,
        goBack: history.goBack,
      },
    }
  }
}
