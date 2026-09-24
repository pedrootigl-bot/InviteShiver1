"use client";

import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { InviteHero } from "@/components/InviteHero";
import { InvitePlayer } from "@/components/InvitePlayer";
import { Navbar } from "@/components/Navbar";
import { Starfield } from "@/components/Starfield";
import { inviteCopy, inviteMedia } from "@/lib/inviteCopy";
import styles from "./InviteExperience.module.css";

type Phase = "idle" | "opening" | "playing";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function detectMobile(maxWidth = 768): boolean {
  if (typeof window === "undefined") return false;
  const narrow = window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  return narrow || (coarse && noHover);
}

function part(root: ParentNode | null, name: string) {
  return root?.querySelector(`[data-part="${name}"]`) ?? null;
}

export function InviteExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const letterRef = useRef<HTMLButtonElement>(null);
  const theaterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const openingLockRef = useRef(false);
  const previousOverflowRef = useRef("");
  const playedOnceRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [showCta, setShowCta] = useState(false);
  const [showPlayFallback, setShowPlayFallback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  const videoSrc = isMobile ? inviteMedia.videoMobile : inviteMedia.video;
  const poster = isMobile ? inviteMedia.posterMobile : inviteMedia.poster;

  const lockScroll = useCallback((lock: boolean) => {
    if (typeof document === "undefined") return;
    if (lock) {
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return;
    }
    document.body.style.overflow = previousOverflowRef.current;
  }, []);

  const safePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    try {
      await video.play();
      setShowPlayFallback(false);
    } catch {
      try {
        video.muted = true;
        await video.play();
        video.muted = false;
        setShowPlayFallback(false);
      } catch {
        setShowPlayFallback(true);
      }
    }
  }, []);

  const resetIdleVisuals = useCallback(() => {
    const letter = letterRef.current;
    const intro = introRef.current;
    const hint = hintRef.current;
    const theater = theaterRef.current;
    const video = videoRef.current;
    const flap = part(letter, "flap");
    const face = part(letter, "face");
    const wax = part(letter, "wax");
    const paper = part(letter, "paper");
    const starfieldWrap = rootRef.current?.querySelector(
      "[data-part='starfield']",
    );
    const navbar = rootRef.current?.querySelector("[data-part='navbar']");

    gsap.set(letter, {
      opacity: 1,
      scale: 1,
      y: 0,
      boxShadow: "0 16px 36px rgba(0, 30, 70, 0.35)",
      clearProps: "transform,filter",
    });
    if (flap) {
      gsap.set(flap, {
        opacity: 1,
        y: 0,
        scaleY: 1,
        rotateX: 0,
        clearProps: "transform",
      });
    }
    if (face) gsap.set(face, { opacity: 1 });
    if (wax) {
      gsap.set(wax, {
        opacity: 1,
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        clearProps: "transform",
      });
    }
    if (paper) {
      gsap.set(paper, {
        top: "28%",
        scale: 1,
        xPercent: -50,
        x: 0,
        y: 0,
        clearProps: "transform",
      });
    }
    if (intro) {
      gsap.set(intro, {
        opacity: 1,
        y: 0,
        visibility: "visible",
      });
      gsap.set(intro.children, { opacity: 1, y: 0, clearProps: "filter" });
    }
    if (hint) gsap.set(hint, { opacity: 1, y: 0 });
    gsap.set(theater, {
      opacity: 0,
      scale: 1,
      clearProps: "filter",
      visibility: "hidden",
      pointerEvents: "none",
    });
    if (starfieldWrap) gsap.set(starfieldWrap, { opacity: 1 });
    if (navbar) gsap.set(navbar, { opacity: 1, visibility: "visible", y: 0 });

    if (video) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    playedOnceRef.current = false;
    setShowPlayFallback(false);
    lockScroll(false);
  }, [lockScroll]);

  const closeToIdle = useCallback(() => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    openingLockRef.current = false;
    setPhase("idle");
    setShowCta(true);
    resetIdleVisuals();
  }, [resetIdleVisuals]);

  const openInvite = useCallback(
    (force = false) => {
      if (openingLockRef.current) return;
      if (!force && phase !== "idle") return;

      const letter = letterRef.current;
      const theater = theaterRef.current;
      const intro = introRef.current;
      const hint = hintRef.current;
      const starfieldWrap = rootRef.current?.querySelector(
        "[data-part='starfield']",
      );
      const navbar = rootRef.current?.querySelector("[data-part='navbar']");
      if (!letter || !theater) return;

      const flap = part(letter, "flap");
      const face = part(letter, "face");
      const wax = part(letter, "wax");
      const paper = part(letter, "paper");

      openingLockRef.current = true;
      playedOnceRef.current = false;
      setPhase("opening");
      lockScroll(true);

      /* Cancela hover/pulse: limpa transforms inline antes da timeline */
      gsap.set(letter, {
        clearProps: "transform,filter",
        boxShadow: "0 16px 36px rgba(0, 30, 70, 0.35)",
      });
      if (flap) gsap.set(flap, { clearProps: "transform", rotateX: 0, opacity: 1 });
      if (wax) {
        gsap.set(wax, {
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
        });
      }
      if (paper) {
        gsap.set(paper, {
          xPercent: -50,
          top: "28%",
          scale: 1,
          x: 0,
          y: 0,
        });
      }

      const finish = () => {
        openingLockRef.current = false;
        setPhase("playing");
        gsap.set(theater, {
          opacity: 1,
          scale: 1,
          visibility: "visible",
          pointerEvents: "auto",
        });
        if (!playedOnceRef.current) {
          playedOnceRef.current = true;
          void safePlay();
        }
      };

      if (reduced) {
        gsap.set(intro, { opacity: 0, visibility: "hidden" });
        if (hint) gsap.set(hint, { opacity: 0 });
        gsap.set(letter, { opacity: 0 });
        if (starfieldWrap) gsap.set(starfieldWrap, { opacity: 0 });
        if (navbar) gsap.set(navbar, { opacity: 0, visibility: "hidden" });
        gsap.set(theater, {
          visibility: "visible",
          pointerEvents: "auto",
        });
        gsap.to(theater, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "sine.out",
          onComplete: finish,
        });
        return;
      }

      timelineRef.current?.kill();
      const tl = gsap.timeline({
        defaults: { force3D: true },
        onComplete: finish,
      });
      timelineRef.current = tl;

      /* Camada UI: saída limpa, sem blur */
      if (hint) {
        tl.to(
          hint,
          { opacity: 0, y: 4, duration: 0.5, ease: "power1.out" },
          0,
        );
      }
      if (intro) {
        tl.to(
          intro.children,
          {
            opacity: 0,
            y: -6,
            duration: 0.55,
            stagger: 0.05,
            ease: "power1.out",
            onComplete: () => {
              gsap.set(intro, { visibility: "hidden" });
            },
          },
          0,
        );
      }

      /* Envelope: sobe e “respira” — antecipação mínima */
      tl.fromTo(
        letter,
        { scale: 1, y: 0 },
        {
          scale: 1.02,
          y: -4,
          duration: 0.55,
          ease: "power2.out",
        },
        0,
      );
      tl.to(
        letter,
        {
          boxShadow: "0 28px 56px rgba(0, 24, 80, 0.45)",
          duration: 0.55,
          ease: "power1.out",
        },
        0,
      );

      /* Selo: dissolve discreto */
      if (wax) {
        tl.to(
          wax,
          {
            opacity: 0,
            scale: 0.88,
            duration: 0.45,
            ease: "power2.inOut",
          },
          0.18,
        );
      }

      /* Aba: abre com rotação; opacidade só no fim do arco */
      if (flap) {
        tl.to(
          flap,
          {
            rotateX: -112,
            transformOrigin: "50% 0%",
            duration: 0.85,
            ease: "power3.inOut",
          },
          0.2,
        );
        tl.to(
          flap,
          {
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
          },
          0.55,
        );
      }

      /* Face some enquanto o papel só “espreita” */
      if (face) {
        tl.to(
          face,
          { opacity: 0, duration: 0.55, ease: "power2.inOut" },
          0.38,
        );
      }
      if (paper) {
        tl.to(
          paper,
          {
            top: "14%",
            xPercent: -50,
            duration: 0.5,
            ease: "power2.out",
          },
          0.4,
        );
      }

      /* Crossfade envelope → vídeo: overlap longo, sem blur */
      tl.to(
        letter,
        {
          opacity: 0,
          scale: 1.06,
          y: -6,
          duration: 0.75,
          ease: "power2.inOut",
        },
        0.72,
      );

      tl.set(theater, { visibility: "visible", pointerEvents: "auto" }, 0.78);
      tl.fromTo(
        theater,
        { opacity: 0, scale: 0.985 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        0.78,
      );

      if (starfieldWrap) {
        tl.to(
          starfieldWrap,
          { opacity: 0, duration: 0.75, ease: "power1.inOut" },
          0.82,
        );
      }

      if (navbar) {
        tl.to(
          navbar,
          {
            opacity: 0,
            duration: 0.45,
            ease: "power1.out",
            onComplete: () => {
              gsap.set(navbar, { visibility: "hidden" });
            },
          },
          0.82,
        );
      }

      tl.add(() => {
        if (!playedOnceRef.current) {
          playedOnceRef.current = true;
          void safePlay();
        }
      }, 0.95);
    },
    [lockScroll, phase, reduced, safePlay],
  );

  const replay = useCallback(() => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    openingLockRef.current = false;
    playedOnceRef.current = false;
    setShowCta(true);

    const theater = theaterRef.current;
    const letter = letterRef.current;
    const flap = part(letter, "flap");
    const face = part(letter, "face");
    const wax = part(letter, "wax");
    const paper = part(letter, "paper");
    const intro = introRef.current;
    const hint = hintRef.current;
    const starfieldWrap = rootRef.current?.querySelector(
      "[data-part='starfield']",
    );
    const navbar = rootRef.current?.querySelector("[data-part='navbar']");
    const video = videoRef.current;

    const prepareAndOpen = () => {
      gsap.set(letter, {
        opacity: 1,
        scale: 1,
        y: 0,
        boxShadow: "0 16px 36px rgba(0, 30, 70, 0.35)",
        clearProps: "transform,filter",
      });
      if (flap) {
        gsap.set(flap, {
          opacity: 1,
          y: 0,
          scaleY: 1,
          rotateX: 0,
          clearProps: "transform",
        });
      }
      if (face) gsap.set(face, { opacity: 1 });
      if (wax) {
        gsap.set(wax, {
          opacity: 1,
          scale: 1,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          clearProps: "transform",
        });
      }
      if (paper) {
        gsap.set(paper, {
          top: "28%",
          scale: 1,
          xPercent: -50,
          clearProps: "transform",
        });
      }
      if (intro) {
        gsap.set(intro, {
          opacity: 1,
          y: 0,
          visibility: "visible",
        });
        gsap.set(intro.children, { opacity: 1, y: 0, clearProps: "filter" });
      }
      if (hint) gsap.set(hint, { opacity: 1, y: 0 });
      if (starfieldWrap) gsap.set(starfieldWrap, { opacity: 1 });
      if (navbar) gsap.set(navbar, { opacity: 1, visibility: "visible", y: 0 });
      if (theater) {
        gsap.set(theater, {
          opacity: 0,
          scale: 1,
          clearProps: "filter",
          visibility: "hidden",
          pointerEvents: "none",
        });
      }
      if (video) {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }

      setPhase("idle");
      requestAnimationFrame(() => {
        openInvite(true);
      });
    };

    if (theater) {
      gsap.to(theater, {
        opacity: 0,
        duration: 0.35,
        ease: "sine.inOut",
        onComplete: () => {
          gsap.set(theater, {
            visibility: "hidden",
            pointerEvents: "none",
          });
          prepareAndOpen();
        },
      });
      return;
    }

    prepareAndOpen();
  }, [openInvite]);

  const handleManualPlay = (e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    void safePlay();
  };

  useEffect(() => {
    setReduced(prefersReducedMotion());
    resetIdleVisuals();
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      openingLockRef.current = false;
      lockScroll(false);
      videoRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(detectMobile());
    update();
    const mq = window.matchMedia("(max-width: 768px)");
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
    video.preload = "auto";
    video.load();
  }, [videoSrc]);

  /* Pré-aquece buffer no idle para a entrada do vídeo não engasgar */
  useEffect(() => {
    if (phase !== "idle") return;
    const video = videoRef.current;
    if (!video) return;
    video.preload = "auto";
    try {
      video.load();
    } catch {
      /* ignore */
    }
  }, [phase, videoSrc]);

  const interactive = phase === "idle";
  const theaterVisible = phase === "opening" || phase === "playing";
  const showControls = phase === "playing";

  return (
    <section
      ref={rootRef}
      className={styles.root}
      data-phase={phase}
      aria-label={inviteCopy.brand}
    >
      <div className={styles.starfieldWrap} data-part="starfield">
        <Starfield />
      </div>

      <Navbar hidden={phase === "playing"} />

      <InviteHero
        letterRef={letterRef}
        introRef={introRef}
        hintRef={hintRef}
        showCta={showCta && phase === "idle"}
        interactive={interactive}
        expanded={phase !== "idle"}
        opening={phase === "opening"}
        onOpen={openInvite}
      />

      <InvitePlayer
        theaterRef={theaterRef}
        videoRef={videoRef}
        videoSrc={videoSrc}
        poster={poster}
        visible={theaterVisible}
        showControls={showControls}
        showPlayFallback={showPlayFallback}
        allowReplay
        onClose={closeToIdle}
        onReplay={replay}
        onManualPlay={handleManualPlay}
      />

      <footer className={styles.footer} data-part="footer">
        {inviteCopy.footer}
      </footer>

      <span className={styles.srOnly} aria-live="polite">
        {phase === "opening"
          ? "Abrindo convite"
          : phase === "playing"
            ? "Convite aberto em tela cheia"
            : "Convite fechado"}
      </span>
    </section>
  );
}
