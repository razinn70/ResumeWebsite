# 🎯 **React Component Export/Import Style Guide**

## 📋 **Consistent Export Patterns**

### **🔥 Recommended: Default Exports for Components**

```typescript
// ✅ PREFERRED: Default export for React components
// components/RetroBootHero.tsx
export default function RetroBootHero(props: Props) {
  return <div>...</div>
}

// app/page.tsx
import RetroBootHero from '@/components/RetroBootHero'
```

**Benefits:**
- ✅ Cleaner imports (no destructuring)
- ✅ Better tree-shaking in modern bundlers
- ✅ Easier to refactor (rename component without breaking imports)
- ✅ Follows Next.js conventions

### **⚡ Named Exports for Utilities & Hooks**

```typescript
// ✅ Named exports for utilities, hooks, types
// lib/utils.ts
export function cn(...inputs: ClassValue[]) { ... }
export function formatDate(date: string): string { ... }
export type Theme = 'light' | 'dark'

// hooks/useDebounce.ts
export function useDebounce<T>(callback: T, delay: number): T { ... }

// Import usage
import { cn, formatDate, type Theme } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
```

## 🏗️ **Component Architecture Patterns**

### **1. Main Component (Default Export)**

```typescript
/**
 * @fileoverview ComponentName - Brief description
 * @author Your Name
 * @version 1.0.0
 */

'use client' // Only if needed

import { memo } from 'react'
// ... other imports

interface ComponentNameProps {
  /** Prop description */
  propName?: string
}

/**
 * ComponentName - Detailed description
 * 
 * @component
 * @param {ComponentNameProps} props
 * @returns {JSX.Element}
 */
const ComponentName = memo(function ComponentName({ 
  propName = 'default'
}: ComponentNameProps) {
  // Component logic here
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
})

// Display name for debugging
ComponentName.displayName = 'ComponentName'

export default ComponentName
```

### **2. Sub-components (Named Exports)**

```typescript
// If you have sub-components, export them as named exports
export const ComponentVariant = memo(function ComponentVariant() {
  return <div>Variant</div>
})

export const ComponentHeader = memo(function ComponentHeader() {
  return <header>Header</header>
})

// Usage
import ComponentName, { ComponentVariant, ComponentHeader } from './ComponentName'
```

## 📁 **File Organization Standards**

```
components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx        # Default: Button
│   ├── Input.tsx         # Default: Input  
│   └── Modal.tsx         # Default: Modal
├── layout/               # Layout components
│   ├── Navigation.tsx    # Default: Navigation
│   ├── Footer.tsx        # Default: Footer
│   └── Sidebar.tsx       # Default: Sidebar
├── features/             # Feature-specific components
│   ├── retro-boot-hero/  # Complex components get folders
│   │   ├── index.tsx     # Default: RetroBootHero
│   │   ├── types.ts      # Named: interfaces, types
│   │   └── utils.ts      # Named: helper functions
│   └── terminal/
│       ├── index.tsx
│       ├── commands.ts
│       └── history.ts
lib/
├── utils.ts              # Named: utility functions
├── constants.ts          # Named: constants, configs
└── types.ts              # Named: global types
hooks/
├── useDebounce.ts        # Named: useDebounce
├── useLocalStorage.ts    # Named: useLocalStorage
└── index.ts              # Re-export all hooks
```

## 🎨 **Naming Conventions**

### **Components** (PascalCase)
```typescript
✅ RetroBootHero.tsx
✅ TerminalNavigation.tsx  
✅ CRTMonitor3D.tsx
❌ retro-boot-hero.tsx
❌ terminalNavigation.tsx
```

### **Utilities & Hooks** (camelCase)
```typescript
✅ useDebounce.ts
✅ formatDate.ts
✅ cn.ts
❌ UseDebounce.ts
❌ FormatDate.ts
```

### **Types & Interfaces** (PascalCase)
```typescript
✅ interface RetroBootHeroProps
✅ type ThemeMode = 'light' | 'dark'
✅ enum StatusType
❌ interface retroBootHeroProps
❌ type themeMode
```

## 🔧 **Import Organization**

```typescript
// ✅ RECOMMENDED ORDER:
// 1. React & Next.js
import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party libraries (alphabetical)
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

// 3. Internal utilities & hooks
import { cn, formatDate } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

// 4. Internal components
import Button from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// 5. Types (use 'type' import when possible)
import type { ComponentProps } from '@/types/component'
```

## 🚫 **Anti-Patterns to Avoid**

### **❌ Mixed Export Styles**
```typescript
// DON'T mix default and named exports for components
export default function Component() { ... }
export const Component = () => { ... } // Confusing!
```

### **❌ Index File Abuse**
```typescript
// DON'T re-export everything through index files
// components/index.ts - TOO MUCH
export { default as Button } from './Button'
export { default as Input } from './Input'
export { default as Modal } from './Modal'
// ... 50+ exports

// ✅ DO: Import directly or group logically
import Button from '@/components/ui/Button'
```

### **❌ Inconsistent Naming**
```typescript
// DON'T mix naming conventions
import { retro_boot_hero } from './retro-boot-hero' // snake_case
import RetroBootHero from './RetroBootHero'         // PascalCase
import terminalNavigation from './terminal'         // camelCase
```

## 🎯 **Quick Reference Card**

| Item Type | Convention | Export Style | Example |
|-----------|------------|-------------|---------|
| **React Components** | PascalCase | Default | `export default Button` |
| **Hooks** | camelCase (use prefix) | Named | `export function useDebounce` |
| **Utilities** | camelCase | Named | `export function formatDate` |
| **Constants** | UPPER_SNAKE_CASE | Named | `export const API_BASE_URL` |
| **Types/Interfaces** | PascalCase | Named | `export interface ButtonProps` |
| **Enums** | PascalCase | Named | `export enum StatusType` |

## 🛠️ **ESLint Rules (Optional)**

```json
// .eslintrc.json - Enforce consistent exports
{
  "rules": {
    "import/prefer-default-export": "off",
    "import/no-default-export": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { "prefer": "type-imports" }
    ],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external", 
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ]
      }
    ]
  }
}
```

---

**🎉 Result:** Consistent, maintainable, and developer-friendly component architecture!
