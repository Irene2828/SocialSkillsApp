# 📄 DESIGN_SYSTEM.md — Social Quest (Bento + Scandinavian Hybrid)

## 🧠 Product Design Direction

Social Quest is a **premium calm learning app for children (7–10)**.

It blends:

* Scandinavian clarity (IKEA / JYSK logic)
* Modern UI structure (bento layouts where appropriate)
* Apple-level polish (spacing + motion)
* Child-readable simplicity

---

# ⚖️ CORE DESIGN RULE

> **Clarity always wins over aesthetics.**

If a visual decision reduces understanding → it is wrong.

---

# 🧩 1. LAYOUT SYSTEM (HYBRID RULE)

## 🟦 STACK LAYOUT (FOCUS MODE)

Use stack layout for:

* Quiz questions
* Answer selection screens
* Completion screens (results)
* Explanations
* Any step-by-step flow

### Stack rules:

* vertical flow only
* one primary action
* no competing cards
* maximum focus

👉 Goal: “Think clearly”

---

## 🟪 BENTO LAYOUT (CHOICE MODE)

Use bento grid ONLY for:

* quiz category selection
* rewards store
* settings overview
* dashboard/home overview

### Bento rules:

* 2-column grid preferred
* cards must be visually equal weight
* no dense text inside tiles
* each tile = one concept only

👉 Goal: “Choose quickly”

---

## 🚫 FORBIDDEN

* bento inside quiz flow
* stacked clutter on home screen
* mixed layouts on same screen without reason

---

# 🎨 2. COLOR SYSTEM (REFINED)

## Base palette (unchanged core)

Background:

* `#FAFAF8`

Text:

* `#222222`
* `#6B7280`

Primary:

* `#4C1D95`

Success:

* `#48C78E`

Reward:

* `#FFC857`

---

## 🌫️ NEW: GRADIENT SYSTEM (CONTROLLED)

### Gradient Rule

Gradients are allowed ONLY in:

* primary CTA buttons
* streak highlight cards
* reward highlight states

---

### Gradient A (Primary Action)

Use for:

* “Start Quick Quiz”
* “Continue”
* “Redeem”

```css
#A78BFA → #4C1D95
```

---

### Gradient B (Soft Premium Accent)

Use for:

* streak cards
* highlight states

```css
#A5B4FC → #60A5FA
```

---

## 🚫 Forbidden gradient usage

* quiz answers
* backgrounds
* full-screen fills
* decorative UI elements

---

# ✍️ 3. TYPOGRAPHY SYSTEM (UNCHANGED BUT STRICTER)

Font:

* Inter (or SF Pro fallback)

### Type scale:

* H1: 28px / SemiBold
* H2: 22px / SemiBold
* Body: 16–18px / Regular
* Secondary: 14px max

---

### Typography rule:

> If text is not necessary for decision-making → remove it

---

# 🧱 4. COMPONENT DESIGN RULES

## Buttons

* height: 48–56px
* radius: Full pill (9999px) (Primary) / 18–20px (Secondary)
* primary = gradient allowed
* secondary = flat

---

## Cards

* radius: 20px
* soft shadow only
* white background
* no heavy borders

---

## Bento Cards

Rules:

* equal sizing grid
* icon + title only
* max 1–2 lines text
* no complex UI inside card

---

# 🎮 5. SCREEN DESIGN LOGIC

## HOME / NEW QUIZ → BENTO SCREEN

Structure:

* Streak card (top highlight)
* Quick Start button (primary CTA)
* Category bento grid

---

## QUIZ FLOW → STACK SCREEN

Structure:

* progress bar
* scenario card
* answers (stacked buttons)
* explanation section

---

## REWARDS → BENTO HYBRID

* wallet at top (stack)
* reward grid (bento)

---

## SETTINGS → BENTO LIGHT

* grouped options in small cards
* no deep nesting

---

# 🎬 6. ANIMATION SYSTEM (REFINED)

Allowed:

* fade
* soft slide (max 12px)
* button press scale (0.98)
* coin float up (very subtle)

---

## Forbidden:

* confetti explosions
* bouncing UI
* flashy reward effects
* game-like transitions

---

# 🧒 7. CHILD UX RULES (UNCHANGED)

* understand in <5 seconds
* no dense text blocks
* one action per screen
* immediate feedback

---

# 🧠 8. UX PRINCIPLE PRIORITY

1. Clarity
2. Cognitive simplicity
3. Emotional calm
4. Visual polish
5. Gamification (minimal)

---

# 🧭 9. PRODUCT FEEL TARGET

The app should feel like:

* IKEA structure (clarity, no clutter)
* JYSK calm retail layout logic
* Headspace emotional calmness
* Duolingo learning clarity (not gamification overload)

---

# 🚫 ANTI-PATTERNS (IMPORTANT)

* no full-bento apps
* no full-stack apps
* no gradient everywhere
* no decorative UI noise
* no mixed visual systems on same screen

---

# 🏁 FINAL RULE

> Bento is for decisions.
> Stack is for thinking.

---

# 🔥 WHAT THIS FIXES FOR YOU

This version prevents:

* Codex overusing bento everywhere
* gradient chaos
* “game app” look
* inconsistent UI direction

And enforces:

👉 premium Scandinavian product design discipline
👉 clear UX hierarchy
👉 real App Store-level structure thinking
