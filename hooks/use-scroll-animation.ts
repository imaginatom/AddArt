"use client"

import { useEffect } from "react"

export function useScrollAnimation() {
  useEffect(() => {
    // Bail out if user prefers reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        el.classList.add("is-visible")
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target) // fire once only
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
