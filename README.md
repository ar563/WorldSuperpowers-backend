# WorldSuperpowers

This is backend code of geopolitical game WorldSuperpowers.
Take part in the creation of a powerful geopolitical empire. Trade, fight, work, vote and play.

### Installation
1. customize content inside private folder, sendMail and transporter in utils folder and ecosystem.config.js in main folder (pm2 configuration)
2. you should have postgresql installed and started
3. create local copy of starting database
   ```sh
   cp starting_database.sql /tmp/starting_database.sql
   ```
5. get into postgres shell
   ```sh
   sudo -i -u postgres
   ```
6. restore starting database
   ```sh
   psql -f /tmp/starting_database.sql postgres
   ```
4. install pm2
   ```sh
   npm install pm2 -g
   ```
7. Install NPM packages
   ```sh
   npm install
   ```
8. start worldsuperpowers backend
   ```sh
   pm2 start ecosystem.config.js
   ```
