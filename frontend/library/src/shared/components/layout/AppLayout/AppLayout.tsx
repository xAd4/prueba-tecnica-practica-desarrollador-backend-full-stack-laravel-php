import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { footerStyle, mainStyle } from './AppLayout.styles'

interface AppLayoutProps {
  children: ReactNode
  footer?: ReactNode
}

export const AppLayout = ({ children, footer }: AppLayoutProps) => (
  <>
    <AppHeader />
    <motion.main style={mainStyle}>{children}</motion.main>
    {footer && <motion.footer style={footerStyle}>{footer}</motion.footer>}
  </>
)
