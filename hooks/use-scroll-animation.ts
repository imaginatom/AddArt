"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function useScrollAnimation() {
  const pathname = usePathname()

  useEffect(() => {
    // Bail out if user prefers reduced motion.
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
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    )

    // Observe currently-present elements. Those that are already in-view
    // (above the fold on a revisit) will fire synchronously right after mount.
    const seen = new WeakSet<Element>()
    const observeAll = () => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        if (seen.has(el) || el.classList.contains("is-visible")) return
        seen.add(el)
        observer.observe(el)
      })
    }
    observeAll()

    // Next.js App Router performs client-side navigations without re-mounting
    // the root layout, so this hook must re-scan the DOM on every route change
    // (handled via the `pathname` dependency) AND watch for any late-mounted
    // children (streamed RSC, Suspense boundaries, async data).
    const mutation = new MutationObserver(() => observeAll())
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
  }, [pathname])
}
