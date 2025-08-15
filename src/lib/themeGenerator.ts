import { DesignSystemTheme } from '@/contexts/DesignSystemContext'

export interface CSSVariables {
  [key: string]: string
}

export function generateCSSVariables(theme: DesignSystemTheme): CSSVariables {
  const variables: CSSVariables = {}

  // 안전한 테마 접근을 위한 헬퍼 함수
  const safeAccess = (obj: any, fallback: any = {}) => {
    return obj && typeof obj === 'object' ? obj : fallback
  }

  // Color variables
  const colors = safeAccess(theme?.colors)
  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables[`--color-${key}`] = value
    }
  })

  // Typography variables
  const typography = safeAccess(theme?.typography)
  if (typeof typography.fontFamily === 'string') {
    variables['--font-family'] = typography.fontFamily
  }
  
  const fontSize = safeAccess(typography.fontSize)
  Object.entries(fontSize).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables[`--font-size-${key}`] = value
    }
  })
  
  const fontWeight = safeAccess(typography.fontWeight)
  Object.entries(fontWeight).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables[`--font-weight-${key}`] = value
    }
  })
  
  const lineHeight = safeAccess(typography.lineHeight)
  Object.entries(lineHeight).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables[`--line-height-${key}`] = value
    }
  })

  // Spacing variables
  const spacing = safeAccess(theme?.spacing)
  Object.entries(spacing).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables[`--spacing-${key}`] = value
    }
  })

  // Border radius variables
  const borderRadius = safeAccess(theme?.borderRadius)
  Object.entries(borderRadius).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables[`--border-radius-${key}`] = value
    }
  })

  // Shadow variables
  const shadows = safeAccess(theme?.shadows)
  Object.entries(shadows).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables[`--shadow-${key}`] = value
    }
  })

  return variables
}

export function applyCSSVariables(variables: CSSVariables, element: HTMLElement = document.documentElement) {
  if (!variables || typeof variables !== 'object') {
    console.warn('applyCSSVariables: Invalid variables provided')
    return
  }
  
  if (!element || typeof element.style?.setProperty !== 'function') {
    console.warn('applyCSSVariables: Invalid element provided')
    return
  }
  
  try {
    Object.entries(variables).forEach(([property, value]) => {
      if (typeof property === 'string' && typeof value === 'string') {
        element.style.setProperty(property, value)
      }
    })
  } catch (error) {
    console.error('Error applying CSS variables:', error)
  }
}

export function generateComponentCSS(theme: DesignSystemTheme) {
  try {
    const variables = generateCSSVariables(theme)
    
    if (!variables || typeof variables !== 'object') {
      console.warn('generateComponentCSS: No variables generated')
      return ''
    }
    
    const variableEntries = Object.entries(variables)
      .filter(([property, value]) => typeof property === 'string' && typeof value === 'string')
      .map(([property, value]) => `  ${property}: ${value};`)
      .join('\n')
    
    return `
:root {
${variableEntries}
}

/* Button styles */
.ds-button {
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  position: relative;
}

.ds-button:focus {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
  z-index: 1;
}

.ds-button:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.ds-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ds-button[aria-pressed="true"] {
  transform: translateY(1px);
}

.ds-button--primary {
  background-color: var(--color-primary);
  color: var(--color-background);
}

.ds-button--primary:hover:not(:disabled) {
  opacity: 0.9;
}

.ds-button--secondary {
  background-color: var(--color-secondary);
  color: var(--color-background);
}

.ds-button--secondary:hover:not(:disabled) {
  opacity: 0.9;
}

.ds-button--outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-border);
}

.ds-button--outline:hover:not(:disabled) {
  background-color: var(--color-accent);
}

.ds-button--ghost {
  background-color: transparent;
  color: var(--color-foreground);
}

.ds-button--ghost:hover:not(:disabled) {
  background-color: var(--color-accent);
}

/* Input styles */
.ds-input {
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-background);
  color: var(--color-foreground);
  transition: border-color 0.2s ease-in-out;
  width: 100%;
}

.ds-input:focus {
  outline: none;
  border-color: var(--color-ring);
  box-shadow: 0 0 0 2px var(--color-ring);
}

.ds-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ds-input--error {
  border-color: var(--color-destructive);
}

/* Card styles */
.ds-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.ds-card__header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.ds-card__content {
  padding: var(--spacing-lg);
}

.ds-card__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-muted);
}

/* Typography styles */
.ds-heading-1 {
  font-family: var(--font-family);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-lg) 0;
}

.ds-heading-2 {
  font-family: var(--font-family);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-md) 0;
}

.ds-heading-3 {
  font-family: var(--font-family);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-md) 0;
}

.ds-heading-4 {
  font-family: var(--font-family);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.ds-heading-5 {
  font-family: var(--font-family);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.ds-heading-6 {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.ds-paragraph {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-md) 0;
}

.ds-caption {
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-muted-foreground);
  margin: 0;
}

/* Modal styles */
.ds-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.ds-modal {
  background-color: var(--color-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 32rem;
  width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.ds-modal__header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.ds-modal__title {
  font-family: var(--font-family);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-foreground);
  margin: 0;
}

.ds-modal__content {
  padding: var(--spacing-xl);
}

.ds-modal__footer {
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

/* Loading styles */
.ds-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--color-muted);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ds-skeleton {
  background: linear-gradient(90deg, var(--color-muted) 25%, var(--color-accent) 50%, var(--color-muted) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: var(--border-radius-md);
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.ds-progress {
  width: 100%;
  height: 0.5rem;
  background-color: var(--color-muted);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.ds-progress__bar {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease-in-out;
}

/* Navigation styles */
.ds-nav-header {
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--spacing-lg);
}

.ds-nav-header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.ds-nav-header__brand {
  font-family: var(--font-family);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-foreground);
  text-decoration: none;
}

.ds-nav-header__menu {
  display: flex;
  gap: var(--spacing-lg);
  list-style: none;
  margin: 0;
  padding: 0;
}

.ds-nav-header__item {
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.ds-nav-header__item:hover {
  color: var(--color-foreground);
}

.ds-breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
}

.ds-breadcrumb__item {
  color: var(--color-muted-foreground);
  text-decoration: none;
}

.ds-breadcrumb__item:hover {
  color: var(--color-foreground);
}

.ds-breadcrumb__separator {
  color: var(--color-muted-foreground);
}

.ds-breadcrumb__item--current {
  color: var(--color-foreground);
  font-weight: var(--font-weight-medium);
}
`;
  } catch (error) {
    console.error('Error generating component CSS:', error)
    return ''
  }
}
