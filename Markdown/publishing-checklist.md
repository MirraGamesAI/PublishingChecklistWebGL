# Unity WebGL Publishing Checklist

> [!WARNING]
> **Check the build yourself before you send it to us.** Every check that applies to your game and its platforms must pass first. A build that fails comes back for fixes, and every round costs time on both sides, so please check carefully.

One checklist for Unity WebGL games on 13 web platforms, listed in Sources. It covers the game build. Store page material such as thumbnails and descriptions is not covered.

1. Main items pass on every platform: build them once.
2. Items that start with a platform name apply only there: enable them in code with a platform check.
3. Blocks marked Optional cover features a game may not have. Skip the block if the game lacks the feature, otherwise every check in it is required.
4. Items under "Can be automated" are still required. Without tools or AI, check them by hand.
5. `Auto test` means a script can check the item and report pass or fail. `Ask AI` means an AI can review the code, text or assets.
6. Item numbers never change, so QA can report a failure briefly, like "G4 failed".

## A. Build & performance

- [ ] **A1.** A loading screen with progress shows at once.
- [ ] **A2.** No splash or logo screens before the game, including Unity's if the license allows turning it off.
- [ ] **A3.** The game runs in current Chrome, Edge, Firefox, Safari and Yandex Browser, on desktop and mobile.
- [ ] **A4.** No crashes, freezes or error messages on rotate, resize, minimize, ads, or browser back and forward.
- [ ] **A5.** Game speed and physics are the same at 60, 144 and 165 Hz.

**Can be automated**

- [ ] **A6.** `Auto test` Initial download is 20 MB or less, as served (compressed).
  - Unity: Brotli compression, managed code stripping, optional content in Addressables.
- [ ] **A7.** `Auto test` Total build is 100 MB or less on disk, with at most 1,500 files and no file over 30 MB.
- [ ] **A8.** `Auto test` `index.html` is at the archive root. File names use only Latin letters, digits, `_`, `-` and `.`.
- [ ] **A9.** `Auto test` All files ship in the build and load by relative paths. No absolute URLs.
- [ ] **A10.** `Auto test` The game runs on any domain: no sitelock or URL checks.
- [ ] **A11.** `Auto test` The build loads on hosts that send no compression headers.
  - Unity: enable Decompression Fallback.
- [ ] **A12.** `Auto test` The platform SDK loads before any other script inside the iframe.
- [ ] **A13.** `Auto test` The game still starts if the platform SDK fails to load, for example because of an ad blocker.
- [ ] **A14.** `Auto test` The game is playable within 20 seconds (5 is the target).
- [ ] **A15.** `Auto test` No errors in the browser console.
- [ ] **A16.** `Auto test` No Unity "not supported on mobile" warning.
  - Unity: remove the mobile check from the WebGL template.
- [ ] **A17.** `Auto test` Peak memory is 256 MB or less on mobile and 512 MB or less on desktop.
  - Unity: set Maximum Memory Size, and test on an iPhone first.
- [ ] **A18.** `Auto test` The page shows only the game: no default Unity template frame, logo or footer.
  - Unity: start from a minimal WebGL template, such as MirraGamesTemplate.
- [ ] **A19.** `Ask AI` The game calls only the SDK features it actually uses.
- [ ] **A20.** `Ask AI` The page never reloads or navigates away during play.
- [ ] **A21.** `Auto test` **YouTube:** No network requests except through the platform SDK.
- [ ] **A22.** `Auto test` **VK:** The platform's init event is sent at startup, or the game won't run.
- [ ] **A23.** `Ask AI` **GamePix:** No third-party SDKs besides the GamePix and Xsolla ones.

## B. Advertisement

**General**

- [ ] **B1.** No home-made ad units or promo images in the game.
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

**Rewarded ads** (Optional)

- [ ] **B12.** A rewarded ad starts only from a button with a video icon that names the exact reward. The button is never green.
- [ ] **B13.** The reward is a bonus. Every level can be finished without watching ads.
- [ ] **B14.** The reward is given only after the ad completes, never after an error or early close, and it is shown clearly.
- [ ] **B15.** One reward needs exactly one ad.
- [ ] **B16.** No rewarded buttons during active play. A continue option shows at the same time, at least as large, next to or above the reward button.
- [ ] **B17.** Rewarded offers are occasional: a revive at most once per attempt, and never right after an interstitial.
- [ ] **B18.** The same reward can also be earned without ads, for example with coins.

**Banners**

- [ ] **B19.** No in-game banners by default. Sticky banners are turned on in the platform console, not in the game.

**Platform-specific**

- [ ] **B20.** **GameDistribution:** A preroll ad plays after the first press of Play.
- [ ] **B21.** **CrazyGames, GameDistribution:** In-game banners, if used, go only on non-gameplay screens that stay open 5+ seconds. Max 2 per screen, never over the UI, at least 20 px from buttons.
- [ ] **B22.** **Poki:** No custom "ad blocked" messages: the platform shows its own.

**Can be automated**

- [ ] **B23.** `Ask AI` Ads come only from the platform SDK, with no other ad networks.
- [ ] **B24.** `Ask AI` A cooldown in the game keeps interstitials at least 3 minutes apart. It is configurable per platform.
- [ ] **B25.** `Ask AI` **GameDistribution:** The interstitial cooldown can drop to 2 minutes.
- [ ] **B26.** `Ask AI` **Yandex, CrazyGames, Poki, Lagged, WG Playground, Playgama:** The platform limits ad frequency itself, so the cooldown can drop to 0 and request an ad at every natural break.

## C. In-app purchases (Optional)

- [ ] **C1.** The game is complete and balanced with purchases turned off.
- [ ] **C2.** Where purchases aren't available, every trace of them is hidden: shop, offers, prices, paid-only content, "remove ads".
- [ ] **C3.** Each product shows its price as a number plus the platform currency, both taken from the SDK.
- [ ] **C4.** A product's image, name and contents match exactly what the player gets.
- [ ] **C5.** The in-game product list matches the platform console, and inactive products are not shown.
- [ ] **C6.** Shop offers don't pop up before the player has played.
- [ ] **C7.** A failed or cancelled purchase grants nothing and leaves the game working.

**Platform-specific**

- [ ] **C8.** **YouTube, GameDistribution, Poki, CoolMath:** No purchases.
- [ ] **C9.** **Yandex:** No purchases on TV.
- [ ] **C10.** **CrazyGames:** Purchases are by invitation only, and progress is saved in the cloud, not only locally.
- [ ] **C11.** **Poki:** No second, premium-style currency next to the main one, such as gems next to coins.

**Can be automated**

- [ ] **C12.** `Ask AI` Purchases go only through the platform SDK. No outside payment pages or stores.
- [ ] **C13.** `Auto test` Purchases that didn't finish are granted on the next launch.
- [ ] **C14.** `Auto test` Each purchase is granted exactly once, even if the restore runs again.
- [ ] **C15.** `Ask AI` A purchase is saved right away, to the cloud where available.

## D. User data

**Saves and personal data**

- [ ] **D1.** Progress saves right after each meaningful action: level done, unlock, purchase.
- [ ] **D2.** Progress survives page refresh, rotation, ads and tab switching.
- [ ] **D3.** No personal data fields: age, email, location. Name input is allowed only with a profanity filter.

**Login** (Optional)

- [ ] **D4.** Guest play is the default, and no login is needed to start or play.
- [ ] **D5.** Login opens only when the player presses a button, with a short reason why.
- [ ] **D6.** Only the platform's own account is used. No Google, Facebook or email logins.
- [ ] **D7.** Guest progress carries over at login, and synced progress follows the player across devices.

**Platform-specific**

- [ ] **D8.** **YouTube:** No name or text input.
- [ ] **D9.** **YouTube, GameDistribution:** No login or account screens.
- [ ] **D10.** **CrazyGames:** If the game has accounts, players are signed in automatically and see their platform name and avatar.
- [ ] **D11.** **Yandex:** The "uses cloud saves" option is turned on in the draft.

**Can be automated**

- [ ] **D12.** `Ask AI` All saves go through one save layer. It uses the platform's save API wherever one exists, and PlayerPrefs only where there is none.
  - Unity: one save interface with a backend per platform.
- [ ] **D13.** `Ask AI` The game loads saved data before play starts or anything is saved.
- [ ] **D14.** `Auto test` Saves are batched to at most one every 3 seconds.
- [ ] **D15.** `Auto test` Save data is 200 KB or less.
- [ ] **D16.** `Auto test` Saves from older versions load without errors.
- [ ] **D17.** `Auto test` A missing or broken save starts a fresh game instead of crashing.
- [ ] **D18.** `Auto test` Saves never crash the game when browser storage is blocked, such as in private mode.
  - Unity: wrap every storage call in try/catch.
- [ ] **D19.** `Ask AI` Players are identified by the platform user ID, never by username or local data.
- [ ] **D20.** `Ask AI` **CrazyGames:** QA rejects any login, token, Xsolla or multiplayer call the game doesn't need.
- [ ] **D21.** `Ask AI` **GameDistribution:** Progress is saved locally only. Server saves need a separate agreement with GameDistribution and must follow privacy laws.

## E. Analytics & events

**Can be automated**

- [ ] **E1.** `Auto test` "Game ready" fires once, exactly when the player can first interact.
- [ ] **E2.** `Auto test` "Gameplay start" fires when active play begins, on the player's first input. "Gameplay stop" fires on every state without active play: menu, pause, dialog, ad, level end, game over.
- [ ] **E3.** `Auto test` Start and stop always alternate, never two of the same in a row, and no event fires while an ad shows.
- [ ] **E4.** `Auto test` In-game loading between levels is reported with "loading start" and "loading stop" where the SDK supports them.
- [ ] **E5.** `Auto test` No third-party analytics, trackers or cookies, such as Google Analytics, Firebase or Facebook Pixel.
- [ ] **E6.** `Auto test` A missing or failing analytics SDK never blocks or crashes the game.
- [ ] **E7.** `Ask AI` Custom events, if any, go only through the platform SDK.
- [ ] **E8.** `Auto test` **YouTube:** "First frame ready" fires as soon as the loading screen shows.
- [ ] **E9.** `Ask AI` **CrazyGames:** The first "gameplay start" ends the download-size measurement, so lazy loading should continue after it.

## F. Controls

- [ ] **F1.** On desktop, the whole game is playable with keyboard and mouse.
- [ ] **F2.** On mobile, the whole game is playable with touch only.
- [ ] **F3.** Every interaction works with both mouse and touch, on any device.
- [ ] **F4.** Controls adapt to the device: touch controls on phones and tablets, keyboard and mouse on desktop.
- [ ] **F5.** Hints match the device: no key names or icons on mobile, no touch controls or "tap" texts on desktop.
- [ ] **F6.** Controls are explained in the game before or during the first play.
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

**Platform-specific**

- [ ] **F14.** **Poki:** Esc or Space pauses and resumes keyboard-controlled games.
- [ ] **F15.** **Yandex:** The remote's arrow keys, OK and Back are enough to play the whole game on TV.
- [ ] **F16.** **Yandex:** Main screens work with one hand and need no scrolling. Strategy, RPG and similar genres are exempt.

**Can be automated**

- [ ] **F17.** `Ask AI` Controls and hints depend on the device type from the platform, not on touch support, because many laptops have touchscreens. Tablets get touch controls too.
- [ ] **F18.** `Ask AI` Every text that names a key, click or tap has a version for the other device.
- [ ] **F19.** `Ask AI` Key bindings use physical key positions, so WASD also works on AZERTY and other layouts.
  - Unity: Input System `Key` values are physical positions.
- [ ] **F20.** `Ask AI` No game actions on browser or system shortcuts such as Ctrl/Cmd+W, Ctrl+R, F5, F11 or Alt+Tab.
- [ ] **F21.** `Auto test` No vibration.
- [ ] **F22.** `Ask AI` **YouTube:** Esc key events are never blocked.

## G. User interface

- [ ] **G1.** The game fills the available area and adapts to resize and rotation without stretching.
- [ ] **G2.** Each device type keeps its aspect ratio, centered, with a cover background or black bars filling the rest. On desktop the play area is never wider than 2:1.
  - Unity: a WebGL template such as MirraGamesTemplate handles this.
- [ ] **G3.** Nothing is cut off, overlapping or off-screen at any size, and nothing sits under a phone notch.
- [ ] **G4.** Text and icons are readable at 640x360 and pixel ratio 1, and sharp at high pixel ratios.
- [ ] **G5.** Buttons are big and spaced enough for fingers, so taps don't land on the wrong one.
- [ ] **G6.** Every popup has a visible close button.
- [ ] **G7.** Icons are drawn, not emoji, and universal: gear for settings, speaker for sound, globe for language.
- [ ] **G8.** No fullscreen button.
- [ ] **G9.** No exit or quit button.
- [ ] **G10.** No browser scroll bars or pull-to-refresh. Scrolling inside the game is fine.
- [ ] **G11.** Every visible button works on the current device. No placeholders, debug UI, FPS counters or test buttons.
- [ ] **G12.** New players reach gameplay with one click at most.
- [ ] **G13.** Complex mechanics get a short, visual tutorial at the start that players can skip.
- [ ] **G14.** Cutscenes and intros can be skipped.
- [ ] **G15.** The game tells the player clearly when all content is finished.
- [ ] **G16.** The title in the game matches the title submitted to the platform.

**Platform-specific**

- [ ] **G17.** **YouTube:** No icons that look like the platform's close, mute or menu buttons.
- [ ] **G18.** **YouTube, GamePix:** No rotate overlay. The game stays playable at any aspect ratio, using black bars.
- [ ] **G19.** **GameDistribution:** A "rotate your device" overlay shows when the device is in the wrong orientation. Yandex and CrazyGames show their own.
- [ ] **G20.** **Poki:** The desktop canvas is 16:9 and scales to 640x360, 836x470 and 1031x580.

**Can be automated**

- [ ] **G21.** `Ask AI` Orientation is never locked in code. It is set in the platform console.
- [ ] **G22.** `Auto test` No browser popups such as alert, confirm or prompt.

## H. Localization

- [ ] **H1.** The game starts in the detected language, with no language picker before play.
- [ ] **H2.** A manual language switch, if present, uses a globe icon and shows each language by its own name (English, Русский).
- [ ] **H3.** Text fits its space in every language. Russian runs about 30% longer than English.

**Platform-specific**

- [ ] **H4.** **OK:** The whole interface is in Russian.

**Can be automated**

- [ ] **H5.** `Ask AI` English is included and is the fallback language.
- [ ] **H6.** `Ask AI` Russian is included and used for players set to ru, be, kk, uk or uz.
- [ ] **H7.** `Ask AI` The language comes from the platform first, then the system language, then English.
- [ ] **H8.** `Ask AI` Every text in the game is translated, down to small labels and tooltips. Only decorative text that isn't needed to play, like graffiti or signs, may stay as it is.
- [ ] **H9.** `Ask AI` Spelling and grammar are correct, and there is no profanity in any language.
- [ ] **H10.** `Auto test` Fonts contain every character of every supported language.
  - Unity: TextMeshPro atlases include Cyrillic, or use a fallback font.
- [ ] **H11.** `Ask AI` **YouTube, CrazyGames, Playgama:** The language comes from the platform, then English. The system language is never read.
  - Unity: in WebGL, `Application.systemLanguage` reads the browser language.

## I. Audio

- [ ] **I1.** The game has music, sound effects and UI sounds.
- [ ] **I2.** Settings have separate music and sound effect toggles, and there is no "mute all" button.
- [ ] **I3.** Sound settings are saved and restored.
- [ ] **I4.** All audio stops whenever the game pauses (see J).
- [ ] **I5.** The platform's mute and the device volume always win. When the platform mutes, nothing plays, and in-game toggles can't override it.
- [ ] **I6.** Volume is consistent, with no sudden loud sounds.
- [ ] **I7.** Audio comes back on iOS after a call or app switch.
  - Unity: on each tap, resume the audio context if iOS suspended it.

**Can be automated**

- [ ] **I8.** `Auto test` No system media player shows in the browser or on the lock screen.
  - Unity: set every audio clip to Decompress On Load.

## J. Pause

- [ ] **J1.** The game pauses when the tab is hidden or minimized, an ad or purchase window opens, or the platform sends a pause event. Clicks outside the game frame don't pause it.
  - Unity: hidden tabs slow the game loop down, but audio keeps playing unless it is paused.
- [ ] **J2.** A pause button is available during gameplay.
- [ ] **J3.** After any automatic pause during play, the game shows a pause screen and resumes on the player's input.

**Can be automated**

- [ ] **J4.** `Ask AI` One pause switch controls the whole game: gameplay, physics, timers, audio and input.
  - Unity: one controller owns `Time.timeScale` and `AudioListener.pause`, and nothing else writes them.
- [ ] **J5.** `Auto test` Pause reasons stack, so the game resumes only after all of them end.
- [ ] **J6.** `Auto test` Progress saves when the tab is hidden or the platform pauses the game.
- [ ] **J7.** `Ask AI` **YouTube:** Only the platform's pause and resume events drive pausing, never the browser's tab-visibility API.
- [ ] **J8.** `Auto test` **YouTube:** On the platform's pause event, everything stops, rendering and network calls included.

## K. Social interactions (Optional)

- [ ] **K1.** Where a feature isn't available, its button and every mention of it are hidden.
- [ ] **K2.** Share, rate and invite prompts never interrupt gameplay and show at most once per session.
- [ ] **K3.** Platform dialogs for purchases, invites and sharing open only after a player action.
- [ ] **K4.** No feature is locked behind sharing or inviting friends.
- [ ] **K5.** Guests see a login button in place of leaderboards, never an error.
- [ ] **K6.** The best score sent to a leaderboard matches the best score in the save.
- [ ] **K7.** Leaderboards show platform names. Names typed in the game pass a profanity filter.

**Platform-specific**

- [ ] **K8.** **YouTube, GameDistribution, GamePix:** No share buttons or share prompts.
- [ ] **K9.** **GamePix:** No "Rate us" or "More games" buttons.

**Can be automated**

- [ ] **K10.** `Ask AI` Share, rate, leaderboards, achievements and invites use only the platform SDK.

## L. Multiplayer (Optional)

- [ ] **L1.** A match starts within seconds even when nobody is online, thanks to bots or a solo mode.
- [ ] **L2.** Solo play is as easy to find as multiplayer.
- [ ] **L3.** Players see platform usernames, and any names they type pass a profanity filter.
- [ ] **L4.** Chat, if there is any, has a profanity filter and can be turned off in settings. Images and drawings players create are moderated too.
- [ ] **L5.** A lost connection shows a message with a reconnect option, and the game never freezes.
- [ ] **L6.** In online matches, a pause only stops this player's audio and input. The match goes on, and the player gets a pause screen on return.

**Platform-specific**

- [ ] **L7.** **YouTube:** No online multiplayer, because outside servers aren't allowed. Same-device multiplayer is fine.
- [ ] **L8.** **GameDistribution:** Multiplayer is agreed with the platform before submission.
- [ ] **L9.** **CrazyGames:** Rooms are reported to the SDK so friends can join, and Instant Multiplayer opens straight into a private room.
- [ ] **L10.** **CrazyGames:** After a round, the same group plays on together without leaving the game.
- [ ] **L11.** **Poki:** No chat. Players express themselves with emoji only.
- [ ] **L12.** **CoolMath:** Chat, if any, uses only preset phrases and emoji reviewed by the platform.

**Can be automated**

- [ ] **L13.** `Auto test` Multiplayer servers are the only outside connection, and they use HTTPS and WSS.
- [ ] **L14.** `Ask AI` **CrazyGames:** Chat follows the platform's "disable chat" setting.
- [ ] **L15.** `Auto test` **OK:** Game servers handle at least 2,000 players at once and 25,000 installs per hour.

## M. Content & links

**Content**

- [ ] **M1.** Content is family-friendly and suits all ages, but the game isn't made or labeled for children.
- [ ] **M2.** No graphic violence or blood, sustained horror, or realistic violence toward animals, children or the elderly.
- [ ] **M3.** No politics, war, religion, black magic, fortune telling, gambling or cheating.
- [ ] **M4.** No drugs, alcohol, tobacco, sexual content or discrimination.
- [ ] **M5.** No real or photorealistic people: no photos, video or face scans, AI-generated included.
- [ ] **M6.** No interactive AI in the game. Assets generated with AI in advance are fine, with no watermarks or leftover prompt text.
- [ ] **M7.** No AI-made imitations of real places or events.
- [ ] **M8.** No real money, prizes, promo codes or tradable items. Rewards have value only inside the game.
- [ ] **M9.** No extra user agreements, terms or consent popups in the game.
- [ ] **M10.** Updates keep the same game. A different game is a new submission.

**Copyright**

- [ ] **M11.** All code, art, music, fonts and names are original or licensed, with proof ready on request. No clones, reskins or barely changed templates.
- [ ] **M12.** No well-known names or trademarks in the title or the game.
- [ ] **M13.** No characters, models, textures or sounds copied from or imitating a known game, film or brand, such as Roblox avatars or Minecraft blocks and mobs.

**Links and branding**

- [ ] **M14.** No outgoing links of any kind: websites, social media, stores, other games, surveys, QR codes.
- [ ] **M15.** No studio logos, contact details or social handles. A credits screen is allowed only for license attributions.

**Platform-specific**

- [ ] **M16.** **CoolMath:** No violence or shooting at all.
- [ ] **M17.** **Poki:** You can show which AI tools and prompts were used, on request.
- [ ] **M18.** **Poki:** A studio logo, if used, appears only on the loading screen, and outgoing links open only through the SDK.
- [ ] **M19.** **Yandex:** Links to your own catalog games, if used, go only through the SDK, never during gameplay, and are clearly marked. None on TV.
- [ ] **M20.** **Yandex:** A community link, if used, points only to a group for your Yandex games, with "Yandex Games" in its name and no outside links.
- [ ] **M21.** **CrazyGames:** Discord or website links, and Steam or Epic links, if used, appear only in the main menu or at the end of a demo, and never as the main call to action.
- [ ] **M22.** **CrazyGames:** If the game collects personal data beyond the SDK, new players see a short privacy notice.
- [ ] **M23.** **OK:** Ads for your own OK games, if used, appear only in a closable window or a 760x60 box.

**Can be automated**

- [ ] **M24.** `Ask AI` No mentions of the App Store, Google Play or other app stores.

## Sources

Checked on 10 November 2026, together with Mirra Games publishing experience. Playgama was added on 13 November 2026. Sources marked "partial" are platforms that publish only part of their rules.

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
16. [Playgama game requirements](https://wiki.playgama.com/playgama/game-requirements)
17. [Playgama Bridge SDK required steps](https://wiki.playgama.com/playgama/bridge-sdk/api)
