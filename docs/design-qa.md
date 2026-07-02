# Design QA Rules — SocialSkillsApp

> Auto-loaded via AGENTS.md. Updated each time a standing design decision
> is made. Do not modify Section 9 without user approval.

---

## 0. Source of truth

Token file: `src/theme/index.ts`

Before any QA pass, re-read this file in full and quote the exact type scale,
spacing scale, and color roles back — do not rely on a cached/remembered
version from earlier in the session.

Current token summary (last verified 2026-07-01):

**Typography scale (6 styles + 2 extras):**
| Token | fontSize | lineHeight | weight | notes |
|---|---|---|---|---|
| `display` | 42 | 52 | 600 | Hero title only (HomeScreen) |
| `heading` | 24 | 32 | 600 | Section headers |
| `subheading` | 20 | 28 | 600 | Card titles, modal headings |
| `label` | 13 | 18 | 600 | Uppercase section labels (letterSpacing ≥ 0.5) |
| `body` | 16 | 24 | 400 | Body copy, supporting text |
| `button` | 16 | 22 | 500 | CTA labels |
| `caption` | 14 | 20 | 400 | Hints, dates, secondary info |
| `tab` | 12 | 16 | 500 | Tab bar labels only |

**Spacing scale:** `xs=6, sm=10, md=16, lg=24, xl=32, xxl=48`

**Radius scale:** `sm=16, md=24, lg=32, xl=40, full=9999`

**Color roles (key semantic tokens):**
| Token | Hex | Role |
|---|---|---|
| `primary` | #BEF264 | Brand green — confirms, selects, CTAs |
| `primarySoft` | #ECFCCB | Soft green tint backgrounds |
| `danger` | #EF8B8B | Destructive actions (delete, remove) |
| `dangerSoft` | #FEE2E2 | Danger zone backgrounds |
| `success` / `successSoft` | #FFC857 / #FFF5E5 | Coins, rewards (amber) |
| `successGreenSoft` | #E4F8E5 | Correct-answer / green-tick backgrounds |
| `text` | #111827 | Primary text |
| `secondaryText` | #6B7280 | Supporting / disabled text |
| `background` | #F0F1F3 | App background |
| `stroke` | #D1D5DB | Borders |
| `neutralGrey` | #E5E7EB | Secondary button backgrounds |
| `errorSoft` | #F3F4F6 | Icon container backgrounds (neutral) |

If a project also has a `design-tokens.md`, that is documentation only —
`src/theme/index.ts` is the enforced source of truth if the two ever disagree.

---

## 1. Typography

Only the styles defined in `src/theme/index.ts` are allowed. Never use inline
`fontSize` / `fontWeight` / `lineHeight` / `letterSpacing` overrides in a
component. If a screen needs a size that doesn't exist yet, STOP and flag it
as a TOKEN GAP — do not invent an inline value and do not silently round it
to the nearest existing token without asking.

**Letter spacing rules:**
- Headings / titles: never below `-0.5` (avoid cramped look)
- Body text: `0` to `0.15` range only
- Uppercase labels: minimum `0.5` (uppercase always needs breathing room)

---

## 2. Spacing

Only values from `{6, 10, 16, 24, 32, 48}` are allowed for margin/padding/gap.
No arbitrary pixel values. Flag anything else as a gap — don't round silently.

---

## 3. Color

No raw hex codes in component files — only `theme.colors.*` references.

**Two sub-rules that matter more than the mechanical check:**

- **Semantic correctness over nearest-match.** If a raw hex doesn't map
  cleanly to an existing named token, do NOT substitute the nearest-named
  token if it's visually wrong. Propose a NEW token instead and show the
  swatch/hex before implementing.
- **Meaning check on interactive colors.** Any color used for a
  destructive/warning action (delete, remove, cancel-with-consequence) must
  NOT reuse `primary` or any confirm/brand color, even if that's the nearest
  token. Flag as a decision, propose a distinct token.

---

## 4. Radius

Only values from `{16, 24, 32, 40, 9999}`. Flag drift, don't round silently
when the gap is large (e.g. circular avatar radius vs card radius are
legitimately different — ask before collapsing).

---

## 5. Modals / overlays / popups (separate pass, always last)

Before generating any table, first list every `Modal`, `Sheet`, `Overlay`,
`Dialog` found in the codebase and show the full list to confirm before
proceeding.

Check across ALL modals as a set, not per-modal in isolation:
- **Scrim:** `rgba(255, 255, 255, 0.85)` everywhere (standardized 2026-07-01)
- **Corner radius:** `theme.borderRadius.lg` (32) everywhere
- **Close/dismiss:** consistent per modal *category* — see Section 9
- **Entry/exit animation:** consistent

---

## 6. Output format for every QA pass

```
| Element | Rule violated | Current | Expected (per tokens) | Fix (code) | Confidence |
```

Classify every flagged issue as one of:
- **(a) TOKEN VIOLATION** — a matching token already exists but isn't used.
  Safe to bulk-approve; these are mechanical.
- **(b) TOKEN GAP** — no token covers this value. Do NOT propose a fix or
  round silently. Wait for decision: add a new token, or change the component.

Do not apply ANY fix until rows are explicitly approved by row number or
"approve all in this table."

---

## 7. Recurring-gap detection

If 3+ rows across a table (or across screens) are flagged as TOKEN GAP near
the same missing value, flag the pattern explicitly and propose ONE new token
that resolves all of them — don't list as separate one-off gaps.

---

## 8. Continuity between QA rounds

At the start of every new QA reply, before presenting new tables:
- Re-list any open decisions from the previous message not yet resolved
- Never silently drop a question — carry it forward until explicitly answered

---

## 9. Standing decisions

> Each entry = one judgment call made during a QA session. Append; never edit.

- **Destructive actions** (delete, remove) use `theme.colors.danger` (#EF8B8B)
  — never `primary` or any brand/confirm color, even as "nearest." (2026-07-01)
- **Loading/processing modals are non-dismissable.** No close button. Backdrop
  tap disabled. Applies to: AI quiz generation loading screen. (2026-07-01)
- **Feedback/success/form modals DO get a close button** (top-right × icon,
  `Ionicons "close"`), positioned absolutely. (2026-07-01)
- **Modal scrim is `rgba(255, 255, 255, 0.85)`** — white, not grey. The
  `rgba(229, 231, 235, 0.85)` in QuestionView was the outlier and was fixed.
  (2026-07-01)
- **receivedChip in MyRewardsScreen is a toast** (bottom-sheet notification),
  not the same component as the inline badge in UnlockedRewardItem. Keep
  separate; renamed to `toastChip`/`toastText` in MyRewardsScreen. (2026-07-01)
- **editBtn** (SwipeableRewardCard swipe-reveal) uses `theme.colors.neutralGrey`
  (#E5E7EB) — `border` (#F3F4F6) is too invisible as a button background.
  (2026-07-01)
- **RewardCard title** uses `subheading` (20/28) not `heading + override`.
  Card titles at this scale fit subheading, not the full heading token. (2026-07-01)
- **DesignQABoard / dev-mode UI** is excluded from all QA passes. (2026-07-01)
- **QA canvas stub tiles are static snapshots**, not live components with mocked
  state. They duplicate JSX/styles from the source components. After any change
  to `NewQuizScreen`, `CreateQuizFromPhotoScreen`, `QuestionView`,
  `MyRewardsScreen` modals, or `SwipeableRewardCard`, re-verify against the real
  running app — do not trust the canvas alone for those states. (2026-07-01)

---

## How to use this file day-to-day

1. **Phase 1 (build):** ignore this file entirely — logic first.
2. **Phase 2 (lock tokens):** finalize `src/theme/index.ts` BEFORE any QA.
   Update Section 0 above with actual values.
3. **Phase 3 (per-screen QA):** for each screen, run a QA pass per Section 6,
   referencing this file. Approve rows in bulk for (a), decide manually on (b).
4. **Phase 4 (modals pass):** run Section 5 once all screens are
   token-compliant — modal drift is easiest to spot last.
5. **Phase 5 (subjective UX pass):** separate from token QA entirely — things
   like "is this screen too empty," "does this icon match its label," "is the
   tone right" are not table-able. Do as a freeform critique, not through this
   rules file.
