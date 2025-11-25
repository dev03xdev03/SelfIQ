# =====================================================

# SUPABASE INTEGRATION - SETUP ANLEITUNG

# =====================================================

## 1. Supabase Projekt Setup

### 1.1 Supabase Dashboard

1. Gehe zu https://supabase.com
2. Erstelle ein neues Projekt
3. Notiere dir die Credentials:
   - Project URL: https://dein-projekt.supabase.co
   - Anon Key: eyJhb... (öffentlicher Key)

### 1.2 Datenbank Schema

1. Im Supabase Dashboard → SQL Editor
2. Führe `supabase_schema.sql` aus (komplettes Schema)
3. Warte bis alle Tabellen erstellt sind

### 1.3 Environment Variables

1. Öffne `.env` Datei
2. Ersetze die Platzhalter:
   ```
   SUPABASE_URL=https://dein-projekt.supabase.co
   SUPABASE_ANON_KEY=dein-echter-anon-key
   ```

---

## 2. Frontend Integration

### 2.1 Installierte Packages

✅ @supabase/supabase-js
✅ react-native-url-polyfill
✅ react-native-dotenv
✅ @react-native-async-storage/async-storage

### 2.2 Erstellte Services

#### `src/lib/supabase.ts`

Zentrale Supabase Client Konfiguration mit AsyncStorage Persistence

#### `src/services/authService.ts`

- `signUp()` - Registrierung mit Username + Gender Detection
- `signIn()` - Login mit Email/Password
- `signInAsGuest()` - Guest Login ohne Email
- `signOut()` - Logout
- `getCurrentUser()` - Aktuell eingeloggter User

#### `src/services/progressService.ts`

- `loadProgressFromSupabase()` - Lädt Story-Fortschritt
- `saveProgressToSupabase()` - Speichert Story-Fortschritt
- `loadAllProgressFromSupabase()` - Lädt alle Fortschritte
- `saveChoiceToSupabase()` - Tracked User-Choices

#### `src/services/subscriptionService.ts`

- `hasAccessToLockedContentSupabase()` - Prüft Abo-Status
- `hasAccessToStory()` - Prüft Zugriff auf Story
- `createSubscription()` - Erstellt Abo nach Payment
- `createPurchase()` - Erstellt Einzelkauf
- `loadAllStories()` - Lädt alle Stories aus DB

#### `src/services/analyticsService.ts`

- `trackEvent()` - Generisches Event Tracking
- `trackStoryStart()` - Story gestartet
- `trackStoryComplete()` - Story abgeschlossen
- `trackSceneView()` - Scene angesehen
- `trackChoiceMade()` - Choice getroffen
- `trackAppOpen()` / `trackAppClose()` - App Sessions

---

## 3. Migration von AsyncStorage → Supabase

### 3.1 IntroScreen anpassen

Aktuell wird nur der Name gespeichert. Nach Supabase-Migration:

```typescript
import { signInAsGuest } from '../services/authService';

const handleStart = async () => {
  const { user, error } = await signInAsGuest(playerName, detectedGender);
  if (user) {
    onStart(playerName);
  }
};
```

### 3.2 StoryScreen anpassen

Ersetze AsyncStorage Calls mit Supabase:

```typescript
import {
  loadProgressFromSupabase,
  saveProgressToSupabase,
} from '../services/progressService';

// Beim Laden
const progress = await loadProgressFromSupabase(episodeId);

// Beim Speichern
await saveProgressToSupabase({
  episodeId,
  currentScene: currentScene.id,
  completedScenes,
  progress: percentage,
  lastPlayedDate: new Date().toISOString(),
});
```

### 3.3 CategorySelectionScreen anpassen

Stories aus Supabase laden:

```typescript
import { loadAllStories } from '../services/subscriptionService';
import { loadAllProgressFromSupabase } from '../services/progressService';

const stories = await loadAllStories();
const allProgress = await loadAllProgressFromSupabase();
```

### 3.4 PreorderScreen anpassen

Nach erfolgreichem Payment:

```typescript
import {
  createPurchase,
  createSubscription,
} from '../services/subscriptionService';

// Einzelkauf
await createPurchase(storyId, 2.99, 'stripe', transactionId);

// Abo
const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
await createSubscription('leseratten_abo', 4.99, expiresAt);
```

---

## 4. Analytics Integration

### 4.1 App.tsx erweitern

```typescript
import { trackAppOpen, trackAppClose } from './src/services/analyticsService';
import { useEffect } from 'react';

export default function App() {
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    trackAppOpen();

    return () => {
      const duration = Math.floor((Date.now() - sessionStart.current) / 1000);
      trackAppClose(duration);
    };
  }, []);

  // ... rest of App
}
```

### 4.2 StoryScreen Analytics

```typescript
import {
  trackStoryStart,
  trackSceneView,
  trackChoiceMade,
} from '../services/analyticsService';

// Bei Story Start
useEffect(() => {
  const sessionId = uuid();
  trackStoryStart(episodeId, sessionId);
}, []);

// Bei Scene View
useEffect(() => {
  if (currentScene) {
    trackSceneView(episodeId, currentScene.id, sessionId);
  }
}, [currentScene]);

// Bei Choice
const handleChoice = (choiceId: string) => {
  trackChoiceMade(episodeId, currentScene.id, choiceId, sessionId);
  // ... rest of logic
};
```

---

## 5. Row Level Security (RLS)

### 5.1 Was ist bereits konfiguriert?

✅ Users können nur eigene Daten sehen/ändern
✅ Stories sind öffentlich lesbar
✅ Progress ist user-spezifisch
✅ Subscriptions/Purchases sind privat
✅ Analytics sind user-spezifisch

### 5.2 Sicherheit

- Kein User kann fremde Fortschritte sehen
- Kein User kann fremde Käufe sehen
- Alle Writes werden durch RLS validiert
- Auth.uid() wird für alle Checks verwendet

---

## 6. Testing

### 6.1 Manuelle Tests

1. **Auth Flow**

   - Guest Signup mit Username
   - Login mit Email/Password
   - Logout

2. **Progress Sync**

   - Story starten
   - Fortschritt machen
   - App neu starten
   - Fortschritt sollte geladen werden

3. **Multi-Device**

   - Auf Gerät 1 Story spielen
   - Auf Gerät 2 einloggen (gleicher Account)
   - Fortschritt sollte synchronisiert sein

4. **Subscriptions**
   - Abo aktivieren
   - Locked Stories sollten freigeschaltet sein
   - hasAccessToStory() sollte true zurückgeben

### 6.2 Supabase Dashboard Checks

- Table Editor → Prüfe ob Daten ankommen
- Auth → Prüfe ob Users registriert werden
- Logs → Prüfe auf Fehler

---

## 7. Production Readiness

### 7.1 Environment Variables

Für Production separate .env Datei:

```
SUPABASE_URL=https://production-projekt.supabase.co
SUPABASE_ANON_KEY=production-anon-key
```

### 7.2 Edge Functions (Optional)

Für Payment Processing:

- Stripe Webhooks
- Apple In-App Purchase Verification
- Google Play Billing Verification

### 7.3 Backup

Supabase bietet automatische Backups:

- Dashboard → Database → Backups
- Point-in-time Recovery verfügbar

### 7.4 Monitoring

- Supabase Dashboard → Logs
- Analytics Events tracken User Behavior
- Fehler-Tracking via Sentry (optional)

---

## 8. Nächste Schritte

### Phase 1: Basic Integration (JETZT)

✅ Supabase Schema deployed
✅ Services erstellt
✅ .env konfiguriert
⏳ Auth Flow implementieren
⏳ Progress Migration

### Phase 2: Feature Complete

- Payment Integration (Stripe/Apple/Google)
- Real-time Subscriptions
- Push Notifications
- Achievements System

### Phase 3: Optimization

- Caching Strategy
- Offline Support
- Performance Monitoring
- A/B Testing

---

## 9. Support & Dokumentation

### Supabase Docs

- Auth: https://supabase.com/docs/guides/auth
- Database: https://supabase.com/docs/guides/database
- Storage: https://supabase.com/docs/guides/storage
- Realtime: https://supabase.com/docs/guides/realtime

### React Native Integration

- https://supabase.com/docs/guides/getting-started/tutorials/with-react-native

### Community

- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

---

## 10. Troubleshooting

### "Unable to resolve module supabase"

→ `npm install @supabase/supabase-js`

### "process.env.SUPABASE_URL is undefined"

→ Prüfe ob .env Datei existiert und babel.config.js konfiguriert ist

### "Row Level Security violation"

→ Prüfe ob User eingeloggt ist (auth.uid() muss gesetzt sein)

### "Connection refused"

→ Prüfe SUPABASE_URL in .env (muss https:// enthalten)

---

**Status: Ready for Integration** ✅
**Nächster Schritt: .env Credentials eintragen + Auth Flow testen**
