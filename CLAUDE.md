# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Policies

### Git Commits
**CRITICAL**: AI assistants MUST NOT create git commits. Only the human developer can make commits to this repository. AI can:
- Suggest commit messages
- Review changes before committing
- Help stage files
- Analyze git history

But AI MUST NEVER execute `git commit` commands.

### Backend Repository
The backend for this application is located in the sibling directory: `../coffee-strapi`
- This is a Strapi CMS instance
- Development server runs on `http://localhost:1337`
- Production server: `https://cms.democoffeeandseaguls.ru`

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Lint code with ESLint
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a React TypeScript application built for Telegram Web App, serving as a coffee ordering system. The app uses a context-based state management pattern with multiple providers for different domains.

### Key Technologies
- **React 19** with TypeScript
- **Vite 7** for build tooling and development server
- **React Router v7** for navigation
- **Axios** for API communication
- **SCSS** with CSS modules for styling
- **React Toastify** for notifications
- **i18next** for internationalization (supports Russian, English, Chinese)
- **TanStack Virtual** (@tanstack/react-virtual) for virtual scrolling
- **Telegram Web App API** integration
- **ESLint + Prettier** for code quality and formatting

### Project Structure

#### Context Architecture
The application uses a multi-layered context provider pattern in `src/main.tsx`:
- `UserProvider` - User authentication and profile management
- `MenuProvider` - Product categories and menu items
- `CartProvider` - Shopping cart state and operations
- `OrdersProvider` - Order history and management
- `ModalProvider` - Global modal state

#### Path Aliases (configured in `vite.config.ts`)
- `@views` → `./src/views`
- `@components` → `./src/components`
- `@hooks` → `./src/hooks`
- `@lib` → `./src/lib`
- `@assets` → `./src/assets`
- `@context` → `./src/context`
- `@models` → `./src/models`
- `@services` → `./src/services`
- `@constants` → `./src/constants`

#### Core Directories
- `src/views/` - Page components (HomePage, MenuPage, OrderPage, OrdersPage, NotFoundPage)
- `src/components/` - Reusable UI components
- `src/context/` - React context providers for state management
- `src/services/` - API service layer with axios
- `src/models/` - TypeScript type definitions
- `src/hooks/` - Custom React hooks (useTelegram, useInfiniteScroll)
- `src/lib/` - Utility libraries (i18n configuration, toast configuration, helpers)
- `src/constants/` - Application constants

### API Integration

The app communicates with a Strapi CMS backend located in `../coffee-strapi`:
- **Development**: `http://localhost:1337`
- **Production**: `https://cms.democoffeeandseaguls.ru`

API client configured in `src/services/api/index.ts` with:
- Request/response interceptors
- Bearer token authentication
- Error handling for connection upgrades (426 status)

### Telegram Integration

The app is designed as a Telegram Web App with a companion bot located in `../coffee-bot`:
- Custom TypeScript definitions in `src/telegram.d.ts`
- Telegram Web App API access through `window.Telegram.WebApp`
- Custom hook `useTelegram` for Telegram-specific functionality
- Dynamic base path handling (`/` for dev, `/web-app` for production)

### Internationalization (i18n)

The app uses i18next for multi-language support:
- Configuration in `src/lib/i18n/index.ts`
- Supported languages: Russian (default), English, Chinese
- Translation files loaded from `/locales/{lang}/{namespace}.json`
- Uses HTTP backend for loading translations
- Browser language detection with localStorage caching
- Language can be set via query parameter `?lang={code}`
- Integrated with React Suspense for loading states

### Styling Architecture

- **SCSS** with CSS modules for component-specific styles
- Global styles in `src/assets/styles/constants.scss`
- Custom font integration (TT Firs font family)
- Responsive design with CSS custom properties (--app-height)

### State Management Pattern

Each context follows a consistent pattern:
1. State interface definition
2. Context type with actions
3. Provider component with state and methods
4. Custom hook for consuming context with error handling

Example from CartContext:
```typescript
const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
```

### Error Handling

- React Toastify for user notifications
- Console error logging for debugging
- Context validation with helpful error messages
- API error interceptors

### Development Notes

- The app initializes by authenticating with Telegram data and loading all necessary data (categories, products, cart, orders)
- i18n is initialized in `src/main.tsx` before the app renders (via `@lib/i18n` import)
- Uses Suspense for code splitting, loading states, and i18n translation loading
- Custom CSS property `--app-height` for mobile viewport handling
- Environment-based configuration for API URLs and base paths
- Virtual scrolling implemented with TanStack Virtual for performance with long lists
- Toast notifications configured globally in `src/lib/toasts/toast.ts`

### Related Projects

This repository is part of a multi-project coffee ordering system:
- **coffee-app** (this repo) - React TypeScript frontend Telegram Web App
- **coffee-strapi** (`../coffee-strapi`) - Strapi CMS backend
- **coffee-bot** (`../coffee-bot`) - Telegram Bot companion