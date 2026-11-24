import { motion, type MotionStyle } from 'motion/react'
import { theme } from '../../../theme/theme'

const wrapperStyle: MotionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.space.md,
  padding: theme.space.xxl,
  color: theme.colors.textMuted,
}

const circleStyle: MotionStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: `4px solid ${theme.colors.primarySoft}`,
  borderTopColor: theme.colors.primary,
}

interface SpinnerProps {
  label?: string
}

export const Spinner = ({ label = 'Cargando...' }: SpinnerProps) => (
  <motion.div role="status" aria-live="polite" style={wrapperStyle}>
    <motion.div
      style={circleStyle}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
    />
    <motion.span style={{ fontSize: theme.fontSizes.sm }}>{label}</motion.span>
  </motion.div>
)
