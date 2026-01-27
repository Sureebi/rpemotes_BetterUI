# 🎨 Futuristic NUI Emote Menu

A modern, futuristic replacement for the default NativeUI emote menu with cyan/teal neon colors and smooth animations.

## ✨ Features

- 🎨 **Futuristic Design** - Neon cyan/teal colors with glow effects
- 🔍 **Real-time Search** - Find emotes instantly
- 📂 **Categories** - Organized emote categories
- 💫 **Smooth Animations** - Modern transitions and effects
- 📱 **Responsive** - Works on all screen resolutions
- ⚡ **Performance** - Optimized for minimal FPS impact
- 🎯 **8+ Color Themes** - Ready-to-use alternative color schemes

## 📸 Preview

The new UI features:
- Transparent backdrop with blur effect
- Glowing neon borders and text
- Smooth slide-in animations
- Interactive hover effects
- Modern grid layout
- Orbitron futuristic font

## 🚀 Installation

1. **Backup** your current `fxmanifest.lua` and `client/EmoteMenu.lua`

2. **Add new files** to your resource:
   ```
   html/
   ├── index.html
   ├── style.css
   ├── script.js
   └── color-themes.css
   
   client/
   └── EmoteMenuNUI.lua
   ```

3. **Update** `fxmanifest.lua`:
   - Add `ui_page 'html/index.html'`
   - Add HTML files to `files` section
   - Replace `client/EmoteMenu.lua` with `client/EmoteMenuNUI.lua`
   - Remove `NativeUI.lua` from client_scripts

4. **Restart** the resource: `restart rpemotes-reborn`

## ⌨️ Usage

- Press **F4** (or your configured key) to open the menu
- Use the **search bar** to find emotes
- Click on **categories** to filter
- Click on an **emote** to play it
- Press **ESC** to close

## 🎨 Customization

### Change Colors

1. Open `html/color-themes.css`
2. Choose a theme (Purple, Green, Orange, etc.)
3. Copy the theme code
4. Paste at the end of `html/style.css`
5. Restart the resource

### Available Themes

- Cyan/Teal (default) - `#00ffff`
- Purple/Magenta - `#9d4edd`
- Green/Emerald - `#00ff88`
- Orange/Amber - `#ff9500`
- Blue/Electric - `#0099ff`
- Red/Crimson - `#ff0055`
- Gold/Yellow - `#ffd700`
- Pink/Rose - `#ff006e`

### Change Title

Edit `html/index.html` line 15:
```html
<h1 class="menu-title">YOUR TITLE HERE</h1>
```

### Change Size

Edit `html/style.css` around line 40:
```css
.menu-container {
    width: 900px;        /* Width */
    max-height: 85vh;    /* Height */
}
```

## 🔄 Reverting to Old UI

To go back to NativeUI:

1. Restore your backup of `fxmanifest.lua`
2. Or manually:
   - Remove `ui_page` and HTML `files` section
   - Change `EmoteMenuNUI.lua` back to `EmoteMenu.lua`
   - Add `'NativeUI.lua'` back to client_scripts
3. Restart the resource

## 📋 Requirements

- FiveM server
- rpemotes-reborn (or compatible emote script)
- No additional dependencies

## 🐛 Troubleshooting

### Menu doesn't open
- Check F8 console for errors
- Verify all HTML files are in `html/` folder
- Restart the resource

### No emotes showing
- Check that `AnimationList.lua` loads before `EmoteMenuNUI.lua`
- Verify `EmoteData` is populated
- Check F8 console for errors

### Styling issues
- Clear FiveM cache
- Restart the game
- Verify `style.css` is in `html/` folder

## 📝 Documentation

- `QUICKSTART_BG.md` - Quick start guide (Bulgarian)
- `INSTALLATION.md` - Detailed installation (Bulgarian)
- `FEATURES_BG.md` - Full feature list (Bulgarian)
- `SUMMARY_BG.md` - Changes summary (Bulgarian)

## 🎯 Compatibility

- ✅ ESX
- ✅ QBCore
- ✅ Standalone
- ✅ All rpemotes-reborn features
- ✅ Permissions (ACE)
- ✅ Keybinds
- ✅ Favorites

## 📊 Stats

- **Files**: 4 (HTML, CSS, JS, Lua)
- **Size**: ~32 KB total
- **Lines of code**: ~1150
- **Color themes**: 8 ready-to-use
- **Animations**: 10+ different effects

## 🤝 Credits

- Original rpemotes-reborn script
- New NUI design created for modern FiveM servers
- Inspired by futuristic/cyberpunk UI designs

## 📄 License

Same as rpemotes-reborn

---

**Enjoy your new futuristic emote menu!** 🚀
