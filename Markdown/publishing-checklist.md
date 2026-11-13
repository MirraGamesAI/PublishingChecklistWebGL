# Unity WebGL Publishing Checklist

One checklist for Unity WebGL games on 12 web platforms, listed in Sources. It covers the game build. Store page material such as thumbnails and descriptions is not covered.

1. Main items pass on every platform: build them once.
2. Items that start with a platform name apply only there: enable them in code with a platform check.
3. Item numbers let QA report a failure briefly, like "G4 failed".

## A. Build & performance

- [ ] **A1.** Initial download is 20 MB or less, as served (compressed).
  - Unity: Brotli compression, managed code stripping, optional content in Addressables.
- [ ] **A2.** Total build is 100 MB or less on disk, with at most 1,500 files and no file over 30 MB.
- [ ] **A3.** `index.html` is at the archive root. File names use only Latin letters, digits, `_`, `-` and `.`.
- [ ] **A4.** All files ship in the build and load by relative paths. No absolute URLs.
- [ ] **A5.** The game runs on any domain: no sitelock or URL checks.
- [ ] **A6.** A loading screen with progress shows at once, and the game is playable within 20 seconds (5 is the target).
- [ ] **A7.** No splash or logo screens before the game, including Unity's if the license allows turning it off.
- [ ] **A8.** The game calls only the SDK features it actually uses.
- [ ] **A9.** The game still starts if the platform SDK fails to load, for example because of an ad blocker.
- [ ] **A10.** It runs in current Chrome, Edge, Firefox, Safari and Yandex Browser, on desktop and mobile.
- [ ] **A11.** No crashes, freezes or error messages on rotate, resize, minimize, ads, or browser back and forward.
- [ ] **A12.** No errors in the browser console.
- [ ] **A13.** No Unity "not supported on mobile" warning.
  - Unity: remove the mobile check from the WebGL template.
- [ ] **A14.** Peak memory is 256 MB or less on mobile and 512 MB or less on desktop.
  - Unity: set Maximum Memory Size, and test on an iPhone first.
- [ ] **A15.** Game speed and physics are the same at 60, 144 and 165 Hz.
- [ ] **A16.** The page never reloads or navigates away during play.
- [ ] **A17.** The page shows only the game: no default Unity template frame, logo or footer.
  - Unity: start from a minimal WebGL template, such as MirraGamesTemplate.

**Platform-specific**

- [ ] **A18.** **YouTube:** The platform SDK loads before the Unity loader.
- [ ] **A19.** **YouTube:** No network requests except through the platform SDK.
- [ ] **A20.** **GamePix:** No third-party SDKs besides the GamePix and Xsolla ones.
- [ ] **A21.** **VK:** The platform's init event is sent at startup, or the game won't run.

## B. Advertisement

**General**

- [ ] **B1.** Ads come only from the platform SDK. No other networks, no home-made ad units, no promo images.
- [ ] **B2.** The first ad shows only after the player has played.
- [ ] **B3.** The game never asks players to click ads or rewards them for it.
- [ ] **B4.** Input is blocked from the ad request until the ad closes. Gameplay and audio pause when the ad starts.
- [ ] **B5.** After an ad during play, the game resumes only when the player taps or presses a key.
- [ ] **B6.** If an ad fails or isn't available, the game continues normally, with no penalty.
- [ ] **B7.** The game is fully playable with an ad blocker. Rewarded buttons with no ad behind them are hidden or disabled.
- [ ] **B8.** Progress is kept when the player clicks an ad and comes back.

**Interstitials**

- [ ] **B9.** Interstitials show only when the player continues into play after a break: Next level, Retry or Play.
- [ ] **B10.** Games without levels show them at natural moments, such as a death or round end, never on a timer.
- [ ] **B11.** Interstitials never show during active play, and never from menu, settings, shop or inventory buttons.
- [ ] **B12.** A cooldown in the game keeps interstitials at least 3 minutes apart. It is configurable per platform.

**Rewarded ads**

- [ ] **B13.** A rewarded ad starts only from a button with a video icon that names the exact reward. The button is never green.
- [ ] **B14.** The reward is a bonus. Every level can be finished without watching ads.
- [ ] **B15.** The reward is given only after the ad completes, never after an error or early close, and it is shown clearly.
- [ ] **B16.** One reward needs exactly one ad.
- [ ] **B17.** No rewarded buttons during active play. A continue option shows at the same time, at least as large, next to or above the reward button.
- [ ] **B18.** Rewarded offers are occasional: not on every death, and never right after an interstitial.
- [ ] **B19.** The same reward can also be earned without ads, for example with coins.

**Banners**

- [ ] **B20.** No in-game banners by default. Sticky banners are turned on in the platform console, not in the game.

**Platform-specific**

- [ ] **B21.** **GameDistribution:** A preroll ad plays after the first press of Play.
- [ ] **B22.** **GameDistribution:** The interstitial cooldown can drop to 2 minutes.
- [ ] **B23.** **Yandex, CrazyGames, Poki, Lagged, WG Playground:** The platform limits ad frequency itself, so the cooldown can drop to 0 and request an ad at every natural break.
- [ ] **B24.** **CrazyGames, GameDistribution:** In-game banners, if used, go only on non-gameplay screens that stay open 5+ seconds. Max 2 per screen, never over the UI, at least 20 px from buttons.
- [ ] **B25.** **Poki:** No custom "ad blocked" messages: the platform shows its own.

## C. In-app purchases

- [ ] **C1.** Purchases go only through the platform SDK. No outside payment pages or stores.
- [ ] **C2.** The game is complete and balanced with purchases turned off.
- [ ] **C3.** Where purchases aren't available, every trace of them is hidden: shop, offers, prices, paid-only content, "remove ads".
- [ ] **C4.** Each product shows its price as a number plus the platform currency, both taken from the SDK.
- [ ] **C5.** A product's image, name and contents match exactly what the player gets.
- [ ] **C6.** The in-game product list matches the platform console, and inactive products are not shown.
- [ ] **C7.** Shop offers don't pop up before the player has played.
- [ ] **C8.** A failed or cancelled purchase grants nothing and leaves the game working.
- [ ] **C9.** Purchases that didn't finish are granted on the next launch.
- [ ] **C10.** Each purchase is granted exactly once, even if the restore runs again.
- [ ] **C11.** A purchase is saved right away, to the cloud where available.

**Platform-specific**

- [ ] **C12.** **YouTube, GameDistribution, Poki, CoolMath:** No purchases.
- [ ] **C13.** **Yandex:** No purchases on TV.
- [ ] **C14.** **CrazyGames:** Purchases are by invitation only, and progress is saved in the cloud, not only locally.
- [ ] **C15.** **Poki:** No second, premium-style currency next to the main one, such as gems next to coins.

## D. User data

**Saves**

- [ ] **D1.** All saves go through one save layer. It uses the platform's cloud save, or PlayerPrefs where the platform has none.
  - Unity: one save interface with a backend per platform.
- [ ] **D2.** The game loads saved data before play starts or anything is saved.
- [ ] **D3.** Progress saves right after each meaningful action: level done, unlock, purchase.
- [ ] **D4.** Saves are batched to at most one every 3 seconds.
- [ ] **D5.** Save data is 200 KB or less.
- [ ] **D6.** Progress survives page refresh, rotation, ads and tab switching.
- [ ] **D7.** Saves from older versions load without errors.
- [ ] **D8.** A missing or broken save starts a fresh game instead of crashing.
- [ ] **D9.** Saves never crash the game when browser storage is blocked, such as in private mode.
  - Unity: wrap every storage call in try/catch.

**Accounts and personal data**

- [ ] **D10.** Guest play is the default, and no login is needed to start or play.
- [ ] **D11.** Login opens only when the player presses a button, with a short reason why.
- [ ] **D12.** Only the platform's own account is used. No Google, Facebook or email logins.
- [ ] **D13.** No personal data fields: age, email, location. Name input is allowed only with a profanity filter.
- [ ] **D14.** Players are identified by the platform user ID, never by username or local data.
- [ ] **D15.** Guest progress carries over at login, and synced progress follows the player across devices.

**Platform-specific**

- [ ] **D16.** **YouTube:** Only the platform's save API, and no name or text input.
- [ ] **D17.** **YouTube, GameDistribution:** No login or account screens.
- [ ] **D18.** **CrazyGames:** If the game has accounts, players are signed in automatically and see their platform name and avatar.
- [ ] **D19.** **CrazyGames:** QA rejects any login, token, Xsolla or multiplayer call the game doesn't need.
- [ ] **D20.** **Yandex:** The "uses cloud saves" option is turned on in the draft.
- [ ] **D21.** **GameDistribution:** Progress is saved locally only. Server saves need a separate agreement with GameDistribution and must follow privacy laws.

## E. Analytics & events

- [ ] **E1.** "Game ready" fires once, exactly when the player can first interact.
- [ ] **E2.** "Gameplay start" fires when active play begins, on the player's first input. "Gameplay stop" fires on every state without active play: menu, pause, dialog, ad, level end, game over.
- [ ] **E3.** Start and stop always alternate, never two of the same in a row, and no event fires while an ad shows.
- [ ] **E4.** In-game loading between levels is reported with "loading start" and "loading stop" where the SDK supports them.
- [ ] **E5.** No third-party analytics, trackers or cookies, such as Google Analytics, Firebase or Facebook Pixel.
- [ ] **E6.** Custom events, if any, go only through the platform SDK.
- [ ] **E7.** A missing or failing analytics SDK never blocks or crashes the game.

**Platform-specific**

- [ ] **E8.** **YouTube:** "First frame ready" fires as soon as the loading screen shows.
- [ ] **E9.** **CrazyGames:** The first "gameplay start" ends the download-size measurement, so lazy loading should continue after it.

## F. Controls

- [ ] **F1.** On desktop, the whole game is playable with keyboard and mouse.
- [ ] **F2.** On mobile, the whole game is playable with touch only.
- [ ] **F3.** Every interaction works with both mouse and touch, on any device.
- [ ] **F4.** Touch controls depend on the device type from the platform, not on touch support, because many laptops have touchscreens. Tablets get touch controls too.
- [ ] **F5.** Key bindings use physical key positions, so WASD also works on AZERTY and other layouts.
  - Unity: Input System `Key` values are physical positions.
- [ ] **F6.** No game actions on browser or system shortcuts such as Ctrl/Cmd+W, Ctrl+R, F5, F11 or Alt+Tab.
- [ ] **F7.** Esc does nothing in the game: no pause, no menu, no cursor toggle.
- [ ] **F8.** The cursor is locked only during gameplay that needs it. Tab shows and hides it, and menus and pause release it.
- [ ] **F9.** If the browser releases the cursor (Esc, tab switch), the game shows a pause screen, and a click or Tab locks it again.
  - Unity: the browser always releases the lock on Esc, and ignores new lock requests for about a second afterwards.
- [ ] **F10.** Long press, right click and drag never select text, open the context menu or scroll the page.
  - Unity: `user-select: none` and `touch-action: none` on the canvas, and block `contextmenu` in the template.
- [ ] **F11.** Arrow keys and Space never scroll the page around the game.
  - Unity: keep `WebGLInput.captureAllKeyboardInput` turned on.
- [ ] **F12.** Tapping a text field on mobile opens the on-screen keyboard.
- [ ] **F13.** No input lag, and no ignored input.
- [ ] **F14.** Controls are explained in the game before or during the first play: touch hints on mobile, key hints on desktop.
- [ ] **F15.** No vibration.

**Platform-specific**

- [ ] **F16.** **YouTube:** Esc key events are never blocked.
- [ ] **F17.** **Poki:** Esc or Space pauses and resumes keyboard-controlled games.
- [ ] **F18.** **Yandex:** The remote's arrow keys, OK and Back are enough to play the whole game on TV.
- [ ] **F19.** **Yandex:** Main screens work with one hand and need no scrolling. Strategy, RPG and similar genres are exempt.

## G. User interface

- [ ] **G1.** The game fills the available area and adapts to resize and rotation without stretching.
- [ ] **G2.** Each device type keeps its aspect ratio, centered, with black bars or a background filling the rest. On desktop the play area is never wider than 2:1.
  - Unity: a WebGL template such as MirraGamesTemplate handles this.
- [ ] **G3.** Orientation is never locked in code. It is set in the platform console.
- [ ] **G4.** Nothing is cut off, overlapping or off-screen at any size, and nothing sits under a phone notch.
- [ ] **G5.** Text and icons are readable at 640x360 and pixel ratio 1, and sharp at high pixel ratios.
- [ ] **G6.** Buttons are big and spaced enough for fingers, so taps don't land on the wrong one.
- [ ] **G7.** Every popup has a visible close button.
- [ ] **G8.** No browser popups such as alert, confirm or prompt.
- [ ] **G9.** Icons are universal: gear for settings, speaker for sound, globe for language.
- [ ] **G10.** No fullscreen button.
- [ ] **G11.** No exit or quit button.
- [ ] **G12.** No browser scroll bars or pull-to-refresh. Scrolling inside the game is fine.
- [ ] **G13.** Every visible button works. No placeholders, debug UI, FPS counters or test buttons.
- [ ] **G14.** New players reach gameplay with one click at most.
- [ ] **G15.** Complex mechanics get a short, visual tutorial at the start that players can skip.
- [ ] **G16.** Cutscenes and intros can be skipped.
- [ ] **G17.** The game tells the player clearly when all content is finished.

**Platform-specific**

- [ ] **G18.** **YouTube:** No icons that look like the platform's close, mute or menu buttons.
- [ ] **G19.** **YouTube, GamePix:** No rotate overlay. The game stays playable at any aspect ratio, using black bars.
- [ ] **G20.** **GameDistribution:** A "rotate your device" overlay shows when the device is in the wrong orientation. Yandex and CrazyGames show their own.
- [ ] **G21.** **Poki:** The desktop canvas is 16:9 and scales to 640x360, 836x470 and 1031x580.

## H. Localization

- [ ] **H1.** English is included and is the fallback language.
- [ ] **H2.** Russian is included and used for players set to ru, be, kk, uk or uz.
- [ ] **H3.** The language comes from the platform first, then the system language, then English.
- [ ] **H4.** The game starts in the detected language, with no language picker before play.
- [ ] **H5.** Every text in the game is translated, down to small labels and tooltips. Only decorative text that isn't needed to play, like graffiti or signs, may stay as it is.
- [ ] **H6.** A manual language switch, if present, uses a globe icon and shows each language by its own name (English, Русский).
- [ ] **H7.** Text fits its space in every language. Russian runs about 30% longer than English.
- [ ] **H8.** Fonts contain every character of every supported language.
  - Unity: TextMeshPro atlases include Cyrillic, or use a fallback font.
- [ ] **H9.** Spelling and grammar are correct, and there is no profanity in any language.

**Platform-specific**

- [ ] **H10.** **YouTube, CrazyGames:** The language comes from the platform, then English. The system language is never read.
  - Unity: in WebGL, `Application.systemLanguage` reads the browser language.
- [ ] **H11.** **OK:** The whole interface is in Russian.

## I. Audio

- [ ] **I1.** The game has music, sound effects and UI sounds.
- [ ] **I2.** Settings have separate music and sound effect toggles, and there is no "mute all" button.
- [ ] **I3.** Sound settings are saved and restored.
- [ ] **I4.** All audio stops whenever the game pauses (see J).
- [ ] **I5.** The platform's mute and the device volume always win. When the platform mutes, nothing plays, and in-game toggles can't override it.
- [ ] **I6.** Volume is consistent, with no sudden loud sounds.
- [ ] **I7.** No system media player shows in the browser or on the lock screen.
  - Unity: set every audio clip to Decompress On Load.
- [ ] **I8.** Audio comes back on iOS after a call or app switch.
  - Unity: on each tap, resume the audio context if iOS suspended it.

## J. Pause

- [ ] **J1.** One pause switch controls the whole game: gameplay, physics, timers, audio and input.
  - Unity: one controller owns `Time.timeScale` and `AudioListener.pause`, and nothing else writes them.
- [ ] **J2.** The game pauses when the tab is hidden or minimized, an ad or purchase window opens, or the platform sends a pause event. Clicks outside the game frame don't pause it.
  - Unity: hidden tabs slow the game loop down, but audio keeps playing unless it is paused.
- [ ] **J3.** Pause reasons stack, so the game resumes only after all of them end.
- [ ] **J4.** A pause button is available during gameplay.
- [ ] **J5.** After any automatic pause during play, the game shows a pause screen and resumes on the player's input.
- [ ] **J6.** Progress saves when the tab is hidden or the platform pauses the game.

**Platform-specific**

- [ ] **J7.** **YouTube:** Only the platform's pause and resume events drive pausing, never the browser's tab-visibility API.
- [ ] **J8.** **YouTube:** On the platform's pause event, everything stops, rendering and network calls included.

## K. Social interactions

- [ ] **K1.** Share, rate, leaderboards, achievements and invites use only the platform SDK.
- [ ] **K2.** Where a feature isn't available, its button and every mention of it are hidden.
- [ ] **K3.** Share, rate and invite prompts never interrupt gameplay and show at most once per session.
- [ ] **K4.** Platform dialogs for purchases, invites and sharing open only after a player action.
- [ ] **K5.** No feature is locked behind sharing or inviting friends.
- [ ] **K6.** Guests see a login button in place of leaderboards, never an error.
- [ ] **K7.** The best score sent to a leaderboard matches the best score in the save.
- [ ] **K8.** Leaderboards show platform names. Names typed in the game pass a profanity filter.

**Platform-specific**

- [ ] **K9.** **YouTube, GameDistribution, GamePix:** No share buttons or share prompts.
- [ ] **K10.** **GamePix:** No "Rate us" or "More games" buttons.

## L. Multiplayer

- [ ] **L1.** A match starts within seconds even when nobody is online, thanks to bots or a solo mode.
- [ ] **L2.** Solo play is as easy to find as multiplayer.
- [ ] **L3.** Players see platform usernames, and any names they type pass a profanity filter.
- [ ] **L4.** Chat, if there is any, has a profanity filter and can be turned off in settings. Images and drawings players create are moderated too.
- [ ] **L5.** A lost connection shows a message with a reconnect option, and the game never freezes.
- [ ] **L6.** Multiplayer servers are the only outside connection, and they use HTTPS and WSS.
- [ ] **L7.** In online matches, a pause only stops this player's audio and input. The match goes on, and the player gets a pause screen on return.

**Platform-specific**

- [ ] **L8.** **YouTube:** No online multiplayer, because outside servers aren't allowed. Same-device multiplayer is fine.
- [ ] **L9.** **GameDistribution:** Multiplayer is agreed with the platform before submission.
- [ ] **L10.** **CrazyGames:** Rooms are reported to the SDK so friends can join, and Instant Multiplayer opens straight into a private room.
- [ ] **L11.** **CrazyGames:** After a round, the same group plays on together without leaving the game.
- [ ] **L12.** **CrazyGames:** Chat follows the platform's "disable chat" setting.
- [ ] **L13.** **Poki:** No chat. Players express themselves with emoji only.
- [ ] **L14.** **CoolMath:** Chat, if any, uses only preset phrases and emoji reviewed by the platform.
- [ ] **L15.** **OK:** Game servers handle at least 2,000 players at once and 25,000 installs per hour.

## M. Content & links

**Content**

- [ ] **M1.** Content is family-friendly and suits all ages, but the game isn't made or labeled for children.
- [ ] **M2.** No graphic violence or blood, sustained horror, or realistic violence toward animals, children or the elderly.
- [ ] **M3.** No politics, war, religion, black magic, fortune telling, gambling or cheating.
- [ ] **M4.** No drugs, alcohol, tobacco, sexual content or discrimination.
- [ ] **M5.** All code, art, music, fonts and names are original or licensed, with proof ready on request. No clones, reskins or barely changed templates.
- [ ] **M6.** No well-known names or trademarks in the title or the game.
- [ ] **M7.** No interactive AI in the game. Assets generated with AI in advance are fine, with no watermarks or leftover prompt text.
- [ ] **M8.** No AI-made likenesses of real people, places or events.
- [ ] **M9.** No real money, prizes, promo codes or tradable items. Rewards have value only inside the game.
- [ ] **M10.** No extra user agreements, terms or consent popups in the game.
- [ ] **M11.** Updates keep the same game. A different game is a new submission.

**Links and branding**

- [ ] **M12.** No outgoing links of any kind: websites, social media, stores, other games, surveys, QR codes.
- [ ] **M13.** No studio logos, contact details or social handles. A credits screen is allowed only for license attributions.
- [ ] **M14.** No mentions of the App Store, Google Play or other app stores.

**Platform-specific**

- [ ] **M15.** **CoolMath:** No violence or shooting at all.
- [ ] **M16.** **Poki:** You can show which AI tools and prompts were used, on request.
- [ ] **M17.** **Poki:** A studio logo, if used, appears only on the loading screen, and outgoing links open only through the SDK.
- [ ] **M18.** **Yandex:** Links to your own catalog games, if used, go only through the SDK, never during gameplay, and are clearly marked. None on TV.
- [ ] **M19.** **Yandex:** A community link, if used, points only to a group for your Yandex games, with "Yandex Games" in its name and no outside links.
- [ ] **M20.** **CrazyGames:** Discord or website links, and Steam or Epic links, if used, appear only in the main menu or at the end of a demo, and never as the main call to action.
- [ ] **M21.** **CrazyGames:** If the game collects personal data beyond the SDK, new players see a short privacy notice.
- [ ] **M22.** **OK:** Ads for your own OK games, if used, appear only in a closable window or a 760x60 box.

## Sources

Checked on 10 November 2026, together with Mirra Games publishing experience. Sources marked "partial" are platforms that publish only part of their rules.

1. [CrazyGames requirements](https://docs.crazygames.com/requirements/intro/)
2. [GameDistribution developer guidelines](https://static.gamedistribution.com/developer/developers-guidelines.html)
3. [YouTube Playables certification requirements](https://developers.google.com/youtube/gaming/playables/certification/requirements)
4. [Yandex Games requirements](https://yandex.com/dev/games/doc/en/concepts/requirements)
5. [Yandex Games player data limits](https://yandex.com/dev/games/doc/en/sdk/sdk-player)
6. [Poki requirements and quality](https://developers.poki.com/guide/requirements-quality)
7. [Poki content and player safety](https://developers.poki.com/guide/content-player-safety)
8. [GamePix submission guidelines](https://partners.gamepix.com/guidelines/submission)
9. [OK app placement rules](https://apiok.ru/res/files/apps/OK_platform_rules_EN.pdf)
10. [CoolMath game review criteria, partial](https://www.coolmathgames.com/blog/how-we-review-and-approve-games)
11. [Y8 developer portal, partial](https://www.y8.com/upload)
12. [Lagged SDK, partial](https://lagged.dev/sdk)
13. [WG Playground developers, partial](https://www.wgplayground.com/developers)
14. [WG Playground content guidelines, partial](https://www.wgplayground.com/content-guidelines)
15. [VK moderation rules, partial](https://dev.vk.ru/en/games-catalog-rules)
