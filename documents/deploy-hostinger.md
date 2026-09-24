# Deploy Hostinger (export estático)

## Gerar o build

```bash
npm run build:hostinger
```

A pasta `dist/` sai com **caminhos relativos** (`./_next`, `./media`, `./brand`) para não quebrar na Hostinger.

## Upload

1. Abra `public_html` (FTP ou Gerenciador de Arquivos).
2. Envie o **conteúdo interno** de `dist/` — não envie a pasta `dist` como subpasta.
3. Na raiz do site devem existir:
   - `index.html`
   - `_next/`
   - `media/`
   - `brand/`
   - `icon.png`

## Evite

- Subir `dist/` inteira como `public_html/dist/` (quebra CSS/JS/vídeo).
- Misturar arquivos antigos de outro site na mesma pasta sem limpar.

## Conferência rápida

Abra o site e no DevTools (Network) confira se `_next/static/...`, `media/*.mp4` e `brand/shiver-logo.png` retornam **200**.
