import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { errorTextStyle, fieldStyle, labelStyle, requiredMarkStyle } from './formControl.styles'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export const FormField = ({ id, label, error, required = false, children }: FormFieldProps) => (
  <motion.div style={fieldStyle}>
    <motion.label htmlFor={id} style={labelStyle}>
      {label}
      {required && (
        <motion.span aria-hidden="true" style={requiredMarkStyle}>
          *
        </motion.span>
      )}
    </motion.label>

    {children}

    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          key={error}
          id={`${id}-error`}
          role="alert"
          style={errorTextStyle}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
)
