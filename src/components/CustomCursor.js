'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import styles from './Cursor.module.css'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return;

    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    const applyHover = () => setIsHovering(true)
    const removeHover = () => setIsHovering(false)

    window.addEventListener('mousemove', moveCursor)
    
    const handleHoverElements = () => {
      const elements = document.querySelectorAll('a, button, [data-cursor="hover"]')
      elements.forEach(el => {
        el.addEventListener('mouseenter', applyHover)
        el.addEventListener('mouseleave', removeHover)
      })
    }
    
    setTimeout(handleHoverElements, 500)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      const elements = document.querySelectorAll('a, button, [data-cursor="hover"]')
      elements.forEach(el => {
        el.removeEventListener('mouseenter', applyHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [pathname])

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return null;

  return (
    <motion.div
      className={styles.cursor}
      animate={{
        x: position.x - (isHovering ? 40 : 10),
        y: position.y - (isHovering ? 40 : 10),
        scale: isHovering ? 4 : 1,
        opacity: isHovering ? 0.3 : 1
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  )
}
