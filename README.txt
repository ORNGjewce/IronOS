IRON//OS Phase 1 — UI patch

This ZIP contains ONLY src/WorkoutSessions.tsx and src/phase1.css, plus this README.

Changes:
- Higher-contrast NASA-inspired workout UI and unified workout buttons
- Add Exercise moved to end of exercise list
- Enlarged active rest countdown
- Custom discard confirmation with clear labels
- Expandable workout history showing exercise names and each recorded set
- No storage key changes, no versionCode changes, no Atlas/nutrition changes

INSTALL:
1. Ensure your full backup was made.
2. Extract the ZIP to C:\iron-os (preserve src/ subfolder).
3. Add `import './phase1.css';` to src/main.tsx after its last CSS import.
4. Run npm run build, npx cap sync android, npx cap open android.
5. Test on Pixel before Google Play upload.

Note: UI design is based on the uploaded source snapshot; no local Android build was performed here.
