# ESP Web Tool
A web app to flash your ESP32 or ESP8266 through your browser with pre-built firmware. Open-Source, free, and easy to use.

Have a look [serial.huhn.me](https://esp.huhn.me)

## Features
- **Multiple firmware options**: Choose from available firmware in the manifest
- **Firmware selection**: Easy-to-use interface to select desired firmware
- **Automatic loading**: Firmware list loaded from manifest.json
- **Chip-specific firmware**: Separate firmware for ESP32 and ESP8266
- **Web-based**: Works directly in your browser
- **Cross-platform**: Works on Windows, Mac, Linux

## How it works
1. Connect your ESP32/ESP8266 to your computer via USB
2. Open the web app and click "Connect"
3. Select your device's serial port
4. Choose firmware from the available list
5. Click "Load Firmware" to prepare the firmware
6. Click "Program" to flash the selected firmware
7. Done! Your device is now flashed with the selected firmware

## Firmware Management
- **Manifest File**: `public/firmware/manifest.json` contains firmware collection info
- **Firmware Files**: Binary files stored in `public/firmware/` directory
- **Supported Chips**: ESP32, ESP8266, ESP32C3, ESP32S2, ESP32S3
- **Flash Address**: Configurable per firmware build (default: 65536 = 0x10000)
- **Versioning**: Multiple versions supported for each chip family

## Credits
Based on [ESP Web Flasher](https://github.com/NabuCasa/esp-web-flasher)  
And inspired by [esptool-js](https://github.com/espressif/esptool-js).

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or later)
- [Git](https://git-scm.com/)

### Local Development

**For Windows PowerShell:**
```powershell
# If you get execution policy error, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Clone and setup
git clone https://github.com/spacehuhntech/espwebtool
cd espwebtool
npm install
npm start
```

**For Windows Command Prompt:**
```cmd
git clone https://github.com/spacehuhntech/espwebtool
cd espwebtool
npm install
npm start
```

The app will be available at: http://localhost:3000

## Deploy to GitHub Pages

### Method 1: Using GitHub Actions (Recommended)
1. Push your code to GitHub
2. Go to your repository Settings > Pages
3. Set Source to "GitHub Actions"
4. The workflow will automatically deploy when you push to main branch

### Method 2: Manual Deploy

**Using PowerShell:**
```powershell
# If you get execution policy error, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
npm install

# Install gh-pages
npm install --save-dev gh-pages

# Build and deploy
npm run deploy
```

**Using Command Prompt (cmd):**
```cmd
# Install dependencies
npm install

# Install gh-pages
npm install --save-dev gh-pages

# Build and deploy
npm run deploy
```

**Note:** Update the `homepage` field in `package.json` with your GitHub username:
```json
"homepage": "https://[YOUR_GITHUB_USERNAME].github.io/espwebtool"
```

## Windows-specific Notes

- **PowerShell Execution Policy**: If you encounter execution policy errors, run:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- **Alternative**: Use Command Prompt (cmd) instead of PowerShell

## License 

This software is licensed under the MIT License. See the [license file](LICENSE) for details.  

## Visitor counter

This project includes a simple, local visitor counter shown in the top-right of the header. By default it uses `localStorage` and counts unique browsers (per device+browser). This is a lightweight client-side approach and does not represent a global site-wide metric.

If you want a global counter shared across all visitors, this project ships with a client-side integration to CountAPI (https://countapi.xyz/) which provides simple public counters without a backend.

How it works in this project:
- By default `src/components/VisitCounter.js` calls CountAPI at the namespace/key `espwebtool/total_visits` to increment and fetch the global total.
- If CountAPI is unavailable the component falls back to a localStorage-based total for the current browser.

To customize:
- Create your own CountAPI namespace/key and update `COUNTAPI_NAMESPACE` and `COUNTAPI_KEY` in `src/components/VisitCounter.js`.
- Or implement a server endpoint `/api/visit` that increments a persistent counter and returns `{ "total": N }`.

There are also hosted analytics services (Plausible, Umami) that provide privacy-focused visitor counts if you prefer a full analytics solution.
