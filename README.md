# CharCraft

## Prerequisites

### Windows:
If `npm` is already installed, you may skip these steps.

#### Step 1: Install Chocolatey
Open PowerShell as Administrator and execute:
```powershell
powershell -c "irm https://community.chocolatey.org/install.ps1 | iex"
```

#### Step 2: Install Node.js
Using Chocolatey, install Node.js:
```powershell
choco install nodejs-lts --version="22.11.0"
```

#### Step 3: Verify Installation
After installation, you may need to reset the environment before verification. Then, run the following commands:
```powershell
node -v
# Expected output: v22.12.0
npm -v
# Expected output: 10.9.0
```

## Setting Up the Project

### Step 1: Install Dependencies
Navigate to the main directory of the project and run:
```bash
npm install
```
Then create an environment file:
```bash
cp .env.example .env
```

### Step 2: Run Tests
To execute the tests, simply run:
```bash
npm test
```

## Troubleshooting

If dependencies do not install with the `npm install` command, you may install them individually as follows:

```bash
npm install --save-dev jest
npm install --save-dev jest-environment-jsdom
npm install --save-dev @babel/core @babel/preset-env babel-jest
npm install --save-dev jest-canvas-mock
```

