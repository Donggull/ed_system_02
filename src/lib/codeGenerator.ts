import { DesignSystemTheme, ComponentType } from '@/contexts/DesignSystemContext'

export interface GeneratedCode {
  react: string
  vue: string
  html: string
  typescript: string
  css: string
  storybook: string
}

export interface ComponentCode {
  name: string
  react: string
  vue: string
  html: string
  typescript: string
  css: string
  storybook: string
}

export class CodeGenerator {
  private theme: DesignSystemTheme
  private components: ComponentType[]

  constructor(theme: DesignSystemTheme, components: ComponentType[]) {
    this.theme = theme
    this.components = components
  }

  // CSS 변수 생성
  generateCSSVariables(): string {
    const cssVars = [
      '/* Design System CSS Variables */',
      ':root {',
      '  /* Colors */',
      ...Object.entries(this.theme.colors).map(([key, value]) => 
        `  --color-${key}: ${value};`
      ),
      '',
      '  /* Typography */',
      `  --font-family: ${this.theme.typography.fontFamily};`,
      ...Object.entries(this.theme.typography.fontSize).map(([key, value]) => 
        `  --font-size-${key}: ${value};`
      ),
      ...Object.entries(this.theme.typography.fontWeight).map(([key, value]) => 
        `  --font-weight-${key}: ${value};`
      ),
      ...Object.entries(this.theme.typography.lineHeight).map(([key, value]) => 
        `  --line-height-${key}: ${value};`
      ),
      '',
      '  /* Spacing */',
      ...Object.entries(this.theme.spacing).map(([key, value]) => 
        `  --spacing-${key}: ${value};`
      ),
      '',
      '  /* Border Radius */',
      ...Object.entries(this.theme.borderRadius).map(([key, value]) => 
        `  --border-radius-${key}: ${value};`
      ),
      '',
      '  /* Shadows */',
      ...Object.entries(this.theme.shadows).map(([key, value]) => 
        `  --shadow-${key}: ${value};`
      ),
      '}'
    ].join('\n')

    return cssVars
  }

  // TypeScript 타입 정의 생성
  generateTypeScriptTypes(): string {
    return `// Design System Type Definitions
export interface DesignSystemTheme {
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    border: string
    input: string
    ring: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
    }
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
    lineHeight: {
      tight: string
      normal: string
      relaxed: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export const theme: DesignSystemTheme = ${JSON.stringify(this.theme, null, 2)}

export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive'
export type ComponentSize = 'sm' | 'md' | 'lg'
`
  }

  // Button 컴포넌트 코드 생성
  generateButtonCode(): ComponentCode {
    const name = 'Button'
    
    const react = `import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  }
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  }
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}`

    const vue = `<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  }
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  }
  
  return [base, variants[props.variant], sizes[props.size]].join(' ')
})
</script>`

    const html = `<button class="btn btn--primary btn--md">
  Button Text
</button>`

    const typescript = `export interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}`

    const css = `.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
}

.btn:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--default {
  background-color: var(--color-background);
  color: var(--color-foreground);
}

.btn--default:hover {
  background-color: var(--color-accent);
  color: var(--color-accentForeground);
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-primary);
}

.btn--primary:hover {
  background-color: color-mix(in srgb, var(--color-primary) 90%, transparent);
}

.btn--secondary {
  background-color: var(--color-secondary);
  color: var(--color-secondary);
}

.btn--secondary:hover {
  background-color: color-mix(in srgb, var(--color-secondary) 80%, transparent);
}

.btn--destructive {
  background-color: var(--color-destructive);
  color: var(--color-destructiveForeground);
}

.btn--destructive:hover {
  background-color: color-mix(in srgb, var(--color-destructive) 90%, transparent);
}

.btn--sm {
  height: 2.25rem;
  padding: 0 0.75rem;
  font-size: var(--font-size-sm);
}

.btn--md {
  height: 2.5rem;
  padding: 0.5rem 1rem;
}

.btn--lg {
  height: 2.75rem;
  padding: 0 2rem;
}`

    const storybook = `import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'destructive'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}`

    return { name, react, vue, html, typescript, css, storybook }
  }

  // Input 컴포넌트 코드 생성
  generateInputCode(): ComponentCode {
    const name = 'Input'
    
    const react = `import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || \`input-\${Math.random().toString(36).substr(2, 9)}\`
  
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}`

    const vue = `<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :class="inputClasses"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
    />
    <p v-if="error" class="input-error">{{ error }}</p>
    <p v-else-if="helperText" class="input-helper">{{ helperText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  error?: string
  helperText?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  error: '',
  helperText: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = \`input-\${Math.random().toString(36).substr(2, 9)}\`

const inputClasses = computed(() => {
  const base = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  
  if (props.error) {
    return base + ' border-destructive focus-visible:ring-destructive'
  }
  
  return base
})
</script>`

    const html = `<div class="input-wrapper">
  <label for="input-1" class="input-label">Label</label>
  <input id="input-1" type="text" class="input" placeholder="Enter text..." />
  <p class="input-helper">Helper text</p>
</div>`

    const typescript = `export interface InputProps {
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  required?: boolean
  value?: string
  onChange?: (value: string) => void
}`

    const css = `.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-foreground);
}

.input {
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-input);
  background-color: var(--color-background);
  padding: 0.5rem 0.75rem;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  transition: all 0.2s ease-in-out;
}

.input:focus-visible {
  outline: none;
  border-color: var(--color-ring);
  box-shadow: 0 0 0 2px var(--color-ring);
}

.input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.input::placeholder {
  color: var(--color-mutedForeground);
}

.input--error {
  border-color: var(--color-destructive);
}

.input--error:focus-visible {
  border-color: var(--color-destructive);
  box-shadow: 0 0 0 2px var(--color-destructive);
}

.input-error {
  font-size: var(--font-size-sm);
  color: var(--color-destructive);
}

.input-helper {
  font-size: var(--font-size-sm);
  color: var(--color-mutedForeground);
}`

    const storybook = `import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email...',
    type: 'email',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long',
  },
}

export const WithError: Story = {
  args: {
    label: 'Username',
    error: 'Username is required',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    value: 'Cannot edit this',
  },
}`

    return { name, react, vue, html, typescript, css, storybook }
  }

  // Card 컴포넌트 코드 생성
  generateCardCode(): ComponentCode {
    const name = 'Card'
    
    const react = `import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
    {children}
  </div>
)

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
    {children}
  </div>
)

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
)

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
)

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
)

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('flex items-center p-6 pt-0', className)}>
    {children}
  </div>
)`

    const vue = `<template>
  <div :class="['card', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

defineProps<Props>()
</script>

<template>
  <div :class="['card-header', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

defineProps<Props>()
</script>

<template>
  <h3 :class="['card-title', className]">
    <slot />
  </h3>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

defineProps<Props>()
</script>

<template>
  <p :class="['card-description', className]">
    <slot />
  </p>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

defineProps<Props>()
</script>

<template>
  <div :class="['card-content', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

defineProps<Props>()
</script>

<template>
  <div :class="['card-footer', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

defineProps<Props>()
</script>`

    const html = `<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">Card description goes here</p>
  </div>
  <div class="card-content">
    <p>Card content goes here</p>
  </div>
  <div class="card-footer">
    <button class="btn btn--primary">Action</button>
  </div>
</div>`

    const typescript = `export interface CardProps {
  children: React.ReactNode
  className?: string
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}`

    const css = `.card {
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-foreground);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.5rem;
}

.card-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold;
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
}

.card-description {
  font-size: var(--font-size-sm);
  color: var(--color-mutedForeground);
}

.card-content {
  padding: 0 1.5rem 1.5rem;
}

.card-footer {
  display: flex;
  align-items: center;
  padding: 0 1.5rem 1.5rem;
}`

    const storybook = `import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { Button } from '../Button/Button'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>Simple card with just content</p>
      </CardContent>
    </Card>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Featured Post</CardTitle>
        <CardDescription>An interesting article about design systems</CardDescription>
      </CardHeader>
      <CardContent>
        <img 
          src="https://via.placeholder.com/400x200" 
          alt="Placeholder" 
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
        <p style={{ marginTop: '1rem' }}>
          This is a sample card with an image. You can add any content here.
        </p>
      </CardContent>
    </Card>
  ),
}`

    return { name, react, vue, html, typescript, css, storybook }
  }

  // Badge 컴포넌트 코드 생성
  generateBadgeCode(): ComponentCode {
    const name = 'Badge'
    
    const react = `import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variants = {
    default: 'border border-transparent bg-primary text-primary-foreground',
    primary: 'border border-transparent bg-primary text-primary-foreground',
    secondary: 'border border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border border-transparent bg-destructive text-destructive-foreground',
    success: 'border border-transparent bg-green-500 text-white'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  
  return (
    <div className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </div>
  )
}`

    const vue = `<template>
  <div :class="badgeClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variants = {
    default: 'border border-transparent bg-primary text-primary-foreground',
    primary: 'border border-transparent bg-primary text-primary-foreground',
    secondary: 'border border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border border-transparent bg-destructive text-destructive-foreground',
    success: 'border border-transparent bg-green-500 text-white'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  
  return [base, variants[props.variant], sizes[props.size]].join(' ')
})
</script>`

    const html = `<span class="badge badge--primary badge--md">
  Badge Text
</span>`

    const typescript = `export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}`

    const css = `.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.125rem 0.625rem;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s ease-in-out;
}

.badge:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-ring);
}

.badge--default,
.badge--primary {
  background-color: var(--color-primary);
  color: white;
}

.badge--secondary {
  background-color: var(--color-secondary);
  color: white;
}

.badge--destructive {
  background-color: var(--color-destructive);
  color: var(--color-destructiveForeground);
}

.badge--success {
  background-color: #10b981;
  color: white;
}

.badge--sm {
  padding: 0.125rem 0.5rem;
  font-size: var(--font-size-xs);
}

.badge--md {
  padding: 0.125rem 0.625rem;
  font-size: var(--font-size-xs);
}

.badge--lg {
  padding: 0.25rem 0.75rem;
  font-size: var(--font-size-sm);
}`

    const storybook = `import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'destructive', 'success'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}`

    return { name, react, vue, html, typescript, css, storybook }
  }

  // Avatar 컴포넌트 코드 생성
  generateAvatarCode(): ComponentCode {
    const name = 'Avatar'
    
    const react = `import React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  className
}) => {
  const [imageError, setImageError] = React.useState(false)
  
  const baseClasses = 'relative flex shrink-0 overflow-hidden rounded-full'
  
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <div className={cn(baseClasses, sizes[size], className)}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium',
          textSizes[size]
        )}>
          {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
        </div>
      )}
    </div>
  )
}`

    const vue = `<template>
  <div :class="avatarClasses">
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      @error="imageError = true"
      class="aspect-square h-full w-full object-cover"
    />
    <div v-else :class="fallbackClasses">
      {{ displayFallback }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  fallback: '',
  size: 'md'
})

const imageError = ref(false)

const avatarClasses = computed(() => {
  const base = 'relative flex shrink-0 overflow-hidden rounded-full'
  
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  return [base, sizes[props.size]].join(' ')
})

const fallbackClasses = computed(() => {
  const base = 'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium'
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base',
    xl: 'text-lg'
  }
  
  return [base, textSizes[props.size]].join(' ')
})

const displayFallback = computed(() => {
  return props.fallback || (props.alt ? props.alt.charAt(0).toUpperCase() : '?')
})
</script>`

    const html = `<div class="avatar avatar--md">
  <img src="https://via.placeholder.com/40" alt="User Avatar" />
</div>

<div class="avatar avatar--md">
  <div class="avatar-fallback">
    U
  </div>
</div>`

    const typescript = `export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}`

    const css = `.avatar {
  position: relative;
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
}

.avatar--sm {
  height: 2rem;
  width: 2rem;
}

.avatar--md {
  height: 2.5rem;
  width: 2.5rem;
}

.avatar--lg {
  height: 3rem;
  width: 3rem;
}

.avatar--xl {
  height: 4rem;
  width: 4rem;
}

.avatar img {
  aspect-ratio: 1;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.avatar-fallback {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-muted);
  color: var(--color-mutedForeground);
  font-weight: var(--font-weight-medium);
}

.avatar--sm .avatar-fallback {
  font-size: var(--font-size-xs);
}

.avatar--md .avatar-fallback {
  font-size: var(--font-size-sm);
}

.avatar--lg .avatar-fallback {
  font-size: var(--font-size-base);
}

.avatar--xl .avatar-fallback {
  font-size: var(--font-size-lg);
}`

    const storybook = `import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://via.placeholder.com/40',
    alt: 'User Avatar',
  },
}

export const Fallback: Story = {
  args: {
    alt: 'John Doe',
    fallback: 'JD',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    src: 'https://via.placeholder.com/32',
    alt: 'Small Avatar',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    src: 'https://via.placeholder.com/48',
    alt: 'Large Avatar',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    src: 'https://via.placeholder.com/64',
    alt: 'XL Avatar',
  },
}`

    return { name, react, vue, html, typescript, css, storybook }
  }

  // Typography 컴포넌트 코드 생성
  generateTypographyCode(): ComponentCode {
    const name = 'Typography'
    
    const react = `import React from 'react'
import { cn } from '@/lib/utils'

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'small'
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  children,
  className,
  as
}) => {
  const variants = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 text-base font-semibold tracking-tight',
    body1: 'leading-7',
    body2: 'text-sm leading-6',
    caption: 'text-xs text-muted-foreground',
    small: 'text-sm font-medium leading-none'
  }
  
  const defaultElements = {
    h1: 'h1',
    h2: 'h2', 
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'p',
    small: 'small'
  }
  
  const Component = as || (defaultElements[variant] as keyof JSX.IntrinsicElements)
  
  return (
    <Component className={cn(variants[variant], className)}>
      {children}
    </Component>
  )
}`

    const vue = `<template>
  <component :is="elementTag" :class="typographyClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'small'
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body1',
  as: ''
})

const variants = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
  h6: 'scroll-m-20 text-base font-semibold tracking-tight',
  body1: 'leading-7',
  body2: 'text-sm leading-6',
  caption: 'text-xs text-muted-foreground',
  small: 'text-sm font-medium leading-none'
}

const defaultElements = {
  h1: 'h1',
  h2: 'h2', 
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'p',
  small: 'small'
}

const elementTag = computed(() => {
  return props.as || defaultElements[props.variant]
})

const typographyClasses = computed(() => {
  return variants[props.variant]
})
</script>`

    const html = `<h1 class="typography typography--h1">Heading 1</h1>
<h2 class="typography typography--h2">Heading 2</h2>
<p class="typography typography--body1">Body text paragraph</p>
<small class="typography typography--small">Small text</small>`

    const typescript = `export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'small'
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}`

    const css = `.typography {
  color: var(--color-foreground);
}

.typography--h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
}

.typography--h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.typography--h3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.typography--h4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.typography--h5 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.typography--h6 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.typography--body1 {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

.typography--body2 {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.typography--caption {
  font-size: var(--font-size-xs);
  color: var(--color-mutedForeground);
}

.typography--small {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1;
}`

    const storybook = `import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'small'],
    },
    as: {
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1',
  },
}

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2',
  },
}

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Heading 3',
  },
}

export const Body1: Story = {
  args: {
    variant: 'body1',
    children: 'This is body text with normal size and weight.',
  },
}

export const Body2: Story = {
  args: {
    variant: 'body2',
    children: 'This is smaller body text for secondary content.',
  },
}

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'This is caption text for additional information.',
  },
}

export const Small: Story = {
  args: {
    variant: 'small',
    children: 'Small text for fine print.',
  },
}

export const CustomElement: Story = {
  args: {
    variant: 'h2',
    as: 'div',
    children: 'H2 styling applied to a div element',
  },
}`

    return { name, react, vue, html, typescript, css, storybook }
  }

  // 모든 컴포넌트 코드 생성
  generateAllComponents(): ComponentCode[] {
    const componentGenerators = {
      button: () => this.generateButtonCode(),
      input: () => this.generateInputCode(),
      card: () => this.generateCardCode(),
      badge: () => this.generateBadgeCode(),
      avatar: () => this.generateAvatarCode(),
      typography: () => this.generateTypographyCode(),
      // 추가 컴포넌트들...
    }

    return this.components
      .filter(component => componentGenerators[component as keyof typeof componentGenerators])
      .map(component => componentGenerators[component as keyof typeof componentGenerators]())
  }

  // 전체 코드 생성
  generateFullCode(): GeneratedCode {
    const components = this.generateAllComponents()
    
    return {
      react: components.map(c => c.react).join('\n\n'),
      vue: components.map(c => c.vue).join('\n\n'),
      html: components.map(c => c.html).join('\n\n'),
      typescript: this.generateTypeScriptTypes(),
      css: this.generateCSSVariables() + '\n\n' + components.map(c => c.css).join('\n\n'),
      storybook: components.map(c => c.storybook).join('\n\n')
    }
  }
}
