# NgotakStream Qx — editable React Native reconstruction

This is a clean React Native/Expo project based on the public NgotakStream Qx source reconstruction and adapted to the NgotakStream Qx application ID and branding. The original NgotakStream Qx v1.0.3-fixed release provides only an APK, not its original TypeScript/JSX project or build files, so this is a source-based rebuild/template—not a byte-for-byte recovery of the original project.

## Edit UI/UX
- Main app screens: `src/screens/`
- Reusable UI: `src/components/`
- Theme tokens/providers: `src/theme/`
- Navigation and route wiring: `src/App.tsx`
- App configuration: `app.config.js`

The source includes an Adult/Hentai section inherited from the NgotakStream Qx project; that section was not detected in the NgotakStream Qx release APK. Remove `AdultSection` routes and associated code if you want a closer feature match to the NgotakStream Qx APK, or keep it as a starting feature.

## Setup / checks
Requires Node.js, npm, JDK 17+, and Android SDK 36 for Android builds.

```bash
npm ci
npm test
npm run prebuild
npm run android
```

The checked-in `android/` folder is an Expo prebuild project; run Gradle/build from Android Studio or a configured Android SDK environment. This sandbox does not have Android SDK/JDK 17, so a release APK build has not been verified here.

## Attribution
This project remains derived from AirFlix/Vega and the public NgotakStream Qx reconstruction. Keep `NOTICE`, `THIRD_PARTY_NOTICES.md`, and `LICENSE` with the project.
