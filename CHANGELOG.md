# Unity WebGL Publishing Checklist 2.0.0

### What's new

1. Human checks come first in every section, and checks a script or an AI can take over sit in a "Can be automated" block with `Auto test` and `Ask AI` hints
2. A cover warning asks developers to check the build themselves before sending it for review
3. New copyright check against characters, models, textures and sounds copied from or imitating a known game, film or brand
4. New content check against real or photorealistic people, AI-generated ones included
5. Controls and hints must match the device: no key hints on mobile, no touch controls or "tap" texts on desktop
6. Optional chips mark the blocks a game can skip when it lacks the feature: purchases, social interactions, multiplayer, rewarded ads and login
7. Playgama joins as the 13th supported platform
8. New general checks: the build loads without compression headers, the platform SDK loads before any other script, and the in-game title matches the submitted one
9. Tightened wording for saves, revive offers, icons and the background around the play area
10. The PDF shows the version, the number of checks that can be automated and the warning on its cover

### Important

1. Every item number changed in this version. From now on numbers are permanent: new items take the next free number, and removed numbers are never reused
2. The PDF tool moved to `Tools/PrintPDF` and writes into `Tools/PrintPDF/Output`
