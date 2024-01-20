### Installation
1. customize content inside private folder, sendMail and transporter in utils folder and ecosystem.config.js in main folder (pm2 configuration)
2. you should have postgresql installed and started
3. install pm2
   ```sh
   npm install pm2 -g
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. start worldsuperpowers backend
   ```sh
   pm2 start ecosystem.config.js
   ```
