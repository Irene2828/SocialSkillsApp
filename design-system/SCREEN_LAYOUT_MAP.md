# 🧭 SOCIAL QUEST — SCREEN LAYOUT MAP (FINAL UX CONTRACT)

## Purpose

This document defines:

* exact layout type per screen
* structure rules per screen
* what components are allowed where

👉 Codex must follow this before inventing UI

---

# 🟦 1. NEW QUIZ TAB (HOME)

## Layout Type: HYBRID (BENTO + STACK)

---

## Structure

### TOP SECTION (STACK)

* Greeting (e.g. “Good evening, Mark 👋”)
* Streak card (gradient allowed)
* Coin balance preview (small)

---

### PRIMARY ACTION

* “Start Quick Quiz” button
  👉 FULL WIDTH
  👉 Gradient allowed (primary gradient)

---

### CATEGORY SECTION (BENTO GRID)

2-column grid:

Cards:

* Friendship Skills
* School Manners
* Feelings & Emotions
* Playground Skills
* Safety Basics

Rules:

* icon + title only
* no long text
* tap opens quiz

---

## UX intent:

👉 “Choose quickly or start instantly”

---

# 🟪 2. QUIZ FLOW SCREEN

## Layout Type: STACK ONLY (FOCUS MODE)

---

## Structure

### TOP

* Progress bar (Question 3/10)

---

### MAIN CARD

* Scenario text (large readable block)

---

### ANSWERS (STACKED BUTTONS)

* 3–4 full-width answer cards
* no grid
* no bento
* no distractions

---

### FEEDBACK AREA

After selection:

* Correct / Try Again
* Explanation text

Button:

👉 “Continue”

---

## UX intent:

👉 “Think clearly, no distraction”

---

# 🟨 3. QUIZ COMPLETION SCREEN

## Layout Type: STACK

---

## Structure

* Score card (8/10)
* Coins earned (+1 / +0.5)
* Streak update message

---

### ACTIONS

* “Take Another Quiz”
* “Go to Rewards”

Primary CTA = gradient allowed

---

## UX intent:

👉 “Reward + reflection moment”

---

# 🪙 4. REWARDS TAB

## Layout Type: HYBRID (STACK + BENTO)

---

## TOP SECTION (STACK)

* Coin balance card (large)
* “≈ $X CAD” equivalence (visual only)

---

## REWARD STORE (BENTO GRID)

2-column grid:

Each card:

* icon
* reward name
* coin cost
* redeem button

Examples:

* Ice Cream
* Movie Night
* Bike Ride
* Extra Game Time

---

## UX intent:

👉 “Scan rewards quickly, decide fast”

---

# ⚙️ 5. SETTINGS TAB

## Layout Type: LIGHT BENTO + STACK MIX

---

## STRUCTURE

### CHILD PROFILE (STACK)

* Name
* Age
* Avatar

---

### PARENT CONTROLS (BENTO)

2-column tiles:

* Daily limit
* Reset progress
* Reward editor
* Parent mode toggle

---

## UX intent:

👉 “Simple control panel, not admin dashboard”

---

# 🧠 6. ONBOARDING (FIRST RUN)

## Layout Type: STACK ONLY

---

Screens:

### 1. Welcome

* title + short description

### 2. Child Setup

* name input
* age selector
* avatar picker

### 3. Parent Info

* simple explanation of system

### 4. Start

* “Start First Quiz” CTA

---

## UX intent:

👉 “No confusion, just start”

---

# 🧩 7. DESIGN DECISION MATRIX

| Screen Type       | Layout      |
| ----------------- | ----------- |
| Decision (choose) | Bento       |
| Action (do task)  | Stack       |
| Reflection        | Stack       |
| Settings overview | Light Bento |
| Onboarding        | Stack       |

---

# 🚨 8. STRICT RULES

## RULE 1

Never mix bento + stack inside quiz flow.

---

## RULE 2

Never use bento for:

* questions
* answers
* explanations

---

## RULE 3

Never use stack for:

* category selection
* reward browsing
* settings overview

---

## RULE 4

If unsure:

👉 default to STACK for safety

---

# 🧠 9. PRODUCT LOGIC SUMMARY

This app behaves like:

* Decision moments → Bento
* Learning moments → Stack
* Emotional moments → Stack
* Control moments → Light Bento

---

# 🏁 FINAL RESULT

If Codex follows this correctly:

👉 UI stops drifting
👉 layouts become predictable
👉 app feels intentional
👉 no “AI-generated randomness”
