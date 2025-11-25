# 🌟 Dreamz - Interactive Story App (Expo)

Eine filmreife, animierte Story-App mit **Choice-Based Storytelling** für iOS, Android und Web, gebaut mit **Expo & React Native**.

## ✨ Features

- 🎬 **Cinematic Experience**: Hochwertige visuelle Story-Erzählung
- 🎭 **Choice-Based Storytelling**: Deine Entscheidungen formen die Geschichte
- 🎨 **Lottie-Animationen**: Leichte, performante Animationen
- 📱 **Cross-Platform**: iOS, Android & Web
- 🚀 **Expo Integration**: Schnelles Development mit Tunnel-Modus
- 💾 **Progress-Tracking**: Automatisches Speichern

## 🚀 Schnellstart mit Expo Tunnel

### 1. Dependencies installiert (bereits erledigt)

### 2. Expo Dev Server mit Tunnel starten

```powershell
cd C:\Users\aandorfer\DreamzApp\DreamzExpo
npx expo start --tunnel --port 8081
```

**Der Tunnel ermöglicht:**

- ✅ Testing auf echten Geräten ohne lokales Netzwerk
- ✅ Remote-Testing von überall
- ✅ QR-Code Scan mit Expo Go App

### 3. App testen

**Option A: Expo Go App (empfohlen für schnelles Testing)**

1. Installiere **Expo Go** auf deinem Smartphone:

   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scanne den QR-Code im Terminal
3. App wird automatisch geladen! 🎉

**Option B: iOS Simulator (macOS)**

```bash
npx expo start --tunnel --ios
```

**Option C: Android Emulator**

```powershell
npx expo start --tunnel --android
```

**Option D: Web Browser**

```powershell
npx expo start --tunnel --web
```

## 📖 Story-System

Die komplette Story wird in `src/data/storyData.json` definiert:

```json
{
  "scenes": {
    "intro": {
      "title": "Willkommen bei Dreamz",
      "text": "Du betrittst den Wald der Wünsche...",
      "choices": [
        {
          "text": "🔮 Dem Licht folgen",
          "nextScene": "light_path"
        }
      ]
    }
  }
}
```

### Story bearbeiten:

1. Öffne `src/data/storyData.json`
2. Bearbeite Szenen & Choices
3. Speichern → **Instant Reload** in der App! ⚡

## 🎨 Expo-spezifische Vorteile

### Hot Reloading

Änderungen erscheinen sofort in der App - kein Neustart nötig!

### Tunnel-Modus

```powershell
npx expo start --tunnel
```

- Automatisches ngrok-Tunneling
- Zugriff von überall
- Ideal für Remote-Testing

### Development Menu

- **Shake** Gerät → Development Menu
- **Reload** → r drücken
- **Debug** → d drücken

## 📱 Expo Go Workflow

1. **Start**: `npx expo start --tunnel`
2. **Scan**: QR-Code mit Expo Go scannen
3. **Edit**: Code ändern in VS Code
4. **Watch**: App reloaded automatisch!
5. **Repeat**: Entwickeln & Testen in Echtzeit

## 🎯 Befehle

```powershell
# Development Server starten (mit Tunnel)
npx expo start --tunnel --port 8081

# Spezifische Platform
npx expo start --tunnel --android
npx expo start --tunnel --ios
npx expo start --tunnel --web

# Production Build erstellen
npx expo build:android
npx expo build:ios

# EAS Build (empfohlen)
npx eas build --platform android
npx eas build --platform ios
```

## 🔧 Troubleshooting

### Tunnel startet nicht?

```powershell
# Expo CLI global installieren
npm install -g expo-cli

# Oder mit npx
npx expo start --tunnel --clear
```

### "Cannot connect to Metro"?

```powershell
# Port 8081 freigeben
netstat -ano | findstr :8081
# Prozess beenden falls belegt
```

### QR-Code nicht scannbar?

```powershell
# Tunnel-URL wird im Terminal angezeigt
# Manuell in Expo Go eingeben: exp://xxx.xxx.xxx.xxx:8081
```

## 📚 Weitere Dokumentation

- **ASSETS_GUIDE.md** - Lottie, Bilder & Sounds hinzufügen
- **STORY_DESIGN.md** - Best Practices für Story-Design
- **README_ORIGINAL.md** - Originale React Native Doku

## 🎮 Development Workflow

### Story-Development

1. **Bearbeite** `src/data/storyData.json`
2. **Speichern** (Ctrl+S)
3. **App reloaded** automatisch
4. **Teste** neue Szenen sofort

### UI-Anpassungen

1. **Styles** in `src/screens/StoryScreen.tsx`
2. **Komponenten** in `src/components/`
3. **Hot Reload** zeigt Änderungen sofort

### Assets hinzufügen

Siehe **ASSETS_GUIDE.md** für:

- Lottie-Animationen
- Hintergrundbilder
- Character-Sprites
- Sound-Effekte

## 🚢 Deployment

### Expo EAS Build (empfohlen)

```powershell
# EAS CLI installieren
npm install -g eas-cli

# Anmelden
eas login

# Build für Android
eas build --platform android

# Build für iOS
eas build --platform ios
```

### Klassischer Build

```powershell
# APK für Android
npx expo build:android -t apk

# IPA für iOS (macOS only)
npx expo build:ios
```

## 💡 Expo-Vorteile

- ✅ **Schneller Start** - Keine native Setup-Zeit
- ✅ **Live Updates** - OTA Updates ohne Store-Review
- ✅ **Easy Testing** - Expo Go für sofortiges Testing
- ✅ **Managed Workflow** - Expo kümmert sich um native Code
- ✅ **Web Support** - Eine Codebase für alle Plattformen

## 🎯 Port 8081

Der Port ist in `app.json` konfiguriert:

```json
{
  "expo": {
    "packagerOpts": {
      "port": 8081
    }
  }
}
```

Expo startet Metro Bundler automatisch auf Port 8081.

## 📊 Projekt-Info

```
Framework: Expo SDK
React Native: 0.81.5
TypeScript: ✅
Plattformen: iOS, Android, Web
Port: 8081
Tunnel: ✅ Aktiviert
```

## 🤝 Support

- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **Lottie**: https://docs.expo.dev/versions/latest/sdk/lottie/

---

**Viel Spaß mit Dreamz auf Expo! 🚀✨**

_Starte jetzt mit: `npx expo start --tunnel --port 8081`_
