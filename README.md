# RPEmotes BetterUI

Modern version of RPEmotes with an improved user interface for FiveM.

## 📸 Preview

### Main Menu
![Emote Menu](https://github.com/Sureebi/rpemotes_BetterUI/blob/main/preview/main-menu.png)

The emote menu with categories, search functionality, and easy access to all features.

### Categories
- **FAVORITES** - Quick access to favorite emotes
- **ALL** - All available emotes (1145+)
- **PROP EMOTES** - Emotes with props (654+)
- **SHARED EMOTES** - Shared emotes (94+)
- **DANCE EMOTES** - Dance emotes (136+)
- **MOODS** - Moods and expressions (38+)
- **WALK STYLES** - Walking styles (130+)

### Emote Selection
![Emote Selection](https://github.com/Sureebi/rpemotes_BetterUI/blob/main/preview/emote-selection.png)

Intuitive interface for selecting emotes with visual icons and commands.

## ✨ Features

- 🎨 **Modern UI** - Improved user interface with neon blue and pink accents
- 🔍 **Search** - Quick search for emotes in Bulgarian language
- ⭐ **Favorites** - Save favorite emotes for quick access
- 📱 **Easy Navigation** - Intuitive interface with clear instructions
- 🎭 **Multiple Categories** - Organized categories for easier finding
- 💫 **Visual Icons** - Each category and emote has a visual icon

## 🎮 Controls

- **ESC** - Close menu
- **ENTER** - Select emote
- **← BACK** - Go back

## 📦 Installation for FiveM

### Step 1: Download the Resource

1. Clone the repository:
```bash
git clone https://github.com/Sureebi/rpemotes_BetterUI.git
```

Or download the ZIP file and extract it.

### Step 2: Install to Your Server

1. Copy the `rpemotes` folder to your FiveM server's `resources` directory:
   ```
   your-server/
   └── resources/
       └── rpemotes/
   ```

2. Make sure the folder structure looks like this:
   ```
   rpemotes/
   ├── client/
   ├── server/
   ├── shared/
   ├── html/
   ├── locales/
   ├── stream/
   ├── fxmanifest.lua
   ├── config.lua
   └── ...
   ```

### Step 3: Configure Server

1. Open your `server.cfg` file
2. Add the resource:
   ```
   ensure rpemotes
   ```
   Or if you want it to start automatically:
   ```
   start rpemotes
   ```

### Step 4: Restart Server

1. Restart your FiveM server
2. The resource should load automatically

### Step 5: Test in Game

1. Join your server
2. Press **F4** (or your configured key) to open the emote menu
3. You should see the new futuristic menu with cyan/blue colors

## 🔧 Configuration

All settings can be changed in `rpemotes/config.lua`:

- **Keybind**: Change the key to open the menu (default: F4)
- **Language**: Select your preferred language
- **Hide Adult Emotes**: Enable/disable adult content
- **Hide Animal Emotes**: Enable/disable animal emotes
- And many more options...

### Changing the Menu Key

In `rpemotes/config.lua`, find:
```lua
MenuKeybind = 'F4', -- Key to open the emote menu
```

Change `'F4'` to your desired key.

### Changing Language

In `rpemotes/config.lua`, find:
```lua
Language = 'en', -- Language code (en, bg, de, etc.)
```

Change to your preferred language code.

## 🐛 Troubleshooting

### Menu doesn't open

**Solution:**
1. Check F8 console for errors
2. Make sure `ui_page 'html/index.html'` is in `fxmanifest.lua`
3. Verify all HTML files are in the `html/` folder
4. Check server console for resource errors

### Menu is empty (no emotes)

**Solution:**
1. Check that `EmoteData`, `SharedEmoteData`, `ExpressionData` and `WalkData` are loaded
2. Make sure `client/AnimationList.lua` loads before `client/EmoteMenuNUI.lua`
3. Check F8 console for JavaScript errors

### Style doesn't load properly

**Solution:**
1. Clear FiveM cache (delete the `cache` folder)
2. Restart the game
3. Verify that `style.css` is in the `html/` folder
4. Check browser console (F12) for CSS errors

### Want to revert to old UI

**Solution:**
1. Open `fxmanifest.lua`
2. Remove:
   ```lua
   ui_page 'html/index.html'
   files {
       'html/index.html',
       'html/style.css',
       'html/script.js'
   }
   ```
3. Change in `client_scripts`:
   ```lua
   'client/EmoteMenuNUI.lua' → 'client/EmoteMenu.lua'
   ```
4. Add back:
   ```lua
   'NativeUI.lua' (at the beginning of client_scripts)
   ```
5. Restart the resource

## 🎨 Customization

### Changing Colors

1. Open `html/color-themes.css`
2. Select your desired theme
3. Copy the code
4. Paste it at the end of `html/style.css`
5. Restart the resource

### Changing Menu Title

In `html/index.html`, find:
```html
<h1 class="menu-title">EMOTE MENU</h1>
```

Change to:
```html
<h1 class="menu-title">YOUR TITLE</h1>
```

### Changing Menu Size

In `html/style.css`, find:
```css
.menu-container {
    width: 900px;
    max-height: 85vh;
    ...
}
```

Change `width` and `max-height` according to your preferences.

## 📝 License

See `rpemotes/license` for details.

## 🙏 Credits

Based on [RPEmotes Reborn](https://github.com/TayMcKenzieNZ/rpemotes) with UI improvements.

## 📞 Support

For questions and issues, please open an [Issue](https://github.com/Sureebi/rpemotes_BetterUI/issues) on GitHub.

---

⭐ If you like this project, don't forget to star it!
