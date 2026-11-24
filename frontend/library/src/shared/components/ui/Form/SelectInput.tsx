import { motion, type HTMLMotionProps } from 'motion/react'
import { controlFocus, controlStyle, invalidControlStyle } from './formControl.styles'

export interface SelectOption {
  value: string | number
  label: string
}

interface SelectInputProps extends HTMLMotionProps<'select'> {
  options: SelectOption[]
  placeholder?: string
  invalid?: boolean
}

export const SelectInput = ({
  options,
  placeholder,
  invalid = false,
  style,
  id,
  ...props
}: SelectInputProps) => (
  <motion.select
    id={id}
    aria-invalid={invalid}
    aria-describedby={invalid ? `${id}-error` : undefined}
    style={{ ...controlStyle, cursor: 'pointer', ...(invalid ? invalidControlStyle : {}), ...style }}
    whileFocus={controlFocus}
    {...props}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </motion.select>
)
