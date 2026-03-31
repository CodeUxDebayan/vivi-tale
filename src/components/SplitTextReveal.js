'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function SplitTextReveal({ text, elementType: Element = 'div', className, delay = 0, stagger = 0.05 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  // Treat <br/> as explicit line breaks, otherwise split by space
  const lines = typeof text === 'string' ? text.split('<br/>') : ['']

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay }
    }
  }

  const child = {
    hidden: {
      y: "120%",
      skewY: 3,
      opacity: 0
    },
    visible: {
      y: "0%",
      skewY: 0,
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 1.2
      }
    }
  }

  return (
    <Element ref={ref} className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}
      >
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            {line.split(' ').map((word, idx) => (
              <span 
                key={`${lineIdx}-${idx}`} 
                style={{ 
                  overflow: 'hidden', 
                  display: 'inline-flex', 
                  marginRight: '0.25em', 
                  paddingBottom: '0.1em', 
                  paddingRight: '0.05em' 
                }}
              >
                <motion.span 
                  variants={child} 
                  style={{ display: 'inline-block', transformOrigin: 'left bottom' }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Element>
  )
}
