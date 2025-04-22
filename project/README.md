# Development Environment Setup

## Installing Node.js and npm

### macOS Setup

1. Install Homebrew (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install Node.js using Homebrew:
```bash
brew install node
```

3. Verify the installation:
```bash
node --version
npm --version
```

### Windows Setup

1. Download the Node.js installer from [https://nodejs.org/](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - Run the downloaded installer
   - Follow the installation wizard steps
   - Make sure to check the box that says "Automatically install the necessary tools"

2. Verify the installation by opening Command Prompt or PowerShell:
```bash
node --version
npm --version
```

## Project Setup

After installing Node.js and npm, run these commands in your project directory:

```bash
npm install
npm run dev
```

## Troubleshooting

If you see "command not found: npm" on macOS:

1. Make sure Homebrew is in your PATH by adding these lines to your ~/.zshrc file:
```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
export PATH="/opt/homebrew/bin:$PATH"
```

2. Reload your shell configuration:
```bash
source ~/.zshrc
```

If you're still having issues:

1. Try reinstalling Node.js:
```bash
brew uninstall node
brew install node
```

2. Verify the installation paths:
```bash
which node
which npm
```