# Embarque Continuado · Estante Mágica

Plataforma interativa de treinamento continuado para CS (Customer Success) iniciantes.
Mesma identidade visual dos demais treinamentos, **100% client-side** (HTML/CSS/JS puro,
sem build e sem servidor). As respostas dos testes ficam apenas no navegador do participante.

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | Hub — navegação para os blocos e a Arena. |
| `autoconhecimento.html` | **Bloco 0** — teste de perfil (estilo MBTI/16personalities) + Quociente de Positividade (QP) + Sabotadores. Gera **relatório do participante** e **visão para o gestor**, exportável em PDF (botão Imprimir). |
| `rotina.html` | **Bloco 1** — "Dominando a Rotina" (gestão de carteira, cadência, blocos de foco, canais de dúvidas, encerramento de tickets) com acordeões e mini-quizzes. |
| `arena.html` | Hub dos jogos. |
| `perguntados.html` | Jogo de trivia por categorias (Carteira, Cadência, Canais & Tickets, Ajustes de Prazo). |
| `codinomes.html` | Codinomes adaptado ao vocabulário de CS (2 times + Espião), ideal para o encontro presencial. |

## Estrutura

```
embarque-continuado/
├─ index.html · autoconhecimento.html · rotina.html
├─ arena.html · perguntados.html · codinomes.html
├─ logo_EM.png
├─ css/
│   ├─ base.css        (identidade visual base)
│   └─ embarque.css    (estilos da plataforma)
└─ js/
    ├─ perfil-data.js      (bancos de questões + 16 tipos + sabotadores + skills)
    ├─ autoconhecimento.js (questionário, cálculo e relatório)
    ├─ quiz-data.js        (perguntas do Perguntados)
    ├─ perguntados.js      (lógica do trivia)
    └─ codinomes.js        (lógica do Codinomes)
```

## Como rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000/embarque-continuado/
```

## Publicação

Por estar dentro do repositório `treinamento-FC` (que já tem GitHub Pages ativo), a plataforma
fica disponível em:

- **Hub:** `https://amandappEM.github.io/treinamento-FC/embarque-continuado/`

> Para movê-la a um repositório dedicado no futuro, basta copiar a pasta `embarque-continuado/`
> para o novo repo e ativar o Pages lá.

## Sobre as metodologias

Os instrumentos de autoconhecimento são **adaptações inspiradas** nas metodologias, para fins
de desenvolvimento interno — não substituem os testes oficiais:

- Tipologia: estilo **MBTI / 16personalities** (4 eixos + Identidade Assertivo/Turbulento).
- **Quociente de Positividade (QP)** e **Sabotadores**: inspirados em *Positive Intelligence* (Shirzad Chamine).

Referências oficiais: [16personalities](https://www.16personalities.com/br/) ·
Sabotadores e QP (pesquisas Novi do programa).
