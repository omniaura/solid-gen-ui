/**
 * SolidJS context for GenerativeUICore
 */

import { createContext, useContext, ParentComponent } from 'solid-js'
import type { GenerativeUICore } from '@solid-gen-ui/core'

/**
 * Context for accessing GenerativeUICore instance
 */
const GenUIContext = createContext<GenerativeUICore>()

export interface GenUIProviderProps {
  /** Core engine instance */
  core: GenerativeUICore
}

/**
 * Provider component for GenerativeUICore
 *
 * Wrap your app with this to enable `useGenUI()` and `useGenUICore()` hooks.
 *
 * @example
 * ```tsx
 * const core = new GenerativeUICore()
 * core.setAdapter(createClaudeAdapter(apiKey))
 *
 * function App() {
 *   return (
 *     <GenUIProvider core={core}>
 *       <Chat />
 *     </GenUIProvider>
 *   )
 * }
 * ```
 */
export const GenUIProvider: ParentComponent<GenUIProviderProps> = (props) => {
  return (
    <GenUIContext.Provider value={props.core}>
      {props.children}
    </GenUIContext.Provider>
  )
}

/**
 * Hook to access the GenerativeUICore instance
 *
 * @throws Error if used outside GenUIProvider
 */
export function useGenUICore(): GenerativeUICore {
  const ctx = useContext(GenUIContext)

  if (!ctx) {
    throw new Error('useGenUICore must be used within GenUIProvider')
  }

  return ctx
}
