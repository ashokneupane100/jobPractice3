"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  // next-themes renders an inline <script> to set the theme before paint.
  // React 19 warns when that script is created during a client render, so
  // only keep it executable in the server-rendered HTML. On the client it
  // becomes a non-executable data block (the theme is already applied).
  const scriptProps =
    typeof window === "undefined" ? undefined : { type: "application/json" }

  return (
    <NextThemesProvider {...props} scriptProps={scriptProps}>
      {children}
    </NextThemesProvider>
  )
}