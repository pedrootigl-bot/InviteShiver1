# Invite Experience — minimal premium

Última revisão: 2026-09-24

## Objetivo

Landing de convite SHIVER: hero + **carta/envelope 2D** → transição curta → vídeo fullscreen. Céu estrelado animado no fundo. Sem card 3D.

## Textos (mantidos)

Fonte: `lib/inviteCopy.ts`

- Brand: SHIVER  
- Título: Você acaba de desbloquear o acesso exclusivo (duas linhas; accent em “o acesso exclusivo”)
- Descrição: Quanto mais sua rede cresce, mais perto você fica de desbloquear até R$500 em recompensas.
- Hint: Abra a carta e descubra o convite
- CTA: Quero desbloquear agora → sharkprime.app/invite#conquistas
- Footer legal  

## Estados

`idle` → `opening` → `playing` → (fechar) → `idle`

## Timeline (~1,2s @ speed=1)

| t (s) | Ação |
|-------|------|
| 0 | lock scroll; fade hint/intro |
| 0–0,18 | selo lift (scale + z) |
| 0,12–0,77 | **flip** `rotateY` 0→180 (verso Play) |
| 0,45–1,15 | theater opacity/scale in |
| 0,55–0,83 | selo fade out |
| 0,7 | `video.play()` |
| ~1,2 | estado `playing` |

Reduced motion: fade direto para theater (~0,2s), sem flip.

## Componentes

- `InviteExperience` — orquestra estados + GSAP
- `InviteHero` — idle (textos + selo)
- `InvitePlayer` — theater fullscreen

## Aceite

- Clique abre fullscreen estável  
- Vídeo invisível no idle  
- Fechar restaura idle limpo  
- `prefers-reduced-motion`  
- `npm run build` ok  
