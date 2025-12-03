# FinCorp CRM

A premium, minimal CRM-style mobile app for finance consultants to manage clients and track follow-ups. Built with React Native and Expo SDK 54.

## Features

- **Client Management**: Store and manage client information including customer details, co-applicants, contact numbers, loan amounts, and security information
- **Follow-up Tracking**: Schedule and track follow-up dates with automatic notifications
- **Search Functionality**: Quickly find clients by name, phone number, or bank
- **Beautiful UI**: Dark mode interface with glassmorphism design, smooth animations, and premium aesthetics
- **Push Notifications**: Automated reminders at 9:00 AM on follow-up dates
- **Local Storage**: All data stored locally using AsyncStorage (no cloud required)

## Tech Stack

- **Expo SDK 54** (managed workflow)
- **React Native** with TypeScript
- **React Navigation** (Stack Navigator)
- **AsyncStorage** for local data persistence
- **Expo Notifications** for scheduled push notifications
- **date-fns** for date manipulation
- **React Native Reanimated** for smooth animations

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app installed on your iOS/Android device (for testing)

## Installation

1. Install dependencies:
```bash
npm install
```

**Note:** If you encounter version conflicts, use Expo's install command to automatically get compatible versions:
```bash
npx expo install --fix
```

This will ensure all Expo packages are compatible with SDK 54.

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Project Structure

```
fin-corp/
├── components/          # Reusable UI components
│   ├── GlassCard.tsx
│   ├── PrimaryButton.tsx
│   ├── InputField.tsx
│   ├── DatePickerField.tsx
│   └── BankPicker.tsx
├── screens/            # Screen components
│   ├── DashboardScreen.tsx
│   ├── ClientListScreen.tsx
│   ├── NewClientScreen.tsx
│   ├── EditClientScreen.tsx
│   └── ClientDetailScreen.tsx
├── services/           # Business logic
│   ├── storage.ts      # AsyncStorage operations
│   └── notifications.ts # Push notification scheduling
├── hooks/              # Custom React hooks
│   └── useClients.ts
├── navigation/         # Navigation setup
│   └── AppNavigator.tsx
├── theme/              # Design system
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    └── idGenerator.ts
```

## Usage

### Adding a New Client

1. Tap "New Client" button on the Dashboard
2. Fill in required fields (marked with *)
3. Select follow-up date if needed
4. Tap "Save Client"

### Managing Follow-ups

- Follow-ups scheduled for today appear on the Dashboard
- Notifications are automatically scheduled for 9:00 AM on follow-up dates
- Edit or delete clients from the Client Detail screen

### Searching Clients

- Navigate to "All Clients"
- Use the search bar to filter by name, phone, or bank

## Data Model

Each client includes:
- Name of Customer (required)
- Name of Co-Applicant (optional)
- Contact Number (required, 10 digits)
- Referral (optional)
- Required Loan Amount (optional)
- Security Information (optional, multiline)
- Login Bank Name (required)
- Follow-up Date (optional)

## Notifications

The app requests notification permissions on first launch. Notifications are scheduled for 9:00 AM local time on follow-up dates. If a client is deleted or follow-up date is cleared, the notification is automatically canceled.

## Design

- **Color Scheme**: Dark backgrounds (#111217, #181A20) with gold (#D4AF37) and blue (#5B9BD5) accents
- **Typography**: Clean, modern font stack optimized for readability
- **Animations**: Smooth transitions and micro-interactions for premium feel
- **Glassmorphism**: Subtle transparency effects on cards

## Building for Production

To create a production build:

```bash
expo build:android
# or
expo build:ios
```

## Notes

- This app is designed for mobile devices only (not optimized for tablets)
- All data is stored locally - no cloud backup included
- Designed for managing ~10-20 clients (suitable for small finance consultants)
- No authentication required (single user app)

## License

Private project
