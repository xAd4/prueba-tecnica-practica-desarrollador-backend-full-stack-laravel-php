import { useEffect } from 'react'
import { theme } from './theme'

/**
 * Applies the document-level styles (body font, background, margin...) without
 * any stylesheet: the values are written directly on the DOM nodes.
 */
export const GlobalStyles = () => {
  useEffect(() => {
    const { body, documentElement } = document

    Object.assign(documentElement.style, {
      backgroundColor: theme.colors.background,
      colorScheme: 'light',
    })

    Object.assign(body.style, {
      margin: '0',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.md,
      lineHeight: '1.5',
      WebkitFontSmoothing: 'antialiased',
    })
  }, [])

  return null
}
