# PRD — Frontend-Only Card Sorting Platform (Open Source)

## 1) Problem statement

Teams need a lightweight, **self-hostable** way to run **card sorting** studies (open/closed/hybrid) to validate or discover information architecture (IA) groupings—without sending participant data to any backend.

Card sorting is explicitly used to uncover users’ mental models and validate category labels/groupings for navigation/menus. ([Nielsen Norman Group][1])

---

## 2) Goals and non-goals

### Goals

* **Template Builder**: create a reusable `template.json` (study setup) including categories and cards.
* **Study Runner**: upload `template.json`, let a participant sort cards, then download `result_{name}.json`.
* **Frontend-only**: runs entirely in the browser; no server, no database.
* **Research-grade capture**: reduce bias and capture enough metadata to analyze results later.
* **Accessible, mobile-friendly drag & drop** (keyboard + touch).

### Non-goals (v1)

* Server-side aggregation/dashboard (you’ll collect result files manually).
* Automated dendrogram/similarity matrix analytics (can be a later “local analysis” feature).
* Participant recruitment or email invites.

---

## 3) Personas

1. **Study Creator (UX/PO/IA Designer)**

* Builds templates, shares study link, collects result JSON files.

2. **Participant**

* Loads template, sorts cards, exports results locally.

---

## 4) User stories

### Study Creator

* As a creator, I can **define categories** (for closed/hybrid sorts) so participants sort consistently.
* As a creator, I can **define cards** (menu items/features) with short, neutral labels to avoid bias. ([Nielsen Norman Group][2])
* As a creator, I can **export a `template.json`** to reuse across sessions and teams.

### Participant

* As a participant, I can input a **name/alias** (pseudonym) so my exported file is identifiable.
* As a participant, I can **drag cards into groups** quickly on mobile/desktop.
* As a participant, I can place unclear items into an **“Unsure / Doesn’t fit”** bucket.
* As a participant, I can **review** before submitting, then **download my result JSON**.

---

## 5) Method alignment with card sorting best practices

### Study type support

* **Open sort**: participant creates categories.
* **Closed sort**: creator provides categories; participant assigns cards.
* **Hybrid sort**: creator provides base categories, participant can add new categories. ([Nielsen Norman Group][3])

### Bias controls (product requirements)

* **Neutral card labels** guidance + validation warnings (e.g., overly long/leading labels). ([Nielsen Norman Group][2])
* **Randomize initial card order** (toggle) to reduce ordering effects.
* Provide an **Unsure** bucket to prevent forced misclassification.
* Encourage adequate sample size guidance in UI copy:

  * NN/g recommends **≥15 participants** for qualitative, **30–50** for quantitative card sorts. ([Nielsen Norman Group][1])

---

## 6) Functional requirements (implementation-ready)

| ID  | Area          | Requirement                                     | Acceptance criteria                                               |
| --- | ------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| F1  | App shell     | SPA with 2 modes: **Builder** and **Run Study** | Routes load locally; no network dependency                        |
| F2  | Builder       | Create/edit **Study metadata**                  | Name, description, sortType, settings saved                       |
| F3  | Builder       | Create/edit **Categories**                      | Add/remove/reorder; unique IDs; label required                    |
| F4  | Builder       | Create/edit **Cards**                           | Add/remove/reorder; label required; optional description/metadata |
| F5  | Builder       | Export `template.json`                          | Valid schema; file downloads to device                            |
| F6  | Runner        | Upload `template.json`                          | Validates schema; shows friendly errors                           |
| F7  | Runner        | Participant identity                            | Input `participantName` (alias); required before start            |
| F8  | Runner        | Sorting interaction                             | Drag card between lists; reorder within category                  |
| F9  | Runner        | Open/hybrid category creation                   | If enabled, participant can add category with label               |
| F10 | Runner        | Progress and completeness                       | Shows unsorted count; optionally enforce “all sorted”             |
| F11 | Runner        | Review step                                     | Shows final grouping summary; allows edits before export          |
| F12 | Runner        | Export `result_{name}.json`                     | Includes grouping + timestamps + template checksum                |
| F13 | Reliability   | Autosave locally                                | Refresh/accidental close restores progress                        |
| F14 | Accessibility | Keyboard + ARIA-friendly DnD                    | Meets basic keyboard sorting flows; visible focus                 |
| F15 | Privacy       | No data leaves browser                          | No API calls; no third-party analytics                            |

---

## 7) Data contracts

### 7.1 `template.json` (Study Template)

Design for versioning + forward compatibility.

```json
{
  "schemaVersion": "1.0.0",
  "templateId": "tmpl_8f3c2b",
  "study": {
    "title": "TrueApp Menu Card Sort",
    "description": "Sort items into More vs My Profile.",
    "language": "en",
    "sortType": "closed",
    "settings": {
      "randomizeCardOrder": true,
      "allowCreateCategories": false,
      "requireAllCardsSorted": true,
      "enableUnsureBucket": true,
      "unsureBucketLabel": "Unsure / Doesn't fit"
    },
    "instructionsMarkdown": "Drag each card into the group that best matches where you'd expect to find it."
  },
  "categories": [
    { "id": "cat_more", "label": "More", "description": "" },
    { "id": "cat_profile", "label": "My Profile", "description": "" }
  ],
  "cards": [
    { "id": "card_usage_summary", "label": "Usage Summary", "description": "", "meta": {} }
  ],
  "createdAt": "2025-12-16T00:00:00.000Z"
}
```

### 7.2 `result_{name}.json` (Participant Result)

Must be analyzable later (and traceable to template version).

```json
{
  "schemaVersion": "1.0.0",
  "templateId": "tmpl_8f3c2b",
  "templateChecksumSha256": "…",
  "participant": {
    "name": "Jirad-01"
  },
  "session": {
    "startedAt": "2025-12-16T10:12:00.000Z",
    "completedAt": "2025-12-16T10:20:12.000Z",
    "durationMs": 492000,
    "timezone": "Asia/Bangkok",
    "userAgent": "…",
    "viewport": { "w": 390, "h": 844 }
  },
  "output": {
    "groups": [
      { "categoryId": "cat_more", "cardIdsInOrder": ["card_usage_summary"] },
      { "categoryId": "cat_profile", "cardIdsInOrder": [] }
    ],
    "unsureCardIds": []
  },
  "telemetry": {
    "movesCount": 37,
    "undoCount": 4
  }
}
```

---

# Product stack design (specific libraries)

## 8) Chosen architecture: React SPA (Vite) for true frontend-only

* **React 19.2.x** (current stable listed by React). ([React][4])
* **Vite 7.3.x** for modern dev/build tooling; deployable on Vercel as static assets. ([npm][5])
* **React Router v7** for routing (Builder/Runner pages). ([React Router][6])

This avoids Next.js server features entirely and prevents accidental backend usage.

## 9) UI system (modern, production-grade)

* **Tailwind CSS v4** for styling. ([Tailwind CSS][7])
* **shadcn/ui** component patterns (built on Radix + Tailwind) for fast, consistent UI. ([Shadcn UI][8])
* **Radix UI** primitives for accessible dialogs/menus/forms. ([Radix UI][9])

## 10) Drag & drop (core of card sorting)

**Primary recommendation: `dnd-kit`**

* Modern React drag-and-drop toolkit, supports sortable lists and sensor-based input (mouse/touch/keyboard patterns via its packages). ([Dnd Kit][10])

**Alternative (optional): Atlassian `pragmatic-drag-and-drop`**

* If you want Atlassian’s approach later or need different perf characteristics. ([Atlassian Design System][11])

## 11) Forms, validation, persistence

* **React Hook Form** for performant forms.
* **Zod** for schema validation + type inference (validate uploaded templates and exported results).
* **@hookform/resolvers** (Zod resolver) for clean integration.
* **localforage** (IndexedDB wrapper) to autosave progress robustly (better than localStorage for larger templates/results).
* **nanoid** for IDs (`templateId`, `cardId`, `categoryId`).
* **date-fns** for timestamps (optional; native Date is ok).

---

# 12) UX interaction design (implementation details)

## Pages / routes

1. `/` — Home

* Buttons: **Create Template** / **Run Study**
* “All data stays on your device” note

2. `/builder`

* Sections:

  * Study metadata
  * Sort settings (open/closed/hybrid toggles)
  * Category editor (list + reorder)
  * Card editor (list + reorder)
  * Export template button

3. `/run`

* Stepper:

  1. Upload template
  2. Participant info + instructions
  3. Sort board
  4. Review + export result

## Sort board layout

* Left: **Unsorted deck** (cards not placed yet)
* Middle/right: **Category columns** (droppable lists)
* Optional last column: **Unsure / Doesn’t fit**
* Bottom bar:

  * Progress (“12/40 sorted”)
  * Undo/Redo
  * “Review” CTA (enabled if rules satisfied)

## Key behaviors

* Drag card from unsorted → category; category → category; reorder within category.
* Prevent duplicates (a card exists in exactly one place).
* Autosave after each move (localforage).
* On refresh: restore to last saved state and show “Recovered session” toast.

---

# 13) Validation rules (Zod)

## Template validation (on upload/export)

* `schemaVersion` supported
* Unique category IDs + labels (case-insensitive)
* Unique card IDs
* Enforce max recommended card count warning (UX hint; don’t hard block):

  * Optimal Workshop suggests typically **30–50 cards** to keep it manageable. ([Optimal Workshop][12])

## Result validation (before export)

* All cards accounted for (sorted + unsure + unsorted)
* If `requireAllCardsSorted=true`, block export until none left unsorted

---

# 14) Repo structure (Vite + React + TS)

```
/src
  /app
    router.tsx
    layout.tsx
  /pages
    HomePage.tsx
    BuilderPage.tsx
    RunPage.tsx
  /components
    /builder
      StudyMetaForm.tsx
      CategoryEditor.tsx
      CardEditor.tsx
      ExportTemplateButton.tsx
    /runner
      TemplateUploader.tsx
      ParticipantForm.tsx
      SortBoard.tsx
      CategoryColumn.tsx
      SortCard.tsx
      ReviewAndExport.tsx
  /domain
    schema.ts        // Zod schemas for Template/Result
    checksum.ts      // sha-256 template checksum
    ids.ts           // nanoid helpers
    model.ts         // types
  /store
    builderStore.ts  // Zustand
    runStore.ts      // Zustand + persistence
  /lib
    download.ts      // Blob download helpers
    persist.ts       // localforage wrapper
```

---

# 15) Testing and quality gates

* **Playwright**: E2E flows (build template → export → upload → sort → export result).
* **Vitest**: schema validation, import/export, checksum correctness.
* Accessibility checks:

  * Keyboard focus visible
  * Basic ARIA labeling for columns and cards

---

# 16) Security and privacy (frontend-only reality)

* No network calls.
* Disable/avoid any third-party analytics scripts.
* Display warning: “Use an alias; don’t enter sensitive personal data.”
* Dependency hygiene: keep React/Vite patched (React versions are tracked publicly). ([React][4])

---

# 17) Scope roadmap (after v1)

* Local “Results Analyzer” page: import multiple result JSON files and generate:

  * similarity matrix
  * agreement heatmap
  * suggested IA labels
* CSV export
* Localization for UI + template content

If you want, I can convert this into a developer-facing backlog (epics → tickets) with acceptance criteria exactly as Windsurf should implement.

[1]: https://www.nngroup.com/articles/card-sorting-definition/?utm_source=chatgpt.com "Card Sorting: Uncover Users' Mental Models"
[2]: https://www.nngroup.com/articles/card-sorting-terminology-matches/?utm_source=chatgpt.com "Card Sorting: Pushing Users Beyond Terminology Matches"
[3]: https://www.nngroup.com/videos/open-vs-closed-card-sorting/?utm_source=chatgpt.com "Open vs. Closed Card Sorting (Video) - NN/G"
[4]: https://react.dev/versions?utm_source=chatgpt.com "React Versions"
[5]: https://www.npmjs.com/package/vite?utm_source=chatgpt.com "vite"
[6]: https://reactrouter.com/ "React Router Official Documentation"
[7]: https://tailwindcss.com/blog/tailwindcss-v4-1?utm_source=chatgpt.com "Tailwind CSS v4.1: Text shadows, masks, and tons more"
[8]: https://ui.shadcn.com/docs/installation/manual?utm_source=chatgpt.com "Manual Installation - Shadcn UI"
[9]: https://www.radix-ui.com/?utm_source=chatgpt.com "Radix UI"
[10]: https://docs.dndkit.com/guides/accessibility?utm_source=chatgpt.com "Accessibility"
[11]: https://atlassian.design/components/pragmatic-drag-and-drop "Packages - index - Components - Atlassian Design System"
[12]: https://www.optimalworkshop.com/blog/card-sorts-for-ia "How to Conduct an Effective Card Sorting Session for Improved IA | Optimal Workshop"
