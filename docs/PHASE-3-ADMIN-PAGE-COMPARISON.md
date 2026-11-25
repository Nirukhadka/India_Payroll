# Phase 3 — Admin Portal Page Comparison

## 1. Viewport Standard & Reference Artifacts
* **Reference Viewport**: 1920 × 912 px
* **greytHR Reference Screenshot**: `greythr-reference.png`
* **IndiaPay Admin Implementation Screenshot**: `indiapay-welcome-admin-1920x912.png`

---

## 2. Visual & Structural Comparison Matrix

| Component Area | greytHR Reference (Observed CDP Evidence) | IndiaPay Admin Portal Implementation | Visual Fidelity Assessment |
|---|---|---|---|
| **Header** | White bar, 9-dot App Launcher, brand logo, pill Search ("Search Anything" + `Ctrl+K`), AI trigger, Settings, Power icon. | Clean white bar, Grid launcher with Quick Launcher modal, VICTOR CHASEX logo, rounded Search pill with `Ctrl+K`, Sparkles AI button, Settings, Logout. | **Matched (High Fidelity)** |
| **Tab Switcher** | Centered pill switch: `Welcome` and `Dashboard`. | Centered rounded-full pill button toggling between Welcome screen and Operational Dashboard. | **Matched (Identical Layout)** |
| **Welcome Hero** | Peach/cream gradient card, "Good Afternoon, Let's do great things together. 🚀 🌟", city skyline & transit train vector illustration. | Matches typography, greeting text, subtitle, and original city skyline vector graphic. | **Matched (Identical Composition)** |
| **My Favourites** | Vertical "+" shortcut button, 4 colored tiles: Add Employee (blue), Process Payroll (peach), Update Payroll Data (peach), Salary statement for a month (peach). | Vertical "+" button opening command palette, 4 tiles matching colors, icons, subtitles, and direct routes. | **Matched (High Fidelity)** |
| **My Tasks** | Split card with peach left sidebar (`0 Things to review`, `3 Things to monitor`), green accent border, Leave monitor link, and planning board illustration. | Split container with peach sidebar, review/monitor counts, green status accent line, and agile whiteboard vector graphic. | **Matched (High Fidelity)** |
| **Latest Updates** | Lavender right sidebar (`#FAF5FF`) with top navigation arrow and 4 date-stamped announcement cards. | Lavender sidebar matching dimensions, arrow link to `/compliance`, and 4 announcement cards. | **Matched (Identical Composition)** |
| **Help Links** | Bottom horizontal row of pill buttons: Community, Statutory Compliances, Knowledge Centre, Resource Centre, Videos, Academy, Audio Guides. | Horizontal row of pill action badges linking to `/helpdesk`, `/compliance`, and `/documents`. | **Matched (High Fidelity)** |

---

## 3. Discrepancy & Visual Tuning Log
* **Brand Assets**: Original IndiaPay branding and customized vector graphics are used in place of proprietary greytHR corporate assets.
* **Responsive Scaling**: Mobile viewports gracefully collapse the right updates column beneath the main workspace while preserving the header and pill toggle.
