import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { mainStyle } from './AppLayout.styles'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => (
  <>
    <AppHeader />
    <motion.main style={mainStyle}>{children}</motion.main>
  </>
)
