# 2030 — O Último Comando: Escolhas

Thriller narrativo cinematográfico interativo para navegador, baseado no Livro I **2030 — O Último Comando**.

## Status

**Parte 1 em desenvolvimento — primeira versão jogável.**

Regra de produção: o jogo completo será construído em no máximo 3 partes. A Parte 1 precisa ser jogável e cobre Prólogo + Ato I (capítulos 1–6), com placeholders substituíveis por `assetId` para as artes definitivas.

## Princípios

- Não é visual novel tradicional, quiz ou página com botões.
- Escolhas alteram estado persistente, relações, informação e rotas.
- Silêncio, espera e recusa podem ser ações.
- Falhas continuam a narrativa quando coerente.
- O jogador só sabe o que o POV descobriu.
- Cópias e reconstruções não apagam mortes ou identidades.
- O sistema de arte é desacoplado: assets definitivos podem ser integrados posteriormente sem reescrever a campanha.

## Stack

React + TypeScript + Vite, arquitetura data-driven, com camada cinematográfica e fallback DOM/CSS.

## Execução

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Estrutura da Parte 1

- Narrative Engine
- Cinematic Director
- Choice Composer
- estado persistente e consequências
- save/load em `localStorage`
- manifesto de assets
- Prólogo + capítulos 1–6
- acessibilidade e layout mobile/desktop

> Esta versão usa placeholders cinematográficos até a integração das imagens finais.
