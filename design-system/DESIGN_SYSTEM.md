# 📄 DESIGN_SYSTEM.md — Social Quest

## Product Design Direction

Social Quest is a **premium, calm, Scandinavian-inspired learning app for children (7–10 years old)**.

It combines:

* IKEA / JYSK simplicity (structure, whitespace, clarity)
* Modern Apple-level UI polish (typography, spacing, motion)
* Child-friendly warmth (not childish visuals)

The goal is:

> Calm confidence, not gamified chaos.

---

# 🎨 Visual Philosophy

## Core Principles

* Minimal, never cluttered
* One primary action per screen
* High readability over decoration
* Emotion through spacing, not noise
* “Quiet confidence” design tone

Avoid:

* Cartoon UI
* Overly bright colors
* Busy backgrounds
* Excess badges, stars, sparkles

---

# 🧱 Layout System

## Grid

* Base spacing unit: **8px**
* Common spacing:

  * 8 / 16 / 24 / 32 / 48
* Screen padding:

  * 20px horizontal minimum

## Cards

* Border radius: **20px**
* Soft shadow only:

  * low opacity, large blur
* No hard borders unless needed for structure

---

# ✍️ Typography

## Font Choice

Primary:

* **Inter** (or SF Pro fallback)

Optional upgrade direction:

* SF Pro Rounded (for slightly softer child feel)

---

## Type Scale

### H1 (Screen Titles)

* 28px / SemiBold
* Calm, short, max 1 line preferred

### H2 (Sections)

* 20–22px / SemiBold

### Body Text

* 16–18px / Regular
* MUST be readable for children without zooming

### Buttons

* 16px / Medium

---

## Typography Rules

* No ALL CAPS text
* No decorative fonts
* No playful “comic” fonts
* No excessive bolding

---

# 🎨 Color System

## Base Palette

Background:

* `#FAFAF8` (warm off-white)

Primary Blue:

* `#4F8EF7`

Success Green:

* `#48C78E`

Reward Gold:

* `#FFC857`

Text Primary:

* `#222222`

Text Secondary:

* `#6B7280`

---

## Color Rules

* Color only used for meaning
* Never use color for decoration
* Green = correct / success only
* Gold = rewards only
* Blue = actions only

---

# 🧩 Components Style

## Buttons

* Height: 48–56px minimum
* Radius: 16–20px
* Primary button = solid blue
* Secondary = soft grey background

Interaction:

* Press scale: 0.98
* Soft fade transition

---

## Cards

Used for:

* quizzes
* rewards
* progress

Style:

* white background
* soft shadow
* generous padding (16–20px)

---

## Answer Buttons (Quiz)

* Large tap targets (min 44px height)
* Full-width cards
* Clear spacing between options
* Selected state = soft blue highlight

---

# 🎯 Icons

## Style Direction

Use:

* Minimal line icons
* Rounded edges preferred
* Consistent stroke width (1.5–2px)

Avoid:

* Filled emoji-style icons everywhere
* Cartoon icons
* Mixed icon styles

---

## Icon Sources

Preferred:

* Lucide icons
* Feather icons style
* Simple SVG system icons

---

## Icon Tone

Icons should feel:

* calm
* structured
* functional
* not playful or noisy

---

# 🎬 Animation System

## Principles

* Subtle only
* Purpose-driven only
* Never distracting

---

## Allowed Animations

### 1. Button Press

* scale: 0.98

### 2. Screen Transition

* fade + slight slide (8–12px max)

### 3. Coin Earned

* gentle float up + fade out

### 4. Correct Answer

* soft green highlight fade in

---

## Forbidden Animations

* confetti explosions (default)
* bouncing UI
* spinning elements
* heavy gamification effects

---

# 🧠 UX Tone

Microcopy should feel:

* calm
* encouraging
* non-judgmental

Examples:

✔ “Great job!”
✔ “Let’s try another one”
✔ “You’re building a strong skill”

Avoid:

❌ “Wrong answer!”
❌ “Try harder!”
❌ “Game over”

---

# 🧒 Child UX Rules

* Everything must be understandable in <5 seconds
* No reading-heavy screens
* One task per screen
* Immediate feedback after actions
* No confusion loops

---

# 🧭 Interaction Rules

* Always show next step clearly
* No hidden navigation
* No deep menus
* No multi-step forms without guidance

---

# 🏁 Product Feel Target

The app should feel like:

* IKEA simplicity in structure
* JYSK calm retail clarity
* Headspace emotional softness
* Duolingo clarity of learning flow
* Apple-level polish in motion and spacing

---

# 🚫 Anti-Patterns (DO NOT DO)

* No gamified clutter UI
* No noisy reward systems
* No childish cartoon branding
* No competing colors
* No dense dashboards
* No tiny text blocks

---

# 🧩 How Codex should use this file

Every screen must:

* follow spacing rules
* follow typography scale
* use defined colors only
* use approved animation types
* use minimal icon system

If anything conflicts → this file wins.

---

# RESULT GOAL

When applied correctly:

👉 App feels calm, premium, and trustworthy
👉 Child can understand UI instantly
👉 Parent feels safe using it daily
👉 Product feels “designed”, not “generated”
