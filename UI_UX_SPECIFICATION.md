# ClientFlow - Complete UI/UX Specification

## Screen-by-Screen Specifications

### 1. Splash / Intro Screen

**Layout:**
- Centered vertical alignment
- Premium logo at center
- Subtext below logo
- Smooth fade-in animation

**Components:**
- **Logo**: Stylized upward-trending bar chart icon in soft gold (#D4AF37)
- **App Name**: "ClientFlow" - Large, bold, modern sans-serif
- **Tagline**: "Smart Client Follow-ups for Finance Consultants" - Smaller, lighter font
- **Background**: Dark gradient (#111217 → #181A20)
- **Effect**: Subtle glowing effects around logo

**Typography:**
- Logo text: 48px, 700 weight
- Tagline: 16px, 400 weight, 60% opacity

---

### 2. Dashboard Screen

**Header Section:**
- **Total Clients Card**
  - Large glass card with gold glow accent
  - "TOTAL CLIENTS" label (14px, uppercase, letter-spacing)
  - Number: 142 (48px, bold, gold color)
  - Optional: "• Floniva" or trend indicator
  - Soft gold glowing background variant

**Follow-ups Today Section:**
- **Card Header**: "Follow-ups Today" with badge count
- **Client List Items**:
  - Circular profile picture (40px)
  - Client name (e.g., "A. Sharma", "M. Chen")
  - Status tags:
    - "Urgent" - Red pill (#FF4444)
    - "Due Soon" - Orange pill (#FF9800)
  - "Call" button - Gray pill
  - Arrow icon on right
  - Glass card background
  - Spacing: 12px between items

**Date Picker Timeline:**
- Horizontal scrollable row
- Date chips: "Mon 16 June", "Tue 12 June", etc.
- Active date: Highlighted with gold background
- Inactive dates: Transparent with border
- Smooth scrolling

**Analytics Section (Optional):**
- Title: "Follow-ups Done vs Upcoming"
- Donut chart visualization
- Dark gray segment (completed)
- Light gray segment (upcoming)
- "+" button for adding follow-ups
- Arrow icon for navigation

**Floating Action Button:**
- Position: Bottom right, 24px from edges
- Size: 56px × 56px
- Icon: "+" symbol (24px)
- Background: Soft gold (#D4AF37)
- Shadow: Gold glow effect
- Animation: Scale on press

---

### 3. Client List Screen

**Search Bar:**
- Full-width glass card at top
- Magnifying glass icon (left)
- "Search" placeholder text
- Border: Subtle glass effect
- Height: 52px

**Filter Tabs:**
- Horizontal row below search
- Pills: "All" (active), "Today", "Upcoming"
- Active: Gold background, dark text
- Inactive: Transparent, gold border
- Spacing: 8px between pills

**Client List:**
- **Client Card**:
  - Glass card background
  - Left: Circular profile picture (48px)
  - Center:
    - Client name (bold, 16px)
    - "Follow-up 16 June" (caption, muted)
    - Bank logo/name (12px, icon + text)
  - Right: Three-dot menu icon
  - Height: 80px
  - Spacing: 12px between cards

**Menu Actions (Expanded):**
- Overlay with blur backdrop
- Action buttons:
  - "Call" - Green (#51CF66)
  - "WhatsApp" - Green (#25D366)
  - "Edit" - Gray
  - "Delete" - Red (#FF6B6B)
- Smooth slide-up animation

---

### 4. New Client Form Screen

**Header:**
- Back arrow (left)
- "New Client" title (center)
- Clean, minimal

**Form Fields (Glass Cards):**
- **Name of Customer**: Text input
- **Name of Co-Applicant**: Text input
- **Contact Number**: Phone input, +91 prefix
- **Referral Source**: Dropdown with options
- **Required Loan Amount**: Numeric input, ₹ symbol
- **Security Information**: Large multiline textarea (6 lines min)
- **Login (Bank Name)**: 
  - Dropdown selector
  - Options: HDFC, ICICI, SBI, etc.
  - Expandable list with search
- **Follow-up Date**:
  - Calendar picker
  - Modal: Bottom sheet
  - Apple-style spinner or grid
  - Selected date highlighted in gold

**Save Button:**
- Floating at bottom right
- Glowing gold background
- Rounded rectangle (24px radius)
- Icon: Checkmark or "Save" text
- Fixed position when scrolling

**Layout:**
- Scrollable form
- 16px padding around cards
- 12px spacing between fields
- Sticky bottom bar for save button

---

### 5. Client Detail Screen

**Header:**
- Back arrow (left)
- Client name (large, bold, 24px)
- Edit button (right, gold text)

**Information Cards:**
- **Contact Card**:
  - Phone icon (left)
  - "Contact" label
  - Phone number (+91 format)
  - Arrow indicator (right)
  
- **Loan Details Card**:
  - Document icon
  - "Loan Details" label
  - Amount display (₹25,00,000)
  - Arrow indicator

- **Security Info Card**:
  - Shield icon
  - "Security Info" label
  - Property information preview
  - Arrow indicator

**Follow-up Date Display:**
- Large circular card
- "16 June" prominently displayed
- Gold accent ring
- Calendar icon overlay

**Action Buttons (Bottom):**
- "Edit" - Secondary pill button (gold border)
- "Delete" - Red pill button
- Horizontal layout
- Spacing: 16px between

---

### 6. Edit Client Screen

**Layout:**
- Identical to New Client Form
- Header: "Edit Client"
- All fields pre-filled with existing data
- Same calendar picker for follow-up date
- Save button: "Save Changes" text

---

### 7. Settings / Notifications Screen

**Layout:**
- Apple-like list style
- Minimal, clean sections

**Toggle Switches:**
- "Push Notifications" - Toggle (iOS/Android style)
- "Email Alerts" - Toggle
- Label on left, toggle on right
- Active: Gold accent

**Reminder Default Time:**
- Section header: "Reminder Default Time"
- Display: "9:00 AM"
- Scrollable time picker below
- Options: Hour intervals (9:00 AM, 10:00 AM, etc.)
- Selected time highlighted

---

## Empty States

### Dashboard Empty
- Illustration: Desk with laptop, lamp, chair (line art style)
- Text: "No clients yet. Tap + to add."
- "Add Client" button (gold, prominent)
- "+" icon in top right corner

### Client List Empty
- Illustration: Person with magnifying glass
- Text: "No clients found"
- "Add Your First Client" button

---

## Component Specifications

### Profile Picture
- **Default**: Gradient circle or placeholder icon
- **Size**: 40px (small), 48px (medium), 64px (large)
- **Border**: 2px gold if active/selected
- **Border Radius**: 50% (circle)

### Badge/Tag
- **Urgent**: Red background (#FF4444), white text, pill shape
- **Due Soon**: Orange background (#FF9800), white text
- **Padding**: 6px horizontal, 4px vertical
- **Font**: 12px, 600 weight

### Status Indicator
- **Dot**: 8px circle
- **Green**: Active/Online
- **Gray**: Inactive
- **Gold**: Priority

---

## Animation Guidelines

### Transitions
- **Screen transition**: 300ms ease-in-out
- **Modal slide-up**: 400ms ease-out
- **Fade in**: 200ms ease-out

### Interactions
- **Button press**: Scale to 0.95, 150ms
- **Card tap**: Scale to 0.98, 150ms
- **Input focus**: Border glow, 300ms

### Loading States
- **Skeleton screens**: Glass cards with shimmer
- **List loading**: Staggered fade-in (100ms delay per item)
- **Form submission**: Button loading spinner

---

## Accessibility

### Color Contrast
- Text on dark background: Minimum 4.5:1 ratio
- Interactive elements: Clear focus states

### Touch Targets
- Minimum 44px × 44px
- Adequate spacing between interactive elements

### Typography
- Scalable text (responds to system settings)
- Minimum readable size: 14px

---

## Responsive Considerations

### iPhone SE / Small Screens
- Reduced padding (12px instead of 16px)
- Smaller font sizes (scale down 1-2px)
- Compact cards

### iPhone Pro Max / Large Screens
- Maximum content width: 600px (centered)
- Increased spacing on sides
- Larger touch targets

---

## Implementation Notes

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Gradients
```css
background: linear-gradient(180deg, #111217 0%, #181A20 100%);
```

### Shadows
- Use platform-specific shadow properties
- iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
- Android: elevation + shadowColor

### Icons
- Use SF Symbols (iOS) or Material Icons (Android)
- Size: 16px, 24px, 32px
- Weight: 1.5px stroke
- Color: Off-white primary, Gold accent

