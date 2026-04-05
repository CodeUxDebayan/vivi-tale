"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./projectDetail.module.css";
import Link from "next/link";
import { X } from "lucide-react";

export default function ProjectDetailClient({ project }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power3.out" },
    );
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <Link
        href={project.artistSlug ? `/artists/${project.artistSlug}` : "/"}
        className={styles.closeBtn}
        data-cursor="hover"
      >
        <X size={40} />
      </Link>

      <div className={styles.mediaContainer}>
        {project.videoUrl ? (
          <video
            src={project.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className={styles.fullVideo}
          />
        ) : (
          <img
            src={project.imageUrl}
            alt={project.title}
            className={styles.fullImage}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="%23666" dominant-baseline="middle" text-anchor="middle">Image unavailable</text></svg>';
            }}
          />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <span className={styles.artistName}>{project.artist}</span>
            <h1 className={styles.title}>{project.title}</h1>
          </div>
          <div className={styles.categories}>
            {project.category.split(",").map((cat, i) => (
              <span key={i} className={styles.categoryPill}>
                {cat.trim()}
              </span>
            ))}
          </div>
        </div>

        {project.description && (
          <div className={styles.description}>
            <p>{project.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
