"use client";

import type { PointerEvent, RefObject } from "react";
import { inviteCopy } from "@/lib/inviteCopy";
import styles from "./InvitePlayer.module.css";

type InvitePlayerProps = {
  theaterRef: RefObject<HTMLDivElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoSrc: string;
  poster: string;
  visible: boolean;
  showControls: boolean;
  showPlayFallback: boolean;
  allowReplay: boolean;
  onClose: () => void;
  onReplay: () => void;
  onManualPlay: (e: PointerEvent<HTMLButtonElement>) => void;
};

export function InvitePlayer({
  theaterRef,
  videoRef,
  videoSrc,
  poster,
  visible,
  showControls,
  showPlayFallback,
  allowReplay,
  onClose,
  onReplay,
  onManualPlay,
}: InvitePlayerProps) {
  return (
    <div
      ref={theaterRef}
      className={styles.theater}
      data-visible={visible ? "true" : "false"}
      aria-hidden={!visible}
    >
      <video
        ref={videoRef}
        className={styles.video}
        src={videoSrc}
        poster={poster}
        playsInline
        loop
        preload="auto"
        controls={showControls}
        aria-label="Vídeo do convite"
      />

      {showPlayFallback ? (
        <button
          type="button"
          className={styles.playFallback}
          onClick={onManualPlay}
          aria-label={inviteCopy.playFallback}
        >
          <span className={styles.playIcon} aria-hidden="true" />
          {inviteCopy.playFallback}
        </button>
      ) : null}

      {showControls ? (
        <div className={styles.chrome}>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={inviteCopy.closeAria}
          >
            ×
          </button>
          {allowReplay ? (
            <button type="button" className={styles.replay} onClick={onReplay}>
              {inviteCopy.replayLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
