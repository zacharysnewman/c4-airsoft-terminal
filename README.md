# C4

## Setup

### Windows

1. **Install NVM for Windows:**

   - Download the NVM for Windows installer from the [nvm-windows releases page](https://github.com/coreybutler/nvm-windows/releases).
   - Run the installer and follow the installation steps.

2. **Check Default Directory:**

   - Open Command Prompt (cmd) or PowerShell.
   - Ensure you are in the default root directory where NVM will install Node.js. You can check this by running:
     ```sh
     cd %USERPROFILE%
     ```

3. **Install Node.js using NVM:**

   - Continue in Command Prompt (cmd) or PowerShell.
   - Run the following commands:
     ```sh
     nvm install latest
     nvm use latest
     ```

4. **Verify Installation:**

   - Ensure `nvm`, `node`, and `npm` are installed correctly:
     ```sh
     nvm version
     node -v
     npm -v
     ```

5. **Install Project Dependencies:**
   - Navigate to the project directory and install dependencies:
     ```sh
     cd path/to/project
     npm ci
     ```

### macOS

1. **Install Homebrew (if not already installed):**

   - Open Terminal.
   - Run the following command to install Homebrew:
     ```sh
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```

2. **Install NVM:**

   - Continue in Terminal.
   - Install NVM using Homebrew:
     ```sh
     brew install nvm
     ```
   - Create NVM directory:
     ```sh
     mkdir ~/.nvm
     ```
   - Add the following lines to your `~/.zshrc` or `~/.bash_profile` file:
     ```sh
     export NVM_DIR="$HOME/.nvm"
     [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"
     [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"
     ```
   - Source your profile script:
     ```sh
     source ~/.zshrc
     # or
     source ~/.bash_profile
     ```

3. **Check Default Directory:**

   - Open Terminal.
   - Ensure you are in the default directory where NVM will install Node.js. You can check this by running:
     ```sh
     cd ~
     ```

4. **Install Node.js using NVM:**

   - Install the latest version of Node.js:
     ```sh
     nvm install node
     ```
   - Use the installed version:
     ```sh
     nvm use node
     ```

5. **Verify Installation:**

   - Ensure `nvm`, `node`, and `npm` are installed correctly:
     ```sh
     nvm --version
     node -v
     npm -v
     ```

6. **Install Project Dependencies:**
   - Navigate to the project directory and install dependencies:
     ```sh
     cd path/to/project
     npm ci
     ```

## Running

- Run `npm start`
