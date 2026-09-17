import {useEffect, type ReactNode} from 'react'
import {useRouter, useRouterState} from 'sanity/router'

export function DefaultStart({children}: {children: ReactNode}) {
  const router = useRouter()
  const state = useRouterState()
  const empty = !state.intent && (!Array.isArray(state.panes) || state.panes.length === 0)
  useEffect(() => {
    if (empty) router.navigate({...state, panes: [[{id: 'start'}]]}, {replace: true})
  }, [empty, router, state])
  return children
}
