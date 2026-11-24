import { motion, type HTMLMotionProps } from 'motion/react'
import {
  baseButtonStyle,
  buttonFocus,
  buttonHoverStyles,
  buttonSizeStyles,
  buttonTap,
  buttonVariantStyles,
  disabledButtonStyle,
  type ButtonSize,
  type ButtonVariant,
} from './Button.styles'

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  type = 'button',
  style,
  ...props
}: ButtonProps) => (
  <motion.button
    type={type}
    disabled={disabled}
    style={{
      ...baseButtonStyle,
      ...buttonSizeStyles[size],
      ...buttonVariantStyles[variant],
      ...(fullWidth ? { width: '100%' } : {}),
      ...(disabled ? disabledButtonStyle : {}),
      ...style,
    }}
    whileHover={disabled ? undefined : buttonHoverStyles[variant]}
    whileTap={disabled ? undefined : buttonTap}
    whileFocus={buttonFocus}
    transition={{ duration: 0.15 }}
    {...props}
  />
)
