'use client'

/**
 * Adds .js to <html> immediately on hydration.
 *
 * The progressive-enhancement CSS in globals.css hides animated elements
 * (.js [data-fade], .js .mask > span, .js .reveal-img) ONLY when this class
 * is present — so content stays visible if JS is blocked or fails.
 */
import { useEffect } from 'react'

export default function JsFlag() {
  useEffect(() => {
    document.documentElement.classList.add('js')
    return () => document.documentElement.classList.remove('js')
  }, [])
  return null
}
