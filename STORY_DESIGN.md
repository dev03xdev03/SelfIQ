# 🎮 Story Design Tipps

## Best Practices für packende Storys

### 1. Story-Struktur

#### Der Drei-Akt-Aufbau

```
Akt 1: Setup (25%)
- Welt vorstellen
- Hauptcharakter etablieren
- Konflikt einführen

Akt 2: Konfrontation (50%)
- Herausforderungen steigern
- Character-Entwicklung
- Plot-Twists

Akt 3: Auflösung (25%)
- Klimax
- Auflösung des Konflikts
- Ending
```

#### Verzweigte Storylines

**Linear mit Illusionen:**

```
Start → A → B → C → Ende
      ↓   ↓   ↓
    (Variations in Text, selbes Ziel)
```

**Echte Verzweigungen:**

```
Start
  ├─→ Licht-Pfad → Gutes Ende
  └─→ Schatten-Pfad → Dunkles Ende
```

**Hub-basiert:**

```
     ┌─ Quest A ─┐
Start → HUB → Quest B → Finale
     └─ Quest C ─┘
```

---

### 2. Entscheidungen gestalten

#### Gute Choices haben:

✅ **Klare Konsequenzen**

```json
{
  "text": "🗡️ Kämpfen",
  "nextScene": "combat_scene"
}
// vs
{
  "text": "🕊️ Verhandeln",
  "nextScene": "negotiation_scene"
}
```

✅ **Emotionale Gewichtung**

```json
{
  "text": "💔 Den Freund verraten für Macht",
  "nextScene": "dark_path"
}
// vs
{
  "text": "❤️ Loyal bleiben",
  "nextScene": "friendship_path"
}
```

✅ **Persönlichkeits-Ausdruck**

- Mutig vs Vorsichtig
- Freundlich vs Zynisch
- Logisch vs Emotional

❌ **Vermeide:**

- Bedeutungslose Choices
- Falsche Entscheidungen (nur eine funktioniert)
- Zu viele Optionen (max 3-4)

---

### 3. Charaktere entwickeln

#### Character-Template

```json
{
  "name": "Luminara",
  "role": "Mentor",
  "personality": "Weise, geheimnisvoll, wohlwollend",
  "goal": "Würdigen Wunschempfänger finden",
  "backstory": "Ehemalige Wunsch-Empfängerin, jetzt Hüterin",
  "relationships": {
    "player": "Testet Würdigkeit",
    "shadow_guardian": "Alte Rivalität"
  }
}
```

#### Dialog-Prinzipien

**Show, don't tell:**

```
❌ "Ich bin sehr mächtig."
✅ *Mit einer Handbewegung lässt sie Sterne tanzen*
```

**Character Voice:**

```
Luminara (Mentor):
"Deine Reise hat erst begonnen, junger Wanderer."

Shadow Guardian (Mysteriös):
"Hmm... interessant. Sehr interessant."
```

---

### 4. Pacing & Rhythm

#### Szenen-Länge variieren

```
Kurze Szene (50-80 Wörter):
- Aktions-Momente
- Entscheidungs-Punkte
- Cliffhanger

Mittlere Szene (100-150 Wörter):
- Story-Progression
- Character-Interaktionen
- World-Building

Lange Szene (200+ Wörter):
- Wichtige Enthüllungen
- Emotionale Höhepunkte
- Endings
```

#### Spannungskurve

```
Spannung
  ↑
  │     ╱╲      ╱╲
  │    ╱  ╲    ╱  ╲    ╱╲
  │   ╱    ╲  ╱    ╲  ╱  ╲
  │  ╱      ╲╱      ╲╱
  │─────────────────────→ Zeit
    1    2    3    4   5
    Setup Mini- Mid- Mini- Finale
          Peak  Point Peak
```

---

### 5. Emotionale Hooks

#### Die Big 6 Emotionen nutzen

1. **Freude** 🎉

   - Erfolge
   - Reunionen
   - Entdeckungen

2. **Traurigkeit** 😢

   - Verluste
   - Abschiede
   - Reue

3. **Angst** 😰

   - Unbekanntes
   - Bedrohungen
   - Time-Pressure

4. **Wut** 😠

   - Ungerechtigkeit
   - Verrat
   - Frustration

5. **Überraschung** 😲

   - Plot-Twists
   - Enthüllungen
   - Unerwartete Begegnungen

6. **Ekel** 🤢
   - Moralische Dilemmata
   - Unappetitliche Situationen

#### Emotionale Achterbahn-Prinzip

Wechsle zwischen:

- **Hoch** → **Tief** → **Hoch**
- Erfolg → Rückschlag → Triumph

---

### 6. World-Building

#### Show Through Details

Statt langer Erklärungen:

```
❌ "Dies ist der Wald der Wünsche. Er wurde vor 1000
    Jahren von einem mächtigen Magier erschaffen..."

✅ "Uralte Runen glühen schwach an den Baumstämmen.
    Die Luft vibriert mit jahrhundertealter Magie."
```

#### Environmental Storytelling

```json
{
  "text": "Du findest einen verlassenen Wunschstein,
           bedeckt mit Ranken. Jemand war hier... vor
           langer Zeit.",
  "choices": [
    {"text": "Den Stein untersuchen", ...},
    {"text": "Weitergehen", ...}
  ]
}
```

---

### 7. Multiple Endings

#### Ending-Typen

**1. Binary (2 Endings)**

```
Guter Pfad → Happy End
Böser Pfad → Bad End
```

**2. Scaled (3-5 Endings)**

```
Sehr Gut → Gut → Neutral → Schlecht → Sehr Schlecht
```

**3. Dimensional (6+ Endings)**

```
     Macht × Moral

Hohe Macht + Gut → Held-Ende
Hohe Macht + Böse → Tyrann-Ende
Niedrig + Gut → Humble-Ende
Niedrig + Böse → Versager-Ende
```

#### Ending-Voraussetzungen tracken

```json
{
  "ending_conditions": {
    "hero_ending": {
      "wishesGranted": ">= 3",
      "choices": ["helped_guardian", "spared_enemy"],
      "visitedScenes": ["secret_sanctuary"]
    }
  }
}
```

---

### 8. Replayability

#### Geheimnisse verstecken

- **Hidden Scenes**: Nur durch bestimmte Choices erreichbar
- **Secret Items**: In optionalen Pfaden
- **Alternative Dialoge**: Basierend auf früheren Entscheidungen

#### Choice Tracking

```typescript
// In StoryEngine.ts
hasChosenBefore(choiceId: string): boolean {
  return this.storyData.playerData.choices.includes(choiceId);
}

// In Scene:
if (hasChosenBefore('trusted_stranger')) {
  text = "Der Fremde erkennt dich wieder...";
}
```

---

### 9. Testing Your Story

#### Checklist

- [ ] Jede Scene ist von mindestens einer anderen erreichbar
- [ ] Alle Choices führen zu validen Scenes
- [ ] Keine Dead-Ends (außer Endings)
- [ ] Texte sind grammatikalisch korrekt
- [ ] Charaktere bleiben konsistent
- [ ] Pacing fühlt sich gut an
- [ ] Emotions-Beats funktionieren
- [ ] Multiple Endings sind erreichbar

#### Playtest Questions

1. Wann war ich am meisten engaged?
2. Wann war ich gelangweilt?
3. Waren meine Choices meaningful?
4. Wollte ich nochmal spielen?
5. Erinnere ich die Charaktere?

---

### 10. Story-Länge

#### Richtwerte

**Micro-Story (5-10 Minuten)**

- 5-10 Szenen
- 1-2 Verzweigungen
- 1 Ending

**Short-Story (15-30 Minuten)**

- 15-25 Szenen
- 3-5 Verzweigungen
- 2-3 Endings

**Medium-Story (45-90 Minuten)**

- 30-50 Szenen
- 8-12 Verzweigungen
- 4-6 Endings

**Epic-Story (2+ Stunden)**

- 60+ Szenen
- 15+ Verzweigungen
- 8+ Endings

---

## 📖 Story-Templates

### Template 1: Hero's Journey

1. **Ordinary World** - Intro
2. **Call to Adventure** - Inciting Incident
3. **Refusal** - Doubt
4. **Meeting Mentor** - Guidance
5. **Crossing Threshold** - Point of No Return
6. **Tests** - Challenges
7. **Approach** - Preparation
8. **Ordeal** - Crisis
9. **Reward** - Prize
10. **Return** - Coming Home
11. **Resurrection** - Final Test
12. **Return with Elixir** - Ending

### Template 2: Mystery Investigation

1. **Crime/Mystery** - Discovery
2. **First Clues** - Investigation
3. **Red Herrings** - False Leads
4. **Twist** - New Information
5. **Deeper Investigation** - Following Leads
6. **Revelation** - Truth Discovered
7. **Confrontation** - Facing Culprit
8. **Resolution** - Mystery Solved

### Template 3: Romance Arc

1. **Meet Cute** - First Encounter
2. **Building Connection** - Getting to Know
3. **Complication** - Obstacle
4. **Separation** - Distance/Conflict
5. **Realization** - Epiphany
6. **Grand Gesture** - Proof of Love
7. **Resolution** - Together/Apart

---

**Viel Erfolg beim Story-Design! ✍️✨**
