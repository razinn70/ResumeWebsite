/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: any): R
      toHaveClass(className: string): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeRequired(): R
      toBeChecked(): R
      toHaveValue(value: any): R
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R
      toBePartiallyChecked(): R
      toHaveDescription(description?: string | RegExp): R
      toHaveAccessibleDescription(description?: string | RegExp): R
      toHaveAccessibleName(name?: string | RegExp): R
      toHaveStyle(css: string | Record<string, any>): R
      toHaveFocus(): R
      toBeInvalid(): R
      toBeValid(): R
      toHaveFormValues(values: Record<string, any>): R
      toBeEmptyDOMElement(): R
    }
  }
}

export {}
