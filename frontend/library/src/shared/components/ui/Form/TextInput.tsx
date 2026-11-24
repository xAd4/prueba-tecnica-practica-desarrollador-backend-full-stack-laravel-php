import { motion, type HTMLMotionProps } from 'motion/react'
import { controlFocus, controlStyle, invalidControlStyle } from './formControl.styles'

interface TextInputProps extends HTMLMotionProps<'input'> {
  invalid?: boolean
}

export const TextInput = ({ invalid = false, style, id, ...props }: TextInputProps) => (
  <motion.input
    id={id}
    aria-invalid={invalid}
    aria-describedby={invalid ? `${id}-error` : undefined}
    style={{ ...controlStyle, ...(invalid ? invalidControlStyle : {}), ...style }}
    whileFocus={controlFocus}
    {...props}
  />
)
