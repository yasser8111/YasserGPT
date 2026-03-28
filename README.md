# YasserGPT

A fast, clean AI chat interface powered by modern language models — built for real conversations.

&nbsp;

**[Live Demo](https://ysrgpt.vercel.app)**

&nbsp;

## Preview

<p align="center">
  <img src="./preview-1.png" width="800" alt="YasserGPT Chat Interface" />
</p>

&nbsp;

## Features

- **Conversational AI** — Context-aware chat with smooth, streaming responses
- **Markdown Rendering** — Full support for code blocks, lists, and rich text output
- **Syntax Highlighting** — Code responses rendered with highlight.js
- **Chat History** — Persistent sessions via Firebase for returning users
- **LRU Caching** — Optimized API call efficiency with smart response caching
- **Authentication** — Secure user accounts powered by Firebase Auth
- **Responsive Design** — Pixel-perfect across desktop and mobile

&nbsp;

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Backend / Auth | Firebase v12 |
| AI Rendering | react-markdown + remark-gfm |
| Syntax Highlighting | highlight.js + rehype-highlight |
| Icons | Lucide React |
| Deployment | Vercel |

&nbsp;

## Project Structure

```
src/
├── api/          # AI model API handlers
├── components/   # Reusable UI components
├── constants/    # App-wide constants and config
├── context/      # React context providers
├── layouts/      # Page layout wrappers
├── pages/        # Route-level page components
├── services/     # Firebase and external services
└── utils/        # Helper functions
```

&nbsp;

## Getting Started

```bash
# Install dependencies
npm install

# Add your environment variables
cp .env.example .env

# Start the development server
npm run dev
```

&nbsp;

---

<p align="center">Built by <strong>Yasser 811</strong></p>