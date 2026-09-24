/** Textos mantidos do convite SHIVER — única fonte de strings de UI. */

export const INVITE_CTA_HREF =
  "https://www.sharkprime.app/invite#conquistas" as const;

export const inviteCopy = {
  brand: "SHIVER",
  title: "Você acaba de desbloquear o acesso exclusivo",
  titleBefore: "Você acaba de desbloquear ",
  titleAccent: "o acesso exclusivo",
  description:
    "Quanto mais sua rede cresce, mais perto você fica de desbloquear até R$500 em recompensas.",
  hint: "Abra a carta e descubra o convite",
  ctaLabel: "Quero desbloquear agora",
  ctaHref: INVITE_CTA_HREF,
  footer:
    "Recompensas sujeitas a elegibilidade e ao regulamento oficial.",
  openAria: "Abrir convite",
  closeAria: "Fechar vídeo",
  playFallback: "Assistir com som",
  replayLabel: "Ver novamente",
  sealLabel: "Convite",
} as const;

export const inviteMedia = {
  video: "./media/invite.mp4",
  videoMobile: "./media/invite-mobile.mp4",
  poster: "./media/invite-poster.webp",
  posterMobile: "./media/invite-mobile-poster.webp",
} as const;
