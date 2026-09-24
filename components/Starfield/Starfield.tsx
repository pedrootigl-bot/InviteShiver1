"use client";

import { useEffect, useState } from "react";
import styles from "./Starfield.module.css";

type Star = {
  id: number;
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
  opacity: string;
  layer: "far" | "mid" | "near";
};

/** Hash determinístico só com inteiros — evita drift SSR/cliente. */
function hashInt(n: number): number {
  let x = (n * 374761393 + 668265263) | 0;
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  x = x ^ (x >>> 16);
  return x >>> 0;
}

function buildStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i += 1) {
    const h1 = hashInt(i + 1);
    const h2 = hashInt(i + 17);
    const h3 = hashInt(i + 41);
    const h4 = hashInt(i + 73);
    const h5 = hashInt(i + 99);

    const layerRoll = h5 % 100;
    const layer: Star["layer"] =
      layerRoll < 45 ? "far" : layerRoll < 80 ? "mid" : "near";

    const sizePx =
      layer === "far"
        ? 1 + (h1 % 12) / 10
        : layer === "mid"
          ? 1.4 + (h2 % 16) / 10
          : 1.8 + (h3 % 22) / 10;

    const left = ((h1 % 1000) / 10).toFixed(1);
    const top = ((h2 % 1000) / 10).toFixed(1);
    const opacityBase =
      layer === "far" ? 35 : layer === "mid" ? 50 : 65;
    const opacity = ((opacityBase + (h3 % 35)) / 100).toFixed(2);
    const delay = ((h3 % 800) / 100).toFixed(2);
    const duration = ((240 + (h4 % 450)) / 100).toFixed(2);

    stars.push({
      id: i,
      left: `${left}%`,
      top: `${top}%`,
      size: `${sizePx.toFixed(1)}px`,
      delay: `${delay}s`,
      duration: `${duration}s`,
      opacity,
      layer,
    });
  }
  return stars;
}

const STARS = buildStars(72);

const SHOOTING = [
  { id: 0, top: "18%", delay: "2s", duration: "7s" },
  { id: 1, top: "42%", delay: "6.5s", duration: "9s" },
  { id: 2, top: "28%", delay: "12s", duration: "8s" },
] as const;

function StarLayer({
  stars,
  driftClass,
  starClass,
}: {
  stars: Star[];
  driftClass: string;
  starClass: string;
}) {
  return (
    <div className={`${styles.drift} ${driftClass}`}>
      {stars.map((star) => (
        <span
          key={star.id}
          className={`${styles.star} ${starClass}`}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            ["--star-opacity" as string]: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

export function Starfield() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.sky} />
      <div className={styles.aurora} />
      <div className={styles.milky} />

      {mounted ? (
        <>
          <StarLayer
            stars={STARS.filter((s) => s.layer === "far")}
            driftClass={styles.driftFar}
            starClass={styles.starFar}
          />
          <StarLayer
            stars={STARS.filter((s) => s.layer === "mid")}
            driftClass={styles.driftMid}
            starClass={styles.starMid}
          />
          <StarLayer
            stars={STARS.filter((s) => s.layer === "near")}
            driftClass={styles.driftNear}
            starClass={styles.starNear}
          />
          {SHOOTING.map((shot) => (
            <span
              key={shot.id}
              className={styles.shooting}
              style={{
                top: shot.top,
                animationDelay: shot.delay,
                animationDuration: shot.duration,
              }}
            />
          ))}
        </>
      ) : null}

      <div className={styles.glow} />
      <div className={styles.vignette} />
    </div>
  );
}
