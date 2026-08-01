# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Design QA Rules

Read `docs/design-qa.md` in full before any design or visual QA work.
This file contains the token source of truth, standing decisions, and the
required QA table format. Never re-litigate items in Section 9.

# Skill: Premium Mobile Typography

## Core Principle

Default to **Regular** or **Medium** font weights. Treat **Bold** as an exception, not the default.

The goal is to create interfaces that feel quiet, premium, spacious, and confident rather than loud or attention-seeking.

---

## Why

On small mobile screens, especially 375pt-wide layouts, bold text creates unnecessary visual density.

Bold typography:

* Makes counters (e.g. inside "a", "e", "o") appear smaller.
* Feels optically tighter, even with identical letter spacing.
* Increases the overall visual weight of the interface.
* Makes layouts feel cramped and less refined.

Regular typography:

* Preserves whitespace within and around letterforms.
* Feels calmer and more premium.
* Improves perceived spacing.
* Allows content to breathe.

Always judge typography on an actual mobile viewport rather than a desktop monitor or zoomed Figma canvas.

---

## Hierarchy Philosophy

Do **not** rely on font weight as the primary hierarchy tool.

Instead, establish hierarchy using:

* Font size
* Vertical spacing
* White space
* Grouping
* Alignment
* Contrast
* Layout

A well-spaced Regular heading is often stronger and more elegant than an unnecessarily Bold heading.

---

## Default Weight Strategy

Prefer:

* Body text → Regular
* Labels → Regular
* Secondary information → Regular
* Section headings → Medium
* Navigation labels → Regular or Medium
* Buttons → Medium
* Page titles → Medium or Semibold only when appropriate

Avoid Bold unless it communicates genuinely higher importance.

---

## Premium Design Principle

Premium interfaces communicate through restraint.

Avoid making every important element louder.

Instead, create confidence through:

* generous spacing
* clear hierarchy
* restrained typography
* consistent rhythm
* visual balance

The interface should feel calm, intentional, and effortless.

---

## Agent Behavior

Whenever generating or modifying mobile UI:

* Default typography to Regular.
* Challenge unnecessary Bold text.
* If Bold is used, confirm it serves a meaningful hierarchy purpose.
* First improve spacing, sizing, or layout before increasing font weight.
* Evaluate the overall "visual noise" of the screen, not individual components.
* Optimize for a quiet, premium reading experience rather than maximum emphasis.

Assume that reducing unnecessary visual weight generally improves perceived quality on mobile devices.

# Systemic Fix Rule

Never patch only the currently visible route, screen, or viewport when a shared component, token, layout primitive, or responsive rule may be responsible.

Before applying any visual or layout fix, the agent must:

1. **Search for all usages** of the affected component, token, or style before editing anything.
2. **Identify the root cause** — is it a shared component, layout wrapper, design token, breakpoint rule, or genuinely screen-specific?
3. **Default to shared.** Only classify as screen-specific after proving it is not shared.
4. **Fix at the shared level**, not at the page or screen level.
5. **Preserve intentional exceptions.** If a screen deliberately differs, document why and leave it intact.
6. **Verify every affected surface** — every route or screen that renders the affected component, not just the one currently visible.
7. **Report what was checked** — list the surfaces verified, the widths or devices tested, and the specific observations made.

If the problem genuinely affects only one route or screen, document why before applying a screen-specific fix.
