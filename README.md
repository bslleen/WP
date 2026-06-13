# Eleanor Ashworth — Writer Portfolio

A dark academia writer portfolio built with React + Vite and Firebase. Features a Wattpad-style reading experience, a full admin CMS, dual themes, and a hidden secret page.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite |
| Database | Firebase Firestore |
| Storage | Firebase Storage (cover images) |
| Auth | Firebase Auth (admin login) |
| Styling | Tailwind v4 + CSS custom properties |
| Fonts | Playfair Display · IM Fell English · Crimson Text · Cinzel |

---

## Quick Start

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run preview
npm run lint
```

Firebase config lives in `src/firebase.js`. The project points to a live Firestore database — no local setup required.

---

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.jsx       Sidebar + mobile tab nav
│   │   └── AdminRequireAuth.jsx  Firebase Auth gate
│   ├── AmbientAudio.jsx          Looping atmospheric sound
│   ├── DustMotes.jsx             Floating particle canvas
│   ├── Footer.jsx
│   ├── Navigation.jsx            Fixed nav, draggable candle, theme toggle
│   ├── OrnateElements.jsx        OrnateDivider, OrnateFrame, CandleIcon, BookIcon
│   ├── PasswordModal.jsx         Secret page password prompt
│   ├── ProtectedRoute.jsx        Secret page auth guard
│   └── WorkCard.jsx              Framed gallery card with atmospheric SVG placeholders
│
├── data/
│   ├── api.js                    All Firestore reads/writes + Firebase Auth helpers
│   ├── content.js                Static fallback content
│   └── normalize.js              Firestore → UI shape adapter
│
├── hooks/
│   └── useSecretAccess.js        3-click + candle trigger, password auth
│
├── pages/
│   ├── About.jsx
│   ├── ChapterReader.jsx         Full-screen Wattpad-style reader
│   ├── Home.jsx                  Gallery with hanging frames
│   ├── Journal.jsx
│   ├── NotFound.jsx
│   ├── Secret.jsx                Private journal + letters to the future
│   ├── WorkDetail.jsx            Work detail page with chapter list
│   ├── Works.jsx                 Filtered works gallery
│   ├── WorksAll.jsx
│   └── admin/
│       ├── AdminAbout.jsx
│       ├── AdminDashboard.jsx
│       ├── AdminJournal.jsx
│       ├── AdminLogin.jsx
│       ├── AdminSettings.jsx     Change password + email
│       ├── AdminWorkDashboard.jsx  Per-work hub: chapter management
│       ├── AdminWorks.jsx        Works list with publish toggle
│       ├── ChapterEditor.jsx     Full-screen distraction-free editor
│       ├── JournalForm.jsx
│       └── WorkForm.jsx          Work metadata + tags + story status
│
└── themes/
    ├── ThemeContext.jsx
    ├── parchment.css
    └── themes.js                 Castle (dark) + Parchment (light) token sets
```

---

## Firestore Collections

```
works/
  {workId}/
    title, description, excerpt, category, year, pages
    status        'published' | 'in progress'     — visibility
    storyStatus   'ongoing'   | 'completed'        — narrative completion
    tags          string[]
    cover_image   url
    accent_color  hex
    published     boolean
    createdAt, updatedAt

    chapters/
      {chapterId}/
        title, content, order, wordCount
        status   'published' | 'draft'
        createdAt, updatedAt

journal/
  {entryId}/
    title, body, excerpt, category
    published   boolean
    createdAt, updatedAt

config/
  profile/         About page content (bio, photo, social links)

private/           Secret page — private journal entries (auth-only)
letters/           Secret page — letters to the future (auth-only)
```

---

## Public Routes

| Route | Page |
|---|---|
| `/` | Home — hanging gallery of featured works, daily literary quote, + recent journal entries |
| `/works` | Filtered works gallery (All · Novel · Poetry · Short Story) |
| `/works/:workId` | Work detail — cover, tags, description, chapter list |
| `/works/:workId/chapter/:chapterId` | Full-screen chapter reader |
| `/about` | About the author |
| `/journal` | Journal entries |
| `/secret` | Hidden page (password-protected) |

The chapter reader has its own fixed top bar and hides the main navigation automatically. The reader also has a background theme picker (Dark / Parchment / White) under the size controls — the chapter title and body text colour both follow the selected theme.

---

## Admin Routes

All routes require Firebase Auth. Access via `/admin/login`.

| Route | Page |
|---|---|
| `/admin` | Dashboard |
| `/admin/works` | Works list |
| `/admin/works/new` | Create work |
| `/admin/works/:workId` | Work dashboard — manage chapters |
| `/admin/works/:workId/edit` | Edit work metadata |
| `/admin/works/:workId/chapters/new` | Write new chapter |
| `/admin/works/:workId/chapters/:chapterId` | Edit chapter |
| `/admin/journal` | Journal entries list |
| `/admin/journal/new` | Create journal entry |
| `/admin/journal/:id/edit` | Edit journal entry |
| `/admin/about` | Edit about page |
| `/admin/settings` | Change password / email |

---

## Chapter System (Wattpad-style)

Works are containers for ordered chapters. Each chapter is a Firestore subcollection document under `works/{workId}/chapters`.

**Admin flow:**
1. Create a work at `/admin/works/new` (title, description, tags, story status, cover, accent colour)
2. Open the work dashboard at `/admin/works/:workId`
3. Click **+ New Chapter** → full-screen editor with word count + auto-save
4. Use **Save Draft** to keep it hidden, **Publish →** to make it live
5. Toggle chapter visibility from the dashboard without opening the editor

**Reader flow:**
- `/works/:workId` shows the chapter list with word counts
- Each chapter links to the full-screen reader
- Reader has font picker (Crimson / Georgia / Lato) and size picker (S / M / L)
- Prev / Next navigation at the bottom of each chapter

---


## Secret Page

Trigger via three rapid clicks on any keyboard letter anywhere on the site(except for writing spaces ), or by clicking the candle icon in the navigation bar.

Authentication via Firebase Auth — credentials managed in the Firebase console.

Features:
- **Private Journal** — entries saved to Firestore (`private/` collection), auth-only
- **Letters to the Future** — seal a message with a reveal date; stays locked until that date

---

## Daily Quote (Today's Ink)

The hero section displays a rotating literary quote sourced live from [ZenQuotes](https://zenquotes.io) via a Vercel serverless proxy at `/api/quote.js`. The proxy handles the request server-side so there are no browser CORS restrictions.

- Quote is cached in `sessionStorage` — same quote for the full browser session, fresh one on next visit
- If the API is unavailable, one of 22 curated literary quotes is shown silently as fallback (keyed to day-of-year so it still rotates daily)
- Serverless function: `api/quote.js`
- Component: `DailyQuote` in `src/pages/Home.jsx`

---

## Design Tokens

```
#0d0a05   --bg-primary      deep black background
#1a1209   --bg-secondary    card / panel background
#c9a84c   --accent          gold — primary accent
#8a6d2f   --accent-dim      muted gold — borders, labels
#f0e6c8   --text-primary    parchment — headings
#8a7d6a   --text-secondary  warm grey — body text
```
