# Gamepedia – BGMI Esports Companion

Gamepedia is an experimental **BGMI (Battlegrounds Mobile India) esports hub** built with React + Vite.  
It focuses on tournaments, teams, players, stats, wiki content and fun tools for fans – with **AI-powered insights** using Gemini.

> 🔗 **Live Demo:** https://gamepedia-fawn.vercel.app/

---

## 🌟 Key Features

### 🏆 Esports Hub

- **Home Dashboard**
  - Featured BGMI tournaments
  - Recent / mock live matches
  - Trending players based on KD
  - Live ticker with quick updates

- **Tournaments**
  - Tournament overview (organizer, tier, dates, location, prize pool)
  - Map pool section (Erangel, Miramar, Sanhok, Vikendi)
  - Participating teams list
  - Tabs for **Overview**, **Bracket** (placeholder), and **Standings**
  - Standings table with **sortable columns** (Rank, WWCD, Finishes, Points…)

- **Matches**
  - Centralized match schedule using `MatchContext`
  - Filter by **status**: Upcoming / Live / Finished
  - Search by team or tournament name
  - Grouped by **Today / Tomorrow / Date**

- **Teams & Players**
  - Mock data for popular BGMI lineups (Team Soul, GodLike, TX, etc.)
  - Rosters populated from `MOCK_PLAYERS`
  - Basic player stats: matches, finishes, KD, HS%, avg damage, KD history

---

### 🤖 AI-Powered Features (Gemini)

Powered by `@google/genai` via `services/geminiService.ts`:

- **Tournament Preview**
  - Generates a short hype intro for a selected tournament on the Home page.

- **Match Analysis**
  - Generates a brief pro-style tactical summary or prediction for a given match:
    - Different behavior for **LIVE / UPCOMING / FINISHED** states.

- **News Content**
  - Generates short esports style news articles from a headline & category.

> ℹ️ If no API key is configured, the UI falls back to safe messages like  
> “AI Analysis requires a valid API Key configured in the environment”.

---

### 🎮 Fan Tools & Wiki (Many Are WIP / Placeholder)

A lot of routes are already wired in `App.tsx` + `Layout` but still under construction.  
Planned / partially mocked sections include:

- **Wiki & Strategy**
  - Weapon Wiki (`WeaponsPage`)
  - Attachment Wiki
  - Vehicle Wiki
  - Strategy Maps & Strategy Board
  - Nade Lineups
  - BGMI Guides / Coaching Hub
  - Glossary (IGL, anchor, etc.)

- **Analytics & Meta**
  - Player and team **Stats** with charts (KD history, points trend)
  - Meta tracker
  - Map stats overview

- **Fun Tools**
  - Fantasy & Pick’ems
  - UC / Rank / Damage / Prize calculators
  - Crosshair generator & Sensitivity converter
  - Drop roulette, reaction tester, zone simulator, spray trainer

- **Community & Admin**
  - Clan manager, recruitment board
  - Points store & inventory
  - Ruleset / table / bracket / scorecard generators
  - Admin dashboard (for managing tournaments & data; mostly stubbed)

> ✅ Most of the **core logic + mock data** are already present in `constants.ts` and `contexts`,  
> but not all pages are fully designed yet – this is still an experimental playground.

---

## 🛠 Tech Stack

**Frontend**

- [React](https://react.dev/) (with functional components & hooks)
- [Vite](https://vitejs.dev/) – fast dev/build tool
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) (hash router)
- [lucide-react](https://lucide.dev/) – icon library

**AI**

- [`@google/genai`](https://www.npmjs.com/package/@google/genai) (Gemini)
- Custom service: `services/geminiService.ts`

**State & Context**

- Custom React Contexts:
  - `MatchContext` – match list, updates, access helpers
  - `UserContext` – user points, bets, badges, inventory, missions, XP & levels

**Storage**

- `localStorage` for:
  - User points & bets
  - Inventory
  - Missions progress
  - Theme preference (light/dark)

---

## 📂 Project Structure

High-level folders:

```txt
Gamepedia/
├─ components/        # Layout, MatchRow, Infobox, CommandPalette, etc.
├─ contexts/          # MatchContext, UserContext and providers
├─ pages/             # All main routes (Home, Tournaments, Matches, Stats, Weapons, etc.)
├─ services/          # Gemini AI service integration
├─ App.tsx            # Router setup & route definitions
├─ constants.ts       # Mock data: teams, players, matches, maps, weapons, guides, etc.
├─ types.ts           # Shared TypeScript types & enums
├─ index.tsx          # React entry, providers
├─ index.html
├─ package.json
└─ vite.config.ts
