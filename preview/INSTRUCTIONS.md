# How to Add Preview Images

## Required Images

Please add the following screenshots to this folder:

1. **main-menu.png** 
   - Screenshot of the main menu showing all categories
   - Should show: ЛЮБИМИ, ВСИЧКИ, PROP EMOTES, SHARED EMOTES, DANCE EMOTES, MOODS, WALK STYLES
   - Size: Recommended 1920x1080 or similar

2. **emote-selection.png**
   - Screenshot of the emote grid/selection view
   - Should show multiple emotes in a grid (e.g., CUP, AXE, MOJITO, etc.)
   - Shows emote icons, names, and commands

3. **emote-detailed.png**
   - Screenshot showing detailed emote view
   - Should show a full grid of emotes with favorite stars
   - Can be from DANCE EMOTES category or similar

## Steps to Add Images

1. Take screenshots in-game (press F4 to open menu)
2. Save them with the exact names above
3. Place them in this `preview/` folder
4. Run these commands:
   ```bash
   git add preview/*.png
   git commit -m "Add preview screenshots"
   git push
   ```

The images will automatically appear in the main README once uploaded to GitHub.

