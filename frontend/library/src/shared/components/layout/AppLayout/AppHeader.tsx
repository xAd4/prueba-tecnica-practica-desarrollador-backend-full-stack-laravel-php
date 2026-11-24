import { motion } from 'motion/react'
import {
  brandSubtitleStyle,
  brandTitleStyle,
  headerInnerStyle,
  headerStyle,
  logoStyle,
} from './AppLayout.styles'

export const AppHeader = () => (
  <motion.header style={headerStyle} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
    <motion.div style={headerInnerStyle}>
      <motion.div aria-hidden="true" style={logoStyle} whileHover={{ rotate: -8, scale: 1.05 }}>
        📖
      </motion.div>
      <motion.div>
        <motion.h1 style={brandTitleStyle}>Biblioteca</motion.h1>
        <motion.p style={brandSubtitleStyle}>Gestión de libros y categorías</motion.p>
      </motion.div>
    </motion.div>
  </motion.header>
)
