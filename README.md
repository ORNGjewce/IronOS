# IRON//OS Android starter — v0.1

This is a functional **prototype**, not a finished fitness or anatomical product.

## Included
- NASA-punk styled responsive interface, five tabs.
- Rotatable, zoomable **simplified 3D muscle-group mannequin** with tappable regions. It is **not an anatomically accurate muscle atlas**.
- Six illustrative exercise mappings (not yet independently source-verified).
- Local workout set logging (reps and kg) and basic activity totals.
- Manual food notes (not a nutrition database).
- JSON export of records.

## Important limitations
- The starter uses **localStorage**, not SQLite. SQLite and database migrations are the next infrastructure milestone; do not rely on this prototype for durable long-term records.
- No import/restore yet, no real anatomical asset, no barcode lookup, no nutritional calculations.
- The 3D mannequin is a technical proof of rotation, selection and exercise lookup only.
- No Android APK is bundled. Generate the Android project on your PC using the commands below.

## Windows setup
Install Node.js 22 LTS, Android Studio with Android SDK, and a supported JDK (JDK 21 recommended). Extract this zip to `C:\iron-os`.

```powershell
cd C:\iron-os
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

For subsequent changes:
```powershell
cd C:\iron-os
npm install
npm run build
npx cap sync android
npx cap open android
```

In Android Studio, select **Build > Build Bundle(s) / APK(s) > Build APK(s)**. The generated debug APK should appear under `android\app\build\outputs\apk\debug\`.

## Next milestone
Replace localStorage with SQLite, introduce proper schema and migration handling, and import an appropriately licensed anatomical model with separately selectable muscle meshes and verified exercise-to-muscle mapping.
