/**
 * Deterministic color for a category so the same category always looks the same.
 * Uses the golden angle (137.5°) so consecutive ids get clearly different hues.
 */
export const getCategoryColor = (categoryId: number | null | undefined): string => {
  if (!categoryId) return 'hsl(230 10% 60%)'
  const hue = Math.round(categoryId * 137.508) % 360
  return `hsl(${hue} 62% 48%)`
}

export const getCategorySoftColor = (categoryId: number | null | undefined): string => {
  if (!categoryId) return 'hsl(230 10% 95%)'
  const hue = Math.round(categoryId * 137.508) % 360
  return `hsl(${hue} 70% 95%)`
}
