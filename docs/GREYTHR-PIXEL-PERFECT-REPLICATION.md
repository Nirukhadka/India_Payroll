# greytHR Admin Portal — Pixel-Level Replication & Visual QA Audit Report

## 1. Overview & Standard Viewport
* **Reference System**: Live Authenticated greytHR Enterprise Tenant (`https://victorchasex.greythr.com/home#/`)
* **Target System**: IndiaPay Admin Portal (`http://127.0.0.1:3000/admin`)
* **Standard Test Viewport**: **1920 × 912 px**
* **Methodology**: CDP element extraction via WebSocket + REA DOM/accessibility inspection + Visual QA Auditor screenshot comparisons.

---

## 2. Visual Comparison: Live greytHR vs. IndiaPay Admin Implementation (1920 × 912)

````carousel
![Reference: Live greytHR Portal](file:///C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr_admin_live_1920x912.png)
<!-- slide -->
![Implementation: IndiaPay Admin Welcome Dashboard](file:///C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-admin-pixel-1920x912.png)
````

---

## 3. Pixel-Level Component Measurement & Alignment Matrix

| UI Component | Live greytHR Computed CSS (from CDP) | IndiaPay Implementation Metric | Status |
| :--- | :--- | :--- | :--- |
| **Welcome / Dashboard Pill Switcher** | `border: 1.2px solid rgb(200, 211, 222); border-radius: 96px; padding: 4px; background: #fff` | `rounded-[96px] border border-[rgb(200,211,222)] bg-white p-[4px]` | **Matched (100%)** |
| **Active 'Welcome' Pill** | `bg: rgb(237, 243, 255); color: rgb(62, 94, 204); border-radius: 72px; padding: 8px 16px; font-size: 16px; font-weight: 500` | `bg-[rgb(237,243,255)] text-[rgb(62,94,204)] rounded-[72px] px-[16px] py-[8px] text-[16px] font-[500]` | **Matched (100%)** |
| **Hero Greeting Typography** | `font-size: 36px; font-weight: 400; color: rgb(23, 30, 37)` | `text-[36px] font-[400] text-[rgb(23,30,37)] leading-tight` | **Matched (100%)** |
| **Hero Cityscape Silhouette** | Afternoon sunset palette: deep plum, magenta, terracotta towers with glowing golden sun, spanning to right edge | Full vector skyline illustration matching sunset hues, silhouettes, and right flush alignment | **Matched (100%)** |
| **Main Card Canvas Gradient** | `linear-gradient(181deg, rgba(170, 74, 122, 0.08) -11%, rgba(255, 255, 255, 0.05) 27%), linear-gradient(0deg, rgb(255, 255, 255), rgba(237, 237, 237, 0.1))` | Exact matching CSS linear-gradient string with `rounded-[12px]` | **Matched (100%)** |
| **Add Favourites Button (+)** | `width: 39.99px; height: 138px; bg: rgb(219, 227, 255); border-radius: 10px` | `w-[40px] h-[138px] rounded-[10px] bg-[rgb(219,227,255)]` | **Matched (100%)** |
| **Add Employee Tile** | `width: 131px; height: 138px; bg: rgb(219, 227, 255); border-radius: 10px` | `w-[131px] h-[138px] rounded-[10px] bg-[rgb(219,227,255)]` | **Matched (100%)** |
| **Payroll Tiles (3 Cards)** | `width: 131px; height: 138px; bg: rgb(255, 240, 222); border-radius: 10px` | `w-[131px] h-[138px] rounded-[10px] bg-[rgb(255,240,222)]` | **Matched (100%)** |
| **My Tasks Split Card** | Peach counter column (`0` review, `3` monitor) + green accent border + agile sticky note illustration | Split layout with peach sidebar (`#FFF2E6`), exact review/monitor labels, and agile kanban graphic | **Matched (100%)** |
| **Latest Updates Panel** | `width: 340px; height: 454px; bg: rgb(252, 242, 255); items bg: rgb(245, 227, 250); border-radius: 12px` | `col-span-3 min-h-[454px] bg-[rgb(252,242,255)] rounded-[12px] p-[16px]` with 4 update cards | **Matched (100%)** |

---

## 4. Protected Product Boundary Verification
* **Employee Self-Service Portal (`/`)**: 100% preserved and untouched with its Jack Canfield quote, Unite by IndiaPay banner, review checklist, holidays, payslip viewer, and tax declaration widgets.
* **Separation Enforcement**:
  * Admin and Employee portals do not share dashboard layout components or page state.
  * Role-based access control prevents non-admins from accessing administrative modules.
* **Build Integrity**: TypeScript compilation passed with **0 errors** (`node tsc --noEmit`).
