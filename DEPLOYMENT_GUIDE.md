# Expo 24/7 Cloud Deployment Guide

## Option 1: Render.com (Empfohlen - Kostenlos)

1. **Gehe zu [render.com](https://render.com)** und melde dich an
2. **Verbinde dein GitHub Repository** (pushe dein Projekt zu GitHub falls noch nicht geschehen)
3. **New > Web Service**
4. **Wähle dein Repository** aus
5. **Settings:**
   - Name: `dreamz-expo`
   - Environment: `Docker`
   - Region: `Frankfurt`
   - Plan: `Free`
6. **Click "Create Web Service"**

✅ Server läuft 24/7, startet automatisch neu bei Crashes

## Option 2: Railway.app (Auch kostenlos, sehr einfach)

```bash
# Installiere Railway CLI
npm install -g railway

# Login
railway login

# Init Project
railway init

# Deploy
railway up
```

✅ Automatischer Deploy bei Git Push
✅ Automatische Restarts
✅ $5 gratis Credits pro Monat

## Option 3: DigitalOcean App Platform ($5/Monat)

1. Gehe zu [digitalocean.com](https://www.digitalocean.com/products/app-platform)
2. **Create App** > GitHub Repository auswählen
3. **Settings:**
   - Type: Web Service
   - Dockerfile: `./Dockerfile`
   - HTTP Port: 8081
4. **Deploy**

✅ Stabil, schnell
✅ Automatische SSL
✅ $5/Monat (günstiger als viele Alternativen)

## Schnellstart (Railway - Empfohlen für dich)

```powershell
# 1. Pushe Code zu GitHub (falls nicht schon passiert)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/DEIN-USERNAME/DreamzExpo.git
git push -u origin main

# 2. Installiere Railway
npm install -g railway

# 3. Login und Deploy
railway login
railway init
railway up

# 4. Expo Tunnel URL erhalten
railway logs
```

## Wichtig: Expo Tunnel Authentication

Da Expo Tunnel Authentifizierung braucht, füge diese ENV Variables hinzu:

**Auf Render.com / Railway:**

- `EXPO_TOKEN`: Dein Expo Token (hol dir einen mit `npx expo whoami` und `npx expo login`)

## Nach dem Deploy

1. **Logs checken:** `railway logs` oder in Render Dashboard
2. **Tunnel URL finden:** Steht in den Logs nach "Tunnel ready"
3. **In Expo Go App:** Scanne den QR Code oder gib die URL ein

## Kosten Vergleich

| Service      | Preis             | Restart | Uptime |
| ------------ | ----------------- | ------- | ------ |
| Render.com   | FREE              | Auto    | 99%+   |
| Railway.app  | FREE ($5 credits) | Auto    | 99%+   |
| DigitalOcean | $5/mo             | Auto    | 99.99% |

**Empfehlung:** Railway.app wegen einfachstem Setup und automatischem Deploy bei Git Push.
