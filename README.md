# C4 - Airsoft Terminal

## Computer Setup (Global dependencies)

### Windows

1. **Install NVM:**

   - Open Command Prompt.
   - Download and run the NVM installation script for Windows from [GitHub](https://github.com/coreybutler/nvm-windows/releases):
     ```sh
     nvm-setup.zip
     ```
   - Follow the installation instructions provided.

2. **Install Node.js using NVM:**

   - Continue in Command Prompt.
   - Install the latest version of Node.js:
     ```sh
     nvm install latest
     ```
   - Use the installed version:
     ```sh
     nvm use latest
     ```

3. **Verify Installation:**
   - Ensure `nvm`, `node`, and `npm` are installed correctly:
     ```sh
     nvm version
     node -v
     npm -v
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

## Project Setup (Project-specific dependencies)

6. **Install Project Dependencies:**
   - Navigate to the project directory and install dependencies:
     ```sh
     cd path/to/project
     npm ci
     ```

## Running

- Run `npm start`
