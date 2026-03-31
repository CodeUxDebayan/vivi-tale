'use client'
import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from './artists.module.css'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ArtistsClient({ artists, projects }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  
  // Aggregate data so we know the artist and their first "cover" project
  const displayArtists = artists.map(artist => {
    const artistProjects = projects.filter(p => p.artistSlug === artist.slug || p.artist === artist.name)
    return {
      ...artist,
      cover: artistProjects.length > 0 ? artistProjects[0] : null
    }
  })

  useEffect(() => {
    // Initial reveal
    gsap.fromTo(containerRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power3.out' }
    )
  }, [])

  const activeArtist = displayArtists[activeIndex] || displayArtists[0]

  if (!displayArtists || displayArtists.length === 0) {
    return (
      <main className={styles.main}>
        <div style={{height: '100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <p>No artists found.</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main} ref={containerRef}>
      {/* Background Layer: Massive Text & Image Blur */}
      <AnimatePresence>
        <motion.div 
          key={activeArtist.id}
          className={styles.bgLayer}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {activeArtist.cover && (
            <img 
              src={activeArtist.cover.imageUrl} 
              alt=""
              className={styles.bgImage}
            />
          )}
          <h1 className={styles.massiveBgText}>{activeArtist.name}</h1>
        </motion.div>
      </AnimatePresence>

      <div className={styles.foreground}>
        {/* Left List */}
        <div className={styles.listCol}>
          <ul className={styles.ul}>
            {displayArtists.map((artist, i) => (
              <li key={artist.id} className={styles.li}>
                {activeIndex === i && <span className={styles.activeSquare} />}
                <Link 
                  href={`/artists/${artist.slug}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`${styles.link} ${activeIndex === i ? styles.activeLink : ''}`}
                  data-cursor="hover"
                >
                  {artist.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Center Media */}
        <div className={styles.mediaCol}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeArtist.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={styles.mediaWrapper}
            >
              {activeArtist.cover ? (
                <Link href={`/artists/${activeArtist.slug}`} data-cursor="hover" style={{display:'block', height:'100%', width:'100%'}}>
                  {activeArtist.cover.videoUrl ? (
                    <video 
                      src={activeArtist.cover.videoUrl} 
                      autoPlay loop muted playsInline 
                      className={styles.media}
                    />
                  ) : (
                    <img src={activeArtist.cover.imageUrl} alt={activeArtist.name} className={styles.media} />
                  )}
                </Link>
              ) : (
                <div className={styles.placeholderMedia}>Coming Soon</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Pagination */}
        <div className={styles.paginationCol}>
          {displayArtists.map((_, i) => (
            <div 
              key={i} 
              className={`${styles.pageDot} ${i === activeIndex ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
