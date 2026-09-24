"use client";

import type { RefObject } from "react";
import { inviteCopy } from "@/lib/inviteCopy";
import styles from "./InviteHero.module.css";

type InviteHeroProps = {
  letterRef: RefObject<HTMLButtonElement | null>;
  introRef: RefObject<HTMLDivElement | null>;
  hintRef: RefObject<HTMLParagraphElement | null>;
  showCta: boolean;
  interactive: boolean;
  expanded: boolean;
  opening: boolean;
  onOpen: () => void;
};

export function InviteHero({
  letterRef,
  introRef,
  hintRef,
  showCta,
  interactive,
  expanded,
  opening,
  onOpen,
}: InviteHeroProps) {
  return (
    <div className={styles.hero}>
      <div ref={introRef} className={styles.intro} data-part="intro">
        <h1 className={styles.title}>
          <span className={styles.titleLine}>
            {inviteCopy.titleBefore.trim()}
          </span>
          <span className={styles.titleAccent}>{inviteCopy.titleAccent}</span>
        </h1>
      </div>

      <button
        ref={letterRef}
        type="button"
        className={styles.letter}
        data-part="letter"
        data-opening={opening ? "true" : "false"}
        onClick={onOpen}
        disabled={!interactive}
        aria-label={inviteCopy.openAria}
        aria-expanded={expanded}
      >
        <span className={styles.flap} data-part="flap" aria-hidden="true" />
        <span className={styles.pocket} data-part="pocket" aria-hidden="true">
          <span className={styles.paper} data-part="paper">
            <span className={styles.paperBrand}>{inviteCopy.brand}</span>
            <span className={styles.paperRule} />
            <span className={styles.paperLabel}>{inviteCopy.sealLabel}</span>
          </span>
        </span>
        <span className={styles.face} data-part="face" aria-hidden="true">
          <span className={styles.foldLeft} />
          <span className={styles.foldRight} />
          <span className={styles.faceMeta} data-part="faceMeta">
            <span className={styles.faceEyebrow}>{inviteCopy.sealLabel}</span>
            <span className={styles.faceBrand}>{inviteCopy.brand}</span>
          </span>
        </span>
        <span className={styles.wax} data-part="wax" aria-hidden="true">
          <span className={styles.waxMark}>S</span>
        </span>
      </button>

      <div className={styles.action}>
        {!showCta && interactive ? (
          <p ref={hintRef} className={styles.hint} data-part="hint">
            {inviteCopy.hint}
          </p>
        ) : null}

        {showCta ? (
          <a
            className={styles.cta}
            href={inviteCopy.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {inviteCopy.ctaLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
