'use client';
import Link from 'next/link';
import styles from './Footer.module.css';
import { useState } from 'react';

const navLinks = [
  { name: 'Artists', path: '/artists' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const socials = [
  { name: 'Instagram', url: 'https://instagram.com' },
  { name: 'Vimeo', url: 'https://vimeo.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        {/* Top row */}
        <div className={styles.topRow}>
          <div className={styles.leftCol}>
            <p className={styles.tagline}>
              Your creative partner<br /> for Animation & Imagery.
            </p>
            {/* Newsletter */}
            <div className={styles.newsletter}>
              <form onSubmit={handleSubmit} className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.newsletterInput}
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className={`${styles.newsletterBtn} ${email ? styles.newsletterBtnVisible : ''}`}
                  aria-label="Subscribe"
                >
                  →
                </button>
              </form>
              {submitted && (
                <p className={styles.successMsg}>Thanks! We'll be in touch.</p>
              )}
            </div>
            {/* Socials */}
            <div className={styles.socials}>
              {socials.map(s => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  data-title={s.name}
                  data-cursor="hover"
                >
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.rightCol}>
            <nav className={styles.nav}>
              {navLinks.map(link => (
                <Link key={link.path} href={link.path} className={styles.navItem} data-cursor="hover">
                  <span className={styles.navSquare} />
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
            <div className={styles.credits}>
              <span className={styles.creditsTitle}>Crafted by</span>
              <div className={styles.creditsItems}>
                <span className={styles.creditsItem}>Tales by VIVI</span>
                <span className={styles.creditsSep} />
                <span className={styles.creditsItem}>© {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Giant logo bottom */}
        <div className={styles.bigLogo}>
          TALES<br />BY VIVI
        </div>
      </div>
    </footer>
  );
}
