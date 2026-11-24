import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => (
  <Provider store={store}>
    {/* Respect the user's "reduce motion" OS preference. */}
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </Provider>
)
