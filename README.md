# React + TypeScript + Vite

# Planej.ai

O Planej.ai é uma aplicação web de planejamento financeiro pessoal. A partir da renda, gastos, dívidas e objetivos do usuário, a aplicação calcula a capacidade mensal de economia e gera um diagnóstico personalizado com inteligência artificial.

## Funcionalidades

- Formulário multi-etapas para criar uma simulação financeira.
- Cálculo da economia mensal disponível.
- Diagnóstico com análise de viabilidade da meta.
- Sugestões para reduzir gastos, gerar renda extra e investir.
- Histórico de simulações salvo no navegador.
- Tema claro e escuro.
- Interface responsiva.

## Tecnologias

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Google Gemini API

## Como executar

Instale as dependências:

```bash
pnpm install
```

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
# Opcional: altere o modelo sem modificar o código
VITE_GEMINI_MODEL=gemini-3.6-flash
```

Inicie o projeto:

```bash
pnpm dev
```

A aplicação estará disponível no endereço exibido pelo Vite, geralmente `http://localhost:5173`.

## Rotas principais

- `/` - criar uma nova simulação;
- `/resultado/:id` - visualizar o resultado;
- `/historico` - consultar simulações anteriores.

## Observação

Este projeto foi desenvolvido para fins de estudo e portfólio. Como a variável `VITE_GEMINI_API_KEY` é utilizada no frontend, recomenda-se usar um backend para proteger a chave em aplicações reais.
