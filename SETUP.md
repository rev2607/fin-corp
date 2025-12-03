# Quick Setup Guide

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create placeholder assets** (optional but recommended):
   - Add `icon.png` (1024x1024) to `assets/` folder
   - Add `splash.png` to `assets/` folder
   - Add `adaptive-icon.png` (1024x1024) to `assets/` folder
   - See `assets/README.md` for details

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device:**
   - Install Expo Go app on your iOS/Android device
   - Scan the QR code shown in the terminal
   - The app will load on your device

## First Run

1. The app will request notification permissions on first launch
2. Allow notifications for follow-up reminders to work
3. Start by adding your first client using the "New Client" button

## Troubleshooting

### Common Issues

1. **"Module not found" errors:**
   - Delete `node_modules` folder
   - Run `npm install` again
   - Clear Expo cache: `expo start -c`

2. **Notifications not working:**
   - Check notification permissions in device settings
   - Ensure the app has permission to send notifications
   - Try restarting the app

3. **Date picker not showing:**
   - On Android, the native date picker should appear
   - On iOS, a modal with a spinner should appear
   - If issues persist, check console for errors

### Development Tips

- Use Expo DevTools for debugging (press `j` in terminal)
- Check device logs for errors
- Reload app by shaking device and selecting "Reload"
- Clear AsyncStorage data by uninstalling/reinstalling the app

## Next Steps

1. Customize the theme colors in `theme/index.ts`
2. Adjust notification time (currently 9:00 AM) in `services/notifications.ts`
3. Add more bank names in `components/BankPicker.tsx`
4. Customize app metadata in `app.json`

## Building for Production

When ready to publish:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS (requires Apple Developer account)
eas build --platform ios
```

For more details, see the main README.md file.

