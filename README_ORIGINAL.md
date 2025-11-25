# 🌟 Dreamz - Interactive Story App

Eine filmreife, animierte Story-App mit **Choice-Based Storytelling** für iOS und Android, gebaut mit **React Native**.

## ✨ Features

- 🎬 **Cinematic Experience**: Hochwertige visuelle Story-Erzählung ohne Game Engine
- 🎭 **Choice-Based Storytelling**: Deine Entscheidungen formen die Geschichte
- 🎨 **Lottie-Animationen**: Leichte, performante Animationen für magische Effekte
- 📱 **Cross-Platform**: Funktioniert auf iOS und Android
- 🎮 **Inventar-System**: Sammle und verwende Items in der Story
- 💾 **Progress-Tracking**: Automatisches Speichern deines Fortschritts
- 🌈 **Smooth Transitions**: Flüssige Übergänge zwischen Szenen

## 🏗️ Projektstruktur

```
Dreamz/
├── src/
│   ├── components/          # Wiederverwendbare UI-Komponenten
│   │   ├── LottieAnimation.tsx
│   │   ├── ChoiceButton.tsx
│   │   └── InventoryModal.tsx
│   ├── screens/            # App-Screens
│   │   └── StoryScreen.tsx
│   ├── navigation/         # Navigation-Setup
│   │   └── AppNavigator.tsx
│   ├── engine/            # Story-Engine Logic
│   │   └── StoryEngine.ts
│   ├── data/              # Story-Daten & JSON
│   │   └── storyData.json
│   └── assets/            # Medien-Assets
│       ├── lottie/        # Lottie-Animationsdateien
│       └── images/        # Hintergrundbilder
├── App.tsx
└── package.json
```

## 🚀 Getting Started

### Voraussetzungen

- Node.js (v20.19.4+)
- npm oder yarn
- React Native Entwicklungsumgebung
  - Für iOS: Xcode (macOS only)
  - Für Android: Android Studio + Android SDK

### Installation

1. **Dependencies installieren:**

   ```bash
   cd Dreamz
   npm install
   ```

2. **iOS Pods installieren (nur macOS):**

   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **App starten:**

   **Android:**

   ```bash
   npm run android
   ```

   **iOS (macOS only):**

   ```bash
   npm run ios
   ```

   **Metro Bundler separat starten:**

   ```bash
   npm start
   ```

## 📖 Story-System

### Story-Graph (JSON-basiert)

Die gesamte Story wird in `src/data/storyData.json` definiert:

```json
{
  "scenes": {
    "scene_id": {
      "title": "Szenen-Titel",
      "background": "background_name",
      "animations": [...],
      "text": "Story-Text",
      "choices": [...]
    }
  }
}
```

### Szenen-Struktur

Jede Szene kann enthalten:

- **Background**: Hintergrundbild
- **Animations**: Array von Lottie-Animationen
- **Character**: Optional - Charakter-Sprite mit Animation
- **Text**: Story-Text für die Szene
- **Sound**: Optional - Hintergrund-Audio
- **Choices**: Array von Entscheidungen

### Neue Szenen hinzufügen

1. Füge eine neue Szene in `storyData.json` hinzu
2. Definiere die Choices mit `nextScene`-IDs
3. Füge Assets (Bilder, Lottie-Files) zum `assets`-Ordner hinzu

## 🎨 Animationen

### Lottie-Animationen verwenden

1. **Download Lottie-Files:**

   - [LottieFiles.com](https://lottiefiles.com) - Kostenlose & Premium Animationen
   - Suche nach: Sparkles, Magic, Particles, Forest, etc.

2. **Lottie-File hinzufügen:**

   ```
   src/assets/lottie/animation_name.json
   ```

3. **In Story verwenden:**
   ```json
   "animations": [
     {
       "type": "lottie",
       "source": "animation_name",
       "position": "overlay"
     }
   ]
   ```

### Positions-Optionen

- `overlay`: Über dem gesamten Screen
- `background`: Hinter allem
- `character`: Bei der Charakter-Position
- `center`: Zentriert im Screen

## 🎮 Story Engine API

### Story Engine Grundlagen

```typescript
import { StoryEngine } from './src/engine/StoryEngine';
import storyData from './src/data/storyData.json';

const engine = new StoryEngine(storyData);

// Aktuelle Szene laden
const scene = engine.getCurrentScene();

// Entscheidung treffen
const nextScene = engine.makeChoice('choice_id');

// Inventar verwalten
engine.addInventoryItem({ id: 'item1', name: 'Magischer Stein' });
engine.removeInventoryItem('item1');

// Progress speichern/laden
const saveData = engine.saveProgress();
engine.loadProgress(saveData);
```

## 🎯 Nächste Schritte

### Assets hinzufügen

1. **Hintergrundbilder:**

   - Erstelle hochauflösende Artworks (z.B. mit Midjourney, DALL·E)
   - Speichere in `src/assets/images/`
   - Update `getBackgroundSource()` in `StoryScreen.tsx`

2. **Lottie-Animationen:**

   - Download von LottieFiles oder erstelle eigene in After Effects
   - Speichere in `src/assets/lottie/`
   - Update `getAnimationSource()` in `LottieAnimation.tsx`

3. **Sound-Effekte:**
   - Installiere: `npm install react-native-sound`
   - Füge Audio-Files hinzu
   - Implementiere Sound-Player

### Erweitere die Story

- Füge mehr Szenen in `storyData.json` hinzu
- Erstelle verzweigte Story-Pfade
- Implementiere Multiple Endings
- Füge Character-Dialoge hinzu
- Baue Mini-Games ein

### Weitere Features

- ⚙️ Einstellungen-Screen (Musik, Sounds, Sprache)
- 💾 Cloud-Speicherung (Firebase)
- 🏆 Achievements System
- 📊 Statistiken & Analytics
- 🌍 Mehrsprachigkeit (i18n)
- 🎵 Background-Musik & Sound-Effekte

## 📚 Ressourcen

- **Animationen:**

  - [LottieFiles](https://lottiefiles.com)
  - [Adobe After Effects](https://www.adobe.com/products/aftereffects.html)

- **Artworks:**

  - [Midjourney](https://midjourney.com)
  - [DALL·E](https://openai.com/dall-e)
  - [Stable Diffusion](https://stability.ai)

- **Sound:**

  - [Freesound](https://freesound.org)
  - [Epidemic Sound](https://www.epidemicsound.com)

- **React Native:**
  - [React Native Docs](https://reactnative.dev)
  - [React Navigation](https://reactnavigation.org)
  - [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)

## 🛠️ Technologie-Stack

- **Framework**: React Native 0.82
- **Navigation**: React Navigation 6.x
- **Animationen**: Lottie, React Native Reanimated
- **State Management**: React Hooks
- **TypeScript**: Für Type-Safety

## 🤝 Entwicklung

### Code-Style

- TypeScript für alle neuen Files
- Functional Components mit Hooks
- Props mit Interfaces definieren
- Aussagekräftige Kommentare

### Best Practices

- Komponenten klein und wiederverwendbar halten
- Story-Logik in der Engine, nicht in UI-Komponenten
- Assets lazy-loaden für bessere Performance
- Animationen optimieren (Lottie > Video > GIF)

## 📱 Build & Deployment

### Android APK bauen

```bash
cd android
./gradlew assembleRelease
```

APK findet sich in: `android/app/build/outputs/apk/release/`

### iOS Build (macOS only)

```bash
cd ios
xcodebuild -workspace Dreamz.xcworkspace -scheme Dreamz -configuration Release
```

Oder öffne in Xcode und baue über die GUI.

## 📝 Lizenz

Dieses Projekt ist ein Template/Starter-Kit für eigene Story-Apps.

---

**Viel Spaß beim Erstellen deiner eigenen magischen Story! ✨**

_Erstellt mit ❤️ und React Native_
