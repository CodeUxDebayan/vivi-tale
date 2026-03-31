'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SplitTextReveal from '../components/SplitTextReveal';
import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Dummy media for trail and showcases ───
const TRAIL_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
  'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=400&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80',
  'https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&q=80',
];

const CATEGORY_MEDIA = {
  'Animation':       'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  'CGI':             'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=1200&q=80',
  'Design':          'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80',
  'Motion Graphics': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=80',
  'Photography':     'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
  'Luxury':          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  'Characters':      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80',
  'Typography':      'https://images.unsplash.com/photo-1545987796-200677ee1011?w=1200&q=80',
  'AI':              'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
  'Set Design':      'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=1200&q=80',
  'Beauty':          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
};

const ALL_ARTISTS = [
  { name: 'Noisegraph',       slug: 'noisegraph',       img: TRAIL_IMAGES[0] },
  { name: 'Ben Fearnley',     slug: 'ben-fearnley',     img: TRAIL_IMAGES[1] },
  { name: 'Arcade Studio',    slug: 'arcade-studio',    img: TRAIL_IMAGES[2] },
  { name: 'Styleframe',       slug: 'styleframe',       img: TRAIL_IMAGES[3] },
  { name: 'JVG',              slug: 'jvg',              img: TRAIL_IMAGES[4] },
  { name: 'Garrigosa Studio', slug: 'garrigosa-studio', img: TRAIL_IMAGES[5] },
  { name: 'Athom Studios',    slug: 'athom-studios',    img: TRAIL_IMAGES[6] },
  { name: 'Platinum',         slug: 'platinum',         img: TRAIL_IMAGES[7] },
];

// ─── Cursor Trail ───
function CursorTrail({ containerRef }) {
  const trailRef = useRef(null);
  const trail = useRef([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const idx = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = Math.abs(x - lastPos.current.x);
      const dy = Math.abs(y - lastPos.current.y);
      if (dx + dy < 60) return;
      lastPos.current = { x, y };

      const pool = trailRef.current?.querySelectorAll('[data-trail-img]');
      if (!pool || pool.length === 0) return;
      const img = pool[idx.current % pool.length];
      idx.current++;

      img.style.left = `${x - 60}px`;
      img.style.top = `${y - 60}px`;
      gsap.killTweensOf(img);
      gsap.fromTo(img, 
        { opacity: 0, scale: 0.7, rotate: (Math.random() - 0.5) * 20 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.4, ease: 'power3.out',
          onComplete: () => {
            gsap.to(img, { opacity: 0, duration: 0.6, delay: 0.5, ease: 'power2.in' });
          }
        }
      );
    };

    container.addEventListener('mousemove', handleMove);
    return () => container.removeEventListener('mousemove', handleMove);
  }, [containerRef]);

  return (
    <div ref={trailRef} className={styles.trailContainer}>
      {TRAIL_IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          data-trail-img
          className={styles.trailImg}
          draggable={false}
        />
      ))}
    </div>
  );
}

// ─── Category Row ───
function CategoryRow({ name, count, img }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/categories?filter=${encodeURIComponent(name)}`}
      className={styles.catRow}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="hover"
    >
      <div className={styles.catRowContent}>
        <span className={styles.catName}>{name}</span>
        <div className={styles.catCount}>
          <span>{count}</span>
        </div>
      </div>

      {/* Immersive hover reveal strip */}
      <motion.div
        className={styles.catReveal}
        initial={{ clipPath: 'inset(0 0 100% round 10px)' }}
        animate={hovered
          ? { clipPath: 'inset(0 0 0% round 10px)' }
          : { clipPath: 'inset(0 0 100% round 10px)' }
        }
        transition={{ duration: 0.7, ease: [0.165, 0.84, 0.44, 1] }}
      >
        <img src={img} alt={name} className={styles.catRevealImg} />
        <div className={styles.catRevealOverlay}>
          <span className={styles.catRevealName}>{name}</span>
          <span className={styles.catRevealArrow}>→</span>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Main Client Page ───
export default function ClientPage({ projects }) {
  const familyRef = useRef(null);
  const counterRef = useRef(null);
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const featuredProjects = projects.slice(0, 5);
  const activeProject = featuredProjects[activeIdx] || featuredProjects[0] || null;

  // Category counts from projects + defaults
  const catCounts = projects.reduce((acc, p) => {
    if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const defaultCategories = {
    'Animation': 18, 'CGI': 12, 'Design': 9, 'Motion Graphics': 14,
    'Photography': 7, 'Luxury': 17, 'Characters': 26, 'AI': 13
  };
  const categories = Object.keys(catCounts).length > 0 ? catCounts : defaultCategories;

  // GSAP scroll counter
  useEffect(() => {
    if (!counterRef.current || !containerRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          if (counterRef.current) {
            const val = Math.round(self.progress * 100);
            counterRef.current.textContent = val.toString().padStart(2, '0');
          }
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.pageRoot} ref={containerRef}>

      {/* ── FIXED FULL-PAGE BACKGROUND ── */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key={activeProject.id}
            className={styles.pageBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <img src={activeProject.imageUrl} alt="" className={styles.pageBgImg} />
            <div className={styles.pageBgOverlay} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.pageFg}>

        {/* ══════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════ */}
        <section className={styles.heroSection}>
          <div className={styles.heroInner}>
            <SplitTextReveal
              elementType="h1"
              className={styles.heroTitle}
              text="TALES BY VIVI"
              delay={0.3}
              stagger={0.07}
            />
            <motion.p
              className={styles.heroTagline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
            >
              Your creative partner for Animation &amp; Imagery.<br />
              Digital Artists. World-class. Nothing else.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8, ease: 'easeOut' }}
            >
              <Link href="/about" className={styles.heroBtn} data-cursor="hover">
                <span className={styles.heroBtnSquare} />
                Read More
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 2 — SHOWREEL
        ══════════════════════════════════ */}
        <section className={styles.showreelSection}>
          <div className={styles.showreelInner}>
            <div className={styles.showreelVideo}>
              <video
                src="https://cdn.coverr.co/videos/coverr-abstract-light-shapes-1588/1080p.mp4"
                autoPlay loop muted playsInline
                className={styles.showreelVid}
                poster="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&q=80"
              />
              <div className={styles.showreelVidOverlay} />
            </div>
            <div className={styles.showreelMeta}>
              <h2 className={styles.showreelTitle}>Our Work since...</h2>
              <div className={styles.showreelDates}>
                <span>2010</span>
                <span className={styles.dateSep} />
                <span className={styles.scrollCount} ref={counterRef}>00</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 3 — THE FAMILY
        ══════════════════════════════════ */}
        <section className={styles.familySection} ref={familyRef}>
          <CursorTrail containerRef={familyRef} />
          <div className={styles.familyInner}>
            <h2 className={styles.familyTitle}>The Family</h2>
            <div className={styles.familyLayout}>
              {/* Left: media preview */}
              <div className={styles.familyMedia}>
                <AnimatePresence mode="wait">
                  {ALL_ARTISTS[activeIdx] && (
                    <motion.div
                      key={ALL_ARTISTS[activeIdx].slug}
                      className={styles.familyMediaInner}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                      <img
                        src={ALL_ARTISTS[activeIdx].img}
                        alt={ALL_ARTISTS[activeIdx].name}
                        className={styles.familyMediaImg}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Right: name list */}
              <div className={styles.familyList}>
                <span className={styles.familySquare} />
                {ALL_ARTISTS.map((artist, i) => (
                  <div key={artist.slug} className={styles.familyItem}>
                    <Link
                      href={`/artists/${artist.slug}`}
                      className={`${styles.familyLink} ${activeIdx === i ? styles.familyLinkActive : ''}`}
                      onMouseEnter={() => setActiveIdx(i)}
                      data-cursor="hover"
                    >
                      {artist.name}
                    </Link>
                  </div>
                ))}
                <Link href="/artists" className={styles.familyViewAll} data-cursor="hover">
                  View All Artists →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 4 — CATEGORIES
        ══════════════════════════════════ */}
        <section className={styles.categoriesSection}>
          <div className={styles.categoriesInner}>
            <div className={styles.categoriesHead}>
              <h2 className={styles.categoriesTitle}>Categories</h2>
              <Link href="/categories" className={styles.categoriesViewAll} data-cursor="hover">
                Explore All
              </Link>
            </div>
            <div className={styles.categoriesList}>
              {Object.entries(categories).map(([name, count]) => (
                <CategoryRow
                  key={name}
                  name={name}
                  count={count}
                  img={CATEGORY_MEDIA[name] || TRAIL_IMAGES[0]}
                />
              ))}
            </div>
            <div className={styles.categoriesButton}>
              <Link href="/categories" className={styles.categoriesAllBtn} data-cursor="hover">
                All Categories
                <span className={styles.heroBtnSquare} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 5 — FEATURED PROJECTS REEL
        ══════════════════════════════════ */}
        <section className={styles.reelSection}>
          <div className={styles.reelInner}>
            <div className={styles.reelHead}>
              <h2 className={styles.reelTitle}>Latest Projects</h2>
              <Link href="/projects" className={styles.reelViewAll} data-cursor="hover">View All</Link>
            </div>
            <div className={styles.reelLayout}>
              {/* Left: name list */}
              <ul className={styles.reelList}>
                {featuredProjects.map((proj, idx) => (
                  <li key={proj.id} className={styles.reelLi}>
                    {activeIdx === idx && <span className={styles.activeSquare} />}
                    <Link
                      href={`/projects/${proj.slug}`}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={`${styles.reelLink} ${activeIdx === idx ? styles.activeReelLink : ''}`}
                      data-cursor="hover"
                    >
                      <span className={styles.reelLinkTitle}>{proj.title}</span>
                      <span className={styles.artistLabel}>// {proj.artist}</span>
                    </Link>
                  </li>
                ))}
                {featuredProjects.length === 0 && (
                  <li className={styles.reelEmpty}>
                    <span>Add projects via <Link href="/admin">/admin</Link></span>
                  </li>
                )}
              </ul>

              {/* Center: media preview */}
              <div className={styles.reelMediaWrapper}>
                <AnimatePresence mode="wait">
                  {activeProject && (
                    <motion.div
                      key={activeProject.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className={styles.reelMediaInner}
                    >
                      <Link href={`/projects/${activeProject.slug}`} data-cursor="hover">
                        {activeProject.videoUrl ? (
                          <video
                            src={activeProject.videoUrl}
                            autoPlay loop muted playsInline
                            className={styles.reelMedia}
                          />
                        ) : (
                          <img
                            src={activeProject.imageUrl}
                            alt={activeProject.title}
                            className={styles.reelMedia}
                          />
                        )}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

      </div>{/* /pageFg */}
    </div>
  );
}
