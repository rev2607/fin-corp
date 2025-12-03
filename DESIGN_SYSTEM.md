# ClientFlow Design System Specification

## Color Palette

### Primary Colors
- **Dark Grey Gradient Start**: `#111217`
- **Dark Grey Gradient End**: `#181A20`
- **Soft Gold (Accent)**: `#D4AF37` / `#E8C547` (light variant)
- **Pale Blue (Focus)**: `#5B9BD5` / `#7BB3E0` (light variant)
- **Off-White (Text)**: `#FFFFFF` / `#F5F5F5`

### Semantic Colors
- **Success**: `#51CF66`
- **Error/Warning**: `#FF6B6B`
- **Urgent**: `#FF4444`
- **Due Soon**: `#FF9800`

### Glassmorphism
- **Card Background**: `rgba(255, 255, 255, 0.05)` - `rgba(255, 255, 255, 0.08)`
- **Border**: `rgba(255, 255, 255, 0.1)`
- **Focus Border**: `rgba(212, 175, 55, 0.5)`

## Typography

### Font Family
- **Primary**: SF Pro (iOS) / Inter (Android)
- **Fallback**: System default sans-serif

### Font Scales
- **H1/Display**: 32px, 700 weight, -0.5 letter-spacing
- **H2/Title**: 24px, 600 weight, -0.3 letter-spacing
- **H3/Heading**: 20px, 600 weight
- **Body**: 16px, 400 weight
- **Body Bold**: 16px, 600 weight
- **Caption**: 14px, 400 weight
- **Small**: 12px, 400 weight

### Line Heights
- **Tight**: 1.2 (headings)
- **Normal**: 1.5 (body)
- **Loose**: 1.6 (large text blocks)

## Spacing System

Base unit: 4px

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px
- **xxxl**: 64px

## Border Radius

- **Small**: 8px (buttons, tags)
- **Medium**: 12px (inputs)
- **Large**: 16px (cards)
- **XL**: 24px (large cards)
- **Pill**: 9999px (badges, pills)

## Shadows & Elevation

### Soft Shadows
```css
shadowColor: '#000000'
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.1
shadowRadius: 4
elevation: 2
```

### Medium Shadows
```css
shadowColor: '#000000'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.15
shadowRadius: 8
elevation: 4
```

### Glow Effects (Gold)
```css
shadowColor: '#D4AF37'
shadowOffset: { width: 0, height: 0 }
shadowOpacity: 0.3
shadowRadius: 12
elevation: 8
```

## Components

### Input Field
- **Background**: Glass card with blur
- **Border**: 1px, `rgba(255, 255, 255, 0.1)`
- **Border Radius**: 12px
- **Padding**: 16px vertical, 16px horizontal
- **Height**: 52px minimum
- **Focus State**: Gold border glow, `rgba(212, 175, 55, 0.5)`

### Dropdown
- Same styling as Input Field
- **Icon**: Downward chevron, gold color
- **Options**: Glass card overlay with blur backdrop

### Date Picker
- **Trigger**: Input field style
- **Modal**: Bottom sheet with blur backdrop
- **Calendar**: Apple-style spinner or grid
- **Selected Date**: Gold highlight

### Card
- **Background**: `rgba(255, 255, 255, 0.05)`
- **Border**: 1px, `rgba(255, 255, 255, 0.1)`
- **Border Radius**: 16px
- **Padding**: 16px
- **Shadow**: Medium shadow
- **Hover State**: `rgba(255, 255, 255, 0.08)`

### Button

#### Primary (Glowing Gold)
- **Background**: `#D4AF37`
- **Text**: Dark (`#111217`)
- **Padding**: 16px vertical, 24px horizontal
- **Border Radius**: 24px
- **Shadow**: Gold glow
- **Press State**: Scale 0.95, slightly darker

#### Secondary (Pill)
- **Background**: Transparent
- **Border**: 2px, gold
- **Text**: Gold
- **Border Radius**: Pill shape
- **Padding**: 12px vertical, 20px horizontal

### Badge/Tag

#### Urgent
- **Background**: Red (`#FF4444`)
- **Text**: White
- **Shape**: Pill
- **Padding**: 6px horizontal, 4px vertical

#### Due Soon
- **Background**: Orange (`#FF9800`)
- **Text**: White
- **Shape**: Pill

## Icons

### Size Scale
- **Small**: 16px
- **Medium**: 24px
- **Large**: 32px
- **XLarge**: 48px

### Style
- **Line weight**: 1.5px
- **Color**: Off-white for primary, Gold for accent
- **Stroke**: Round caps and joins

## Animations & Transitions

### Duration
- **Fast**: 150ms
- **Normal**: 300ms
- **Slow**: 500ms

### Easing
- **Standard**: `ease-in-out`
- **Entrance**: `ease-out`
- **Exit**: `ease-in`

### Effects
- **Fade In**: Opacity 0 → 1
- **Slide Up**: TranslateY 20px → 0
- **Scale**: Scale 0.95 → 1 (button press)
- **Glow Pulse**: Shadow opacity animation

## Layout Patterns

### Screen Padding
- **Horizontal**: 16px (md)
- **Vertical**: 24px (lg)

### Card Spacing
- **Between Cards**: 16px (md)
- **Card Content Gap**: 12px

### Section Spacing
- **Between Sections**: 24px (lg)

### Floating Action Button
- **Position**: Bottom right, 24px from edges
- **Size**: 56px × 56px
- **Shadow**: Large glow
- **Icon**: + symbol, 24px

## Empty States

### Illustration Style
- Minimal line art
- Off-white color, 40% opacity
- Centered, 200px × 200px max

### Text
- **Title**: H3, center aligned
- **Description**: Body, muted, center aligned
- **Action Button**: Primary gold button

## Micro-interactions

### Button Press
1. Scale down to 0.95
2. Darken background by 10%
3. Return on release

### Input Focus
1. Border color transition to gold
2. Subtle glow effect
3. Label scale to 1.05

### Card Tap
1. Scale to 0.98
2. Increase shadow
3. Return on release

## Status Indicators

### Profile Picture
- **Size**: 40px × 40px
- **Border Radius**: 50%
- **Border**: 2px, gold (if active)
- **Default**: Gradient or placeholder icon

### Notification Badge
- **Size**: 20px × 20px
- **Background**: Red
- **Text**: White, 12px
- **Position**: Top-right of icon

