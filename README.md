# 🏍️ MotoCare AstraPay

> Motorcycle service booking app with integrated AstraPay QRIS payment — built for the AstraPay Hackathon.

**🔗 Live Demo:** https://seppam.github.io/motocare-astrapay/

---

## 📖 Business Overview

### What This App Does

MotoCare AstraPay is a **consumer mobile app** that helps motorcycle owners in Indonesia easily book professional service and maintenance at authorized Astra Honda workshops (AHASS), then pay seamlessly via **AstraPay QRIS**.

### The Problem It Solves

Most motorcycle owners in Indonesia face these pain points:
- **No easy online booking** — have to walk in and wait in line
- **No visibility into pricing** — costs are opaque until you arrive
- **Payment friction** — cash-only or complicated bank transfers at workshops

### The Solution

MotoCare AstraPay brings the full service journey into one app:

```
Browse services → Book workshop slot → Pay via QRIS → Get digital receipt
```

Users can:
- 📋 Browse 4 service categories (oil change, tire service, tune-up, flood protection)
- 🏪 Choose from 3 partner AHASS workshops nearest to them
- 📅 Pick date and time slots
- 💳 Pay instantly with AstraPay QRIS — no cash, no friction
- 📜 Receive a digital receipt and service schedule

### Target Users

- Motorcycle owners in Indonesia (especially Jakarta metro area)
- AstraPay wallet users who prefer cashless payments
- Users who want transparency and convenience in workshop bookings

### Business Model

- **For AstraPay:** Drives QRIS adoption, increases wallet transactions, strengthens AHASS partnership
- **For workshops:** Pre-bookings reduce walk-in crowding, better capacity planning
- **For users:** Transparent pricing, no queuing, seamless payment

---

## 🧩 App Features

| Feature | Description |
|---|---|
| **Service Catalog** | Browse 4 service types with descriptions, pricing ranges, and estimated duration |
| **Workshop Picker** | Select nearest AHASS partner workshop |
| **Smart Scheduling** | Choose from 3 date options and 4 time slots |
| **AstraPay QRIS Payment** | Real-time QRIS code generation with countdown timer |
| **Booking Confirmation** | Digital receipt with booking ID and service schedule |
| **Booking History** | (In development) View past bookings and payment status |
| **User Profile** | (In development) Manage AstraPay account and vehicle info |

---

## 🛠️ Technical Overview

### Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native with Expo SDK 56 |
| **Routing** | Expo Router (file-based routing) |
| **Language** | TypeScript |
| **UI Components** | React Native Paper (Material Design 3) |
| **Icons** | Ionicons via `@expo/vector-icons` |
| **State / Persistence** | AsyncStorage (local) |
| **QR Code** | `react-native-qrcode-svg` |
| **Payment** | Mock AstraPay SDK (OAuth token + EMVCo QRIS payload) |
| **Platforms** | iOS, Android, Web |

### Architecture

```
app/                          # Expo Router file-based routes
├── _layout.tsx               # Root layout: theme, SafeArea, DemoBanner
├── (tabs)/                   # Tab navigator
│   ├── _layout.tsx           # Tab bar config (3 tabs)
│   ├── index.tsx             # Home: wallet card + service list
│   ├── booking.tsx           # Booking history (in progress)
│   └── profile.tsx           # User profile (in progress)
├── service/[id].tsx          # Service detail + booking form
└── payment/[bookingId].tsx   # QRIS payment screen

components/
├── DemoBanner.tsx            # Demo notice banner with GitHub link
└── ServiceCard.tsx           # Reusable service category card

constants/
├── services.ts               # Static service data (4 types)
└── theme.ts                  # Design tokens (colors, typography)

lib/
└── astrapay.ts               # Mock AstraPay SDK
                                # - generateToken() → OAuth mock
                                # - generateQRIS() → EMVCo QRIS payload mock
```

### Dark Theme Design System

```typescript
const COLORS = {
  background:   '#0a1128',  // Dark navy — page background
  surface:      '#111827',  // Card surface
  border:       '#1e3a5f',  // Dividers, borders
  primary:      '#10b981',  // Emerald green — CTA, success, AstraPay brand
  text:         '#ffffff',  // Primary text
  textMuted:    '#94a3b8',  // Secondary/muted text
  danger:       '#ef4444',  // Error, countdown urgent
  warning:      '#f59e0b',  // Pending states
};
```

---

## 🚀 How to Run

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- **Expo CLI** (or use `npx`)
- For mobile: iOS Simulator (Mac) or Android Emulator

### 1. Clone the Repository

```bash
git clone https://github.com/seppam/motocare-astrapay.git
cd motocare-astrapay
```

### 2. Install Dependencies

```bash
npm install
```

> Note: This project uses `legacy-peer-deps` to handle React Native / Expo peer dependency nuances. The `.npmrc` file is pre-configured.

### 3. Run on Web (Development)

```bash
npm run web
# or
npx expo start --web
```

The app will open at `http://localhost:8081`.

### 4. Run on Mobile (Development)

```bash
# iOS Simulator (Mac only)
npx expo start --ios

# Android Emulator
npx expo start --android

# Scan QR code with Expo Go app
npx expo start
```

### 5. Build for Production

**Web static export:**
```bash
npx expo export --platform web --output-dir dist
```

**Android APK (via EAS):**
```bash
eas build --platform android --profile preview
```

---

## 🌐 Deployment

### Web — GitHub Pages

The project uses **GitHub Actions** for automatic deployment. Every push to `main` triggers a CI pipeline that:

1. Installs dependencies
2. Runs `npx expo export --platform web`
3. Patches absolute asset paths → relative paths (required for GitHub Pages subpath)
4. Deploys to the `gh-pages` branch

**Live URL:** https://seppam.github.io/motocare-astrapay/

To manually trigger a deployment, push to `main` or go to the **Actions** tab on GitHub.

### Mobile — App Store / Play Store

```bash
# Configure EAS credentials
eas credentials

# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## 🔐 Environment Variables

Create a `.env` file for API credentials (currently uses mock values):

```bash
EXPO_PUBLIC_ASTRAPAY_SANDBOX_URL=https://sandbox.astrapay.com
EXPO_PUBLIC_ASTRAPAY_CLIENT_ID=your_client_id
EXPO_PUBLIC_ASTRAPAY_CLIENT_SECRET=your_client_secret
```

> The app ships with mock credentials that simulate the full payment flow. Replace with real AstraPay sandbox credentials for production testing.

---

## 📌 Status & Roadmap

| Feature | Status |
|---|---|
| Service catalog | ✅ Complete |
| Workshop + date/time booking | ✅ Complete |
| QRIS payment screen | ✅ Complete |
| Booking history | 🚧 In progress |
| User profile | 🚧 In progress |
| Real AstraPay API integration | 🚧 Next phase |
| Push notifications | 📋 Planned |
| Android/iOS production APK | 📋 Planned |

---

## 👤 Author

**Muhamad Septian Pamungkas**  
Built for the AstraPay Hackathon

---

## 📄 License

MIT
