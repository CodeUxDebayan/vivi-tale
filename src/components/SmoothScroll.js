'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
      {children}
    </ReactLenis>
  )
}
