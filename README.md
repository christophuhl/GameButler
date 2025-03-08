# Game Butler 🎮 

Game Butler is a Discord bot that helps manage and rank games for your server's wishlist. Keep track of games your community wants to play, rank them, and organize your gaming sessions!

## Features

- **Game Management**: Add, remove, and view games in your server's wishlist
- **Game Rankings**: Score and rank games based on community interest
- **User Tracking**: Keep track of who added games and who's interested
- **Database Persistence**: All data is stored in PostgreSQL for reliability

## Project Structure
```
gameButler/
├── .env                 # Environment variables configuration
├── app.js              # Main application entry point
├── commands.js         # Discord slash command definitions
├── db.js              # Database configuration and connection
├── gamelist.js        # Game management logic
├── testDb.js          # Database connection testing utility
├── utils.js           # Utility functions
└── package.json       # Project dependencies and scripts
```

## Setup

1. **Prerequisites**
   - Node.js (v18 or higher)
   - PostgreSQL database
   - Discord Bot Token

2. **Environment Variables**
   Create a `.env` file in the root directory with:
   ```env
   APP_ID=your_discord_app_id
   DISCORD_TOKEN=your_discord_bot_token
   PUBLIC_KEY=your_discord_public_key
   DB_USER=your_db_user
   DB_HOST=your_db_host
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   ```

3. **Database Setup**
   ```sql
   CREATE TABLE Games (
       id INTEGER PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       added_by VARCHAR(255)
   );

   CREATE TABLE Scores (
    id INTEGER PRIMARY KEY,
    game VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    score DECIMAL(4,2)
   )
   ```

4. **Installation**
   ```bash
   npm install
   ```

5. **Register Discord Commands**
   ```bash
   npm run register
   ```

6. **Start the Bot**
   ```bash
   npm start
   ```

## Commands

- `/gamelist add [game]` - Add a game to the wishlist
- `/gamelist remove [game]` - Remove a game from the wishlist
- `/gamelist get [game]` - Get information about a specific game
- `/gamelist show` - Display all games in the wishlist
- (coming soon) `/gamelist rate [game]` - Rate a game from 0-10

## Development

Test database connection:
```bash
npm run test-db
```

Run in development mode with auto-reload:
```bash
npm run dev
```

Ensure Discord can connect to your local server
- Start the ngrok tunnel to your local port 3000 with `ngrok http 3000`
- Paste the forwarding link into your Discord Bot's Interaction Endpoint URL (append '/interactions' to it)
  - Forwarding link should look like: "https://9dbd-67-183-159-100.ngrok-free.app"

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Discord.js
- Powered by Node.js and PostgreSQL
- Special thanks to the Discord API team for their documentation
- Built using Cursor, ChatGPT

---

Made with ❤️ by Christoph Uhl
