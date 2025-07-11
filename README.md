# ESP Web Tool
A web app to flash your ESP32 or ESP8266 through your browser. Open-Source, free, and easy to use.

Have a look [serial.huhn.me](https://esp.huhn.me)

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
