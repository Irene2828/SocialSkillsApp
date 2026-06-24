# 📄 DESIGN_LINT_RULES.md — Social Quest UI Guardrails

## Purpose

This file defines **hard UI + UX rules** that every screen and component must follow.

Codex must treat these as **build-time validation rules**, not suggestions.

If a component violates these rules → it must be refactored.

---

# 🚨 1. TYPOGRAPHY RULES (STRICT)

## RULE T1 — Font Consistency

* Only use `Inter` (or system fallback SF Pro)
* ❌ No decorative fonts
* ❌ No mixed font families

---

## RULE T2 — Type Scale Enforcement

Allowed sizes only:

* 28px → H1 (screen titles only)
* 22px → H2 (section headers)
* 18px → Body large
* 16px → Body default (minimum allowed body text)
* 14px → secondary text ONLY (rare use)

❌ Any font < 14px is forbidden
❌ Any random font scaling is forbidden

---

## RULE T3 — Text Density Rule

* No screen may contain more than:

  * 2 H1 elements
  * 4 paragraph blocks above 3 lines each

If exceeded → simplify layout.

---

# 🎨 2. COLOR RULES (STRICT)

## RULE C1 — Allowed Colors Only

Must use ONLY:

* `#FAFAF8` (background)
* `#4F8EF7` (primary actions)
* `#48C78E` (success states)
* `#FFC857` (rewards only)
* `#222222` (primary text)
* `#6B7280` (secondary text)

❌ No random hex colors
❌ No inline color guessing
❌ No gradients unless explicitly defined later

---

## RULE C2 — Semantic Color Usage

* Blue → actions only
* Green → correctness only
* Gold → rewards only
* Grey → neutral text only

Violations must be refactored.

---

# 🧱 3. LAYOUT RULES

## RULE L1 — Spacing System

Only allowed spacing:

8 / 16 / 24 / 32 / 48 px

❌ No arbitrary spacing values

---

## RULE L2 — Screen Padding

* Minimum horizontal padding: 20px
* Vertical rhythm must follow 8px grid

---

## RULE L3 — One Primary Action Rule

Each screen must have:

* ONLY ONE primary CTA button

If multiple exist → downgrade secondary actions visually.

---

# 🧩 4. COMPONENT RULES

## RULE C1 — Reusable Components Mandatory

All UI must use:

* Button component
* Card component
* Screen wrapper
* Typography system

❌ No inline-styled UI blocks

---

## RULE C2 — Card Standard

All cards must have:

* borderRadius: 20px
* soft shadow only
* white background
* padding ≥ 16px

---

## RULE C3 — Button Standard

Buttons must:

* height ≥ 48px
* borderRadius ≥ 16px
* have press feedback (scale 0.98)
* use defined color tokens only

---

# 🎯 5. QUIZ COMPONENT RULES

## RULE Q1 — Answer Buttons

Each answer must:

* be full-width card
* have minimum height 44px
* include tap feedback
* show correct/incorrect state clearly

---

## RULE Q2 — Feedback Timing

After answer:

1. Show result (correct/incorrect)
2. Show explanation
3. Require user tap “Continue”

❌ No auto-advance

---

# 🎬 6. ANIMATION RULES

## RULE A1 — Allowed Animations Only

* fade in/out
* slight vertical slide (max 12px)
* scale 0.98 button press
* soft coin float animation

---

## RULE A2 — Forbidden Animations

❌ confetti bursts
❌ bouncing UI
❌ spinning icons
❌ flashing effects
❌ aggressive gamification animations

---

# 🧠 7. UX SIMPLICITY RULES

## RULE U1 — Cognitive Load Limit

Each screen must contain:

* 1 primary action
* 1 supporting action max
* clear hierarchy

---

## RULE U2 — No Clutter Rule

If a screen feels “busy”:
→ remove elements, not reduce size

---

## RULE U3 — Child Readability Rule

If a 7-year-old cannot understand the screen in 5 seconds:
→ redesign required

---

# 🧒 8. CHILD UX SAFETY RULES

## RULE S1 — No Negative Framing

❌ “Wrong answer”
✔ “Let’s try another one”

---

## RULE S2 — No Shame Language

Never use:

* fail
* incorrect
* mistake-heavy tone

Replace with:

* “Nice try”
* “Good effort”
* “Let’s continue”

---

# ⚡ 9. PERFORMANCE RULES

## RULE P1 — No Render Waste

* Avoid unnecessary re-renders in quiz flow
* Memoize heavy components where needed

---

## RULE P2 — Instant Interaction Rule

* Buttons must respond <100ms visually
* Quiz transition must feel immediate

---

# 🧭 10. NAVIGATION RULES

## RULE N1 — No Dead Ends

Every screen must have:

* clear exit path
* clear next step

---

## RULE N2 — Tab Simplicity

Only 3 tabs allowed:

* New Quiz
* Rewards
* Settings

❌ No additional navigation layers

---

# 🧾 FINAL VALIDATION CHECKLIST (MANDATORY)

Before completing any screen, Codex must confirm:

### Typography

* [ ] Only allowed font used
* [ ] Correct type scale applied

### Color

* [ ] Only approved colors used

### Layout

* [ ] 8px spacing system followed
* [ ] One primary action exists

### Components

* [ ] Reusable components used only
* [ ] No inline UI hacks

### UX

* [ ] Screen understandable in 5 seconds
* [ ] No clutter or overload

### Animation

* [ ] Only approved animations used

---

# 🧠 HOW CODEx SHOULD USE THIS

At the end of every screen or feature:

> Run internal checklist validation
> If any rule fails → refactor before finalizing

---

# 🏁 RESULT

If enforced correctly, this ensures:

👉 consistent Scandinavian UI
👉 no “AI-generated mess” look
👉 production-grade design discipline
👉 child-safe UX clarity
👉 app feels intentionally designed, not assembled
