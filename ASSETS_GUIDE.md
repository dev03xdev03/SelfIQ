# 🎨 Assets Guide für Dreamz

## Lottie-Animationen hinzufügen

### 1. Lottie-Files von LottieFiles.com herunterladen

Besuche [LottieFiles.com](https://lottiefiles.com) und suche nach passenden Animationen:

**Empfohlene Suchbegriffe:**

- `sparkles` - Funkeleffekte
- `fireflies` - Glühwürmchen
- `magic circle` - Magische Kreise
- `particles` - Partikeleffekte
- `fog mist` - Nebel
- `forest` - Wald-Animationen
- `stars` - Sterne
- `glow` - Leuchteffekte

### 2. Lottie-File umbenennen und speichern

Speichere die `.json` Files in:

```
src/assets/lottie/
```

**Beispiel-Struktur:**

```
src/assets/lottie/
├── fireflies.json
├── fog.json
├── light_particles.json
├── dark_mist.json
├── sparkles.json
├── magic_circle.json
└── rising_stars.json
```

### 3. Lottie-Animation in der App nutzen

Öffne `src/components/LottieAnimation.tsx` und aktualisiere die `getAnimationSource` Funktion:

```typescript
const getAnimationSource = (sourceName: string) => {
  const animations: Record<string, any> = {
    fireflies: require('../../assets/lottie/fireflies.json'),
    fog: require('../../assets/lottie/fog.json'),
    light_particles: require('../../assets/lottie/light_particles.json'),
    dark_mist: require('../../assets/lottie/dark_mist.json'),
    sparkles: require('../../assets/lottie/sparkles.json'),
    magic_circle: require('../../assets/lottie/magic_circle.json'),
    rising_stars: require('../../assets/lottie/rising_stars.json'),
  };
  return animations[sourceName] || null;
};
```

Dann kommentiere die LottieView Komponente ein:

```typescript
<LottieView
  source={getAnimationSource(source)}
  autoPlay={autoPlay}
  loop={loop}
  speed={speed}
  style={styles.animation}
/>
```

---

## Hintergrundbilder hinzufügen

### 1. Bilder erstellen/beschaffen

**Optionen:**

- **KI-generiert**: Midjourney, DALL·E, Stable Diffusion
- **Stock Photos**: Unsplash, Pexels
- **Eigene Artworks**: Photoshop, Procreate

**Empfohlene Auflösung:**

- Mindestens: 1080 x 1920 (Portrait)
- Optimal: 1440 x 2560
- Format: JPG oder PNG

**Beispiel-Prompts für KI (Midjourney/DALL·E):**

```
"Mystical forest entrance at twilight, glowing fireflies, magical atmosphere, cinematic lighting, fantasy art style"

"Ancient guardian sanctuary with golden light beams, ethereal particles floating, magical temple, fantasy illustration"

"Dark mysterious forest path with shadowy mist, glowing eyes in darkness, horror fantasy atmosphere"
```

### 2. Bilder speichern

Speichere Bilder in:

```
src/assets/images/
```

**Beispiel-Struktur:**

```
src/assets/images/
├── forest_entrance.jpg
├── glowing_forest.jpg
├── dark_forest.jpg
├── guardian_sanctuary.jpg
└── ceremony_circle.jpg
```

### 3. Bilder in der App nutzen

Öffne `src/screens/StoryScreen.tsx` und aktualisiere die `getBackgroundSource` Funktion:

```typescript
const getBackgroundSource = (backgroundName: string) => {
  const backgrounds: Record<string, any> = {
    forest_entrance: require('../assets/images/forest_entrance.jpg'),
    glowing_forest: require('../assets/images/glowing_forest.jpg'),
    dark_forest: require('../assets/images/dark_forest.jpg'),
    guardian_sanctuary: require('../assets/images/guardian_sanctuary.jpg'),
    ceremony_circle: require('../assets/images/ceremony_circle.jpg'),
  };
  return backgrounds[backgroundName] || null;
};
```

Dann ersetze den Platzhalter:

```tsx
<ImageBackground
  source={getBackgroundSource(currentScene.background)}
  style={styles.backgroundContainer}
  resizeMode="cover"
>
  <View style={styles.gradientOverlay} />
</ImageBackground>
```

---

## Character-Sprites hinzufügen

### 1. Character-Artworks erstellen

**Empfohlene Auflösung:**

- 512 x 768 oder 1024 x 1536
- Transparenter Hintergrund (PNG)
- Zentrale Figur, freistehend

**KI-Prompts für Characters:**

```
"Fantasy guardian character, glowing ethereal being, full body portrait, transparent background, magical robes, fantasy art style --v 6"

"Mysterious shadow guardian, dark magical character, hooded figure, mystical appearance, game character design"
```

### 2. Sprites speichern

```
src/assets/images/characters/
├── guardian_light.png
├── shadow_guardian.png
├── luminara.png
└── wish_keeper.png
```

### 3. Character in Szene verwenden

In `storyData.json`:

```json
"character": {
  "name": "Luminara",
  "sprite": "guardian_light",
  "animation": "gentle_float"
}
```

---

## Sound-Effekte hinzufügen (Optional)

### 1. Audio-Files beschaffen

**Quellen:**

- [Freesound.org](https://freesound.org)
- [Zapsplat.com](https://www.zapsplat.com)
- [Epidemic Sound](https://www.epidemicsound.com)

**Benötigte Sounds:**

- Ambiente: Wald-Geräusche, Magische Atmosphäre
- Effekte: Button-Klicks, Übergänge
- Musik: Background-Loops

### 2. Audio speichern

```
src/assets/sounds/
├── forest_ambience.mp3
├── magical_chimes.mp3
├── mysterious_whispers.mp3
└── button_click.mp3
```

### 3. react-native-sound installieren

```bash
npm install react-native-sound
cd ios && pod install && cd ..
```

### 4. Sound-Manager erstellen

Erstelle `src/utils/SoundManager.ts`:

```typescript
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

class SoundManager {
  private sounds: Map<string, Sound> = new Map();

  load(name: string, filename: string) {
    const sound = new Sound(filename, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load sound', error);
      }
    });
    this.sounds.set(name, sound);
  }

  play(name: string, loop: boolean = false) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.setNumberOfLoops(loop ? -1 : 0);
      sound.play();
    }
  }

  stop(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.stop();
    }
  }
}

export default new SoundManager();
```

---

## 📝 Asset-Checkliste

### Für jede neue Szene brauchst du:

- [ ] 1x Hintergrundbild (1080x1920+)
- [ ] 1-3x Lottie-Animationen
- [ ] Optional: Character-Sprite (512x768+)
- [ ] Optional: Ambiente-Sound
- [ ] Szenen-Eintrag in `storyData.json`

### Performance-Tipps:

✅ **Empfohlen:**

- Lottie für Animationen (klein & performant)
- JPG für Backgrounds ohne Transparenz
- PNG nur für Sprites mit Transparenz
- Komprimiere Bilder (TinyPNG, ImageOptim)

❌ **Vermeide:**

- Große GIFs (nutze Lottie stattdessen)
- Unkomprimierte Bilder über 2MB
- Zu viele gleichzeitige Animationen
- Videos über 5MB

---

## 🎨 Kostenlose Asset-Ressourcen

### Lottie-Animationen

- [LottieFiles](https://lottiefiles.com) - Tausende kostenlose Animationen
- [IconScout Lottie](https://iconscout.com/lottie-animations)

### Bilder & Artworks

- [Unsplash](https://unsplash.com) - Kostenlose hochauflösende Fotos
- [Pexels](https://pexels.com)
- [Artbreeder](https://www.artbreeder.com) - KI-generierte Bilder

### Sounds

- [Freesound](https://freesound.org) - Community Sound Library
- [Zapsplat](https://www.zapsplat.com) - Sound-Effekte & Musik

### KI-Bildgenerierung (Paid/Trial)

- [Midjourney](https://midjourney.com) - High-Quality Fantasy Art
- [DALL·E](https://openai.com/dall-e)
- [Leonardo.ai](https://leonardo.ai) - Free Tier verfügbar
