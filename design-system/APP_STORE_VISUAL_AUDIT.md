# 🧪 PROMPT — APP STORE VISUAL AUDIT (FINAL QUALITY CHECK)

## 🎯 PURPOSE

You are reviewing the **Social Quest React Native + Expo app** after applying DESIGN_SYSTEM_V3.

Your task is to ensure the app feels:

> like a real, premium, shipped product — not an AI-generated UI prototype

---

# 🚨 CRITICAL GOAL

Detect and fix:

* UI inconsistency
* layout drift
* color system violations
* “prototype feel”
* overly generic components

---

# 🧠 1. PRODUCT REALISM TEST

For every screen, ask:

### Q1

Does this screen feel like a shipped product from a real company?

If NO:
→ simplify layout
→ reduce visual noise
→ enforce design system stricter

---

### Q2

Does anything feel “templated” or generic?

Examples:

* default cards everywhere
* repetitive spacing with no hierarchy
* random UI patterns per screen

If YES:
→ redesign screen for intentional structure

---

# 🎨 2. VISUAL CONSISTENCY AUDIT

## Check:

* same spacing system everywhere (8px grid)
* same radius system (20px cards, 18–20px buttons)
* same shadow style
* no random styling overrides

---

## FAIL CONDITIONS:

* mixed border radius styles
* inconsistent card padding
* different button styles across screens

---

# 🟣 3. COLOR SYSTEM AUDIT (V3 STRICT)

Verify:

### Allowed ONLY:

* `#4F8EF7` (primary)
* `#7C8CF8` (correct state)
* `#E5E7EB` (incorrect state)
* `#FFC857` (rewards)
* neutrals

---

## FAIL CONDITIONS:

* any green anywhere ❌
* any red anywhere ❌
* accidental color duplicates
* inline hex values not in system

---

# 🧩 4. LAYOUT QUALITY AUDIT

## CHECK:

### Bento usage:

* ONLY on:

  * category selection
  * rewards
  * settings overview

### Stack usage:

* ONLY on:

  * quiz flow
  * onboarding
  * explanations

---

## FAIL CONDITIONS:

* bento inside quiz flow ❌
* stacked clutter on selection screens ❌
* mixed layout patterns per screen ❌

---

# 🧒 5. CHILD UX CLARITY TEST

For each screen:

Ask:

> Can a 7-year-old understand what to do in under 5 seconds?

If NO:

* reduce text
* increase spacing
* simplify actions

---

# ⚡ 6. INTERACTION QUALITY AUDIT

Check:

* button response feels instant (<100ms visual feedback)
* transitions are smooth (fade/slide only)
* no jarring screen changes

---

## FAIL CONDITIONS:

* laggy navigation
* heavy animations
* missing feedback states

---

# 🎬 7. MOTION AUDIT

Allowed ONLY:

* fade
* subtle slide (≤12px)
* button scale (0.98)
* coin float animation

---

## FAIL CONDITIONS:

* bounce animations
* confetti
* flashy gamification effects
* excessive motion layering

---

# 🧠 8. DESIGN SYSTEM ADHERENCE TEST

For every component:

Check:

* uses DESIGN_SYSTEM_V3
* no inline styling overrides
* no hardcoded spacing outside system
* no “one-off UI fixes”

---

# 🧱 9. COMPONENT ARCHITECTURE AUDIT

Ensure:

* Button component used everywhere
* Card component reused everywhere
* ScreenWrapper used consistently

---

## FAIL CONDITIONS:

* duplicated button styles
* custom ad-hoc cards
* inline UI blocks repeated

---

# 🧭 10. UX FLOW AUDIT

Check full journey:

### Flow must feel:

* New Quiz → clear entry
* Quiz → focused stack experience
* Result → calm reward moment
* Rewards → easy scanning
* Settings → simple control panel

---

## FAIL CONDITIONS:

* confusing navigation loops
* dead ends
* unclear next action

---

# 🧾 FINAL PASS / FAIL CRITERIA

## PASS CONDITIONS:

✔ consistent design system
✔ no red/green legacy colors
✔ strict bento vs stack separation
✔ calm Scandinavian feel achieved
✔ child understands UI instantly
✔ no prototype-like inconsistency

---

## FAIL CONDITIONS:

❌ visual inconsistency
❌ mixed design languages
❌ chaotic layout usage
❌ game-like UI creep
❌ unclear user flows
