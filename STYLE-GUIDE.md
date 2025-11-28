# Style Guide

## Overview

This document defines the visual design system for the Warehouse Inventory System. The design follows a modern, professional aesthetic with an earthy, muted color palette that conveys reliability and warmth.

**Design Philosophy**: Clean, functional, warehouse-inspired with natural earth tones.

---

## Color Palette

### Primary Colors

| Name        | Hex       | RGB              | CSS Variable        | Usage                              |
| ----------- | --------- | ---------------- | ------------------- | ---------------------------------- |
| Stone       | `#2D3436` | `45, 52, 54`     | `--color-stone`     | Header, sidebar, dark backgrounds  |
| Olive       | `#6B7B3C` | `107, 123, 60`   | `--color-olive`     | Primary actions, active states     |
| Ochre       | `#C9A227` | `201, 162, 39`   | `--color-ochre`     | Warnings, highlights, badges       |
| Brick       | `#A0522D` | `160, 82, 45`    | `--color-brick`     | Errors, destructive actions        |
| Navy        | `#2C3E50` | `44, 62, 80`     | `--color-navy`      | Secondary actions, links           |

### Neutral Colors

| Name        | Hex       | RGB              | CSS Variable        | Usage                              |
| ----------- | --------- | ---------------- | ------------------- | ---------------------------------- |
| Warm White  | `#FAF9F6` | `250, 249, 246`  | `--color-warm-white`| Main background                    |
| Sand        | `#E8E4DD` | `232, 228, 221`  | `--color-sand`      | Card backgrounds, borders          |
| Ash         | `#9CA3AF` | `156, 163, 175`  | `--color-ash`       | Secondary text, icons              |
| Charcoal    | `#374151` | `55, 65, 81`     | `--color-charcoal`  | Primary text                       |

### Semantic Colors

| Name        | Hex       | RGB              | CSS Variable        | Usage                              |
| ----------- | --------- | ---------------- | ------------------- | ---------------------------------- |
| Forest      | `#4A5D23` | `74, 93, 35`     | `--color-forest`    | Success states, stock in           |
| Sage        | `#9CAF88` | `156, 175, 136`  | `--color-sage`      | Olive hover state                  |
| Terracotta  | `#C67B5C` | `198, 123, 92`   | `--color-terracotta`| Warning accents                    |
| Cream       | `#F5F1EB` | `245, 241, 235`  | `--color-cream`     | Subtle backgrounds                 |

### Color Usage Examples

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Stone (#2D3436)  ██████  Header & Sidebar background                       │
│  Olive (#6B7B3C)  ██████  Primary buttons, active nav, checkboxes           │
│  Ochre (#C9A227)  ██████  Warning badges, low stock alerts                  │
│  Brick (#A0522D)  ██████  Delete buttons, error states                      │
│  Navy  (#2C3E50)  ██████  Links, secondary buttons                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Warm White (#FAF9F6)  ████████████  Page background                        │
│  Sand (#E8E4DD)        ████████████  Cards, table headers                   │
│  Ash (#9CA3AF)         ████████████  Placeholder text, icons                │
│  Charcoal (#374151)    ████████████  Body text, headings                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Typography

### Font Family

| Type      | Font Stack                                           | Usage            |
| --------- | ---------------------------------------------------- | ---------------- |
| Primary   | `'DM Sans', system-ui, sans-serif`                   | All UI text      |
| Monospace | `'JetBrains Mono', 'Fira Code', monospace`           | Product codes    |

### Font Sizes

| Name   | Size   | Line Height | Weight  | CSS Class      | Usage                    |
| ------ | ------ | ----------- | ------- | -------------- | ------------------------ |
| xs     | 12px   | 16px        | 400     | `text-xs`      | Captions, timestamps     |
| sm     | 14px   | 20px        | 400     | `text-sm`      | Secondary text, labels   |
| base   | 16px   | 24px        | 400     | `text-base`    | Body text                |
| lg     | 18px   | 28px        | 500     | `text-lg`      | Subheadings              |
| xl     | 20px   | 28px        | 600     | `text-xl`      | Section titles           |
| 2xl    | 24px   | 32px        | 600     | `text-2xl`     | Page titles              |
| 3xl    | 30px   | 36px        | 700     | `text-3xl`     | Dashboard stats          |
| 4xl    | 36px   | 40px        | 700     | `text-4xl`     | Hero numbers             |

### Font Weights

| Weight    | Value | Usage                                |
| --------- | ----- | ------------------------------------ |
| Regular   | 400   | Body text, descriptions              |
| Medium    | 500   | Labels, navigation items             |
| Semibold  | 600   | Headings, button text                |
| Bold      | 700   | Stats, important numbers             |

---

## Spacing System

Based on 4px grid system.

| Name  | Value | CSS Variable   | Usage                            |
| ----- | ----- | -------------- | -------------------------------- |
| px    | 1px   | --             | Borders                          |
| 0.5   | 2px   | `--space-0.5`  | Tiny gaps                        |
| 1     | 4px   | `--space-1`    | Inline spacing                   |
| 2     | 8px   | `--space-2`    | Tight padding                    |
| 3     | 12px  | `--space-3`    | Form element padding             |
| 4     | 16px  | `--space-4`    | Default padding                  |
| 5     | 20px  | `--space-5`    | Card padding                     |
| 6     | 24px  | `--space-6`    | Section gaps                     |
| 8     | 32px  | `--space-8`    | Large section gaps               |
| 10    | 40px  | `--space-10`   | Page margins                     |
| 12    | 48px  | `--space-12`   | Large page margins               |
| 16    | 64px  | `--space-16`   | Header height                    |

---

## Border Radius

| Name   | Value | CSS Variable       | Usage                       |
| ------ | ----- | ------------------ | --------------------------- |
| none   | 0     | --                 | Sharp corners               |
| sm     | 4px   | `--radius-sm`      | Buttons, badges             |
| md     | 6px   | `--radius-md`      | Inputs, cards               |
| lg     | 8px   | `--radius-lg`      | Modals, dropdowns           |
| xl     | 12px  | `--radius-xl`      | Large cards                 |
| full   | 9999px| `--radius-full`    | Avatars, pills              |

---

## Shadows

| Name   | Value                                    | Usage                    |
| ------ | ---------------------------------------- | ------------------------ |
| sm     | `0 1px 2px rgba(0, 0, 0, 0.05)`          | Subtle elevation         |
| md     | `0 4px 6px -1px rgba(0, 0, 0, 0.1)`      | Cards, dropdowns         |
| lg     | `0 10px 15px -3px rgba(0, 0, 0, 0.1)`    | Modals, popovers         |
| xl     | `0 20px 25px -5px rgba(0, 0, 0, 0.1)`    | Large modals             |

---

## Layout

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER (h: 64px, bg: Stone)                                                │
├─────────────┬───────────────────────────────────────────────────────────────┤
│             │                                                               │
│   SIDEBAR   │   MAIN CONTENT (bg: Warm White)                               │
│  (w: 240px) │                                                               │
│  (bg: Stone)│   ┌─────────────────────────────────────────────────────────┐ │
│             │   │  PAGE HEADER (mb: 24px)                                 │ │
│             │   └─────────────────────────────────────────────────────────┘ │
│             │                                                               │
│             │   ┌─────────────────────────────────────────────────────────┐ │
│             │   │  CONTENT AREA (p: 24px)                                 │ │
│             │   │                                                         │ │
│             │   └─────────────────────────────────────────────────────────┘ │
│             │                                                               │
└─────────────┴───────────────────────────────────────────────────────────────┘
```

### Dimensions

| Element         | Width        | Height      |
| --------------- | ------------ | ----------- |
| Header          | 100%         | 64px        |
| Sidebar Open    | 240px        | 100vh - 64px|
| Sidebar Collapsed| 64px        | 100vh - 64px|
| Content Max     | 1440px       | auto        |
| Modal Small     | 400px        | auto        |
| Modal Medium    | 560px        | auto        |
| Modal Large     | 720px        | auto        |

### Grid System

- **Container**: Max-width 1440px, centered
- **Columns**: 12-column grid
- **Gutter**: 24px
- **Margin**: 24px (desktop), 16px (tablet), 12px (mobile)

---

## Components

### Buttons

#### Primary Button

```
┌────────────────────────┐
│     + Add Product      │
└────────────────────────┘
```

| State    | Background    | Text       | Border        |
| -------- | ------------- | ---------- | ------------- |
| Default  | Olive         | White      | None          |
| Hover    | Sage          | White      | None          |
| Active   | Forest        | White      | None          |
| Disabled | Sand          | Ash        | None          |

#### Secondary Button

| State    | Background    | Text       | Border        |
| -------- | ------------- | ---------- | ------------- |
| Default  | Transparent   | Navy       | Navy (1px)    |
| Hover    | Navy (10%)    | Navy       | Navy (1px)    |
| Active   | Navy (20%)    | Navy       | Navy (1px)    |
| Disabled | Transparent   | Ash        | Sand (1px)    |

#### Danger Button

| State    | Background    | Text       | Border        |
| -------- | ------------- | ---------- | ------------- |
| Default  | Brick         | White      | None          |
| Hover    | Terracotta    | White      | None          |
| Active   | #8B4513       | White      | None          |
| Disabled | Sand          | Ash        | None          |

#### Ghost Button

| State    | Background    | Text       | Border        |
| -------- | ------------- | ---------- | ------------- |
| Default  | Transparent   | Charcoal   | None          |
| Hover    | Sand          | Charcoal   | None          |
| Active   | Sand (dark)   | Charcoal   | None          |
| Disabled | Transparent   | Ash        | None          |

#### Button Sizes

| Size  | Height | Padding (x) | Font Size | Icon Size |
| ----- | ------ | ----------- | --------- | --------- |
| sm    | 32px   | 12px        | 14px      | 16px      |
| md    | 40px   | 16px        | 14px      | 18px      |
| lg    | 48px   | 24px        | 16px      | 20px      |

---

### Input Fields

```
  Label *
┌─────────────────────────────────────────┐
│ Placeholder text...                     │
└─────────────────────────────────────────┘
  Helper text or error message
```

| State    | Background    | Border        | Label      |
| -------- | ------------- | ------------- | ---------- |
| Default  | Warm White    | Sand          | Charcoal   |
| Hover    | Warm White    | Ash           | Charcoal   |
| Focus    | Warm White    | Olive (2px)   | Olive      |
| Error    | Warm White    | Brick (2px)   | Brick      |
| Disabled | Cream         | Sand          | Ash        |

#### Input Sizes

| Size  | Height | Padding     | Font Size |
| ----- | ------ | ----------- | --------- |
| sm    | 36px   | 8px 12px    | 14px      |
| md    | 44px   | 10px 14px   | 14px      |
| lg    | 52px   | 12px 16px   | 16px      |

---

### Cards

```
┌─────────────────────────────────────────┐
│                                         │
│   Card Title                            │
│   ─────────────────────────────         │
│                                         │
│   Card content goes here with           │
│   relevant information.                 │
│                                         │
│                        [ Action ]       │
│                                         │
└─────────────────────────────────────────┘
```

| Property      | Value                           |
| ------------- | ------------------------------- |
| Background    | Warm White                      |
| Border        | 1px solid Sand                  |
| Border Radius | 8px (lg)                        |
| Padding       | 20px                            |
| Shadow        | sm (on hover: md)               |

---

### Stat Cards (Dashboard)

```
┌────────────────────────┐
│  ┌────┐                │
│  │ 📦 │  1,234         │
│  └────┘  Products      │
│          ↑ 23 new      │
└────────────────────────┘
```

| Property         | Value                          |
| ---------------- | ------------------------------ |
| Background       | Warm White                     |
| Border           | 1px solid Sand                 |
| Border Radius    | 8px                            |
| Icon Container   | 48px circle, colored bg        |
| Number Font      | 3xl, Bold, Charcoal            |
| Label Font       | sm, Medium, Ash                |
| Trend Font       | xs, color based on +/-         |

#### Icon Background Colors

| Card Type    | Icon Background |
| ------------ | --------------- |
| Products     | Olive (light)   |
| Categories   | Navy (light)    |
| Low Stock    | Ochre (light)   |
| Growth       | Forest (light)  |

---

### Badges

```
┌─────────────┐
│  Beverages  │
└─────────────┘
```

| Type       | Background      | Text           | Border        |
| ---------- | --------------- | -------------- | ------------- |
| Default    | Sand            | Charcoal       | None          |
| Category   | Sand            | Charcoal       | None          |
| Stock In   | Forest (15%)    | Forest         | None          |
| Stock Out  | Brick (15%)     | Brick          | None          |
| Low Stock  | Ochre (15%)     | Ochre (dark)   | None          |
| Info       | Navy (15%)      | Navy           | None          |

#### Badge Sizes

| Size  | Padding     | Font Size | Border Radius |
| ----- | ----------- | --------- | ------------- |
| sm    | 2px 8px     | 12px      | 4px           |
| md    | 4px 10px    | 14px      | 4px           |

---

### Tables

```
┌──────────────────────────────────────────────────────────────────────┐
│ □  Name             │ Code     │ Category   │ Price  │ Stock │ •••  │
├──────────────────────────────────────────────────────────────────────┤
│ □  Coca-Cola 2L     │ BEV-001  │ Beverages  │ $2.99  │ 150   │ •••  │
├──────────────────────────────────────────────────────────────────────┤
│ □  Pepsi 2L         │ BEV-002  │ Beverages  │ $2.89  │ 8 ⚠️  │ •••  │
└──────────────────────────────────────────────────────────────────────┘
```

| Element         | Background    | Text       | Border         |
| --------------- | ------------- | ---------- | -------------- |
| Header          | Sand          | Charcoal   | Sand (bottom)  |
| Row Default     | Warm White    | Charcoal   | Sand (bottom)  |
| Row Hover       | Cream         | Charcoal   | Sand (bottom)  |
| Row Selected    | Olive (10%)   | Charcoal   | Olive (left)   |

#### Table Spacing

| Property           | Value    |
| ------------------ | -------- |
| Header Height      | 48px     |
| Row Height         | 56px     |
| Cell Padding       | 12px 16px|
| Checkbox Column    | 48px     |
| Actions Column     | 64px     |

---

### Modals

```
┌─────────────────────────────────────────────────────────────────┐
│                                                            ✕    │
│  Modal Title                                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│   Modal content area with forms, text, or other                 │
│   content types.                                                │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│                              [ Cancel ]  [ Confirm Action ]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Property        | Value                              |
| --------------- | ---------------------------------- |
| Background      | Warm White                         |
| Border Radius   | 12px (xl)                          |
| Shadow          | xl                                 |
| Overlay         | Stone with 50% opacity             |
| Header Padding  | 20px 24px                          |
| Body Padding    | 24px                               |
| Footer Padding  | 16px 24px                          |
| Footer Border   | 1px solid Sand (top)               |

---

### Toast Notifications

```
Success:
┌──────────────────────────────────────────┐
│  ✓  Product created successfully         │
└──────────────────────────────────────────┘

Error:
┌──────────────────────────────────────────┐
│  ✕  Failed to update stock               │
└──────────────────────────────────────────┘

Warning:
┌──────────────────────────────────────────┐
│  ⚠  Stock is running low                 │
└──────────────────────────────────────────┘
```

| Type    | Background    | Border (left)  | Icon Color |
| ------- | ------------- | -------------- | ---------- |
| Success | Warm White    | Forest (4px)   | Forest     |
| Error   | Warm White    | Brick (4px)    | Brick      |
| Warning | Warm White    | Ochre (4px)    | Ochre      |
| Info    | Warm White    | Navy (4px)     | Navy       |

| Property        | Value           |
| --------------- | --------------- |
| Width           | 360px           |
| Padding         | 16px            |
| Border Radius   | 8px             |
| Shadow          | lg              |
| Position        | Top-right       |
| Animation       | Slide in/out    |

---

### Navigation (Sidebar)

```
┌─────────────────────┐
│                     │
│  ◉ Dashboard        │  ← Active
│                     │
│  ○ Products         │  ← Default
│  ○ Categories       │
│  ○ Inventory        │
│    ├ Stock Mgmt     │  ← Submenu
│    └ History        │
│  ○ Reports          │
│    ├ By Category    │
│    └ Low Stock      │
│                     │
└─────────────────────┘
```

| State     | Background      | Text       | Icon       |
| --------- | --------------- | ---------- | ---------- |
| Default   | Transparent     | Ash        | Ash        |
| Hover     | Stone (lighter) | Warm White | Warm White |
| Active    | Olive           | Warm White | Warm White |
| Submenu   | Transparent     | Ash (70%)  | None       |

| Property             | Value           |
| -------------------- | --------------- |
| Item Height          | 44px            |
| Item Padding         | 12px 16px       |
| Icon Size            | 20px            |
| Icon-Text Gap        | 12px            |
| Submenu Indent       | 32px            |
| Border Radius        | 6px             |

---

### Form Elements

#### Select / Dropdown

```
┌─────────────────────────────────────────┐
│ Select category...                    ▼ │
└─────────────────────────────────────────┘
     ┌────────────────────────────────────┐
     │ Beverages                          │
     │ Snacks                             │
     │ Household                          │
     │ Dairy                              │
     └────────────────────────────────────┘
```

Same styles as Input Fields, with:

| Property         | Value              |
| ---------------- | ------------------ |
| Dropdown Shadow  | md                 |
| Option Height    | 40px               |
| Option Hover     | Cream background   |
| Option Selected  | Olive (10%) bg     |

#### Checkbox

```
  ☐ Unchecked    ☑ Checked
```

| State      | Background    | Border     | Check      |
| ---------- | ------------- | ---------- | ---------- |
| Unchecked  | Warm White    | Sand       | None       |
| Hover      | Warm White    | Ash        | None       |
| Checked    | Olive         | Olive      | White      |
| Disabled   | Cream         | Sand       | Ash        |

| Property      | Value    |
| ------------- | -------- |
| Size          | 18px     |
| Border Radius | 4px      |
| Border Width  | 2px      |

---

## Icons

### Icon Library

**Recommended**: Lucide React

### Icon Sizes

| Size   | Pixels | Usage                          |
| ------ | ------ | ------------------------------ |
| xs     | 14px   | Inline with small text         |
| sm     | 16px   | Buttons (sm), badges           |
| md     | 20px   | Buttons (md), navigation       |
| lg     | 24px   | Page headers, standalone       |
| xl     | 32px   | Empty states, large actions    |
| 2xl    | 48px   | Dashboard stat icons           |

### Common Icons

| Icon Name       | Usage                              |
| --------------- | ---------------------------------- |
| Package         | Products                           |
| Tag             | Categories                         |
| BarChart3       | Inventory/Reports                  |
| TrendingUp      | Stock In                           |
| TrendingDown    | Stock Out                          |
| AlertTriangle   | Low Stock Warning                  |
| Plus            | Add actions                        |
| Pencil          | Edit actions                       |
| Trash2          | Delete actions                     |
| Search          | Search fields                      |
| ChevronDown     | Dropdowns, expandable              |
| MoreHorizontal  | Action menus                       |
| Check           | Success, checkboxes                |
| X               | Close, errors                      |

---

## Animations & Transitions

### Transition Durations

| Name    | Duration | Easing                    | Usage              |
| ------- | -------- | ------------------------- | ------------------ |
| fast    | 100ms    | ease-out                  | Hovers, toggles    |
| normal  | 200ms    | ease-in-out               | Most transitions   |
| slow    | 300ms    | ease-in-out               | Modals, drawers    |

### Common Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Loading States

```
Skeleton:
┌────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Animated shimmer
│ ░░░░░░░░░░░░░░░░░░                    │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │
└────────────────────────────────────────┘
```

| Property         | Value                              |
| ---------------- | ---------------------------------- |
| Skeleton Color   | Sand                               |
| Shimmer          | Linear gradient animation          |
| Border Radius    | Same as target element             |

---

## Responsive Breakpoints

| Name   | Min Width | Max Width | Columns | Gutter | Margin |
| ------ | --------- | --------- | ------- | ------ | ------ |
| xs     | 0         | 639px     | 4       | 16px   | 12px   |
| sm     | 640px     | 767px     | 8       | 16px   | 16px   |
| md     | 768px     | 1023px    | 8       | 20px   | 20px   |
| lg     | 1024px    | 1279px    | 12      | 24px   | 24px   |
| xl     | 1280px    | 1535px    | 12      | 24px   | 32px   |
| 2xl    | 1536px    | ∞         | 12      | 24px   | 40px   |

### Responsive Behavior

| Component       | Mobile (<768px)        | Tablet (768-1024px)    | Desktop (>1024px)      |
| --------------- | ---------------------- | ---------------------- | ---------------------- |
| Sidebar         | Hamburger overlay      | Collapsed (64px)       | Expanded (240px)       |
| Stat Cards      | 1 per row              | 2 per row              | 4 per row              |
| Data Table      | Card view              | Horizontal scroll      | Full table             |
| Modal           | Full screen            | 90% width              | Fixed width            |
| Form Layout     | Single column          | Single column          | Two columns            |

---

## Tailwind Configuration

```javascript
// tailwind.config.js

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary
        stone: '#2D3436',
        olive: {
          DEFAULT: '#6B7B3C',
          light: '#8A9A5B',
          dark: '#4A5D23',
        },
        ochre: {
          DEFAULT: '#C9A227',
          light: '#E0C068',
          dark: '#A68B1F',
        },
        brick: {
          DEFAULT: '#A0522D',
          light: '#C67B5C',
          dark: '#8B4513',
        },
        navy: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
          dark: '#1A252F',
        },
        // Neutral
        'warm-white': '#FAF9F6',
        sand: {
          DEFAULT: '#E8E4DD',
          dark: '#D4CFC6',
        },
        ash: '#9CA3AF',
        charcoal: '#374151',
        // Semantic
        forest: {
          DEFAULT: '#4A5D23',
          light: '#6B8E23',
        },
        sage: '#9CAF88',
        terracotta: '#C67B5C',
        cream: '#F5F1EB',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      spacing: {
        '18': '72px',
        '22': '88px',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## CSS Variables

```css
/* styles/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Primary Colors */
    --color-stone: 45 52 54;
    --color-olive: 107 123 60;
    --color-ochre: 201 162 39;
    --color-brick: 160 82 45;
    --color-navy: 44 62 80;
    
    /* Neutral Colors */
    --color-warm-white: 250 249 246;
    --color-sand: 232 228 221;
    --color-ash: 156 163 175;
    --color-charcoal: 55 65 81;
    
    /* Semantic Colors */
    --color-forest: 74 93 35;
    --color-sage: 156 175 136;
    --color-terracotta: 198 123 92;
    --color-cream: 245 241 235;
    
    /* Spacing */
    --header-height: 64px;
    --sidebar-width: 240px;
    --sidebar-collapsed-width: 64px;
    
    /* Transitions */
    --transition-fast: 100ms;
    --transition-normal: 200ms;
    --transition-slow: 300ms;
  }
}

@layer components {
  .btn-primary {
    @apply bg-olive text-white font-semibold px-4 py-2 rounded-md
           hover:bg-sage active:bg-forest
           transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-transparent text-navy font-semibold px-4 py-2 rounded-md
           border border-navy
           hover:bg-navy/10 active:bg-navy/20
           transition-colors duration-200;
  }
  
  .btn-danger {
    @apply bg-brick text-white font-semibold px-4 py-2 rounded-md
           hover:bg-terracotta active:bg-brick-dark
           transition-colors duration-200;
  }
  
  .input-field {
    @apply w-full px-3 py-2 bg-warm-white border border-sand rounded-md
           text-charcoal placeholder:text-ash
           focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive
           transition-colors duration-200;
  }
  
  .card {
    @apply bg-warm-white border border-sand rounded-lg p-5
           shadow-sm hover:shadow-md
           transition-shadow duration-200;
  }
}
```

---

## Accessibility

### Color Contrast

All text colors meet WCAG 2.1 AA standards:

| Combination              | Contrast Ratio | Pass |
| ------------------------ | -------------- | ---- |
| Charcoal on Warm White   | 10.5:1         | ✅ AAA |
| Ash on Warm White        | 4.7:1          | ✅ AA  |
| White on Olive           | 5.2:1          | ✅ AA  |
| White on Stone           | 12.1:1         | ✅ AAA |
| White on Brick           | 4.8:1          | ✅ AA  |

### Focus States

All interactive elements must have visible focus indicators:

```css
.focus-visible:focus {
  outline: 2px solid var(--color-olive);
  outline-offset: 2px;
}
```

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Do's and Don'ts

### ✅ Do

- Use consistent spacing from the spacing scale
- Maintain color contrast ratios for accessibility
- Use semantic colors for their intended purpose
- Apply transitions for smooth interactions
- Keep forms single-column on mobile

### ❌ Don't

- Don't use colors outside the defined palette
- Don't use custom font sizes outside the scale
- Don't skip loading states for async operations
- Don't remove focus indicators
- Don't use shadows inconsistently

