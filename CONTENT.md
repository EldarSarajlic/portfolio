# Editing your portfolio content

All the text/records on the site now live in **`src/content/*.json`** — separate
from the React code. You have three ways to change them, from zero-setup to
fully no-code.

---

## The three ways to edit

| Way | Setup | Where you edit | Best for |
| --- | --- | --- | --- |
| **1. Pages CMS** (recommended) | One-time connect | Browser form at [app.pagescms.org](https://app.pagescms.org) | Day-to-day updates from any device, no code |
| **2. Edit the JSON directly** | None | The `src/content/*.json` files in your editor or on GitHub | Quick tweaks when you're already in the code |
| **3. Ask Claude Code** | None | Plain English ("add a job at X") | Bigger changes, restructuring, new sections |

However you edit, the flow to production is the same:

> **change committed to GitHub `main` → Vercel rebuilds → live in ~1 minute.**

---

## What lives where

| File | Controls | Section |
| --- | --- | --- |
| `src/content/site.json` | Name, role/tagline, email, GitHub & LinkedIn links | Hero, Contact, footer |
| `src/content/about.json` | The four quick-fact cards | About |
| `src/content/skills.json` | Intro line + skill groups | Skills |
| `src/content/experience.json` | Your roles / positions | Experience |
| `src/content/projects.json` | Project cards | Selected work |
| `src/content/education.json` | Degrees, courses, certifications | Education |

Editing your email or a social link in `site.json` updates it **everywhere** at
once (hero icons, contact cards, footer) — no more hunting through the code.

### Still code-managed (on purpose)

These rarely change and are tied to the visual design, so they stay in the
components. Edit the file directly or just ask Claude Code:

- **Hero headline** ("Building quality software…") — `src/sections/Hero.tsx`
- **About prose paragraphs** (the coloured-highlight bio) — `src/sections/About.tsx`
- **The two full case-study pages** — `src/pages/DispatcherPage.tsx`,
  `src/pages/PlaywrightPage.tsx`

Any of these can be moved into the CMS later if you find you're editing them
often — just ask.

---

## One-time setup: connect Pages CMS

Pages CMS is free, open-source, and Git-based (no database, no separate backend).
It reads the `.pages.yml` file already in this repo.

1. Go to **[app.pagescms.org](https://app.pagescms.org)** and sign in with GitHub.
2. Authorize the Pages CMS GitHub app **for the `EldarSarajlic/portfolio` repo only**
   (you can limit it to this single repository).
3. Open the project — it auto-detects `.pages.yml` and shows an editing form for
   each section (Site & Social, About, Skills, Experience, Projects, Education).
4. Edit a field → **Save**. Pages CMS commits to `main`, and Vercel redeploys.

That's it. From then on you edit at app.pagescms.org from your laptop or phone.

### Adding a new logo

Logos live in `public/logos` and are referenced by path (e.g. `/logos/htec.svg`).
In Pages CMS, open the **Media** tab, upload the image, then set the entry's
`logo` field to `/logos/<your-file>`. The `initials` field is the fallback shown
if the image is ever missing.

---

## Local preview (optional)

To see changes before they go live:

```bash
npm install
npm run dev
```

Then open http://localhost:5173. To check a production build:

```bash
npm run build
```

---

## Notes

- **Dates, order, and wording** are all plain text — type them however you like
  (e.g. `"Aug 2026 — Present"`).
- **Lists** (bullets, tech stack, skills, courses) are add/remove rows in the CMS.
- A **project's `href`** can be an internal case-study route (`/projects/…`) or an
  external `https://…` link.
- A **project's status badge** is optional — leave its label empty for no badge;
  `tone` is `amber` or `mint`.
- Alternative CMS if you'd rather self-host the editor in this repo:
  [Sveltia CMS](https://sveltiacms.app) (needs a small OAuth relay on Vercel).
