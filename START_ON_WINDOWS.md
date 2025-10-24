# 🪟 How to Start the App on Your Windows Computer

## 📋 **Prerequisites**

Make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ Git installed
- ✅ Your code pulled from GitHub

---

## 🚀 **PowerShell Commands (Run These on Your Windows PC)**

### **Step 1: Open PowerShell**
- Press `Win + X`
- Select "Windows PowerShell" or "Terminal"

### **Step 2: Navigate to Project**
```powershell
# Clone the repo if you haven't already
git clone https://github.com/ezequielcasillas1/BibleCompanionListener.git
cd BibleCompanionListener

# Or if you already have it, pull latest changes
cd path\to\BibleCompanionListener
git pull origin claude/mobile-expo-app-011CUR7RQBw77RsEUXNowNmT
```

### **Step 3: Install Dependencies**
```powershell
npm install
```

### **Step 4: Start the Expo Server**
```powershell
npm start
```

**That's it!** The Expo server will start and show you:
- A QR code to scan
- The URL: `exp://192.168.1.213:8081` (your local IP)
- Web option: `http://localhost:8081`

---

## 📱 **Connect with Expo Go**

Once the server starts:

1. **Open Expo Go** on your phone
2. **Scan the QR code** that appears in PowerShell
3. **Or enter manually**: `exp://192.168.1.213:8081`

---

## 🔧 **Alternative Start Commands**

If `npm start` doesn't work, try these:

### **Option 1: Direct Expo Start**
```powershell
npx expo start
```

### **Option 2: Clear Cache First**
```powershell
npx expo start --clear
```

### **Option 3: LAN Mode (for better network discovery)**
```powershell
npx expo start --lan
```

### **Option 4: Tunnel Mode (works across different networks)**
```powershell
npx expo start --tunnel
```

---

## 🌐 **Finding Your IP Address**

To confirm your IP address:

### **PowerShell Command:**
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"} | Select-Object IPAddress, InterfaceAlias
```

### **Or Simple Method:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi or Ethernet adapter.

---

## ✅ **Expected Output**

When you run `npm start`, you should see:

```
› Metro waiting on exp://192.168.1.213:8081

› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Web is waiting on http://localhost:8081

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press w │ open web

› Press j │ open DevTools
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

---

## 🎯 **Connection URLs**

Once started, you can connect via:

**Mobile (Expo Go):**
```
exp://192.168.1.213:8081
```

**Web Browser:**
```
http://localhost:8081
```

**Local Network:**
```
exp://localhost:8081
```

---

## 🐛 **Troubleshooting**

### **"Cannot find module" errors**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

### **Port 8081 already in use**
```powershell
# Kill the process using port 8081
netstat -ano | findstr :8081
# Note the PID number, then:
taskkill /PID <PID_NUMBER> /F

# Or use a different port
npx expo start --port 8082
```

### **Phone can't connect**
- Make sure phone and computer are on the **same WiFi network**
- Disable VPN on your phone
- Check Windows Firewall isn't blocking port 8081:
  ```powershell
  New-NetFirewallRule -DisplayName "Expo Dev Server" -Direction Inbound -Port 8081 -Protocol TCP -Action Allow
  ```

### **QR code not showing**
```powershell
# Try tunnel mode
npx expo start --tunnel
```

---

## 🔄 **Stopping the Server**

To stop the Expo server:
- Press `Ctrl + C` in PowerShell
- Or close the PowerShell window

---

## 📦 **Quick Start Script**

Create a file called `start.ps1` with:

```powershell
# Start Bible Companion Listener
Write-Host "Starting Bible Companion Listener..." -ForegroundColor Green

# Navigate to project directory
Set-Location -Path "C:\path\to\BibleCompanionListener"

# Pull latest changes
Write-Host "Pulling latest changes..." -ForegroundColor Yellow
git pull

# Install/update dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Start Expo
Write-Host "Starting Expo server..." -ForegroundColor Green
npm start
```

Then run:
```powershell
.\start.ps1
```

---

## 🎉 **You're Ready!**

Run these commands on **your Windows PC**:
```powershell
cd BibleCompanionListener
npm install
npm start
```

Then connect with Expo Go to: **`exp://192.168.1.213:8081`**

**Enjoy listening to the Bible!** 🎧📖✨
