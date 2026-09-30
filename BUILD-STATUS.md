# Build/check status

- `npm ci`: succeeded; 1,371 packages installed. `npm audit` reported 36 advisories in the inherited dependency tree (1 low, 26 moderate, 9 high).
- `npx tsc --noEmit`: passed with 0 TypeScript errors.
- `CI=true npx jest --silent --runInBand`: passed, 31/31 suites and 179/179 tests.
- `npx expo prebuild --platform android --no-install`: succeeded; Android project regenerated for `com.ngotakstreamqxfilm`.
- Full `assembleDebug`/APK build was **not run**: this environment has Java 11 and no Android SDK (`sdkmanager`/`ANDROID_HOME` absent). Use JDK 17+ and Android SDK 36 locally to verify/build.

This is an editable source rebuild based on a related public React Native project and the target APK's identity/assets. It is not the original source tree and is not claimed to be a byte-for-byte or feature-for-feature match to the NgotakStreamQxFilm APK. The original APK has no source maps or project Gradle configuration.
