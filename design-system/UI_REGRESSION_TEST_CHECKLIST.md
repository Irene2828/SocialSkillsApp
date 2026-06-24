# 🧪 SOCIAL QUEST — UI REGRESSION TEST CHECKLIST

## Purpose

Before ANY commit or feature completion, Codex must verify that:

* design system is still intact
* layout rules were not violated
* UX simplicity is preserved
* no accidental UI drift happened

If anything fails → fix before finishing.

---

# 🚨 1. LAYOUT REGRESSION TEST

## L1 — Correct Layout Type Per Screen

Verify:

* New Quiz → HYBRID (bento + stack)
* Quiz Flow → STACK ONLY
* Rewards → HYBRID
* Settings → LIGHT BENTO + STACK
* Onboarding → STACK ONLY

❌ If mismatch → refactor layout immediately

---

## L2 — No Mixed Layout Violation

Check:

* No bento inside quiz flow ❌
* No stacked clutter on selection screens ❌
* No hybrid randomness inside a single section ❌

---

## L3 — One Screen = One Purpose

Each screen must answer ONE question:

* Choose something?
* Do something?
* Review something?
* Adjust something?

If multiple → split screen

---

# 🎨 2. DESIGN SYSTEM REGRESSION

## D1 — Typography Rules

Check:

* Only Inter / SF Pro used
* No font < 14px
* No random scaling
* Only approved type scale used

---

## D2 — Color Token Validation

Allowed only:

* `#FAFAF8`
* `#4F8EF7`
* `#48C78E`
* `#FFC857`
* `#222222`
* `#6B7280`

❌ Any new color = automatic failure

---

## D3 — Gradient Usage Check

Gradients allowed ONLY in:

* primary CTA buttons
* streak highlight cards
* reward highlights

If used elsewhere → remove

---

# 🧱 3. COMPONENT REGRESSION

## C1 — Reusable Component Enforcement

Verify:

* Buttons use Button component
* Cards use Card component
* Screens use ScreenWrapper

❌ No inline UI duplication allowed

---

## C2 — Card Consistency

All cards must have:

* radius: 20px
* soft shadow
* white background
* consistent padding

---

## C3 — Button Consistency

All buttons must:

* respect size rules (≥48px height)
* show press feedback
* use correct color system

---

# 🧠 4. UX REGRESSION CHECK

## U1 — One Primary Action Rule

Each screen must have:

✔ ONE primary CTA only

If multiple → downgrade secondary actions

---

## U2 — 5-Second Clarity Rule

Ask:

> Can a 7-year-old understand this screen in 5 seconds?

If no → simplify UI

---

## U3 — Cognitive Load Check

If screen contains:

* too much text
* too many choices
* competing actions

→ reduce immediately

---

# 🧒 5. CHILD UX SAFETY CHECK

## S1 — Language Tone

Check:

❌ “Wrong”
✔ “Let’s try again”

❌ “Failure”
✔ “Nice effort”

---

## S2 — Emotional Safety

Ensure:

* no shame language
* no punishment tone
* no competitive pressure

---

# 🎬 6. ANIMATION REGRESSION CHECK

## A1 — Allowed Only

✔ fade
✔ soft slide (≤12px)
✔ button press scale
✔ coin float animation

---

## A2 — Forbidden

❌ confetti spam
❌ bouncing UI
❌ flashy effects
❌ game-style transitions

---

# ⚡ 7. PERFORMANCE REGRESSION

Check:

* quiz transitions are instant
* no lag when switching tabs
* no repeated re-renders in quiz loop
* no memory leaks in navigation

---

# 🧭 8. NAVIGATION REGRESSION

Ensure:

* only 3 tabs exist:

  * New Quiz
  * Rewards
  * Settings

❌ no hidden navigation layers
❌ no dead-end screens

---

# 🧾 FINAL PRE-COMMIT CHECKLIST

Codex MUST confirm:

### Layout

* [ ] Correct layout type per screen
* [ ] No mixed layout violations

### Design System

* [ ] Only allowed colors used
* [ ] Typography rules respected
* [ ] Gradient rules respected

### Components

* [ ] Reusable components used
* [ ] No inline UI duplication

### UX

* [ ] One primary action per screen
* [ ] 5-second child understanding test passed

### Safety

* [ ] No negative emotional language
* [ ] No confusing UI states

### Performance

* [ ] Smooth navigation
* [ ] No unnecessary re-renders

---

# 🧠 HOW TO USE THIS

Before finishing ANY feature:

👉 Run this checklist mentally or via Codex prompt
👉 If any rule fails → fix before commit

---

# 🏁 WHAT THIS GIVES YOU

This system ensures:

✔ no design drift over time
✔ no accidental “game UI creep”
✔ consistent Scandinavian product feel
✔ stable UX for real child usage
✔ App Store-level discipline

---

# 🔥 REAL IMPACT (IMPORTANT)

With all your files now:

* DESIGN_SYSTEM_V2
* LINT RULES
* SCREEN MAP
* SYSTEM PROMPT
* REGRESSION CHECKLIST

You’ve essentially built:

👉 a **self-governing design system for an AI-coded app**

That’s the same structure real product teams use — just simplified.
