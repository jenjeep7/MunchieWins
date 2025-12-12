# MunchieWins

A React Native Expo application built with Tailwind CSS (NativeWind) and Firebase.

## 🚀 Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **NativeWind** - Tailwind CSS for React Native
- **Firebase** - Authentication and Firestore database

## 📋 Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google, etc.)
   - Create a Firestore database
   - Copy your Firebase configuration
   - Update `firebaseConfig.js` with your credentials

3. **Run the app:**
   ```bash
   npm start
   ```

   Then:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
MunchieWins/
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API and Firebase services
│   └── utils/          # Helper functions
├── assets/             # Images, fonts, etc.
├── App.js              # Main app component
├── firebaseConfig.js   # Firebase configuration
├── global.css          # Tailwind CSS imports
└── tailwind.config.js  # Tailwind configuration
```

## 🎨 Using Tailwind CSS

NativeWind allows you to use Tailwind CSS classes in React Native:

```jsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-blue-500 items-center justify-center">
      <Text className="text-white text-2xl font-bold">Hello World</Text>
    </View>
  );
}
```

## 🔥 Firebase Setup

The app is configured to use Firebase for:
- **Authentication** - User login/signup
- **Firestore** - Real-time database

Update your Firebase config in `firebaseConfig.js` before running the app.

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## 🔒 Environment Variables

Create a `.env` file based on `.env.example` for sensitive configuration.

## 📝 Next Steps

1. Set up your Firebase project and update credentials
2. Create your app screens in `src/screens/`
3. Implement authentication flows
4. Add your UI components based on design prototypes
5. Configure navigation between screens

## 🤝 Contributing

This is a private project. Contact the team for contribution guidelines.

## 📄 License

Private and proprietary.
