# Cloudflare Workers Full-Stack React Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/structura-intelligent-pdf-extraction-engine)

A production-ready full-stack application template powered by Cloudflare Workers. Features a modern React frontend with shadcn/ui components, Tailwind CSS, and a robust backend using Durable Objects for stateful entities, Hono routing, and TypeScript end-to-end.

This template demonstrates a real-time chat application with users, chat boards, and messages stored in Durable Objects. Extend it by adding entities in `worker/entities.ts` and routes in `worker/user-routes.ts`.

## ✨ Key Features

- **Full-Stack TypeScript**: Shared types between frontend and Workers backend.
- **Durable Objects**: Per-entity storage with automatic indexing for listings (users, chats).
- **Modern React Frontend**: shadcn/ui, Tailwind CSS, TanStack Query, React Router.
- **API-First Backend**: Hono router with CORS, error handling, and optimistic updates.
- **Hot Reload Development**: Vite dev server proxies to Workers for seamless full-stack dev.
- **Production Deploy**: Single `wrangler deploy` for Workers + static assets.
- **Theme Support**: Light/dark mode with `next-themes`.
- **Responsive UI**: Mobile-first design with sidebar layout.
- **Error Reporting**: Built-in client-side error capture to `/api/client-errors`.

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Durable Objects, Hono, TypeScript |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| **State** | TanStack Query, Zustand, Immer |
| **UI Components** | Radix UI, Lucide Icons, Tailwind Animate, Sonner Toasts |
| **Data** | Shared types, IndexedEntity pattern for lists/pagination |
| **Dev Tools** | Bun, ESLint, Wrangler, Cloudflare Vite Plugin |

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (`bunx wrangler@latest init` or `npm i -g wrangler`)

### Installation

```bash
git clone <your-repo>
cd <project>
bun install
```

### Development

Start the full-stack dev server:

```bash
bun run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3000/api/*` (proxied via Vite)
- Edit `src/pages/HomePage.tsx` for UI changes.
- Add backend routes in `worker/user-routes.ts`.
- Add entities extending `IndexedEntity` in `worker/entities.ts`.

Type generation (after first deploy):

```bash
bun run cf-typegen
```

Linting:

```bash
bun run lint
```

### Usage Examples

#### Frontend API Calls

Uses `api-client.ts` wrapper:

```tsx
// List users
const users = await api<{ items: User[]; next: string | null }>('/api/users');

// Create chat
const chat = await api<Chat>('/api/chats', {
  method: 'POST',
  body: JSON.stringify({ title: 'New Chat' })
});

// Send message
const msg = await api<ChatMessage>('/api/chats/c1/messages', {
  method: 'POST',
  body: JSON.stringify({ userId: 'u1', text: 'Hello!' })
});
```

#### Backend Extensions

1. **New Entity**: Extend `IndexedEntity` in `worker/entities.ts`.
2. **New Routes**: Add to `userRoutes` in `worker/user-routes.ts` using `ok()`, `bad()`, entities.
3. **Seeding**: Use `Entity.ensureSeed(env)` for mock data.

Current API endpoints:

```
GET    /api/users              # Paginated list
POST   /api/users              # Create user {name}
DELETE /api/users/:id          # Delete user
POST   /api/users/deleteMany   # Bulk delete {ids}

GET    /api/chats              # Paginated list
POST   /api/chats              # Create chat {title}
GET    /api/chats/:id/messages # List messages
POST   /api/chats/:id/messages # Send {userId, text}
DELETE /api/chats/:id          # Delete chat

GET    /api/health             # Health check
POST   /api/client-errors      # Error reporting
```

## ☁️ Deployment

1. **Login to Cloudflare**:
   ```bash
   wrangler login
   wrangler whoami
   ```

2. **Deploy** (builds frontend + deploys Workers + assets):
   ```bash
   bun run deploy
   ```

3. **Custom Domain** (optional):
   Edit `wrangler.jsonc` and run `wrangler deploy`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/structura-intelligent-pdf-extraction-engine)

View logs: `wrangler tail`

## 📚 Project Structure

```
├── src/              # React frontend (Vite)
├── worker/           # Cloudflare Workers backend
│   ├── core-utils.ts # Entity base classes (DO NOT MODIFY)
│   ├── entities.ts   # UserEntity, ChatBoardEntity
│   └── user-routes.ts # Your API routes
├── shared/           # Shared types/mock data
├── tailwind.config.js # UI theming
└── wrangler.jsonc    # Workers config
```

## 🤝 Contributing

1. Fork & clone.
2. `bun install`.
3. `bun run dev`.
4. Add features in `src/` or `worker/user-routes.ts`.
5. Test thoroughly.
6. Submit PR.

## 🔒 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)