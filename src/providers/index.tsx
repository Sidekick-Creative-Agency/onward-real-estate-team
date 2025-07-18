// NOTE: Commented out ThemeProvider because it's not needed for now
import React from 'react'
import { HeaderThemeProvider } from './HeaderTheme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    // <ThemeProvider>
    <HeaderThemeProvider>{children}</HeaderThemeProvider>
    //  </ThemeProvider>
  )
}
