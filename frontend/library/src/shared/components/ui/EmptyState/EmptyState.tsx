import { motion, type MotionStyle } from 'motion/react'
import type { ReactNode } from 'react'
import { theme } from '../../../theme/theme'

const containerStyle: MotionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.space.sm,
  padding: `${theme.space.xxl} ${theme.space.lg}`,
  textAlign: 'center',
  border: `2px dashed ${theme.colors.border}`,
  borderRadius: theme.radii.lg,
  backgroundColor: theme.colors.surfaceMuted,
}

const iconStyle: MotionStyle = { fontSize: '2.5rem', lineHeight: 1 }

const titleStyle: MotionStyle = {
  margin: 0,
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes.lg,
}

const descriptionStyle: MotionStyle = {
  margin: 0,
  color: theme.colors.textMuted,
  maxWidth: '420px',
}

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export const EmptyState = ({ icon = '📚', title, description, action }: EmptyStateProps) => (
  <motion.div
    style={containerStyle}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <motion.span aria-hidden="true" style={iconStyle} animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 1.2, delay: 0.2 }}>
      {icon}
    </motion.span>
    <motion.h3 style={titleStyle}>{title}</motion.h3>
    {description && <motion.p style={descriptionStyle}>{description}</motion.p>}
    {action}
  </motion.div>
)
