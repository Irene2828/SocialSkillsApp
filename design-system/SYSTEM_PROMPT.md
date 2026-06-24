## 📄 SYSTEM_PROMPT.md — Social Quest AI Development Rules

You are building a production-quality React Native + Expo + TypeScript app called:

# SOCIAL QUEST

A calm, Scandinavian-inspired social skills learning app for children (7–10 years old).

---

# 🎯 CORE OBJECTIVE

Build a **real, stable, production-ready mobile app** that:

* teaches social skills through quizzes
* rewards learning with a simple coin system
* supports daily habit building (streaks)
* works fully offline
* is safe for children and trusted by parents

---

# 🧠 PRODUCT PHILOSOPHY

This is NOT a game.

This is NOT a toy app.

This is a:

👉 calm learning tool
👉 habit-building system
👉 parent-trusted education product

Tone must always be:

* calm
* minimal
* structured
* encouraging
* never noisy or chaotic

---

# 📐 DESIGN SYSTEM (HARD RULE)

You MUST follow:

👉 DESIGN_SYSTEM.md

If anything conflicts:
➡ DESIGN_SYSTEM wins

---

# 🚨 UI LINT RULES (HARD ENFORCEMENT)

You MUST validate every screen against:

👉 DESIGN_LINT_RULES.md

If any rule is violated:
➡ refactor before completing task

No exceptions.

---

# 🧱 ARCHITECTURE RULES

## Tech Stack

* React Native (Expo)
* TypeScript
* Local storage only (no backend unless explicitly added later)

---

## Required Structure

* /screens
* /components
* /data
* /hooks
* /utils
* /design-system

---

## State Rules

* Keep state minimal and local
* Use predictable state flows
* No unnecessary global state
* No over-engineering

---

# 🧩 COMPONENT RULES

You MUST use reusable components:

* Button
* Card
* ScreenWrapper
* Header
* Quiz components
* Reward components

❌ No inline UI duplication allowed

---

# 🎮 FEATURE RULES

## QUIZ SYSTEM

* 10 questions per quiz
* Multiple choice only
* One correct answer
* Must show explanation after answer
* Must require “Continue” tap

---

## REWARD SYSTEM

* 1 quiz → coins earned
* 8–10 correct → +1 coin
* 6–7 correct → +0.5 coin
* <6 → 0 coins

Coins persist locally.

---

## STREAK SYSTEM

* Tracks daily usage
* Increases only once per day
* Resets if a day is missed

---

# 🧒 CHILD UX RULES

* Must be understandable in 5 seconds
* One action per screen
* Large tap targets
* No dense text blocks
* No complex navigation

---

# 🧑🏫 PARENT UX RULES

* Simple reward management
* Simple limits (daily quiz cap)
* No complex dashboards
* No technical language

---

# 🎬 ANIMATION RULES

Allowed:

* fade
* subtle slide (≤12px)
* scale 0.98 button press
* gentle coin float

Forbidden:

❌ confetti spam
❌ bouncing UI
❌ flashy effects
❌ game-like animations

---

# ⚡ PERFORMANCE RULES

* No unnecessary re-renders in quiz flow
* No lag between question transitions
* Must feel instant and responsive

---

# 🧠 UX PRINCIPLE PRIORITY

In order of importance:

1. Clarity
2. Simplicity
3. Stability
4. Aesthetic polish
5. Gamification (minimal)

---

# 🚫 FORBIDDEN PATTERNS

* Over-engineered architecture
* Complex state systems
* Excessive animations
* Social features (leaderboards, sharing)
* Cloud backend (not allowed in MVP)

---

# 🧾 REQUIRED VALIDATION STEP

Before completing ANY feature:

You MUST verify:

* DESIGN_SYSTEM compliance
* DESIGN_LINT_RULES compliance
* UX simplicity
* Child readability (5-second rule)
* No unnecessary complexity introduced

If any fail → fix before finishing.

---

# 🧭 PRODUCT BEHAVIOR GOAL

The app should feel like:

* IKEA clarity in structure
* JYSK calm retail simplicity
* Headspace emotional calmness
* Duolingo learning clarity

BUT:

* no clutter
* no noise
* no gamification overload

---

# 🏁 FINAL OUTPUT EXPECTATION

Every generated feature must be:

✔ usable immediately
✔ visually consistent
✔ child-readable
✔ parent-trustworthy
✔ production-stable

---

# 🧠 HOW TO USE THIS

This system prompt MUST be active for every Codex session.

It defines:

👉 behavior
👉 architecture
👉 UI rules
👉 UX rules
👉 product philosophy

---

# 🔥 REAL IMPACT OF THIS SETUP

If you use:

* SYSTEM_PROMPT.md
* DESIGN_SYSTEM.md
* DESIGN_LINT_RULES.md

Together → Codex becomes:

👉 consistent
👉 predictable
👉 production-grade
👉 non-chaotic
