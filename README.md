# Cauldron

Master app that houses the pocket spirituality apps behind a single **accordion main menu**.
React Native 0.83.1, dark/light theme, Appodeal ads, react-native-iap locks.

## Menu (accordion)

The main menu lists house **Titles**; tapping a Title expands it in place to reveal its
sub-categories as a list. Tapping a sub-category opens it directly; the header back button
returns to the menu.

| Title | Route | Sub-categories |
|-------|-------|----------------|
| Witchery | `Witch` | Green Witch · Flow Witch · Spirit Witch · Cosmic Witch |
| Occult | `Occultist` | Hermetic · Alchemical · Qabalistic · Solomonic |
| Gnosis | `Gnosis` | Mandaeism · Manichaean · Zoroastrianism |
| Magick | `Magick` | Lucifer · Enoch |
| Esoterica | `Esoterica` | Sophia · Seth · Logos · Christos |
| Pegan | `Pegan` | Tethering · Mediation · Continuity · Regeneration · Ritual Book |
| **Tools** | `Tools` | Tarot · Numerology · Gematria · Moon Phases · Horoscopes · Astrology · Chakras · Crystals |
| **Help & Settings** | `Help` | (opens directly) Theme · daily horoscope · privacy · about |

**Gnosis content:** pocketGnosis shipped as a clone of Occult (its categories were never
built). Its real intended categories — the Gnostic/dualist "Light vs Darkness" traditions
**Mandaeism, Manichaean, Zoroastrianism** — come from the design notes (`Gnosis.txt`,
`pocketGnosis.txt`) and are implemented in `apps/gnosis/data/gnosisTraditions.ts` +
`screens/GnosisCategoryList.tsx` (freely accessible, no lock gate). Content depth is modest
where the notes were thin (esp. Zoroastrianism) — expand the data file to go deeper. No
categories overlap across houses now.

## How navigation works

- `screens/MainMenuScreen.tsx` — the accordion. Each sub-category does
  `navigation.navigate(houseRoute, { category })`.
- `apps/<key>/Section.tsx` — a **param-driven native stack**: `LocksProvider` wrapping a
  stack of that house's category screens + `PracticeDetail`, with
  `initialRouteName = route.params.category`. Opening a category mounts the house with that
  category as the initial screen, so the back button pops straight back to the menu.
- `shared/houseHeader.tsx` — the shared header/back button (`navigation.goBack()`, which
  bubbles to the menu from a category or to the category from a detail screen).
- `apps/mystic/` is the **Tools** house (same stack pattern; tool screens keep header
  titles). `apps/help/` is the **Help** house (single screen, opened directly).

## Structure

```
App.tsx                     Root: providers + stack (MainMenu -> houses) + shared ad banner
screens/MainMenuScreen.tsx  Accordion menu
shared/                     ThemeContext, BannerContext, AppodealService, banner, houseHeader
apps/<key>/Section.tsx      Param-driven native stack per house
apps/<key>/screens/...      Category screens (+ PracticeDetail), copied from source app
apps/<key>/LocksContext.tsx Per-app locks; AsyncStorage keys namespaced cauldron_<key>_locks
apps/mystic/                Tools house (ToolsHomeScreen + tool screens; Gematria/MoonPhase added)
apps/help/                  Help house (HelpHomeScreen + notification services)
```

Practice-house keys: `witch`, `occultist`, `gnosis`, `pegan`, `magick`, `esoterica`.
Utility houses: `mystic` (Tools), `help` (Help).

Note: the old per-house `WelcomeScreen.tsx` home screens are now unused (dead code) —
left in place rather than deleted so their purchase/unlock logic stays intact for reuse.

## Build

```
npm install --legacy-peer-deps
npm run android
```

Android identity: `com.prch.cauldron`, display name **Cauldron**
(android/ tree cloned from pocketWitch and renamed).
Verified: `gradlew assembleDebug` produces a working APK.

Build notes (already handled, kept for reproducibility):
- `--legacy-peer-deps` is required: react-native-iap 14.7.0 declares a
  nitro-modules ^0.31 peer but the apps ship (and work) with 0.32.
- `react-native-iap` pinned to 14.7.0 and `react-native-google-mobile-ads`
  pinned to 16.0.1 - the versions the source apps actually build with
  (newer 16.4.0 fails Kotlin compile on this AGP/Kotlin combo).
- `react-native-tts` 4.1.1 uses the dead `jcenter()` repo; fixed via
  `patches/react-native-tts+4.1.1.patch` applied by the `postinstall` hook
  (lotusserpent had the same fix hand-edited into its node_modules).
- `react-native-push-notification` was dropped from the dependency union:
  nothing imports it (notifee handles notifications) and its gradle file
  also relied on jcenter().
- `google-services.json` got a `com.prch.cauldron` client cloned from the
  pwitch entry so the plugin accepts the new applicationId.

## Monetization & ads (baselined)

Everything is centralized in **`shared/monetization.ts`** — one Cauldron namespace so the
store listing reads as one app:

- **Products** (`SKUS`): a global all-access subscription `com.prch.cauldron.allaccess`
  plus a one-time unlock per house (`…witchery`, `…occult`, `…gnosis`, `…magick`,
  `…esoterica`, `…pegan`, `…tools`). A house is unlocked when the account owns its own
  unlock **or** the all-access sub.
- **One shared PurchaseService** (`shared/PurchaseService.ts`); each `apps/<house>/PurchaseService.ts`
  is a one-line shim (`createPurchaseService(SKUS.<house>)`). A module-level debug flag lets
  the Help ▸ Developer panel mimic an active/inactive subscription app-wide.
- **Restore Purchases** and a hidden **Developer/Test panel** (tap Version 7×; passkeys
  `cauldron:sub-on` / `:sub-off` / `:clear`) now live in the **Help** house — the old
  copies were orphaned in the retired Home screens.
- **Ads**: `AD_TEST_MODE`, `APPODEAL_APP_KEY`, `ADMOB_APP_ID`, `AD_TEST_DEVICE_IDS` all read
  from `monetization.ts`; `AppodealService` uses `setTesting(AD_TEST_MODE)`.

**Before production (all one file, `shared/monetization.ts`, except native AdMob id):**
1. Create the `com.prch.cauldron.*` products in Play Console / App Store Connect.
2. Swap `APPODEAL_APP_KEY` and `ADMOB_APP_ID` for real Cauldron accounts (they're still the
   old pocketWitch/pocketMystic keys). The **AdMob app id must also** be updated in
   `app.json` and `android/app/src/main/AndroidManifest.xml` (native, can't be centralized).
3. Change the `DEV_PASSKEYS` before release.

Gating status: Witch/Occult/Magick/Esoterica/Pegan gate via `isSubscriptionActive()`; the
**Gnosis** traditions and **Tools** house are currently free (their SKUs exist in the catalog
— flip them on by adding the lock check to those screens when ready).

## Caveats / follow-ups
- **Firebase**: the `com.prch.cauldron` client in google-services.json is a clone of
  the pwitch one (fine for building). Register the app in the Firebase console and
  replace the file before relying on FCM/analytics.
- **Release signing**: keystore.properties now points at the local copy of the old
  pocketMystic release keystore (`app/keystores/release.keystore`). A brand-new Play
  listing should get its own keystore/upload key.
- **Notifications**: per-app NotificationService copies remain, but none auto-initialize
  at startup (eight daily schedules at once would be spam). Screens that let the user
  enable reminders still work. Pick which schedules Cauldron should own and initialize
  them in `App.tsx`.
- **VersionCheckService**: still checks the old per-app store listings; harmless
  (errors are swallowed) but should be pointed at the Cauldron listing.
- **pocketGnosis** never had a finished RN App.tsx; its section reuses the
  pocketOccultist layout (same screen set) with gnosis screens/data, and borrows
  occultist's LocksContext/config (namespaced).
- **iOS**: `ios/` is a straight copy of pocketWitch's project, still named pocketWitch
  internally. Rename the Xcode project on a Mac before building for iOS.
- Old per-app unlocks stored on devices under the previous AsyncStorage keys do not
  carry over (keys were namespaced to avoid collisions).
