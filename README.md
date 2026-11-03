# Straight Drive Terminal

Serial (UART / RS485 / USB) and BLE device terminal that runs in the browser, by Straight Drive.

**Open the tool:** https://hema-sdsl.github.io/SD_Serial_Terminal/

## How to use
- Use **Chrome** or **Edge** on a laptop / PC.
- **Serial:** choose *Serial Terminal* → **Add port…** → pick your board → **Connect**.
- **BLE:** turn Bluetooth on → choose *BLE Terminal* → **Scan & Connect**.
- Press **F1** inside the tool for help and shortcuts.

## Install as a desktop app
Open the link and click **Install app** in the top bar (or ⋮ menu → *Install as desktop app*).
You get a **SD Terminal** icon on your desktop / Start menu that opens in its own window and also works offline.

## Updates
When a new version is published, the tool shows **"New version available"** — click **Update now**.
No reinstall needed; your commands and settings are kept. See ⋮ → *What's new* for the change list.

## Files
| File | Purpose |
|---|---|
| `index.html` | The tool itself |
| `version.json` | Latest version number + notes (used for update notifications) |
| `sw.js` | Offline copy + one-click updates |
| `manifest.webmanifest`, `icons/` | Desktop app name and icon |
