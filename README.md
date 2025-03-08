# Game Butler 🎮 

Game Butler is a Discord bot that helps manage and rank games for your server's gamelist. Keep track of games your community wants to play, rank them, and organize your gaming sessions!

## Features

- **Game Management**: Add, remove, and view games in your server's gamelist
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
├── games.js           # Game management logic
├── scores.js          # Game scoring and rating logic
├── utils.js           # Utility functions
└── package.json       # Project dependencies and scripts
```

## Setup

1. **Prerequisites**
   - Node.js (v18 or higher)
   - PostgreSQL database (I'm using NeonDB)
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
   ADMIN_ID=admin_discord_id
   ```

3. **Database Setup**
   ```sql
   CREATE TABLE Games (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       price TEXT,
       time_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       added_by_username TEXT,
       added_by_discord_id TEXT,
       score DECIMAL(4,2) DEFAULT 0,
       time_updated TIMESTAMP,
       rank INTEGER
   );

   CREATE TABLE Scores (
    id INTEGER PRIMARY KEY,
    game TEXT NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
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

- `/gamelist [limit?] [sort?] [order?]` - Get a list of all games in the gamelist (optional limit, sort by: price/score, order: ascending/descending)
- `/games get [game]` - Get details about a specific game
- `/games add [game] [price]` - Add a new game
- `/games update [game] [price]` - Update a game's price
- `/games remove [game]` - Remove a game
- `/rate [game] [score]` - Rate a game from 0-10
- `/ratings game [name] [limit?]` - Get ratings for a specific game (optional limit)
- `/ratings user [name] [limit?]` - Get ratings from a specific user (optional limit)

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
