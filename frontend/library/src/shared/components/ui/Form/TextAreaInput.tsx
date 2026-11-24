import { motion, type HTMLMotionProps } from 'motion/react'
import { controlFocus, controlStyle, invalidControlStyle, textAreaStyle } from './formControl.styles'

interface TextAreaInputProps extends HTMLMotionProps<'textarea'> {
  invalid?: boolean
}

export const TextAreaInput = ({ invalid = false, style, id, ...props }: TextAreaInputProps) => (
  <motion.textarea
    id={id}
    aria-invalid={invalid}
    aria-describedby={invalid ? `${id}-error` : undefined}
    style={{ ...controlStyle, ...textAreaStyle, ...(invalid ? invalidControlStyle : {}), ...style }}
    whileFocus={controlFocus}
    {...props}
  />
)
