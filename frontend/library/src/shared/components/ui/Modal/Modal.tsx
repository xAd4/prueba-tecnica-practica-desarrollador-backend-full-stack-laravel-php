import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, type ReactNode } from 'react'
import { theme } from '../../../theme/theme'
import { Button } from '../Button/Button'
import {
  backdropStyle,
  bodyStyle,
  dialogAnimation,
  dialogStyle,
  headerStyle,
  titleStyle,
} from './Modal.styles'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: string
}

export const Modal = ({ isOpen, title, onClose, children, maxWidth = '560px' }: ModalProps) => {
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={backdropStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            style={{ ...dialogStyle, maxWidth }}
            {...dialogAnimation}
            transition={theme.transitions.spring}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.header style={headerStyle}>
              <motion.h2 id={titleId} style={titleStyle}>
                {title}
              </motion.h2>
              <Button variant="ghost" size="sm" aria-label="Cerrar" onClick={onClose}>
                ✕
              </Button>
            </motion.header>
            <motion.div style={bodyStyle}>{children}</motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
