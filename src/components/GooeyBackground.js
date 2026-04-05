"use client";

import styles from "./GooeyBackground.module.css";

export default function GooeyBackground() {
  return (
    <div className={styles.gooWrap} aria-hidden="true">
      <svg className={styles.filterSvg}>
        <defs>
          <filter id="goo-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className={styles.blobsLayer}>
        <div className={styles.blobs}>
          <span className={`${styles.blob} ${styles.blobA}`} />
          <span className={`${styles.blob} ${styles.blobB}`} />
          <span className={`${styles.blob} ${styles.blobC}`} />
          <span className={`${styles.blob} ${styles.blobD}`} />
          <span className={`${styles.blob} ${styles.blobE}`} />
        </div>
      </div>

      <div className={styles.noise}>
        <div className={styles.vignette} />
      </div>
    </div>
  );
}
